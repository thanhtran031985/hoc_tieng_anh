import { buildQuestionData, explanationRequired, questionSummary, readQuestionForm, validateBuilt, type BankWord, type QuestionForm } from "@/lib/rules/admin-questions";
import { saveQuestionSchema } from "@/lib/schemas/admin-questions";
import { db } from "../db";
import { fail, firstIssue, type AdminResult } from "./result";

// Ngân hàng câu hỏi quản trị (Adult11): đọc cả ngân hàng và lưu một câu hỏi (thêm mới hoặc sửa), dạng 8.2–8.4 của giai đoạn 1.
// Hàm ghi kiểm Zod ở đây; server action (`features/admin/question-actions.ts`) gọi `requireAdmin()` trước khi vào.

export type QuestionRow = {
  id: number;
  type: string;
  summary: string;
  levelId: number;
  level: number;
  skill: string;
  difficulty: number;
  explanation: string;
  status: "draft" | "published";
  form: QuestionForm;
};

export type QuestionsData = {
  rows: QuestionRow[];
  levels: { id: number; number: number; name: string }[];
  /** Mọi từ trong ngân hàng, để chọn lựa chọn và dựng bản xem trước. */
  words: BankWord[];
};

export async function getQuestions(): Promise<QuestionsData> {
  const [questions, levels, words] = await Promise.all([
    db.question.findMany({
      where: { type: { in: ["listen_choose_picture", "match_pairs", "choose_word_for_picture"] } },
      orderBy: [{ level: { number: "asc" } }, { id: "asc" }],
      select: { id: true, type: true, options: true, answer: true, explanation: true, levelId: true, skill: true, difficulty: true, status: true, level: { select: { number: true } } },
    }),
    db.level.findMany({ orderBy: { number: "asc" }, select: { id: true, number: true, name: true } }),
    db.word.findMany({ orderBy: { word: "asc" }, select: { id: true, word: true, image: true } }),
  ]);
  return {
    rows: questions.map((q) => ({
      id: q.id,
      type: q.type,
      summary: questionSummary(q.type, q.options, q.answer),
      levelId: q.levelId,
      level: q.level.number,
      skill: q.skill,
      difficulty: q.difficulty,
      explanation: q.explanation ?? "",
      status: q.status === "published" ? "published" : "draft",
      form: readQuestionForm(q.type, q.options, q.answer),
    })),
    levels,
    words,
  };
}

export async function saveQuestion(input: unknown): Promise<AdminResult> {
  const parsed = saveQuestionSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { id, type, levelId, skill, difficulty, explanation, status, choices, correct, pairs } = parsed.data;

  if (id && !(await db.question.findUnique({ where: { id }, select: { id: true } }))) return fail("Không tìm thấy câu hỏi này nữa.");
  const level = await db.level.findUnique({ where: { id: levelId }, select: { number: true } });
  if (!level) return fail("Không tìm thấy cấp này.", "levelId");
  if (explanationRequired(level.number) && !explanation) return fail(`Câu hỏi THCS (cấp ${level.number}) cần có giải thích để học sinh hiểu vì sao sai.`, "explanation");

  const texts = (type === "match_pairs" ? pairs : choices).map((t) => t.trim()).filter(Boolean);
  const found = texts.length ? await db.word.findMany({ where: { word: { in: texts } }, select: { id: true, word: true, image: true }, orderBy: { id: "asc" } }) : [];
  const bank = new Map<string, BankWord>();
  for (const w of found) {
    const key = w.word.trim().replace(/\s+/g, " ").toLowerCase();
    if (!bank.has(key)) bank.set(key, w);
  }

  const built = buildQuestionData(type, { choices, correct, pairs }, bank);
  if (!built.ok) return fail(built.message, built.field);
  const invalid = validateBuilt(type, built.data);
  if (invalid) return fail(invalid, type === "match_pairs" ? "pairs" : "choices");

  const data = {
    type,
    prompt: built.data.prompt as object,
    options: built.data.options as object,
    answer: built.data.answer as object,
    explanation: explanation || null,
    levelId,
    skill,
    difficulty,
    status,
  };
  const saved = id ? await db.question.update({ where: { id }, data, select: { id: true } }) : await db.question.create({ data, select: { id: true } });
  return { ok: true, id: saved.id };
}
