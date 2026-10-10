import { z } from "zod";
import { WORDLAB } from "../rules/constants.ts";
import { audioNameFromUrl } from "../rules/tts.ts";
import { explorerAnswerSchema, explorerDistractorSchema, explorerSentenceSchema, wordQuestionKindSchema } from "./word-explorer.ts";

// Dữ liệu ghi của màn Soạn Khám phá từ (task 25, Adult22). Dùng chung giữa biểu mẫu ở client và server action.

/** Hình là tệp trong thư viện hình hoặc hình đã tải lên; không bao giờ là địa chỉ ngoài. */
const imagePath = z
  .string()
  .max(255)
  .refine((p) => /^\/(?:media\/pictures|uploads)\/[A-Za-z0-9._/-]+$/.test(p) && !p.includes(".."), "Hình phải chọn từ thư viện hình.")
  .nullish();
/** Âm thanh là tệp mp3 của Khám phá do máy chủ tạo (tên tệp hợp lệ). */
const audioPath = z
  .string()
  .max(255)
  .refine((p) => audioNameFromUrl(p) !== null, "Âm thanh không hợp lệ.")
  .nullish();

export const editorAnswerSchema = explorerAnswerSchema.extend({ image: imagePath, audio: audioPath });
export const editorDistractorSchema = explorerDistractorSchema.extend({ image: imagePath });

export const editorBranchSchema = z.object({
  /** Có `id` là nhánh đã lưu; không có là nhánh mới. */
  id: z.number().int().positive().optional(),
  kind: wordQuestionKindSchema,
  questionEn: z.string().trim().min(1, "Nhập câu hỏi tiếng Anh.").max(255, "Câu hỏi tối đa 255 ký tự."),
  questionVi: z.string().trim().max(255, "Bản dịch câu hỏi tối đa 255 ký tự.").default(""),
  answers: z.array(editorAnswerSchema).min(1, "Mỗi nhánh cần ít nhất một đáp án.").max(5, "Mỗi nhánh tối đa 5 đáp án."),
  distractors: z.array(editorDistractorSchema).max(2, "Mỗi nhánh tối đa 2 hình nhiễu."),
  /** Câu của nhánh trong đoạn văn “Đọc cả đoạn”. */
  sentence: explorerSentenceSchema,
});
export type EditorBranchInput = z.infer<typeof editorBranchSchema>;

export const saveExplorerSchema = z.object({
  wordId: z.number().int().positive(),
  status: z.enum(["draft", "published"]),
  /** 0 nhánh là gỡ Khám phá của từ; tối đa 6 nhánh (xuất bản cần 4–6). */
  branches: z.array(editorBranchSchema).max(WORDLAB.branchMax, `Tối đa ${WORDLAB.branchMax} nhánh.`),
});
export type SaveExplorerInput = z.infer<typeof saveExplorerSchema>;

export const editorWordInputSchema = z.object({ wordId: z.number().int().positive() });

/** Tạo giọng đọc cho một lượt mục: mã nhánh (đáp án của nhánh) và 0 là đoạn văn. */
export const generateExplorerAudioSchema = z.object({
  wordId: z.number().int().positive(),
  ids: z.array(z.number().int().min(0)).min(1).max(10),
  force: z.boolean().default(false),
});
