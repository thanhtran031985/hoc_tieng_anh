import { z } from "zod";
import { MAX_ACCEPTED, MAX_CARDS } from "../rules/admin-question-types.ts";
import { extraQuestionTypeSchema } from "./question-extra.ts";

// Dữ liệu ghi của màn Câu hỏi dạng mới (task 15, Adult18). Dùng chung giữa biểu mẫu ở client và server action.
// Biểu mẫu chỉ gửi chữ nhập vào; server tra từ minh họa và âm phonics rồi dựng `prompt`, `options`, `answer` (xem rules/admin-question-types.ts).

export const saveExtraQuestionSchema = z.object({
  /** Có `id` là sửa, không có là thêm mới. */
  id: z.number().int().positive().optional(),
  type: extraQuestionTypeSchema,
  levelId: z.number().int().positive(),
  status: z.enum(["draft", "published"]),
  text: z.string().max(200, "Tối đa 200 ký tự."),
  tiles: z.array(z.object({ t: z.string().max(4), sound: z.string().max(4) })).max(8, "Tối đa 8 ô âm."),
  distractors: z.string().max(200),
  alternatives: z.string().max(800),
  accepted: z.string().max(200 * MAX_ACCEPTED + MAX_ACCEPTED),
  ignoreCase: z.boolean(),
  ignoreEndPunct: z.boolean(),
  cards: z.array(z.string().max(30, "Thẻ tối đa 30 ký tự.")).max(MAX_CARDS),
  correct: z.number().int().min(0).max(MAX_CARDS - 1).nullable(),
  title: z.string().max(60, "Tiêu đề tối đa 60 ký tự."),
  questions: z
    .array(z.object({ text: z.string().max(120), choices: z.array(z.string().max(30)).max(3), correct: z.number().int().min(0).max(2).nullable(), evidence: z.number().int().min(0).max(5) }))
    .max(3),
  picture: z.string().max(100),
});

export type SaveExtraQuestionInput = z.infer<typeof saveExtraQuestionSchema>;
