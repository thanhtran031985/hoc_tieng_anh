import { z } from "zod";

// Thông tin thêm của từ vựng, lưu ở cột JSON `words.extra`.
export const wordExtraSchema = z.object({
  /** Họ từ (vd success → successful, successfully). */
  family: z.array(z.string().trim().min(1).max(100)).default([]),
  /** Cụm từ đi kèm (vd "play football"). */
  collocations: z.array(z.string().trim().min(1).max(150)).default([]),
  /** Ghi chú ngắn cho người soạn nội dung. */
  note: z.string().trim().max(500).optional(),
});

export type WordExtra = z.infer<typeof wordExtraSchema>;

export function parseWordExtra(value: unknown): WordExtra {
  const result = wordExtraSchema.safeParse(value ?? {});
  return result.success ? result.data : wordExtraSchema.parse({});
}
