"use server";

import { revalidatePath } from "next/cache";
import { LearnerAccessError } from "@/server/learners";
import { requireParentGate } from "@/server/parent-gate";
import { unlockTargets, type UnlockResult } from "@/server/parent-progress";

// Server action của trang Tiến độ: phải đang đăng nhập và đã mở khóa khu bố mẹ, rồi `unlockTargets` kiểm Zod, quyền với hồ sơ của bé
// và việc mỗi mục có tồn tại. Lỗi bất ngờ trả lời nhẹ nhàng, không lộ chi tiết kỹ thuật.

export async function unlockTargetsAction(input: unknown): Promise<UnlockResult> {
  const user = await requireParentGate();
  try {
    const result = await unlockTargets(user.id, input);
    if (result.ok) {
      revalidatePath("/parent/progress");
      // Bé vào được ngay: làm mới các màn bé đọc trạng thái khóa.
      revalidatePath("/map", "layout");
      revalidatePath("/home");
      revalidatePath("/levels");
    }
    return result;
  } catch (error) {
    if (error instanceof LearnerAccessError) return { ok: false, message: "Hồ sơ này không còn truy cập được." };
    console.error("unlock action:", error);
    return { ok: false, message: "Chưa mở khóa được. Bố mẹ thử lại nhé." };
  }
}
