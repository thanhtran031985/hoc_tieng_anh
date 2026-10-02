"use server";

import { revalidatePath } from "next/cache";
import { LearnerAccessError } from "@/server/learners";
import { requireParentGate } from "@/server/parent-gate";
import * as settings from "@/server/parent-settings";

// Server action của trang Cài đặt. Mỗi hàm: phải đang đăng nhập và đã mở khóa khu bố mẹ, rồi gọi hàm ở server/parent-settings.ts
// (kiểm Zod và quyền với hồ sơ). Lỗi bất ngờ trả lời nhẹ nhàng; không bao giờ lộ chi tiết kỹ thuật.

export type SettingsActionResult = settings.SettingsResult;

type Fn = (userId: number, input: unknown) => Promise<settings.SettingsResult>;

async function run(fn: Fn, input: unknown): Promise<SettingsActionResult> {
  const user = await requireParentGate();
  try {
    const result = await fn(user.id, input);
    if (result.ok) revalidatePath("/parent", "layout");
    return result;
  } catch (error) {
    if (error instanceof LearnerAccessError) return { ok: false, message: "Hồ sơ này không còn truy cập được." };
    console.error("settings action:", error);
    return { ok: false, message: "Chưa lưu được. Bố mẹ thử lại nhé." };
  }
}

export async function saveStudyTimeAction(input: unknown) {
  return run(settings.saveStudyTime, input);
}
export async function saveAppearanceAction(input: unknown) {
  return run(settings.saveAppearance, input);
}
export async function renameLearnerAction(input: unknown) {
  return run(settings.renameLearner, input);
}
export async function changeGradeAction(input: unknown) {
  return run(settings.changeGrade, input);
}
export async function changeLevelAction(input: unknown) {
  return run(settings.changeLevel, input);
}
export async function resetProgressAction(input: unknown) {
  return run(settings.resetProgress, input);
}
export async function deleteLearnerAction(input: unknown) {
  return run(settings.deleteLearner, input);
}
export async function changePasswordAction(input: unknown) {
  return run(settings.changePassword, input);
}
export async function changeParentPinAction(input: unknown) {
  return run(settings.changeParentPin, input);
}
