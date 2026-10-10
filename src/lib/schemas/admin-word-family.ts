import { z } from "zod";
import { FAMILY_MEMBERS_MAX, familyDecoysSchema, familyIpaSchema, familyPatternSchema, familySentencesSchema, familyTrapNoteSchema } from "./word-family.ts";

// Dữ liệu ghi của màn Soạn Họ vần (task 26, Adult23). Dùng chung giữa biểu mẫu ở client và server action.

export const familyMemberInputSchema = z.object({
  wordId: z.number().int().positive(),
  /** Cùng âm với cả họ (true) hay Bẫy chính tả: cùng chữ nhưng khác âm (false). */
  sameSound: z.boolean(),
});
export type FamilyMemberInput = z.infer<typeof familyMemberInputSchema>;

/** Vần để ghép, nếu khác vần hiển thị (“irt” cho họ “ir”); rỗng là dùng chính vần của họ. */
const buildRimeSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z]{1,10}$/, "Vần để ghép chỉ gồm 1–10 chữ cái a–z.")
  .or(z.literal(""))
  .nullish()
  .transform((v) => (v ? v : null));

export const saveFamilySchema = z.object({
  /** Có `id` là họ đã lưu; không có là họ mới. */
  id: z.number().int().positive().optional(),
  pattern: familyPatternSchema,
  soundIpa: familyIpaSchema,
  levelId: z.number().int().positive(),
  buildRime: buildRimeSchema,
  decoys: familyDecoysSchema,
  trapNote: familyTrapNoteSchema,
  members: z
    .array(familyMemberInputSchema)
    .max(FAMILY_MEMBERS_MAX, `Tối đa ${FAMILY_MEMBERS_MAX} từ.`)
    .refine((list) => new Set(list.map((m) => m.wordId)).size === list.length, "Có từ bị thêm hai lần."),
  sentences: familySentencesSchema,
  status: z.enum(["draft", "published"]),
});
export type SaveFamilyInput = z.infer<typeof saveFamilySchema>;

/** Mở một họ để soạn: có mã là họ đã lưu, không có là họ mới. */
export const familyEditorInputSchema = z.object({ familyId: z.number().int().positive().nullable() });

/** Tạo giọng đọc đoạn văn vui của một họ. */
export const generateFamilyAudioSchema = z.object({ familyId: z.number().int().positive(), force: z.boolean().default(false) });

/** Gợi ý từ trong kho: từ có chứa `pattern`, lọc thêm theo chữ bé gõ. */
export const familyBankSearchSchema = z.object({
  pattern: familyPatternSchema,
  query: z.string().trim().max(30).default(""),
});
