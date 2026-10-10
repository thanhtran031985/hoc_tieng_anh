"use server";

import { requireActiveLearner } from "@/server/active-learner";
import { LearnerAccessError } from "@/server/learners";
import { placeItem, stowItem, wearItem, type RoomWriteResult } from "@/server/room";
import { requireUser } from "@/server/session";

export type RoomActionResult = RoomWriteResult | { ok: false; reason: "error" };

// Server action của Phòng của tớ. Quyền hồ sơ và việc bé sở hữu món đều kiểm ở server; lỗi trả lời nhẹ để màn hiện lời Bông và nạp lại.
async function run(write: (userId: number, learnerId: number) => Promise<RoomWriteResult>): Promise<RoomActionResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner({ allowTimeUp: true });
  try {
    return await write(user.id, learner.id);
  } catch (error) {
    if (error instanceof LearnerAccessError) return { ok: false, reason: "missing" };
    return { ok: false, reason: "error" };
  }
}

/** Đặt hoặc dời một món nội thất trong phòng. */
export async function placeItemAction(input: unknown): Promise<RoomActionResult> {
  return run((userId, learnerId) => placeItem(userId, learnerId, input));
}

/** Cất một món nội thất vào kho. */
export async function stowItemAction(input: unknown): Promise<RoomActionResult> {
  return run((userId, learnerId) => stowItem(userId, learnerId, input));
}

/** Mặc (hoặc bỏ) mũ/áo cho Bông. */
export async function wearItemAction(input: unknown): Promise<RoomActionResult> {
  return run((userId, learnerId) => wearItem(userId, learnerId, input));
}
