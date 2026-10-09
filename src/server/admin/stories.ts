import { createHash } from "node:crypto";
import { checkStoryAudioUpload, isStoryImagePath, pageLabel, pagesPublishBlock, validatePage, type EditorPage } from "@/lib/rules/admin-story";
import { pageText } from "@/lib/rules/lesson-story";
import { createStorySchema, generateStoryAudioSchema, saveStorySchema, type AudioItemResult } from "@/lib/schemas";
import { STORY_QUESTION_TYPE, storyNewWordsSchema, storySentencesSchema } from "@/lib/schemas/story";
import { audioFileExists, removeAudioFile, saveAudioFile } from "../audio/files";
import { TtsTextError, TtsUnavailableError, currentVoice, isTtsAvailable, synthesizeMp3 } from "../audio/tts";
import { db } from "../db";
import { getStoriesPlay } from "../story-play";
import { storeImageUpload } from "./media";
import { fail, firstIssue, type AdminResult } from "./result";

// Soạn truyện tranh (Adult19, task 16): danh sách truyện, đọc một truyện để soạn, lưu cả truyện, tải âm thanh/tranh lên và tạo giọng đọc.
// Hàm ghi kiểm Zod ở đây; server action / route handler (`features/admin/story-actions.ts`, `/admin/stories/upload`) gọi `requireAdmin()` trước khi vào.

export type StoryListRow = {
  id: number;
  title: string;
  titleVi: string;
  level: number;
  unit: string;
  /** Số trang truyện (không tính trang câu hỏi). */
  pages: number;
  /** Số trang truyện chưa có âm thanh. */
  silent: number;
  status: "draft" | "published";
};

export type StoryListData = { rows: StoryListRow[]; levels: { id: number; number: number; name: string }[] };

export async function getStoryList(): Promise<StoryListData> {
  const [stories, levels] = await Promise.all([
    db.story.findMany({
      orderBy: [{ level: { number: "asc" } }, { sortOrder: "asc" }, { id: "asc" }],
      select: { id: true, title: true, titleVi: true, status: true, level: { select: { number: true } }, unit: { select: { title: true } }, pages: { select: { kind: true, audio: true } } },
    }),
    db.level.findMany({ orderBy: { number: "asc" }, select: { id: true, number: true, name: true } }),
  ]);
  return {
    rows: stories.map((s) => {
      const pages = s.pages.filter((p) => p.kind === "page");
      return { id: s.id, title: s.title, titleVi: s.titleVi, level: s.level.number, unit: s.unit?.title ?? "—", pages: pages.length, silent: pages.filter((p) => !p.audio).length, status: s.status === "published" ? "published" : "draft" };
    }),
    levels,
  };
}

export type StoryEditorData = {
  story: { id: number; title: string; titleVi: string; levelId: number; unitId: number | null; newWords: string[]; status: "draft" | "published" };
  pages: EditorPage[];
  levels: { id: number; number: number; name: string }[];
  units: { id: number; levelId: number; title: string }[];
  /** Các từ có hình trong ngân hàng từ vựng, để chọn tranh từ thư viện. */
  pictures: { word: string; image: string }[];
  /** Nghĩa ngắn theo chữ thường (từ ngân hàng từ vựng) để xem trước. */
  glossary: Record<string, string>;
  /** Máy chủ tạo được giọng đọc (đã cài công cụ). */
  ttsAvailable: boolean;
};

