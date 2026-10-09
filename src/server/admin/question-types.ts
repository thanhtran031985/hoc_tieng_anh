import { buildExtraData, extraQuestionSummary, readExtraForm, validateExtraBuilt, EXTRA_TYPE_INFO, type ExtraContext, type ExtraForm } from "@/lib/rules/admin-question-types";
import type { BankWord } from "@/lib/rules/admin-questions";
import type { PhonicsSoundInfo } from "@/lib/rules/lesson-play";
import { saveExtraQuestionSchema } from "@/lib/schemas/admin-question-types";
import { EXTRA_QUESTION_TYPES } from "@/lib/schemas/question-extra";
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
};

const key = (text: string) => text.trim().replace(/\s+/g, " ").toLowerCase();

export async function getExtraQuestions(): Promise<ExtraQuestionsData> {
  const [questions, levels, words, sounds] = await Promise.all([
    db.question.findMany({
      where: { type: { in: [...EXTRA_QUESTION_TYPES] } },
      orderBy: [{ level: { number: "asc" } }, { id: "asc" }],
      select: { id: true, type: true, prompt: true, options: true, answer: true, levelId: true, status: true, level: { select: { number: true } } },
    }),
    db.level.findMany({ orderBy: { number: "asc" }, select: { id: true, number: true, name: true } }),
    db.word.findMany({ where: { image: { not: null } }, orderBy: { word: "asc" }, select: { id: true, word: true, image: true } }),
    db.phonicsSound.findMany({ where: { status: "published" }, orderBy: { sortOrder: "asc" }, select: { grapheme: true, ipa: true, audio: true } }),
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
  };
}

export async function saveExtraQuestion(input: unknown): Promise<AdminResult> {
  const parsed = saveExtraQuestionSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { id, type, levelId, status, ...form } = parsed.data;

  const existing = id ? await db.question.findUnique({ where: { id }, select: { id: true, type: true, difficulty: true, explanation: true } }) : null;
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

  const built = buildExtraData(type, form, ctx);
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
  return { ok: true, id: saved.id };
}
