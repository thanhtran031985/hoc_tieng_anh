// Số liệu cho trang Tổng quan của bố mẹ (hàm thuần, không đụng database).
// Ngày theo lịch ở múi giờ ứng dụng (xem dates.ts); tuần bắt đầu từ thứ Hai.
import { addDays, dateOnly, diffDays, weekStart } from "./dates.ts";

export type SessionLike = { startedAt: Date; minutes: number };

/** `n` ngày liên tiếp kết thúc ở `today` (cũ nhất trước). */
export function lastDays(today: Date, n: number): Date[] {
  return Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)));
}

/** Phút học theo từng ngày của `days` (ngày không có buổi học là 0). */
export function minutesPerDay(sessions: readonly SessionLike[], days: readonly Date[]): number[] {
  const index = new Map(days.map((d, i) => [d.getTime(), i]));
  const totals = days.map(() => 0);
  for (const s of sessions) {
    const i = index.get(dateOnly(s.startedAt).getTime());
    if (i !== undefined) totals[i] += s.minutes;
  }
  return totals;
}

export type WeekCompare = {
  /** Phút từ thứ Hai tuần này đến hôm nay. */
  thisWeek: number;
  /** Phút cùng khoảng của tuần trước (từ thứ Hai đến cùng thứ). */
  lastWeek: number;
  /** Phần trăm thay đổi, làm tròn; null khi tuần trước chưa có phút nào. */
  deltaPercent: number | null;
};

/** So phút học tuần này với tuần trước ở cùng khoảng (thứ Hai đến cùng thứ), để đầu tuần không bị "giảm" oan. */
export function compareWeeks(sessions: readonly SessionLike[], today: Date): WeekCompare {
  const monday = weekStart(today);
  const elapsed = diffDays(today, monday) + 1;
  const prevMonday = addDays(monday, -7);
  const sum = (from: Date, days: number) => minutesPerDay(sessions, lastDays(addDays(from, days - 1), days)).reduce((a, b) => a + b, 0);
  const thisWeek = sum(monday, elapsed);
  const lastWeek = sum(prevMonday, elapsed);
  return { thisWeek, lastWeek, deltaPercent: lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null };
}

/** "+12%", "−8%", "0%" (dấu trừ Unicode); chuỗi rỗng khi không so được. */
export function formatDelta(percent: number | null): string {
  if (percent === null) return "";
  if (percent > 0) return `+${percent}%`;
  if (percent < 0) return `−${Math.abs(percent)}%`;
  return "0%";
}

export type CefrEstimate = {
  /** Nhãn khung CEFR ước lượng theo cấp (PRD A1). */
  label: string;
  /** Mốc A1/A2/B1/B2 sáng tới (0–3). */
  band: 0 | 1 | 2 | 3;
  note: string;
};

export const CEFR_BANDS = ["A1", "A2", "B1", "B2"] as const;

const CEFR_BY_LEVEL: Record<number, CefrEstimate> = {
  1: { label: "Pre-A1", band: 0, note: "Pre-A1 · mới làm quen" },
  2: { label: "Pre-A1", band: 0, note: "Pre-A1 · đang làm quen" },
  3: { label: "A1", band: 0, note: "Pre-A1 tới A1" },
  4: { label: "A1", band: 0, note: "A1 · đang vững" },
  5: { label: "A2", band: 1, note: "A1 tới A2" },
  6: { label: "A2", band: 1, note: "A2 · nền tảng" },
  7: { label: "A2", band: 1, note: "A2 · đang vững" },
  8: { label: "A2+", band: 1, note: "A2 · đang tiến tới B1" },
  9: { label: "B1", band: 2, note: "A2 tới B1" },
  10: { label: "B1", band: 2, note: "B1 · học vượt" },
};

/** Trình độ CEFR ước lượng theo cấp hiện tại (bảng ở PRD A1; chưa đo bằng bài thi). */
export function cefrForLevel(level: number): CefrEstimate {
  return CEFR_BY_LEVEL[Math.min(10, Math.max(1, Math.round(level)))];
}

/** Phần trăm hoàn thành (0–100, làm tròn); không có bài nào thì 0. */
export function percentDone(done: number, total: number): number {
  return total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
}

const WEEKDAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

/** Nhãn ngày ngắn "T6 2/10" cho tooltip và trục biểu đồ. */
export function dayLabel(day: Date): string {
  return `${WEEKDAY[day.getUTCDay()]} ${day.getUTCDate()}/${day.getUTCMonth() + 1}`;
}

/** Mốc thời gian của một hoạt động: "20:15" nếu hôm nay, "Hôm qua", còn lại "T4 30/9". `timeOfDay` đã ở múi giờ ứng dụng. */
export function activityWhen(at: Date, now: Date, timeOfDay: string): string {
  const days = diffDays(dateOnly(now), dateOnly(at));
  if (days <= 0) return timeOfDay;
  if (days === 1) return "Hôm qua";
  return dayLabel(dateOnly(at));
}
