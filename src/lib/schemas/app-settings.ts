import { z } from "zod";

// Cài đặt chung của cả hệ thống, lưu ở bảng `app_settings` (khóa → JSON). Dùng chung giữa server và client.

/** Công tắc "Giọng mp3" (khóa `voice_mp3`): tắt (mặc định) thì mọi nơi dùng giọng trình duyệt; bật thì phát mp3 khi từ có tệp. */
export const voiceMp3SettingSchema = z.object({
  enabled: z.boolean().default(false),
});
export type VoiceMp3Setting = z.infer<typeof voiceMp3SettingSchema>;

/** Đọc giá trị đã lưu; sai dạng hoặc chưa có thì về mặc định (tắt). */
export function parseVoiceMp3Setting(raw: unknown): VoiceMp3Setting {
  const parsed = voiceMp3SettingSchema.safeParse(raw ?? {});
  return parsed.success ? parsed.data : { enabled: false };
}
