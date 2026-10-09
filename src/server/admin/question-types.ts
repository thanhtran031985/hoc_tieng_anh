import { buildExtraData, extraQuestionSummary, readExtraForm, validateExtraBuilt, EXTRA_TYPE_INFO, type ExtraContext, type ExtraForm } from "@/lib/rules/admin-question-types";
import type { BankWord } from "@/lib/rules/admin-questions";
import type { PhonicsSoundInfo } from "@/lib/rules/lesson-play";
import { saveExtraQuestionSchema } from "@/lib/schemas/admin-question-types";
import { createHash } from "node:crypto";
import { checkStoryAudioUpload } from "@/lib/rules/admin-story";
import { audioNameFromUrl } from "@/lib/rules/tts";
import { EXTRA_QUESTION_TYPES } from "@/lib/schemas/question-extra";
import { audioFileExists, removeAudioFile, saveAudioFile } from "../audio/files";
import { TtsTextError, TtsUnavailableError, currentVoice, isTtsAvailable, synthesizeMp3 } from "../audio/tts";
import { db } from "../db";
import { fail, firstIssue, type AdminResult } from "./result";

// Câu hỏi dạng mới (Adult18): ghép âm, sắp xếp câu, nghe và gõ, điền từ. Đọc cả danh sách và lưu một câu (thêm mới hoặc sửa).
// Hàm ghi kiểm Zod ở đây; server action (`features/admin/question-type-actions.ts`) gọi `requireAdmin()` trước khi vào.

export type ExtraQuestionRow = {
  id: number;
  type: string;
  summary: string;
  levelId: number;
  level: number;
  status: "draft" | "published";
  form: ExtraForm;
};

export type ExtraQuestionsData = {
  rows: ExtraQuestionRow[];
  levels: { id: number; number: number; name: string }[];
  /** Các từ có hình trong ngân hàng, để chọn hình minh họa. */
  words: BankWord[];
  /** Bộ âm phonics (chữ → phiên âm, tệp âm thanh), để chọn âm thanh cho từng ô. */
  sounds: { grapheme: string; ipa: string | null; audio: string | null }[];
  /** Máy chủ tạo được giọng đọc (đã cài công cụ): bật nút “Tạo giọng đọc tự động” của câu luyện nói. */
  ttsAvailable: boolean;
};

const key = (text: string) => text.trim().replace(/\s+/g, " ").toLowerCase();

export async function getExtraQuestions(): Promise<ExtraQuestionsData> {
  const [questions, levels, words, sounds, ttsAvailable] = await Promise.all([
    db.question.findMany({
      where: { type: { in: [...EXTRA_QUESTION_TYPES] } },
      orderBy: [{ level: { number: "asc" } }, { id: "asc" }],
      select: { id: true, type: true, prompt: true, options: true, answer: true, levelId: true, status: true, level: { select: { number: true } } },
    }),
    db.level.findMany({ orderBy: { number: "asc" }, select: { id: true, number: true, name: true } }),
    db.word.findMany({ where: { image: { not: null } }, orderBy: { word: "asc" }, select: { id: true, word: true, image: true } }),
    db.phonicsSound.findMany({ where: { status: "published" }, orderBy: { sortOrder: "asc" }, select: { grapheme: true, ipa: true, audio: true } }),
    isTtsAvailable(),
  ]);
  const wordById = new Map(words.map((w) => [w.id, w.word]));
  return {
    rows: questions.map((q) => {
      const wordId = (q.prompt as { wordId?: unknown } | null)?.wordId;
      return {
        id: q.id,
        type: q.type,
        summary: extraQuestionSummary(q.type, q.prompt),
        levelId: q.levelId,
        level: q.level.number,
        status: q.status === "published" ? "published" : "draft",
        form: readExtraForm(q.type, q.prompt, q.options, q.answer, typeof wordId === "number" ? (wordById.get(wordId) ?? "") : ""),
      };
    }),
    levels,
    words,
    sounds,
    ttsAvailable,
  };
}

