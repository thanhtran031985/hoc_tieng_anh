"use server";

import { revalidatePath } from "next/cache";
import { completeReviewInputSchema, type ReviewCompletion } from "@/lib/schemas";
import { requireActiveLearner } from "@/server/active-learner";
import { LearnerAccessError } from "@/server/learners";
import { completeReview } from "@/server/review";
import { requireUser } from "@/server/session";

export type CompleteReviewResult = { ok: true; completion: ReviewCompletion } | { ok: false; message: string };

/**
 * Ghi kết quả một phiên ôn của hồ sơ đang chọn. Chỉ nhận kết quả từng mục; sao, xu và hộp mới do server tính.
 * Lỗi trả về lời nhẹ nhàng để màn tổng kết hiện thông báo (kết quả vẫn được giữ trên máy).
 */
export async function completeReviewAction(input: unknown): Promise<CompleteReviewResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const parsed = completeReviewInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Kết quả ôn tập chưa hợp lệ." };
  try {
    const completion = await completeReview(user.id, learner.id, parsed.data);
    // Thanh trên cùng (sao, xu, chuỗi ngày) lấy số mới; ReviewFlow giữ nguyên bộ câu hỏi đã tải nên màn tổng kết không bị đổi.
    revalidatePath("/review");
    return { ok: true, completion };
  } catch (error) {
    if (error instanceof LearnerAccessError) return { ok: false, message: "Hồ sơ này không còn truy cập được." };
    return { ok: false, message: "Chưa lưu được kết quả. Bé thử lại nhé!" };
  }
}
