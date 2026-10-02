// Ngày theo lịch của người dùng (hàm thuần). Cột `@db.Date` trong database là ngày không giờ, nên mọi so sánh
// ngày dùng "ngày lịch" ở múi giờ ứng dụng, biểu diễn bằng Date lúc 00:00 UTC của ngày đó.

export const APP_TIME_ZONE = "Asia/Ho_Chi_Minh";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Ngày lịch của `date` ở múi giờ `timeZone`, trả về Date lúc 00:00 UTC của ngày đó (dùng thẳng được với cột DATE). */
export function dateOnly(date: Date, timeZone: string = APP_TIME_ZONE): Date {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const pick = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return new Date(Date.UTC(pick("year"), pick("month") - 1, pick("day")));
}

/** Ngày hôm nay (ngày lịch ở múi giờ ứng dụng). */
export function today(now: Date = new Date()): Date {
  return dateOnly(now);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/** Số ngày từ `from` đến `to` (dương nếu `to` sau `from`). Cả hai là ngày không giờ. */
export function diffDays(to: Date, from: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

/** Thứ Hai của tuần chứa `date` (tuần bắt đầu từ thứ Hai). */
export function weekStart(date: Date): Date {
  const sinceMonday = (date.getUTCDay() + 6) % 7;
  return addDays(date, -sinceMonday);
}

/** Chênh lệch (ms) giữa giờ tường ở múi giờ `timeZone` và UTC tại thời điểm `instant`. */
function zoneOffsetMs(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const pick = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const wallAsUtc = Date.UTC(pick("year"), pick("month") - 1, pick("day"), pick("hour"), pick("minute"), pick("second"));
  return wallAsUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

/** Thời điểm bắt đầu (00:00 giờ địa phương) của ngày lịch `day` ở múi giờ `timeZone`; dùng để lọc cột DATETIME theo "hôm nay". */
export function dayStartInstant(day: Date, timeZone: string = APP_TIME_ZONE): Date {
  const first = day.getTime() - zoneOffsetMs(day, timeZone);
  return new Date(day.getTime() - zoneOffsetMs(new Date(first), timeZone));
}
