"use server";

import { requireActiveLearner } from "@/server/active-learner";
import { requireUser } from "@/server/session";
import { getWordLabEntry, type LabData } from "@/server/word-lab";

export type LabEntryResult = { ok: true; data: LabData } | { ok: false; message: string; missing: boolean };

/**
 * Nạp một bậc của khung liên kết (Khám phá của từ, Họ vần, Ghép chữ đầu). Đi qua `getWordLabEntry` (kiểm hồ sơ thuộc tài khoản đang đăng nhập);
 * mục chưa có hoặc chưa xuất bản trả `missing` để khung nói nhẹ nhàng rồi ở lại bậc hiện tại. Không ghi gì, không tính sao hay xu.
 */
export async function getWordLabEntryAction(input: unknown): Promise<LabEntryResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  try {
    const data = await getWordLabEntry(user.id, learner.id, input);
    if (!data) return { ok: false, message: "Mục này chưa có hoặc chưa mở được.", missing: true };
    return { ok: true, data };
  } catch {
    return { ok: false, message: "Chưa mở được. Mình thử lại nhé!", missing: false };
  }
}
