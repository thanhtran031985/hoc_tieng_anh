import { z } from "zod";

// Ngân hàng câu hỏi: ba cột JSON `prompt`, `options`, `answer` của bảng `questions`.
// `type` là chuỗi; mỗi dạng câu hỏi có hình dạng `options` và `answer` riêng.

/** Dạng câu hỏi của giai đoạn 1 (PRD C8: 8.2–8.4). */
export const QUESTION_TYPES = ["listen_choose_picture", "choose_word_for_picture", "match_pairs"] as const;
export const questionTypeSchema = z.enum(QUESTION_TYPES);
export type QuestionType = z.infer<typeof questionTypeSchema>;

export const SKILLS = ["vocabulary", "listening", "reading", "grammar", "pronunciation", "writing", "speaking"] as const;
export const skillSchema = z.enum(SKILLS);

/** Đề bài: chữ, hình, âm thanh, hoặc từ vựng có sẵn (`wordId`). Có ít nhất một thứ. */
export const questionPromptSchema = z
  .object({
    text: z.string().trim().min(1).max(500).optional(),
    image: z.string().max(255).optional(),
    audio: z.string().max(255).optional(),
    wordId: z.number().int().positive().optional(),
  })
  .refine((p) => Object.values(p).some((v) => v !== undefined), "Đề bài cần có chữ, hình, âm thanh hoặc từ");

/** Một lựa chọn: hình hoặc chữ. */
export const questionOptionSchema = z
  .object({
    id: z.string().min(1).max(20),
    text: z.string().trim().min(1).max(200).optional(),
    image: z.string().max(255).optional(),
  })
  .refine((o) => o.text !== undefined || o.image !== undefined, "Lựa chọn cần có chữ hoặc hình");

const uniqueIds = (items: { id: string }[]) => new Set(items.map((i) => i.id)).size === items.length;

const choiceOptionsSchema = z.array(questionOptionSchema).min(2).max(4).refine(uniqueIds, "Mã lựa chọn bị trùng");
const choiceAnswerSchema = z.object({ correct: z.array(z.string().min(1)).min(1) });

const matchOptionsSchema = z.object({
  left: z.array(questionOptionSchema).min(3).max(6).refine(uniqueIds, "Mã lựa chọn bị trùng"),
  right: z.array(questionOptionSchema).min(3).max(6).refine(uniqueIds, "Mã lựa chọn bị trùng"),
});
const matchAnswerSchema = z.object({ pairs: z.array(z.object({ left: z.string().min(1), right: z.string().min(1) })).min(3) });

const choiceQuestionSchema = z
  .object({ prompt: questionPromptSchema, options: choiceOptionsSchema, answer: choiceAnswerSchema })
  .refine((q) => q.answer.correct.every((id) => q.options.some((o) => o.id === id)), {
    message: "Đáp án đúng phải nằm trong các lựa chọn",
    path: ["answer"],
  });

const matchQuestionSchema = z
  .object({ prompt: questionPromptSchema, options: matchOptionsSchema, answer: matchAnswerSchema })
  .refine(
    (q) =>
      q.answer.pairs.length === q.options.left.length &&
      q.answer.pairs.every((p) => q.options.left.some((o) => o.id === p.left) && q.options.right.some((o) => o.id === p.right)),
    { message: "Mỗi cặp phải nối đúng lựa chọn bên trái với bên phải", path: ["answer"] },
  );

export const questionDataSchemas = {
  listen_choose_picture: choiceQuestionSchema,
  choose_word_for_picture: choiceQuestionSchema,
  match_pairs: matchQuestionSchema,
} satisfies Record<QuestionType, z.ZodType>;

export type ChoiceQuestionData = z.infer<typeof choiceQuestionSchema>;
export type MatchQuestionData = z.infer<typeof matchQuestionSchema>;
export type QuestionData = ChoiceQuestionData | MatchQuestionData;

/** Kiểm tra bộ ba prompt/options/answer theo dạng câu hỏi; ném ZodError nếu sai (dùng khi ghi). */
export function validateQuestionData(type: string, data: unknown): QuestionData {
  return questionDataSchemas[questionTypeSchema.parse(type)].parse(data);
}

/** Như `validateQuestionData` nhưng trả về null thay vì ném lỗi (dùng khi đọc). */
export function parseQuestionData(type: string, data: unknown): QuestionData | null {
  const t = questionTypeSchema.safeParse(type);
  if (!t.success) return null;
  const result = questionDataSchemas[t.data].safeParse(data);
  return result.success ? result.data : null;
}
