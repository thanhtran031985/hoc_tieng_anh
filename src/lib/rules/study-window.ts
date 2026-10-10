// Khung giờ được học trong tuần (task 24, Adult07 và Screen47), hàm thuần không đụng database.
// Bố mẹ chọn các ngày được học (thứ Hai = 1 … Chủ nhật = 7) và giờ bắt đầu, giờ kết thúc; ngoài khung đó bé không vào được bài
// cho tới khi bố mẹ mở tạm bằng PIN (30 phút). Giờ tính theo múi giờ Việt Nam ở server.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { APP_TIME_ZONE } from "./dates.ts";
import { clockMinutes } from "./parent-settings.ts";

export const ALL_DAYS: readonly number[] = [1, 2, 3, 4, 5, 6, 7];
export const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;
export const DAY_NAMES = ["thứ Hai", "thứ Ba", "thứ Tư", "thứ Năm", "thứ Sáu", "thứ Bảy", "Chủ nhật"] as const;

/** Bố mẹ mở tạm cho bé học ngoài khung giờ trong bao lâu. */
export const TEMP_OPEN_MINUTES = 30;

/** Khung cả ngày (khi bố mẹ chỉ chọn ngày mà không đặt giờ). */
export const FULL_DAY = { from: "00:00", to: "23:59" } as const;

export type StudyWindow = { from: string; to: string; days: readonly number[] };

/** Thứ (1–7) và số phút kể từ 0 giờ ở múi giờ Việt Nam. */
export type VnClock = { day: number; minutes: number };

const WEEKDAY: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

export function vnClock(now: Date = new Date(), timeZone: string = APP_TIME_ZONE): VnClock {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", hourCycle: "h23", hour: "2-digit", minute: "2-digit" }).formatToParts(now);
  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { day: WEEKDAY[pick("weekday")] ?? 1, minutes: Number(pick("hour")) * 60 + Number(pick("minute")) };
}

/** Khung cả ngày (không đặt giờ, chỉ chọn ngày). */
export const isFullDay = (w: Pick<StudyWindow, "from" | "to">): boolean => w.from === FULL_DAY.from && w.to === FULL_DAY.to;

/** Cả tuần được học (không giới hạn ngày). */
export const isEveryDay = (days: readonly number[]): boolean => ALL_DAYS.every((d) => days.includes(d));

export type WindowReason = "open" | "rest_day" | "before" | "after";

const inRange = (w: StudyWindow, minutes: number): "before" | "in" | "after" => {
  const from = clockMinutes(w.from) ?? 0;
  const to = clockMinutes(w.to) ?? 1439;
  if (minutes < from) return "before";
  if (minutes < to || (to >= 1439 && minutes <= 1439)) return "in";
  return "after";
};

/** Bây giờ có trong khung giờ không (không tính mở tạm): mở, ngày nghỉ, chưa tới giờ hoặc đã quá giờ. Không có khung thì luôn mở. */
export function windowReason(window: StudyWindow | null, clock: VnClock): WindowReason {
  if (!window) return "open";
  if (!window.days.includes(clock.day)) return "rest_day";
  const where = inRange(window, clock.minutes);
  return where === "in" ? "open" : where;
}

/** Lần mở kế tiếp tính từ `clock`: hôm nay (nếu còn chưa tới giờ) hoặc ngày được học gần nhất sau đó; null nếu không có ngày nào được học. */
export function nextOpening(window: StudyWindow | null, clock: VnClock): { dayOffset: number; day: number; from: string } | null {
  if (!window || window.days.length === 0) return null;
  for (let offset = 0; offset <= 7; offset++) {
    const day = ((clock.day - 1 + offset) % 7) + 1;
    if (!window.days.includes(day)) continue;
    if (offset === 0 && windowReason(window, clock) !== "before") continue;
    return { dayOffset: offset, day, from: window.from };
  }
  return null;
}

/** Bố mẹ đã mở tạm và còn hạn? `tempOpenUntil` là mốc hết hạn (ms kể từ 1970). */
export const tempOpenActive = (tempOpenUntil: number | null | undefined, nowMs: number): boolean => typeof tempOpenUntil === "number" && tempOpenUntil > nowMs;

/** Bé được vào học lúc này: trong khung giờ hoặc bố mẹ đang mở tạm. */
export function isStudyAllowed(window: StudyWindow | null, clock: VnClock, tempOpenUntil: number | null | undefined, nowMs: number): boolean {
  return windowReason(window, clock) === "open" || tempOpenActive(tempOpenUntil, nowMs);
}

/** Mốc hết hạn khi bố mẹ mở tạm lúc `nowMs`. */
export const tempOpenDeadline = (nowMs: number): number => nowMs + TEMP_OPEN_MINUTES * 60 * 1000;

/** Câu mô tả khung giờ cho bố mẹ: “17:00–20:30, T2, T3, T4” hoặc “cả tuần, mọi giờ”. */
export function describeWindow(window: StudyWindow | null): string {
  if (!window) return "mọi ngày, mọi giờ";
  const days = isEveryDay(window.days) ? "cả tuần" : window.days.map((d) => DAY_LABELS[d - 1]).join(", ");
  return `${isFullDay(window) ? "mọi giờ" : `${window.from}–${window.to}`}, ${days}`;
}

/** Ngày được học hợp lệ: ít nhất một ngày, mỗi ngày từ 1 đến 7, không trùng. */
export function validateStudyDays(days: readonly number[]): string {
  if (days.length === 0) return "Chọn ít nhất một ngày được học.";
  if (days.some((d) => !Number.isInteger(d) || d < 1 || d > 7) || new Set(days).size !== days.length) return "Ngày được học chưa hợp lệ.";
  return "";
}
