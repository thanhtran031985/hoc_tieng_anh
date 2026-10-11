import { audioNameFromUrl } from "@/lib/rules/tts";
import { canPublish, explorerIssues, type ExplorerBranch } from "@/lib/rules/word-explorer";
import { editorWordInputSchema, generateExplorerAudioSchema, saveExplorerSchema, type EditorBranchInput } from "@/lib/schemas/admin-word-explorer";
import type { AudioItemResult } from "@/lib/schemas/admin-audio";
import { parseExplorerAnswers, parseExplorerDistractors, parseExplorerSentences, type ExplorerAnswer, type ExplorerDistractor, type ExplorerSentence } from "@/lib/schemas";
import { isAiAvailable } from "../ai/gemini";
import { audioFileExists, removeAudioFile, saveAudioFile } from "../audio/files";
import { TtsTextError, TtsUnavailableError, currentVoice, isTtsAvailable, synthesizeMp3 } from "../audio/tts";
import { db } from "../db";
import { listPictures } from "./pictures";
import { fail, type AdminResult } from "./result";

// Soạn Khám phá từ (Adult22): đọc dữ liệu soạn của một từ, lưu (Nháp / Xuất bản có kiểm điều kiện) và tạo giọng đọc tự động.
// Hàm ghi kiểm Zod ở đây; server action (`features/admin/word-explorer-actions.ts`) gọi `requireAdmin()` trước khi vào.

export type EditorBranch = {
  id: number;
  kind: EditorBranchInput["kind"];
  questionEn: string;
  questionVi: string;
  answers: ExplorerAnswer[];
  distractors: ExplorerDistractor[];
  sentence: ExplorerSentence;
};

export type ExplorerEditorData = {
  word: { id: number; word: string; ipa: string | null; meaningVi: string; image: string | null; exampleEn: string | null; exampleVi: string | null; levelNumber: number; topic: string | null };
  /** Chưa có dòng nào: `none`; mọi dòng đã xuất bản: `published`; còn lại `draft`. */
  status: "none" | "draft" | "published";
  branches: EditorBranch[];
  /** Âm thanh của cả đoạn văn (chưa có thì null). */
  readingAudio: string | null;
  ttsAvailable: boolean;
  /** Có khóa AI: nút “Gợi ý bằng AI” dùng được (task 29). */
  aiAvailable: boolean;
  /** Hình chọn được: thư viện hình của sản phẩm cộng hình đã tải lên. */
  pictures: string[];
  /** Kho từ vựng để lấy sẵn chữ, nghĩa, hình, âm thanh cho đáp án. */
  bank: { word: string; meaningVi: string; image: string | null; audio: string | null }[];
};

/** Dữ liệu soạn của một từ (kể cả bản Nháp); từ không có thì null. */
export async function getExplorerEditor(input: unknown): Promise<ExplorerEditorData | null> {
  const parsed = editorWordInputSchema.safeParse(input);
  if (!parsed.success) return null;
  const { wordId } = parsed.data;
  const [word, rows, reading, ttsAvailable, pictures, bank] = await Promise.all([
    db.word.findUnique({
      where: { id: wordId },
      select: { id: true, word: true, ipa: true, meaningVi: true, image: true, exampleEn: true, exampleVi: true, level: { select: { number: true } }, topics: { take: 1, orderBy: { topicId: "asc" }, select: { topic: { select: { nameVi: true } } } } },
    }),
    db.wordQuestion.findMany({ where: { wordId }, orderBy: { sortOrder: "asc" } }),
    db.wordReading.findUnique({ where: { ownerType_ownerId: { ownerType: "word", ownerId: wordId } } }),
    isTtsAvailable(),
    listPictures(),
    db.word.findMany({ orderBy: { word: "asc" }, select: { word: true, meaningVi: true, image: true, audio: true } }),
  ]);
  if (!word) return null;
  const sentences = parseExplorerSentences(reading?.sentences) ?? [];
  const branches: EditorBranch[] = rows.map((r, i) => ({
    id: r.id,
    kind: r.kind as EditorBranch["kind"],
    questionEn: r.questionEn,
    questionVi: r.questionVi,
    answers: parseExplorerAnswers(r.answers) ?? [],
    distractors: parseExplorerDistractors(r.distractors) ?? [],
    sentence: sentences[i] ?? { en: "", vi: "" },
  }));
  const status = rows.length === 0 ? "none" : rows.every((r) => r.status === "published") && reading?.status === "published" ? "published" : "draft";
  return {
    word: { id: word.id, word: word.word, ipa: word.ipa, meaningVi: word.meaningVi, image: word.image, exampleEn: word.exampleEn, exampleVi: word.exampleVi, levelNumber: word.level.number, topic: word.topics[0]?.topic.nameVi ?? null },
    status,
    branches,
    readingAudio: reading?.audio ?? null,
    ttsAvailable,
    aiAvailable: isAiAvailable(),
    pictures,
    bank,
  };
}

