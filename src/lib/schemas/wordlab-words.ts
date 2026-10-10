import { z } from "zod";
import { contentWordSchema } from "./content.ts";

// Từ thêm vào kho chỉ để làm đủ Họ vần (task 27): prisma/seed/wordlab/family-words.json. Chỉ import zod vì seed chạy thẳng bằng Node.
export const familyWordSchema = contentWordSchema.extend({
  /** Cấp của từ (1–10): cấp thấp nhất mà bé có thể gặp từ này. */
  level: z.number().int().min(1).max(10),
});
export type FamilyWord = z.infer<typeof familyWordSchema>;

export const familyWordsFileSchema = z.object({ words: z.array(familyWordSchema).min(1) });
