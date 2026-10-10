"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireActiveLearner } from "@/server/active-learner";
import { LearnerAccessError } from "@/server/learners";
import { requireUser } from "@/server/session";
import { openOutsideHours, type AddTimeResult } from "@/server/study-time";

/** Bố mẹ nhập PIN để cho hồ sơ đang chọn học ngoài khung giờ trong 30 phút (sai nhiều lần thì khóa tạm, dùng chung bộ đếm với cổng bố mẹ). */
export async function openOutsideHoursAction(secret: unknown): Promise<AddTimeResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner({ allowTimeUp: true });
  const parsed = z.string().min(1).max(72).safeParse(secret);
  if (!parsed.success) return { ok: false, message: "Nhập mã PIN của bố mẹ." };
  try {
    const result = await openOutsideHours(user.id, learner.id, parsed.data);
    if (result.ok) revalidatePath("/home");
    return result;
  } catch (error) {
    if (error instanceof LearnerAccessError) return { ok: false, message: "Hồ sơ này không còn truy cập được." };
    console.error("openOutsideHoursAction:", error);
    return { ok: false, message: "Chưa mở được giờ học. Bố mẹ thử lại nhé." };
  }
}
