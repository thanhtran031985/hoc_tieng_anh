"use server";

import type { BuyResult } from "@/lib/schemas";
import { requireActiveLearner } from "@/server/active-learner";
import { LearnerAccessError } from "@/server/learners";
import { requireUser } from "@/server/session";
import { buyItem } from "@/server/shop";

export type BuyItemActionResult = BuyResult | { ok: false; reason: "error"; message: string };

/** Mua một món cho hồ sơ đang chọn. Quyền hồ sơ, đủ xu và chống mua hai lần đều kiểm ở server; lỗi trả lời nhẹ để bé thử lại (xu chưa bị trừ). */
export async function buyItemAction(input: unknown): Promise<BuyItemActionResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner({ allowTimeUp: true });
  try {
    return await buyItem(user.id, learner.id, input);
  } catch (error) {
    if (error instanceof LearnerAccessError) return { ok: false, reason: "missing" };
    return { ok: false, reason: "error", message: "Chưa mua được. Xu của bé vẫn còn nguyên, bé thử lại nhé!" };
  }
}
