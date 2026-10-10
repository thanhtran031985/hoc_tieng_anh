import { z } from "zod";
import type { EarnedBadge } from "./reward";
import { reviewItemSchema } from "./lesson-complete";

// Dữ liệu client gửi khi bé ôn xong một phiên. Chỉ gồm kết quả từng mục; sao, xu, XP và hộp mới do server tính.

const MAX_ITEMS = 60;
const MAX_DURATION_MS = 3 * 60 * 60 * 1000;

export const completeReviewInputSchema = z.object({
  /** Lúc bé bắt đầu phiên ôn (ms), giữ nguyên qua các lần thử lưu lại để một phiên chỉ ghi một lần. */
  startedAtMs: z.number().int().positive(),
  durationMs: z.number().int().min(0).max(MAX_DURATION_MS),
  items: z.array(reviewItemSchema).min(1).max(MAX_ITEMS),
});

export type CompleteReviewInput = z.infer<typeof completeReviewInputSchema>;

/** Một từ vừa ôn và hộp của nó trước/sau phiên. */
export type ReviewMove = {
  wordId: number;
  word: string;
  meaningVi: string;
  image: string | null;
  from: number;
  to: number;
};

/** Kết quả server trả về cho màn tổng kết ôn tập. */
export type ReviewCompletion = {
  stars: number;
  coins: number;
  xp: number;
  /** Số từ đã ôn. */
  total: number;
  minutes: number;
  /** Các từ lên hộp (đúng), theo thứ tự ôn. */
  up: ReviewMove[];
  /** Số từ về hộp 1 (chưa nhớ). */
  back: number;
  /** Huy hiệu thành tích vừa đạt ở phiên ôn (vd 100 từ đầu tiên); bài ôn không rơi sticker. */
  badges?: EarnedBadge[];
};