export async function saveExtraQuestion(input: unknown): Promise<AdminResult> {
  const parsed = saveExtraQuestionSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { id, type, levelId, status, ...form } = parsed.data;

  const existing = id ? await db.question.findUnique({ where: { id }, select: { id: true, type: true, difficulty: true, explanation: true, prompt: true } }) : null;
  if (id && (!existing || existing.type !== type)) return fail("Không tìm thấy câu hỏi này nữa.");
  if (!(await db.level.findUnique({ where: { id: levelId }, select: { id: true } }))) return fail("Không tìm thấy cấp này.", "levelId");

  const picture = form.picture.trim();
  const graphemes = [...new Set(form.tiles.map((t) => t.sound.trim()).filter(Boolean))];
  const [pictureWords, soundRows] = await Promise.all([
    picture ? db.word.findMany({ where: { word: picture }, select: { id: true, word: true, image: true }, orderBy: { id: "asc" } }) : [],
    graphemes.length ? db.phonicsSound.findMany({ where: { grapheme: { in: graphemes } }, select: { grapheme: true, ipa: true, audio: true } }) : [],
  ]);
  const bank = new Map<string, BankWord>();
  for (const w of pictureWords) if (!bank.has(key(w.word))) bank.set(key(w.word), w);
  const sounds = new Map<string, PhonicsSoundInfo>(soundRows.map((s) => [s.grapheme, { ipa: s.ipa, audio: s.audio }]));
  const ctx: ExtraContext = { bank, sounds };

  // Âm thanh mẫu (luyện nói) chỉ nhận đường dẫn đã gắn cho chính câu này và còn khớp chữ; chữ đổi thì mất tệp cũ.
  let audio: string | null = null;
  let staleAudio: string | null = null;
  if (type === "speaking") {
    const old = existing?.prompt as { text?: unknown; audio?: unknown } | null | undefined;
    const oldAudio = typeof old?.audio === "string" ? old.audio : null;
    const sameText = typeof old?.text === "string" && old.text === form.text.trim().replace(/\s+/g, " ");
    audio = oldAudio && sameText && form.audio === oldAudio && audioNameFromUrl(oldAudio) ? oldAudio : null;
    if (oldAudio && !audio) staleAudio = oldAudio;
    if (status === "published" && !audio) return fail("Câu luyện nói cần âm thanh mẫu trước khi xuất bản.", "audio");
  }
  const built = buildExtraData(type, { ...form, audio }, ctx);
  if (!built.ok) return fail(built.message, built.field);
  const invalid = validateExtraBuilt(type, built.data);
  if (invalid) return fail(invalid, "text");

  const data = {
    type,
    prompt: built.data.prompt as object,
    options: built.data.options as object,
    answer: built.data.answer as object,
    explanation: existing?.explanation ?? null,
    levelId,
    skill: EXTRA_TYPE_INFO[type].skill as "pronunciation" | "writing" | "listening" | "grammar",
    difficulty: existing?.difficulty ?? 1,
    status,
  };
  const saved = id ? await db.question.update({ where: { id }, data, select: { id: true } }) : await db.question.create({ data, select: { id: true } });
  if (staleAudio) await removeAudioFile(staleAudio);
  return { ok: true, id: saved.id };
}

export type QuestionAudioResult = { ok: true; audio: string } | { ok: false; field?: string; message: string };

async function setQuestionAudio(questionId: number, audio: string): Promise<void> {
  const row = await db.question.findUnique({ where: { id: questionId }, select: { prompt: true } });
  const prompt = (row?.prompt ?? {}) as Record<string, unknown>;
  const old = typeof prompt.audio === "string" ? prompt.audio : null;
  await db.question.update({ where: { id: questionId }, data: { prompt: { ...prompt, audio } as object } });
  if (old && old !== audio) await removeAudioFile(old);
}

async function speakingQuestion(questionId: number) {
  if (!Number.isInteger(questionId) || questionId < 1) return null;
  const row = await db.question.findUnique({ where: { id: questionId }, select: { id: true, type: true, prompt: true } });
  const text = (row?.prompt as { text?: unknown } | null | undefined)?.text;
  return row && row.type === "speaking" && typeof text === "string" ? { id: row.id, text } : null;
}

/** Tạo giọng đọc tự động cho âm thanh mẫu của một câu luyện nói đã lưu. */
export async function generateQuestionAudio(questionId: number, force = false): Promise<QuestionAudioResult> {
  const q = await speakingQuestion(questionId);
  if (!q) return { ok: false, message: "Hãy lưu câu hỏi trước khi tạo giọng đọc." };
  if (!force) {
    const current = (await db.question.findUnique({ where: { id: q.id }, select: { prompt: true } }))?.prompt as { audio?: unknown } | null;
    if (typeof current?.audio === "string" && (await audioFileExists(current.audio))) return { ok: true, audio: current.audio };
  }
  try {
    const voice = currentVoice();
    const bytes = await synthesizeMp3(q.text, voice);
    const stored = await saveAudioFile("question", q.id, q.text, voice, bytes);
    await setQuestionAudio(q.id, stored);
    return { ok: true, audio: stored };
  } catch (error) {
    if (error instanceof TtsUnavailableError) return { ok: false, message: error.message };
    if (error instanceof TtsTextError) return { ok: false, message: error.message };
    console.error("tạo giọng đọc câu luyện nói:", error);
    return { ok: false, message: "Chưa tạo được giọng đọc. Thử lại nhé." };
  }
}

/** Lưu tệp âm thanh mẫu tải lên cho một câu luyện nói đã lưu (.mp3/.wav theo nội dung, ≤ 3 MB, 0,5–30 giây). */
export async function saveQuestionAudioUpload(questionId: number, file: { name: string; bytes: Uint8Array }): Promise<QuestionAudioResult> {
  const q = await speakingQuestion(questionId);
  if (!q) return { ok: false, message: "Hãy lưu câu hỏi trước khi tải âm thanh lên." };
  const check = checkStoryAudioUpload(file.name, file.bytes);
  if (!check.ok) return { ok: false, field: "file", message: check.message };
  const bytes = Buffer.from(file.bytes);
  const stored = await saveAudioFile("question", q.id, createHash("sha1").update(bytes).digest("hex"), "upload", bytes, check.format);
  await setQuestionAudio(q.id, stored);
  return { ok: true, audio: stored };
}

