import { z } from "zod";

// Câu trả lời của bé (cột JSON `answer_logs.answer`) và dữ liệu ghi các bảng kết quả học.

export const ANSWER_SOURCES = ["lesson", "review", "exam"] as const;

/** Câu trả lời: chọn lựa chọn (mã), nối cặp, hoặc gõ chữ. */
export const answerValueSchema = z.union([
  z.object({ selected: z.array(z.string().min(1).max(20)).min(1).max(6) }),
  z.object({ pairs: z.array(z.object({ left: z.string().min(1).max(20), right: z.string().min(1).max(20) })).min(1).max(6) }),
  z.object({ text: z.string().max(500) }),
]);

export type AnswerValue = z.infer<typeof answerValueSchema>;

const MAX_TIME_MS = 10 * 60 * 1000;

export const answerLogInputSchema = z
  .object({
    source: z.enum(ANSWER_SOURCES),
    questionId: z.number().int().positive().optional(),
    wordId: z.number().int().positive().optional(),
    attemptId: z.number().int().positive().optional(),
    isCorrect: z.boolean(),
    answer: answerValueSchema.optional(),
    timeMs: z.number().int().min(0).max(MAX_TIME_MS).optional(),
  })
  .refine((v) => v.questionId !== undefined || v.wordId !== undefined, "Cần có câu hỏi hoặc từ");

export type AnswerLogInput = z.infer<typeof answerLogInputSchema>;

/** Kết quả một lần học bài, do server tính từ các câu trả lời (sao: PRD Phần F). */
export const lessonResultSchema = z.object({
  correct: z.number().int().min(0).max(200),
  wrong: z.number().int().min(0).max(200),
  stars: z.number().int().min(1).max(3),
  xp: z.number().int().min(0).max(10000),
  coins: z.number().int().min(0).max(10000),
});

export type LessonResult = z.infer<typeof lessonResultSchema>;

/** Thẻ ôn tập: gắn với một từ hoặc một câu hỏi (đúng một trong hai), hộp 1–5. */
export const reviewCardInputSchema = z
  .object({
    wordId: z.number().int().positive().optional(),
    questionId: z.number().int().positive().optional(),
    box: z.number().int().min(1).max(5).default(1),
    dueOn: z.date(),
    correctCount: z.number().int().min(0).default(0),
    wrongCount: z.number().int().min(0).default(0),
  })
  .refine((v) => (v.wordId === undefined) !== (v.questionId === undefined), "Thẻ ôn tập gắn với đúng một từ hoặc một câu hỏi");

export type ReviewCardInput = z.infer<typeof reviewCardInputSchema>;
