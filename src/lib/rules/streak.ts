// Chuỗi ngày học (PRD Phần F), hàm thuần không đụng database.
// Học ít nhất 1 bài hoặc 1 lượt ôn trong ngày thì được tính. Mỗi tuần có 1 "thẻ nghỉ phép" tự dùng khi bé bỏ đúng một ngày.
// Thẻ nạp lại về 1 khi sang tuần mới (tuần bắt đầu thứ Hai, so với ngày học gần nhất) nên không cần thêm cột.
// Ngày là "ngày lịch" (Date lúc 00:00 UTC, xem dates.ts).
import { addDays, diffDays, weekStart } from "./dates.ts";

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

// ---- Thẻ chuỗi ngày trên trang chủ: 7 ngày T2–CN ----

export type WeekDayStatus = "done" | "today" | "freeze" | "missed" | "future";
export type WeekCell = { label: string; status: WeekDayStatus; isToday: boolean };

export const WEEK_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;
/** Tên đầy đủ để đọc trong lời giải thích (“thứ Tư”). */
export const WEEKDAY_NAMES = ["thứ Hai", "thứ Ba", "thứ Tư", "thứ Năm", "thứ Sáu", "thứ Bảy", "Chủ nhật"] as const;

/**
 * Ngày thẻ nghỉ phép đã dùng trong tuần của `today` (hoặc null). Database không lưu riêng ngày dùng thẻ nên suy ra từ trạng thái chuỗi:
 * thẻ đã hết trong tuần này, và có một ngày bị bỏ nằm giữa hai ngày học liền nhau mà chuỗi hiện tại còn phủ tới ngày trước đó
 * (`recordStudyDay` chỉ dùng thẻ khi bỏ đúng một ngày và vẫn giữ chuỗi).
 * `studied` là các ngày có học (tính cả ngày cuối tuần trước để xét thứ Hai).
 */
export function freezeDayOfWeek(state: StreakState, studied: readonly Date[], today: Date): Date | null {
  const last = state.lastStudyDate;
  if (!last || freezesAvailable(state, today) > 0) return null;
  const has = new Set(studied.map((day) => day.getTime()));
  const monday = weekStart(today);
  for (let day = monday; day.getTime() < last.getTime(); day = addDays(day, 1)) {
    if (has.has(day.getTime())) continue;
    const before = addDays(day, -1);
    if (!has.has(before.getTime()) || state.streakDays < diffDays(last, before)) continue;
    let after = true;
    for (let next = addDays(day, 1); next.getTime() <= last.getTime(); next = addDays(next, 1)) if (!has.has(next.getTime())) after = false;
    if (after) return day;
  }
  return null;
}

/** 7 ô của tuần chứa `today`: đã học, hôm nay (chưa học), dùng thẻ nghỉ phép, bỏ lỡ, chưa tới. */
export function weekCells(state: StreakState, studied: readonly Date[], today: Date): WeekCell[] {
  const has = new Set(studied.map((day) => day.getTime()));
  const monday = weekStart(today);
  const freeze = freezeDayOfWeek(state, studied, today);
  return WEEK_LABELS.map((label, i) => {
    const day = addDays(monday, i);
    const isToday = day.getTime() === today.getTime();
    const status: WeekDayStatus = has.has(day.getTime())
      ? "done"
      : isToday
        ? "today"
        : day.getTime() > today.getTime()
          ? "future"
          : freeze && freeze.getTime() === day.getTime()
            ? "freeze"
            : "missed";
    return { label, status, isToday };
  });
}
