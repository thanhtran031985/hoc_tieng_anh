"use server";

import { createLearnerFormSchema } from "@/lib/schemas";
import { avatarForIndex } from "@/lib/learner-rules";
import { setActiveLearner } from "@/server/active-learner";
import { LearnerLimitError, createLearner, listLearners } from "@/server/learners";
import { requireUser } from "@/server/session";

export type CreateLearnerResult = { ok: true } | { ok: false; message: string };

/** Lưu hồ sơ bé từ luồng 3 bước rồi chọn luôn hồ sơ đó. Dữ liệu được kiểm bằng Zod ở server. */
export async function createLearnerAction(input: unknown): Promise<CreateLearnerResult> {
  const user = await requireUser();
  const parsed = createLearnerFormSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Thông tin hồ sơ chưa đúng" };
  try {
    const existing = await listLearners(user.id);
    const learner = await createLearner(user.id, { ...parsed.data, avatar: avatarForIndex(existing.length) });
    await setActiveLearner(user.id, learner.id);
    return { ok: true };
  } catch (error) {
    if (error instanceof LearnerLimitError) return { ok: false, message: "Tài khoản đã có đủ 6 hồ sơ rồi." };
    return { ok: false, message: "Chưa lưu được hồ sơ. Bố mẹ thử lại nhé." };
  }
}
