"use server";

import { revalidatePath } from "next/cache";
import { applyStartLevelInputSchema, completePlacementInputSchema, type PlacementResult } from "@/lib/schemas";
import { requireActiveLearner } from "@/server/active-learner";
import { LearnerAccessError } from "@/server/learners";
import { PlacementClosedError, applyStartLevel, completePlacement } from "@/server/placement";
import { requireUser } from "@/server/session";

export type CompletePlacementResult = { ok: true; result: PlacementResult } | { ok: false; message: string };
export type ApplyLevelResult = { ok: true } | { ok: false; message: string };

/** Ghi kết quả bài xếp lớp của hồ sơ đang chọn và trả cấp đề xuất. Lỗi trả lời nhẹ nhàng để màn kết quả cho Thử lại. */
export async function completePlacementAction(input: unknown): Promise<CompletePlacementResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const parsed = completePlacementInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Kết quả bài xếp lớp chưa hợp lệ." };
  try {
    return { ok: true, result: await completePlacement(user.id, learner.id, parsed.data) };
  } catch (error) {
    if (error instanceof PlacementClosedError || error instanceof LearnerAccessError) return { ok: false, message: "Bé đã bắt đầu học rồi nên không xếp lớp lại được." };
    return { ok: false, message: "Chưa lưu được kết quả. Bé thử lại nhé!" };
  }
}

/** Đặt cấp bắt đầu (từ kết quả, hoặc "Bỏ qua, bắt đầu theo lớp"). */
export async function applyStartLevelAction(input: unknown): Promise<ApplyLevelResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const parsed = applyStartLevelInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Cấp này chưa hợp lệ." };
  try {
    await applyStartLevel(user.id, learner.id, parsed.data);
    revalidatePath("/home");
    return { ok: true };
  } catch (error) {
    if (error instanceof PlacementClosedError) return { ok: true };
    return { ok: false, message: "Chưa đặt được cấp. Bé thử lại nhé!" };
  }
}
