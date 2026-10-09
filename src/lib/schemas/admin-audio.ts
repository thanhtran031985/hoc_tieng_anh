import { z } from "zod";
import { TTS_UI_BATCH_SIZE } from "@/lib/rules/tts";

// Tạo giọng đọc ở khu quản trị. Dùng chung giữa server và client.

/** Tạo giọng đọc cho một lượt từ (tối đa `TTS_UI_BATCH_SIZE` từ mỗi lần gọi). `force`: tạo lại cả chỗ đã có tệp. */
export const generateAudioSchema = z.object({
  wordIds: z.array(z.number().int().positive()).min(1, "Chọn ít nhất một từ.").max(TTS_UI_BATCH_SIZE, `Mỗi lượt tối đa ${TTS_UI_BATCH_SIZE} từ.`),
  force: z.boolean().default(false),
});
export type GenerateAudioInput = z.input<typeof generateAudioSchema>;

/** Kết quả từng từ trong lượt: đã tạo, bỏ qua (đã có tệp) hoặc lỗi kèm lời nhắn. */
export type AudioItemResult = { id: number; word: string; status: "made" | "skipped" | "error"; message?: string };
export type GenerateAudioResult = { ok: true; items: AudioItemResult[] } | { ok: false; message: string };
