import { VOICE_MP3_SETTING_KEY } from "@/lib/rules/tts";
import { parseVoiceMp3Setting } from "@/lib/schemas/app-settings";
import { db } from "./db";

// Cài đặt chung của cả hệ thống (bảng app_settings). Đọc thì mọi nơi gọi được; ghi chỉ qua server action của quản trị.

/** Công tắc "Giọng mp3" có đang bật không (mặc định tắt). */
export async function getVoiceMp3Enabled(): Promise<boolean> {
  const row = await db.appSetting.findUnique({ where: { key: VOICE_MP3_SETTING_KEY }, select: { value: true } });
  return parseVoiceMp3Setting(row?.value).enabled;
}

/** Bật/tắt công tắc "Giọng mp3". Nơi gọi phải đã kiểm quyền quản trị. */
export async function setVoiceMp3Enabled(enabled: boolean): Promise<void> {
  const value = { enabled };
  await db.appSetting.upsert({ where: { key: VOICE_MP3_SETTING_KEY }, create: { key: VOICE_MP3_SETTING_KEY, value }, update: { value } });
}
