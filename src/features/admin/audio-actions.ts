"use server";

import { revalidatePath } from "next/cache";
import { voiceMp3SettingSchema, type GenerateAudioResult } from "@/lib/schemas";
import { requireAdmin } from "@/server/admin-gate";
import { generateWordAudio } from "@/server/admin/audio";
import type { AdminResult } from "@/server/admin/result";
import { setVoiceMp3Enabled } from "@/server/app-settings";

// Server action của giọng đọc mp3: gọi `requireAdmin()` ở dòng đầu (không dựa vào layout).

/** Bật hoặc tắt công tắc “Giọng mp3” (toàn hệ thống, mặc định tắt). */
export async function setVoiceMp3Action(input: unknown): Promise<AdminResult> {
  await requireAdmin();
  const parsed = voiceMp3SettingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Giá trị không hợp lệ." };
  try {
    await setVoiceMp3Enabled(parsed.data.enabled);
    revalidatePath("/admin/media");
    revalidatePath("/admin/vocab");
    return { ok: true };
  } catch (error) {
    console.error("set voice mp3:", error);
    return { ok: false, message: "Chưa lưu được. Thử lại nhé." };
  }
}

/** Tạo giọng đọc cho một lượt từ (tối đa 5 từ mỗi lần gọi). */
export async function generateAudioAction(input: unknown): Promise<GenerateAudioResult> {
  await requireAdmin();
  try {
    const result = await generateWordAudio(input);
    if (result.ok && result.items.some((i) => i.status === "made")) {
      revalidatePath("/admin/media");
      revalidatePath("/admin/vocab");
      revalidatePath("/admin");
    }
    return result;
  } catch (error) {
    console.error("generate audio:", error);
    return { ok: false, message: "Chưa tạo được giọng đọc. Thử lại nhé." };
  }
}
