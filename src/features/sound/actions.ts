"use server";

import { soundSettingsSchema } from "@/lib/schemas";
import { requireActiveLearner } from "@/server/active-learner";
import { updateLearnerSettings } from "@/server/learners";
import { requireUser } from "@/server/session";

export type SaveSoundResult = { ok: true } | { ok: false };

/**
 * Lưu cài đặt âm thanh (nhạc nền, hiệu ứng, âm lượng) của hồ sơ đang chọn vào `learners.settings`, để máy nào bé dùng cũng giống nhau.
 * Chỉ ghi ba trường này, giữ nguyên phần còn lại (giới hạn giờ, giọng đọc…). Hồ sơ phải thuộc tài khoản đang đăng nhập.
 */
export async function saveSoundSettingsAction(input: unknown): Promise<SaveSoundResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner({ allowTimeUp: true });
  const parsed = soundSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  try {
    await updateLearnerSettings(user.id, learner.id, { ...learner.settings, ...parsed.data });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
