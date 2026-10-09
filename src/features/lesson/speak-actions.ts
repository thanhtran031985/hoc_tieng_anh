"use server";

import { requireActiveLearner } from "@/server/active-learner";
import { LearnerAccessError } from "@/server/learners";
import { saveRecording, type SaveRecordingResult } from "@/server/recordings";
import { requireUser } from "@/server/session";

/**
 * Lưu bản ghi âm của bé sau khi nói xong (FormData: `file` + các trường số). Chỉ lưu cho hồ sơ đang chọn của tài khoản đang đăng nhập.
 * Lỗi không làm hỏng bài: màn Luyện nói vẫn cho bé đi tiếp.
 */
export async function saveRecordingAction(formData: FormData): Promise<SaveRecordingResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner({ allowTimeUp: true });
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, message: "Chưa có bản ghi âm." };
  const num = (key: string) => Number(formData.get(key));
  const transcript = formData.get("transcript");
  try {
    return await saveRecording(
      user.id,
      learner.id,
      { questionId: num("questionId"), durationMs: Math.round(num("durationMs")), stars: num("stars"), transcript: typeof transcript === "string" && transcript !== "" ? transcript : null, scored: formData.get("scored") === "1" },
      { bytes: new Uint8Array(await file.arrayBuffer()) },
    );
  } catch (error) {
    if (error instanceof LearnerAccessError) return { ok: false, message: "Hồ sơ này không dùng được." };
    console.error("save recording:", error);
    return { ok: false, message: "Chưa lưu được bản ghi âm." };
  }
}
