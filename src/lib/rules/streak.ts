// Chuỗi ngày học (PRD Phần F), hàm thuần không đụng database.
// Học ít nhất 1 bài hoặc 1 lượt ôn trong ngày thì được tính. Mỗi tuần có 1 "thẻ nghỉ phép" tự dùng khi bé bỏ đúng một ngày.
// Thẻ nạp lại về 1 khi sang tuần mới (tuần bắt đầu thứ Hai, so với ngày học gần nhất) nên không cần thêm cột.
// Ngày là "ngày lịch" (Date lúc 00:00 UTC, xem dates.ts).
import { diffDays, weekStart } from "./dates.ts";

export type StreakState = {
  streakDays: number;
  streakFreezes: number;
  lastStudyDate: Date | null;
};

/** Số thẻ nghỉ phép tối đa (và số thẻ được nạp mỗi tuần). */
export const MAX_FREEZES = 1;

/** Số thẻ còn dùng được vào ngày `today`: sang tuần mới so với lần học gần nhất thì được nạp lại. */
export function freezesAvailable(state: StreakState, today: Date): number {
  if (!state.lastStudyDate) return MAX_FREEZES;
  const sameWeek = weekStart(state.lastStudyDate).getTime() === weekStart(today).getTime();
  return sameWeek ? Math.min(state.streakFreezes, MAX_FREEZES) : MAX_FREEZES;
}

/** Chuỗi ngày để hiển thị hôm nay: đứt thì về 0 (nhẹ nhàng, không mất sao/xu). Hôm nay chưa học thì chuỗi hôm qua vẫn còn. */
export function streakForDisplay(state: StreakState, today: Date): number {
  if (!state.lastStudyDate) return 0;
  const gap = diffDays(today, state.lastStudyDate);
  if (gap <= 1) return state.streakDays;
  if (gap === 2 && freezesAvailable(state, today) > 0) return state.streakDays;
  return 0;
}

/**
 * Trạng thái chuỗi sau khi bé học xong một bài hoặc một lượt ôn vào ngày `today`.
 * - Học tiếp trong cùng ngày: không đổi.
 * - Hôm qua có học: chuỗi + 1.
 * - Bỏ đúng 1 ngày: dùng thẻ nghỉ phép (nếu còn) để giữ chuỗi + 1; hết thẻ thì chuỗi về 1.
 * - Bỏ từ 2 ngày: chuỗi về 1.
 */
export function recordStudyDay(state: StreakState, today: Date): StreakState {
  if (!state.lastStudyDate) return { streakDays: 1, streakFreezes: MAX_FREEZES, lastStudyDate: today };

  const gap = diffDays(today, state.lastStudyDate);
  if (gap <= 0) return { ...state };

  const freezes = freezesAvailable(state, today);
  if (gap === 1) return { streakDays: state.streakDays + 1, streakFreezes: freezes, lastStudyDate: today };
  if (gap === 2 && freezes > 0) return { streakDays: state.streakDays + 1, streakFreezes: freezes - 1, lastStudyDate: today };
  return { streakDays: 1, streakFreezes: freezes, lastStudyDate: today };
}
