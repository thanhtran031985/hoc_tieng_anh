"use server";

import { requireActiveLearner } from "@/server/active-learner";
import { saveGameRecord, type SaveGameRecordResult } from "@/server/game-records";
import { LearnerAccessError } from "@/server/learners";
import { requireUser } from "@/server/session";

/**
 * Lưu thành tích mini game sau khi chơi xong (cho xe ma của Đua xe lần sau). Chỉ lưu cho hồ sơ đang chọn của tài khoản đang đăng nhập.
 * Lỗi không làm hỏng bài: bé vẫn đi tiếp.
 */
export async function saveGameRecordAction(input: unknown): Promise<SaveGameRecordResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner({ allowTimeUp: true });
  try {
    return await saveGameRecord(user.id, learner.id, input);
  } catch (error) {
    if (error instanceof LearnerAccessError) return { ok: false, message: "Hồ sơ này không dùng được." };
    console.error("save game record:", error);
    return { ok: false, message: "Chưa lưu được thành tích." };
  }
}
