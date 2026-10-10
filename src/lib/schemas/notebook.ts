import { z } from "zod";

// Tham số trang in danh sách từ (task 23): `?level=3&topic=17`. Tham số sai (không phải số nguyên dương) bị bỏ qua như không lọc.
// Dùng chung giữa trang in (server) và nút “In danh sách từ” của Sổ từ.

const optionalInt = (max: number) =>
  z
    .preprocess((value) => (value === undefined || value === "" ? undefined : Number(value)), z.number().int().min(1).max(max).optional())
    .catch(undefined);

export const printQuerySchema = z.object({ level: optionalInt(10), topic: optionalInt(1_000_000) });
export type PrintQuery = z.infer<typeof printQuerySchema>;

/** Đọc tham số truy vấn thô (chuỗi hoặc mảng chuỗi của Next) thành bộ lọc đã kiểm. */
export function parsePrintQuery(raw: Record<string, string | string[] | undefined>): { level: number | null; topic: number | null } {
  const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const parsed = printQuerySchema.parse({ level: pick(raw.level), topic: pick(raw.topic) });
  return { level: parsed.level ?? null, topic: parsed.topic ?? null };
}