export async function getStoryEditor(storyId: number): Promise<StoryEditorData | null> {
  if (!Number.isInteger(storyId) || storyId < 1) return null;
  const story = await db.story.findUnique({
    where: { id: storyId },
    select: {
      id: true,
      title: true,
      titleVi: true,
      levelId: true,
      unitId: true,
      newWords: true,
      status: true,
      pages: { orderBy: { sortOrder: "asc" }, select: { id: true, kind: true, image: true, sentences: true, audio: true, question: { select: { prompt: true, options: true, answer: true } } } },
    },
  });
  if (!story) return null;
  const [levels, units, words, play, ttsAvailable] = await Promise.all([
    db.level.findMany({ orderBy: { number: "asc" }, select: { id: true, number: true, name: true } }),
    db.unit.findMany({ orderBy: [{ levelId: "asc" }, { sortOrder: "asc" }], select: { id: true, levelId: true, title: true } }),
    db.word.findMany({ where: { image: { not: null } }, orderBy: { word: "asc" }, select: { word: true, image: true } }),
    getStoriesPlay([storyId], false),
    isTtsAvailable(),
  ]);

  const pages: EditorPage[] = story.pages.map((p) => {
    const q = p.question;
    const prompt = (q?.prompt as { text?: unknown } | null | undefined)?.text;
    const options = Array.isArray(q?.options) ? (q.options as { id?: unknown; text?: unknown }[]) : [];
    const correctId = Array.isArray((q?.answer as { correct?: unknown } | null | undefined)?.correct) ? (q?.answer as { correct: unknown[] }).correct[0] : undefined;
    const correct = options.findIndex((o) => o.id === correctId);
    return {
      key: `p${p.id}`,
      id: p.id,
      kind: p.kind,
      image: p.image,
      sentences: p.kind === "page" ? (storySentencesSchema.safeParse(p.sentences).data ?? []).map((s) => s.en) : [],
      audio: p.audio,
      question: { text: typeof prompt === "string" ? prompt : "", choices: [...options.map((o) => (typeof o.text === "string" ? o.text : "")), "", "", ""].slice(0, 3), correct: correct >= 0 ? correct : null },
    };
  });
  return {
    story: { id: story.id, title: story.title, titleVi: story.titleVi, levelId: story.levelId, unitId: story.unitId, newWords: storyNewWordsSchema.safeParse(story.newWords).data ?? [], status: story.status === "published" ? "published" : "draft" },
    pages,
    levels,
    units,
    pictures: words.flatMap((w) => (w.image ? [{ word: w.word, image: w.image }] : [])),
    glossary: play.get(storyId)?.glossary ?? {},
    ttsAvailable,
  };
}

const slugOf = (title: string) =>
  title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "truyen";

