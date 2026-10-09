import { z } from "zod";
import { TTS_UI_BATCH_SIZE } from "@/lib/rules/tts";

// Âm phonics ở khu quản trị (Adult20). Dùng chung giữa server và client.

/** Tạo âm thanh tự động cho một lượt âm (tối đa `TTS_UI_BATCH_SIZE` âm mỗi lần gọi). `force`: tạo lại cả âm đã có tệp. */
export const generatePhonicsSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, "Chọn ít nhất một âm.").max(TTS_UI_BATCH_SIZE, `Mỗi lượt tối đa ${TTS_UI_BATCH_SIZE} âm.`),
  force: z.boolean().default(false),
});

/** Kết quả từng âm trong lượt: đã tạo, bỏ qua (đã có tệp) hoặc lỗi kèm lời nhắn. */
export type PhonicsItemResult = { id: number; grapheme: string; status: "made" | "skipped" | "error"; message?: string };
export type GeneratePhonicsResult = { ok: true; items: PhonicsItemResult[] } | { ok: false; message: string };
