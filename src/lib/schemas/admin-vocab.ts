import { z } from "zod";
import { exampleContainsWord, isIpaShape, isWordShape } from "../rules/admin-vocab.ts";
import { PARTS_OF_SPEECH } from "./content.ts";

// Dữ liệu ghi của Ngân hàng từ vựng quản trị (task 12, Adult10). Dùng chung giữa biểu mẫu ở client và server action.

const optionalText = (max: number) => z.string().trim().max(max, `Tối đa ${max} ký tự.`).nullable();

export const saveWordSchema = z
  .object({
    /** Có `id` là sửa, không có là thêm mới. */
    id: z.number().int().positive().optional(),
    word: z.string().trim().min(1, "Nhập từ tiếng Anh.").max(100, "Từ tối đa 100 ký tự.").refine(isWordShape, "Chỉ dùng chữ cái tiếng Anh, số, dấu cách, dấu gạch nối."),
    ipa: z.string().trim().min(1, "Nhập phiên âm IPA.").max(100, "Phiên âm tối đa 100 ký tự.").refine(isIpaShape, "Phiên âm đặt trong hai dấu gạch chéo, ví dụ /ˈæp.əl/."),
    partOfSpeech: z.enum(PARTS_OF_SPEECH, { error: "Chọn loại từ." }),
    meaningVi: z.string().trim().min(1, "Nhập nghĩa tiếng Việt.").max(255, "Nghĩa tối đa 255 ký tự."),
    exampleEn: z.string().trim().min(1, "Nhập một câu ví dụ tiếng Anh.").max(500, "Câu ví dụ tối đa 500 ký tự."),
    exampleVi: optionalText(500),
    levelId: z.number().int().positive(),
    /** Tên chủ đề (trùng tên chủ đề của cấp); `null` là bỏ khỏi mọi chủ đề, `undefined` là giữ nguyên. */
    topic: z.string().trim().min(1).max(150).nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (!exampleContainsWord(value.word, value.exampleEn)) ctx.addIssue({ code: "custom", path: ["exampleEn"], message: `Câu ví dụ chưa chứa từ “${value.word}”.` });
  });

export type SaveWordInput = z.infer<typeof saveWordSchema>;

/** Tên loại từ tiếng Việt cho biểu mẫu và bảng. */
export const PART_OF_SPEECH_LABEL: Record<(typeof PARTS_OF_SPEECH)[number], string> = {
  noun: "danh từ",
  verb: "động từ",
  adjective: "tính từ",
  adverb: "trạng từ",
  preposition: "giới từ",
  determiner: "hạn định từ",
  pronoun: "đại từ",
  conjunction: "liên từ",
  interjection: "thán từ",
  phrase: "cụm từ",
};