/** Tạo truyện mới (Nháp, chưa có trang) rồi trả về mã để mở màn soạn. */
export async function createStory(input: unknown): Promise<AdminResult> {
  const parsed = createStorySchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { title, levelId } = parsed.data;
  if (!(await db.level.findUnique({ where: { id: levelId }, select: { id: true } }))) return fail("Không tìm thấy cấp này.", "levelId");
  const last = await db.story.findFirst({ where: { levelId }, orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
  const base = slugOf(title);
  let slug = base;
  for (let n = 2; await db.story.findUnique({ where: { levelId_slug: { levelId, slug } }, select: { id: true } }); n++) slug = `${base}-${n}`;
  const saved = await db.story.create({ data: { levelId, slug, title, titleVi: "", newWords: [], status: "draft", sortOrder: (last?.sortOrder ?? 0) + 1 }, select: { id: true } });
  return { ok: true, id: saved.id };
}

export type SaveStoryResult = { ok: true; pages: { id: number; audio: string | null }[] } | { ok: false; field?: string; message: string };

const bad = (message: string, field?: string): SaveStoryResult => ({ ok: false, message, field });

const textOfPage = (sentences: readonly string[]) => pageText(sentences.map((s) => s.trim()).filter(Boolean));

/**
 * Lưu cả truyện: thông tin, danh sách trang theo thứ tự (trang đã có `id` giữ nguyên, trang bị bỏ thì xóa kèm câu hỏi của nó, trang mới thì tạo).
 * Trang đổi chữ thì mất tệp âm thanh cũ (không còn khớp chữ). Xuất bản chỉ khi mọi trang có âm thanh, 1–2 câu ≤ 16 từ.
 */
export async function saveStory(input: unknown): Promise<SaveStoryResult> {
  const parsed = saveStorySchema.safeParse(input);
  if (!parsed.success) {
    const issue = firstIssue(parsed.error);
    return issue.ok ? bad("Dữ liệu chưa hợp lệ.") : issue;
  }
  const { id, title, titleVi, levelId, unitId, newWords, status, pages } = parsed.data;

  const story = await db.story.findUnique({ where: { id }, select: { id: true, pages: { select: { id: true, sentences: true, audio: true, questionId: true } } } });
  if (!story) return bad("Không tìm thấy truyện này nữa.");
  if (!(await db.level.findUnique({ where: { id: levelId }, select: { id: true } }))) return bad("Không tìm thấy cấp này.", "levelId");
  if (unitId !== null && !(await db.unit.findFirst({ where: { id: unitId, levelId }, select: { id: true } }))) return bad("Chủ đề này không thuộc cấp đã chọn.", "unitId");
  const existing = new Map(story.pages.map((p) => [p.id, p]));
  if (pages.some((p) => p.id !== null && !existing.has(p.id))) return bad("Danh sách trang đã thay đổi. Hãy tải lại trang rồi soạn lại.", "pages");

  const editorPages: EditorPage[] = [];
  for (const [i, p] of pages.entries()) {
    const old = p.id !== null ? existing.get(p.id) : undefined;
    const oldText = old ? textOfPage((storySentencesSchema.safeParse(old.sentences).data ?? []).map((s) => s.en)) : "";
    const keepAudio = p.kind === "page" && old?.audio && oldText === textOfPage(p.sentences) ? old.audio : null;
    const page: EditorPage = { key: `k${i}`, id: p.id, kind: p.kind, image: p.image, sentences: p.sentences, audio: keepAudio, question: p.question };
    const issue = validatePage(page);
    if (issue) return bad(`${pageLabel(pages, i)}: ${issue.message}`, "pages");
    if (p.kind === "page" && p.image && !isStoryImagePath(p.image)) return bad(`${pageLabel(pages, i)}: đường dẫn tranh không hợp lệ.`, "pages");
    editorPages.push(page);
  }
  if (status === "published") {
    const block = pagesPublishBlock(editorPages);
    if (block) return bad(block, "status");
  }

  const keepIds = new Set(pages.flatMap((p) => (p.id === null ? [] : [p.id])));
  const staleAudio: (string | null)[] = [];
  const result: { id: number; audio: string | null }[] = [];

  await db.$transaction(async (tx) => {
    for (const old of story.pages) {
      if (keepIds.has(old.id)) continue;
      await tx.storyPage.delete({ where: { id: old.id } });
      if (old.questionId) await tx.question.delete({ where: { id: old.questionId } }).catch(() => undefined);
      staleAudio.push(old.audio);
    }
    const firstImage = editorPages.find((p) => p.kind === "page" && p.image)?.image ?? null;
    await tx.story.update({ where: { id }, data: { title, titleVi, levelId, unitId, newWords, status, cover: firstImage } });

    for (const [i, page] of editorPages.entries()) {
      const old = page.id !== null ? existing.get(page.id) : undefined;
      let questionId: number | null = old?.questionId ?? null;
      if (page.kind === "question") {
        const ids = ["a", "b", "c"] as const;
        const data = {
          type: STORY_QUESTION_TYPE,
          prompt: { text: page.question.text.trim() },
          options: page.question.choices.map((text, n) => ({ id: ids[n], text: text.trim() })),
          answer: { correct: [ids[page.question.correct ?? 0]] },
          levelId,
          skill: "reading",
          difficulty: 1,
          status: "published" as const,
        };
        questionId = questionId ? (await tx.question.update({ where: { id: questionId }, data, select: { id: true } })).id : (await tx.question.create({ data, select: { id: true } })).id;
      } else if (questionId) {
        await tx.question.delete({ where: { id: questionId } }).catch(() => undefined);
        questionId = null;
      }
      if (old?.audio && old.audio !== page.audio) staleAudio.push(old.audio);
      const data = {
        sortOrder: i + 1,
        kind: page.kind,
        image: page.kind === "page" ? page.image : null,
        sentences: page.kind === "page" ? page.sentences.map((s) => s.trim()).filter(Boolean).map((en) => ({ en })) : [],
        audio: page.kind === "page" ? page.audio : null,
        questionId,
      };
      const saved = old ? await tx.storyPage.update({ where: { id: old.id }, data, select: { id: true, audio: true } }) : await tx.storyPage.create({ data: { storyId: id, ...data }, select: { id: true, audio: true } });
      result.push(saved);
    }
  });
  for (const stale of staleAudio) await removeAudioFile(stale);
  return { ok: true, pages: result };
}

export type StoryUploadResult = { ok: true; audio: string; seconds: number } | { ok: false; field?: string; message: string };

/** Lưu tệp âm thanh tải lên cho một trang truyện đã lưu. Loại, dung lượng, độ dài kiểm theo nội dung tệp. */
export async function saveStoryAudioUpload(pageId: number, file: { name: string; bytes: Uint8Array }): Promise<StoryUploadResult> {
  if (!Number.isInteger(pageId) || pageId < 1) return { ok: false, message: "Không tìm thấy trang này." };
  const page = await db.storyPage.findUnique({ where: { id: pageId }, select: { id: true, kind: true, audio: true } });
  if (!page || page.kind !== "page") return { ok: false, message: "Không tìm thấy trang này nữa. Hãy lưu truyện rồi thử lại." };
  const check = checkStoryAudioUpload(file.name, file.bytes);
  if (!check.ok) return { ok: false, field: "file", message: check.message };
  const bytes = Buffer.from(file.bytes);
  const stored = await saveAudioFile("story", pageId, createHash("sha1").update(bytes).digest("hex"), "upload", bytes, check.format);
  await db.storyPage.update({ where: { id: pageId }, data: { audio: stored } });
  if (page.audio && page.audio !== stored) await removeAudioFile(page.audio);
  return { ok: true, audio: stored, seconds: check.seconds };
}

/** Lưu tranh tải lên (hình PNG, JPEG, WebP, SVG an toàn ≤ 2 MB) và trả đường dẫn để gắn vào trang. */
export async function saveStoryImageUpload(file: { name: string; bytes: Uint8Array }): Promise<{ ok: true; path: string } | { ok: false; message: string }> {
  const stored = await storeImageUpload(file);
  return stored.ok ? { ok: true, path: stored.path } : stored;
}

export type GenerateStoryAudioResult = { ok: true; items: AudioItemResult[] } | { ok: false; message: string };

/** Tạo giọng đọc tự động cho một lượt trang. Không cần công tắc “Giọng mp3” (xuất bản bắt buộc có âm thanh). Lỗi một trang không làm hỏng cả lượt. */
export async function generateStoryAudio(input: unknown): Promise<GenerateStoryAudioResult> {
  const parsed = generateStoryAudioSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ." };
  const { pageIds, force } = parsed.data;
  const pages = await db.storyPage.findMany({ where: { id: { in: pageIds } }, select: { id: true, kind: true, sentences: true, audio: true, storyId: true, sortOrder: true } });
  const byId = new Map(pages.map((p) => [p.id, p]));
  const voice = currentVoice();
  const items: AudioItemResult[] = [];
  const labels = new Map<number, string>();
  for (const storyId of new Set(pages.map((p) => p.storyId))) {
    const all = await db.storyPage.findMany({ where: { storyId }, orderBy: { sortOrder: "asc" }, select: { id: true, kind: true } });
    all.filter((p) => p.kind === "page").forEach((p, i) => labels.set(p.id, `Trang ${i + 1}`));
  }

  for (const id of pageIds) {
    const page = byId.get(id);
    const label = labels.get(id) ?? `#${id}`;
    if (!page || page.kind !== "page") {
      items.push({ id, word: label, status: "error", message: "Không tìm thấy trang này nữa." });
      continue;
    }
    if (!force && (await audioFileExists(page.audio))) {
      items.push({ id, word: label, status: "skipped" });
      continue;
    }
    const text = textOfPage((storySentencesSchema.safeParse(page.sentences).data ?? []).map((s) => s.en));
    try {
      const bytes = await synthesizeMp3(text, voice);
      const stored = await saveAudioFile("story", id, text, voice, bytes);
      await db.storyPage.update({ where: { id }, data: { audio: stored } });
      if (page.audio && page.audio !== stored) await removeAudioFile(page.audio);
      items.push({ id, word: label, status: "made" });
    } catch (error) {
      if (error instanceof TtsUnavailableError) return { ok: false, message: error.message };
      items.push({ id, word: label, status: "error", message: error instanceof TtsTextError ? error.message : "Chưa tạo được giọng đọc cho trang này." });
      if (!(error instanceof TtsTextError)) console.error("tạo giọng đọc truyện:", error);
    }
  }
  return { ok: true, items };
}
