"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireActiveLearner } from "@/server/active-learner";
import { LearnerAccessError } from "@/server/learners";
import { requireUser } from "@/server/session";
import { addBonusMinutes, type AddTimeResult } from "@/server/study-time";

/** Bố mẹ nhập PIN hoặc mật khẩu để thêm 10 phút học hôm nay cho hồ sơ đang chọn (sai nhiều lần thì khóa tạm). */
export async function addBonusMinutesAction(secret: unknown): Promise<AddTimeResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner({ allowTimeUp: true });
  const parsed = z.string().min(1).max(72).safeParse(secret);
  if (!parsed.success) return { ok: false, message: "Nhập PIN hoặc mật khẩu của bố mẹ." };
  try {
    const result = await addBonusMinutes(user.id, learner.id, parsed.data);
    if (result.ok) revalidatePath("/home");
    return result;
  } catch (error) {
    if (error instanceof LearnerAccessError) return { ok: false, message: "Hồ sơ này không còn truy cập được." };
    console.error("addBonusMinutesAction:", error);
    return { ok: false, message: "Chưa thêm được giờ. Bố mẹ thử lại nhé." };
  }
}