const referenced = (branches: readonly { answers: readonly { audio?: string | null }[] }[]): Set<string> => new Set(branches.flatMap((b) => b.answers.flatMap((a) => (audioNameFromUrl(a.audio) ? [a.audio as string] : []))));

/**
 * Lưu Khám phá của một từ. `branches` rỗng là gỡ Khám phá (xóa nhánh, đoạn văn và tệp âm thanh). Xuất bản chỉ khi không còn lý do chặn
 * (`explorerIssues`: số nhánh 4–6, đáp án đủ hình và âm thanh, hình nhiễu, bản dịch, đoạn văn có âm thanh). Đổi chữ đoạn văn thì tệp âm thanh cũ bị bỏ.
 */
export async function saveExplorer(input: unknown): Promise<AdminResult> {
  const parsed = saveExplorerSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const where = issue?.path[0] === "branches" && typeof issue.path[1] === "number" ? `Nhánh ${issue.path[1] + 1}: ` : "";
    return fail(`${where}${issue?.message ?? "Dữ liệu chưa hợp lệ."}`, "form");
  }
  const { wordId, status, branches } = parsed.data;
  if (!(await db.word.findUnique({ where: { id: wordId }, select: { id: true } }))) return fail("Không tìm thấy từ này nữa.");

  const existing = await db.wordQuestion.findMany({ where: { wordId }, select: { id: true, answers: true } });
  const known = new Set(existing.map((r) => r.id));
  if (branches.some((b) => b.id !== undefined && !known.has(b.id))) return fail("Danh sách nhánh đã thay đổi. Hãy mở lại ngăn kéo rồi soạn lại.", "form");
  // Âm thanh đáp án chỉ giữ khi tệp là của chính Khám phá này hoặc là tệp của một từ trong kho (lấy sẵn khi chọn đáp án từ kho); đường dẫn lạ thì bỏ.
  const mine = referenced(existing.map((r) => ({ answers: parseExplorerAnswers(r.answers) ?? [] })));
  const foreign = [...referenced(branches)].filter((file) => !mine.has(file));
  const fromBank = new Set(
    foreign.length
      ? (await db.word.findMany({ where: { OR: [{ audio: { in: foreign } }, { exampleAudio: { in: foreign } }] }, select: { audio: true, exampleAudio: true } })).flatMap((w) => [w.audio, w.exampleAudio]).filter((f): f is string => f !== null)
      : [],
  );
  for (const b of branches) for (const a of b.answers) if (a.audio && !mine.has(a.audio) && !fromBank.has(a.audio)) a.audio = null;

  const oldReading = await db.wordReading.findUnique({ where: { ownerType_ownerId: { ownerType: "word", ownerId: wordId } } });
  const oldText = (parseExplorerSentences(oldReading?.sentences) ?? []).map((s) => s.en).join("\n");
  const sentences = branches.map((b) => b.sentence);
  const keepReadingAudio = oldReading?.audio && sentences.map((s) => s.en).join("\n") === oldText && sentences.length > 0 ? oldReading.audio : null;

  if (status === "published") {
    const rules: ExplorerBranch[] = branches.map((b) => ({ kind: b.kind, questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers, distractors: b.distractors }));
    const issues = explorerIssues(rules, { sentences, audio: keepReadingAudio });
    if (!canPublish(issues)) return fail(`Chưa xuất bản được: ${issues[0].message}${issues.length > 1 ? ` (còn ${issues.length - 1} việc nữa)` : ""} Lưu Nháp trước, xong rồi xuất bản.`, "status");
  }

  const stale: (string | null | undefined)[] = [];
  await db.$transaction(async (tx) => {
    const keep = new Set(branches.flatMap((b) => (b.id === undefined ? [] : [b.id])));
    const removed = existing.filter((r) => !keep.has(r.id));
    if (removed.length) await tx.wordQuestion.deleteMany({ where: { id: { in: removed.map((r) => r.id) } } });
    // Dời thứ tự cũ ra xa trước để đổi chỗ các nhánh không vướng khóa duy nhất (word_id, sort_order).
    await tx.wordQuestion.updateMany({ where: { wordId }, data: { sortOrder: { increment: 100 } } });
    for (const [i, b] of branches.entries()) {
      const data = { sortOrder: i + 1, kind: b.kind, questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers, distractors: b.distractors, status };
      if (b.id === undefined) await tx.wordQuestion.create({ data: { wordId, ...data } });
      else await tx.wordQuestion.update({ where: { id: b.id }, data });
    }
    if (branches.length === 0) {
      if (oldReading) await tx.wordReading.delete({ where: { id: oldReading.id } });
    } else {
      await tx.wordReading.upsert({
        where: { ownerType_ownerId: { ownerType: "word", ownerId: wordId } },
        create: { ownerType: "word", ownerId: wordId, sentences, audio: keepReadingAudio, status },
        update: { sentences, audio: keepReadingAudio, status },
      });
    }
    if (oldReading?.audio && oldReading.audio !== keepReadingAudio) stale.push(oldReading.audio);
  });
  // Tệp không còn nhánh nào dùng thì xóa (đáp án bị xóa, nhánh bị xóa, đổi chữ đoạn văn).
  const stillUsed = referenced(branches);
  for (const file of mine) if (!stillUsed.has(file)) stale.push(file);
  for (const file of stale) await removeAudioFile(file);
  return { ok: true, id: wordId };
}

