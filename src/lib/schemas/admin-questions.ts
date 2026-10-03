import { z } from "zod";
import { MAX_CHOICES, MAX_EXPLANATION, MAX_PAIRS } from "../rules/admin-questions.ts";
import { SKILLS, questionTypeSchema, skillSchema } from "./question.ts";

// Dữ liệu ghi của Ngân hàng câu hỏi quản trị (task 12, Adult11). Dùng chung giữa biểu mẫu ở client và server action.
// Biểu mẫu chỉ gửi chữ của các từ; server tra từ trong ngân hàng và dựng `prompt`, `options`, `answer` (xem rules/admin-questions.ts).

const word = z.string().max(100, "Từ tối đa 100 ký tự.");

export const saveQuestionSchema = z.object({
  /** Có `id` là sửa, không có là thêm mới. */
  id: z.number().int().positive().optional(),
  type: questionTypeSchema,
  levelId: z.number().int().positive(),
  skill: skillSchema,
  difficulty: z.number({ error: "Chọn độ khó." }).int().min(1, "Độ khó từ 1 đến 5.").max(5, "Độ khó từ 1 đến 5."),
  explanation: z.string().trim().max(MAX_EXPLANATION, `Giải thích tối đa ${MAX_EXPLANATION} ký tự.`).nullable(),
  status: z.enum(["draft", "published"]),
  choices: z.array(word).max(MAX_CHOICES),
  correct: z.number().int().min(0).max(MAX_CHOICES - 1).nullable(),
  pairs: z.array(word).max(MAX_PAIRS),
});

export type SaveQuestionInput = z.infer<typeof saveQuestionSchema>;

export const SKILL_LABEL: Record<(typeof SKILLS)[number], string> = {
  vocabulary: "Từ vựng",
  listening: "Nghe",
  reading: "Đọc",
  grammar: "Ngữ pháp",
  pronunciation: "Phát âm",
  writing: "Viết",
  speaking: "Nói",
};
