// Giới hạn giờ học mỗi ngày (PRD D7), hàm thuần không đụng database.
// Hết giờ khi số phút đã học hôm nay chạm giới hạn bố mẹ đặt cộng với số phút bố mẹ thêm cho đúng ngày hôm nay.

/** Phút bố mẹ thêm, chỉ có hiệu lực đúng ngày `date` (yyyy-mm-dd, ngày lịch ở múi giờ ứng dụng). */
export type Bonus = { date: string; minutes: number } | null;

/** Mỗi lần bố mẹ thêm giờ cho bé. */
export const BONUS_STEP_MINUTES = 10;

export type Allowance = {
  /** Tổng phút được học hôm nay (giới hạn + phút thêm); null là không giới hạn. */
  total: number | null;
  used: number;
  /** Số phút còn lại (không âm); null là không giới hạn. */
  remaining: number | null;
  exhausted: boolean;
};

/** Phút thêm đang có hiệu lực hôm nay (0 nếu phút thêm của ngày khác). */
export function bonusFor(bonus: Bonus, dayKey: string): number {
  return bonus && bonus.date === dayKey ? bonus.minutes : 0;
}

export function studyAllowance(limitMinutes: number | null, bonus: Bonus, dayKey: string, usedMinutes: number): Allowance {
  const used = Math.max(0, Math.trunc(usedMinutes));
  if (limitMinutes === null) return { total: null, used, remaining: null, exhausted: false };
  const total = limitMinutes + bonusFor(bonus, dayKey);
  const remaining = Math.max(0, total - used);
  return { total, used, remaining, exhausted: remaining === 0 };
}

/**
 * Phút thêm mới sau một lần bố mẹ thêm giờ: cộng `step` phút, và luôn đảm bảo bé còn ít nhất `step` phút
 * (kể cả khi bé đã học quá giới hạn vì làm nốt câu đang dở).
 */
export function grantBonus(limitMinutes: number | null, bonus: Bonus, dayKey: string, usedMinutes: number, step: number = BONUS_STEP_MINUTES): { date: string; minutes: number } {
  const current = bonusFor(bonus, dayKey);
  const needed = limitMinutes === null ? 0 : Math.max(0, usedMinutes) + step - limitMinutes;
  return { date: dayKey, minutes: Math.max(current + step, needed) };
}
