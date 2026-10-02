// Ôn tập lặp lại theo 5 hộp (PRD Phần F), hàm thuần không đụng database.
// Hộp 1–5 ôn lại sau 1, 3, 7, 14, 30 ngày. Đúng thì lên một hộp, sai thì về hộp 1. Từ mới học vào hộp 1, đến hạn ngày mai.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { addDays } from "./dates.ts";

export const BOX_INTERVAL_DAYS = [1, 3, 7, 14, 30] as const;
export const MAX_BOX = BOX_INTERVAL_DAYS.length;

export type ReviewCardState = { box: number; correctCount: number; wrongCount: number };

export type NextReview = ReviewCardState & { dueOn: Date };

/** Số ngày tới lần ôn kế của một hộp (hộp ngoài khoảng được kẹp vào 1–5). */
export function intervalDays(box: number): number {
  const index = Math.min(MAX_BOX, Math.max(1, Math.trunc(box))) - 1;
  return BOX_INTERVAL_DAYS[index];
}

/** Hộp 5 và đã đúng thì tính là "đã thuộc". */
export const isMastered = (card: ReviewCardState) => card.box >= MAX_BOX && card.correctCount > 0;

/**
 * Thẻ sau khi bé trả lời một lần. `card` null nghĩa là từ mới học lần đầu: vào hộp 1 và đến hạn ngày mai
 * (lần đầu gặp không tính là "ôn" nên không lên hộp). Ngày là "ngày lịch" (xem dates.ts).
 */
export function nextReview(card: ReviewCardState | null, correct: boolean, today: Date): NextReview {
  const correctCount = (card?.correctCount ?? 0) + (correct ? 1 : 0);
  const wrongCount = (card?.wrongCount ?? 0) + (correct ? 0 : 1);
  const box = card === null || !correct ? 1 : Math.min(MAX_BOX, card.box + 1);
  return { box, correctCount, wrongCount, dueOn: addDays(today, intervalDays(box)) };
}
