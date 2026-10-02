"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { setActiveLearner } from "@/server/active-learner";
import { getLearner } from "@/server/learners";
import { requireUser } from "@/server/session";

const selectSchema = z.object({ learnerId: z.coerce.number().int().positive() });

/** Chọn hồ sơ bé để học: chỉ chọn được hồ sơ thuộc tài khoản đang đăng nhập. */
export async function selectLearnerAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = selectSchema.safeParse({ learnerId: formData.get("learnerId") });
  const learner = parsed.success ? await getLearner(user.id, parsed.data.learnerId) : null;
  // Hồ sơ không có hoặc của tài khoản khác: không nói rõ, quay về màn chọn hồ sơ.
  if (!learner) redirect("/profiles");
  await setActiveLearner(user.id, learner.id);
  redirect("/home");
}
