"use server";

import type { OpenedReward } from "@/lib/schemas";
import { requireActiveLearner } from "@/server/active-learner";
import { LearnerAccessError } from "@/server/learners";
import { RewardAccessError, openReward } from "@/server/rewards";
import { requireUser } from "@/server/session";

export type OpenRewardResult = { ok: true; reward: OpenedReward } | { ok: false; message: string };

/**
 * Mở một quà sticker của hồ sơ đang chọn (hộp quà cuối bài hoặc quà đang chờ ở Bộ sưu tập): đánh dấu đã mở và cộng xu một lần.
 * Quà phải thuộc đúng hồ sơ; lỗi trả lời nhẹ để bé thử mở lại (quà vẫn được giữ).
 */
export async function openRewardAction(input: unknown): Promise<OpenRewardResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner({ allowTimeUp: true });
  try {
    return { ok: true, reward: await openReward(user.id, learner.id, input) };
  } catch (error) {
    if (error instanceof RewardAccessError || error instanceof LearnerAccessError) return { ok: false, message: "Không tìm thấy món quà này." };
    return { ok: false, message: "Chưa mở được quà. Bé thử lại nhé, quà vẫn được giữ!" };
  }
}