export type GenerateExplorerAudioResult = { ok: true; items: AudioItemResult[] } | { ok: false; message: string };

/**
 * Tạo giọng đọc tự động cho một lượt mục của một từ: mã nhánh (mọi đáp án chưa có tệp của nhánh) và 0 (đoạn văn “Đọc cả đoạn”).
 * Không cần công tắc “Giọng mp3” (xuất bản bắt buộc có âm thanh). Lỗi một mục không làm hỏng cả lượt.
 */
export async function generateExplorerAudio(input: unknown): Promise<GenerateExplorerAudioResult> {
  const parsed = generateExplorerAudioSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ." };
  const { wordId, ids, force } = parsed.data;
  const rows = await db.wordQuestion.findMany({ where: { wordId }, orderBy: { sortOrder: "asc" }, select: { id: true, sortOrder: true, answers: true } });
  const reading = await db.wordReading.findUnique({ where: { ownerType_ownerId: { ownerType: "word", ownerId: wordId } } });
  const voice = currentVoice();
  const items: AudioItemResult[] = [];

  for (const id of ids) {
    try {
      if (id === 0) {
        const label = "Đoạn văn";
        const sentences = parseExplorerSentences(reading?.sentences) ?? [];
        if (!reading || sentences.length === 0) {
          items.push({ id, word: label, status: "error", message: "Chưa có câu nào để đọc." });
          continue;
        }
        if (!force && (await audioFileExists(reading.audio))) {
          items.push({ id, word: label, status: "skipped" });
          continue;
        }
        const text = sentences.map((s) => s.en).join(" ");
        const stored = await saveAudioFile("explorer", reading.id, text, voice, await synthesizeMp3(text, voice));
        await db.wordReading.update({ where: { id: reading.id }, data: { audio: stored } });
        if (reading.audio && reading.audio !== stored) await removeAudioFile(reading.audio);
        items.push({ id, word: label, status: "made" });
        continue;
      }
      const row = rows.find((r) => r.id === id);
      const label = `Nhánh ${row?.sortOrder ?? "?"}`;
      const answers = row ? parseExplorerAnswers(row.answers) : null;
      if (!row || !answers) {
        items.push({ id, word: label, status: "error", message: "Không tìm thấy nhánh này nữa." });
        continue;
      }
      let made = 0;
      const next: ExplorerAnswer[] = [];
      for (const a of answers) {
        if (!force && (await audioFileExists(a.audio))) {
          next.push(a);
          continue;
        }
        const stored = await saveAudioFile("explorer", row.id, a.text, voice, await synthesizeMp3(a.text, voice));
        if (a.audio && a.audio !== stored) await removeAudioFile(a.audio);
        next.push({ ...a, audio: stored });
        made += 1;
      }
      if (made > 0) await db.wordQuestion.update({ where: { id: row.id }, data: { answers: next } });
      items.push({ id, word: label, status: made > 0 ? "made" : "skipped" });
    } catch (error) {
      if (error instanceof TtsUnavailableError) return { ok: false, message: error.message };
      items.push({ id, word: id === 0 ? "Đoạn văn" : `Mục ${id}`, status: "error", message: error instanceof TtsTextError ? error.message : "Chưa tạo được giọng đọc cho mục này." });
      if (!(error instanceof TtsTextError)) console.error("tạo giọng đọc Khám phá:", error);
    }
  }
  return { ok: true, items };
}

