"use server";

import { completeLessonInputSchema, type LessonCompletion } from "@/lib/schemas";
import { requireActiveLearner } from "@/server/active-learner";
import { LearnerAccessError } from "@/server/learners";
import { completeLesson } from "@/server/lesson-complete";
import { LessonLockedError } from "@/server/lesson-play";
import { requireUser } from "@/server/session";

export type CompleteLessonResult = { ok: true; completion: LessonCompletion } | { ok: false; message: string };

/**
 * Ghi kết quả một bài học của hồ sơ đang chọn. Chỉ nhận kết quả từng mục; sao và xu do server tính.
 * Lỗi trả về lời nhẹ nhàng để màn kết thúc hiện nút Thử lại (kết quả vẫn được giữ trên máy).
 */
export async function completeLessonAction(input: unknown): Promise<CompleteLessonResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const parsed = completeLessonInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Kết quả bài học chưa hợp lệ." };
  try {
    return { ok: true, completion: await completeLesson(user.id, learner.id, parsed.data) };
  } catch (error) {
    if (error instanceof LessonLockedError || error instanceof LearnerAccessError) return { ok: false, message: "Bài này chưa mở với bé." };
    return { ok: false, message: "Chưa lưu được kết quả. Bé thử lại nhé!" };
  }
}
