"use server";

import { startExamInputSchema, type ExamResult } from "@/lib/schemas";
import { requireActiveLearner } from "@/server/active-learner";
import { ExamAccessError, ExamNotReadyError, startExam, submitExam, type ExamPlay } from "@/server/exam";
import { LearnerAccessError } from "@/server/learners";
import { ExamGateClosedError, LevelLockedError } from "@/server/map";
import { requireUser } from "@/server/session";

export type StartExamResult = { ok: true; play: ExamPlay } | { ok: false; message: string };
export type SubmitExamResult = { ok: true; result: ExamResult } | { ok: false; message: string };

function messageOf(error: unknown, fallback: string): string {
  if (error instanceof ExamGateClosedError || error instanceof LevelLockedError || error instanceof LearnerAccessError) return "Cổng thi chưa mở với bé.";
  if (error instanceof ExamNotReadyError) return "Bé ôn một chủ đề gợi ý xong là thi lại được nhé!";
  if (error instanceof ExamAccessError) return error.message;
  return fallback;
}

/** Bắt đầu (hoặc tiếp tục lượt thi dở) bài thi lên cấp của hồ sơ đang chọn. Cổng, quyền sở hữu hồ sơ và điều kiện thi lại đều kiểm ở server. */
export async function startExamAction(input: unknown): Promise<StartExamResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const parsed = startExamInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Bài thi chưa hợp lệ." };
  try {
    return { ok: true, play: await startExam(user.id, learner.id, parsed.data.level) };
  } catch (error) {
    return { ok: false, message: messageOf(error, "Bông chưa tải được bài thi. Bé thử lại nhé!") };
  }
}

/** Nộp bài thi: client chỉ gửi kết quả từng câu; đạt hay chưa, sao, xu và lên cấp do server tính. */
export async function submitExamAction(input: unknown): Promise<SubmitExamResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner({ allowTimeUp: true });
  try {
    return { ok: true, result: await submitExam(user.id, learner.id, input) };
  } catch (error) {
    return { ok: false, message: messageOf(error, "Chưa lưu được kết quả bài thi. Bé thử lại nhé!") };
  }
}
