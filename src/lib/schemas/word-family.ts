import { z } from "zod";
import { explorerSentenceSchema } from "./word-explorer.ts";

// Họ vần (dạng bài 8.28, task 26): hình dạng JSON của `word_families.decoys` và các trường dùng chung giữa server và client.
// Điều kiện xuất bản (đủ từ cùng âm, đoạn văn có dịch và giọng đọc…) kiểm riêng ở src/lib/rules/word-family.ts.

export const WORD_FAMILY_KINDS = ["rime", "root"] as const;
export const wordFamilyKindSchema = z.enum(WORD_FAMILY_KINDS);
export type WordFamilyKind = z.infer<typeof wordFamilyKindSchema>;

/** Số từ tối đa của một họ vần (cả từ cùng âm lẫn Bẫy). */
export const FAMILY_MEMBERS_MAX = 24;
/** Số chữ đầu nhiễu tối đa. */
export const FAMILY_DECOYS_MAX = 8;
/** Số câu tối đa của đoạn văn vui của họ. */
export const FAMILY_SENTENCES_MAX = 4;

/** Vần: 1–6 chữ cái thường a–z (“at”, “ir”, “irt”). */
export const familyPatternSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Nhập vần.")
  .max(6, "Vần tối đa 6 chữ cái.")
  .regex(/^[a-z]+$/, "Vần chỉ gồm các chữ cái a–z, không dấu, không khoảng trắng.");

/** Âm IPA của cả họ, viết giữa hai dấu gạch chéo: /æt/. */
export const familyIpaSchema = z
  .string()
  .trim()
  .min(1, "Nhập âm IPA.")
  .max(40, "Âm IPA tối đa 40 ký tự.")
  .regex(/^\/[^/\s][^/]*\/$/, "Âm IPA phải nằm giữa hai dấu gạch chéo, ví dụ /æt/.");

/** Chữ đầu (phụ âm hoặc cụm phụ âm trước vần): 1–3 chữ cái thường. */
export const onsetSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z]{1,3}$/, "Chữ đầu gồm 1–3 chữ cái a–z.");

export const familyDecoysSchema = z.array(onsetSchema).max(FAMILY_DECOYS_MAX, `Tối đa ${FAMILY_DECOYS_MAX} chữ đầu nhiễu.`);

export const familyTrapNoteSchema = z.string().trim().max(500, "Lời giải thích tối đa 500 ký tự.");

export const familySentencesSchema = z.array(explorerSentenceSchema).max(FAMILY_SENTENCES_MAX, `Đoạn văn tối đa ${FAMILY_SENTENCES_MAX} câu.`);

/** Tham số của các thao tác đọc họ vần theo mã (tab Họ vần trong Sổ từ, khung liên kết). */
export const familyIdInputSchema = z.object({ familyId: z.number().int().positive() });

/** Tham số nạp một mục của khung liên kết (Khám phá của từ, Họ vần, Ghép chữ đầu). */
export const wordLabEntryInputSchema = z.discriminatedUnion("v", [
  z.object({ v: z.literal("wx"), wordId: z.number().int().positive() }),
  z.object({ v: z.literal("fam"), familyId: z.number().int().positive() }),
  z.object({ v: z.literal("build"), familyId: z.number().int().positive(), first: z.number().int().positive().nullable().default(null) }),
]);
export type WordLabEntryInput = z.infer<typeof wordLabEntryInputSchema>;

/** Đọc JSON từ database về đúng kiểu; hỏng thì trả null để màn bỏ qua họ thay vì vỡ. */
export function parseFamilyDecoys(data: unknown): string[] | null {
  const result = familyDecoysSchema.safeParse(data);
  return result.success ? result.data : null;
}
