import { dayStartInstant, today } from "@/lib/rules/dates";
import { learnerSettingsSchema } from "@/lib/schemas";
import { grantBonus, studyAllowance } from "@/lib/rules/study-time";
import { DAY_LABELS, DAY_NAMES, FULL_DAY, describeWindow, isFullDay, isStudyAllowed, nextOpening, tempOpenDeadline, vnClock, windowReason, type StudyWindow, type WindowReason } from "@/lib/rules/study-window";
import { db } from "./db";
import { requireLearner, type Learner } from "./learners";
import { checkParentSecret } from "./parent-secret";

// Giờ học trong ngày của một hồ sơ: số phút đã học (cộng từ `study_sessions`), giới hạn bố mẹ đặt và phút thêm.
// Mọi hàm nhận hồ sơ qua `requireLearner` (hoặc hồ sơ đã kiểm quyền) nên chỉ đọc/ghi được hồ sơ thuộc tài khoản đang đăng nhập.

/** Nhịp đo giờ gần nhau hơn mức này thì bỏ qua (chống gửi dồn để tăng phút). */
export const MIN_TICK_GAP_MS = 50 * 1000;

export const dayKey = (date: Date = today()) => date.toISOString().slice(0, 10);

export type StudyStatus = {
  learnerId: number;
  /** Giới hạn bố mẹ đặt (null là không giới hạn) và số phút đã thêm hôm nay. */
  limitMinutes: number | null;
  bonusMinutes: number;
  usedMinutes: number;
  /** Số phút còn lại; null là không giới hạn. */
  remainingMinutes: number | null;
  exhausted: boolean;
  /** Đang ngoài khung giờ bố mẹ cho phép và bố mẹ chưa mở tạm: bé phải sang màn Chưa đến giờ học. */
  outsideHours: boolean;
};

/** Hồ sơ đang ngoài khung giờ được học (tính ở múi giờ Việt Nam) và chưa được bố mẹ mở tạm bằng PIN. */
export function isOutsideHours(learner: Learner, now: Date = new Date()): boolean {
  const { studyWindow, tempOpenUntil } = learner.settings;
  return !isStudyAllowed(studyWindow, vnClock(now), tempOpenUntil, now.getTime());
}

export async function usedMinutesToday(learnerId: number, now: Date = new Date()): Promise<number> {
  const sum = await db.studySession.aggregate({ where: { learnerId, startedAt: { gte: dayStartInstant(today(now)) } }, _sum: { minutes: true } });
  return sum._sum.minutes ?? 0;
}

/** Trạng thái giờ học hôm nay của một hồ sơ đã được kiểm quyền. */
export async function getStudyStatusFor(learner: Learner): Promise<StudyStatus> {
  const key = dayKey();
  const used = await usedMinutesToday(learner.id);
  const { dailyLimitMinutes, bonus } = learner.settings;
  const allowance = studyAllowance(dailyLimitMinutes, bonus, key, used);
  return {
    learnerId: learner.id,
    limitMinutes: dailyLimitMinutes,
    bonusMinutes: allowance.total === null ? 0 : allowance.total - dailyLimitMinutes!,
    usedMinutes: used,
    remainingMinutes: allowance.remaining,
    exhausted: allowance.exhausted,
    outsideHours: isOutsideHours(learner),
  };
}

export async function getStudyStatus(userId: number, learnerId: number): Promise<StudyStatus> {
  return getStudyStatusFor(await requireLearner(userId, learnerId));
}

/**
 * Ghi một phút học (nhịp từ trình duyệt khi bé đã học đủ 60 giây). Nhịp đến sớm hơn 50 giây sau nhịp trước thì bỏ qua,
 * nên mở nhiều tab hoặc gửi dồn cũng không tăng phút quá nhanh.
 */
export async function recordStudyMinute(userId: number, learnerId: number): Promise<StudyStatus> {
  const learner = await requireLearner(userId, learnerId);
  const now = new Date();
  const last = await db.studySession.findFirst({ where: { learnerId, minutes: { gt: 0 }, endedAt: { not: null } }, orderBy: { endedAt: "desc" }, select: { endedAt: true } });
  if (!last?.endedAt || now.getTime() - last.endedAt.getTime() >= MIN_TICK_GAP_MS) {
    await db.studySession.create({ data: { learnerId, startedAt: new Date(now.getTime() - 60 * 1000), endedAt: now, minutes: 1 } });
  }
  return getStudyStatusFor(learner);
}

export type TimeUpSummary = {
  /** Phút đã học hôm nay. */
  minutes: number;
  /** Sao nhận được từ các bài học xong hôm nay. */
  stars: number;
  /** Số từ khác nhau bé đã học (có trong nhật ký bài học) hôm nay. */
  newWords: number;
};

/** Tóm tắt buổi học hôm nay cho màn Hết giờ học. */
export async function getTimeUpSummary(userId: number, learnerId: number): Promise<TimeUpSummary> {
  await requireLearner(userId, learnerId);
  const dayStart = dayStartInstant(today());
  const [minutes, stars, words] = await Promise.all([
    usedMinutesToday(learnerId),
    db.lessonAttempt.aggregate({ where: { learnerId, finishedAt: { gte: dayStart } }, _sum: { stars: true } }),
    db.answerLog.findMany({ where: { learnerId, source: "lesson", createdAt: { gte: dayStart }, wordId: { not: null } }, distinct: ["wordId"], select: { wordId: true } }),
  ]);
  return { minutes, stars: stars._sum.stars ?? 0, newWords: words.length };
}

export type AddTimeResult = { ok: true } | { ok: false; message: string };

/**
 * Bố mẹ thêm 10 phút học cho hôm nay sau khi nhập đúng PIN hoặc mật khẩu. Luôn còn ít nhất 10 phút
 * (kể cả khi bé đã học quá giới hạn vì làm nốt câu đang dở).
 */
export async function addBonusMinutes(userId: number, learnerId: number, secret: unknown): Promise<AddTimeResult> {
  const learner = await requireLearner(userId, learnerId);
  const checked = await checkParentSecret(userId, secret);
  if (!checked.ok) return checked;
  const used = await usedMinutesToday(learnerId);
  const bonus = grantBonus(learner.settings.dailyLimitMinutes, learner.settings.bonus, dayKey(), used);
  const settings = learnerSettingsSchema.parse({ ...learner.settings, bonus });
  await db.learner.update({ where: { id: learnerId }, data: { settings } });
  return { ok: true };
}

// ---- Chưa đến giờ học (Screen47) ----

export type OutsideHoursWeekDay = { label: string; name: string; allowed: boolean; hours: string | null; today: boolean };

export type OutsideHoursData = {
  name: string;
  /** Lý do khóa: ngày nghỉ, chưa tới giờ hoặc hôm nay đã hết giờ. */
  reason: Exclude<WindowReason, "open">;
  from: string;
  to: string;
  /** Giờ học kế tiếp: “hôm nay”, “ngày mai” hoặc tên thứ, kèm giờ bắt đầu. */
  next: { when: string; day: string; from: string } | null;
  /** Số phút còn lại tới giờ học hôm nay (chỉ khi chưa tới giờ); null nếu không áp dụng. */
  minutesUntil: number | null;
  week: OutsideHoursWeekDay[];
  summary: string;
};

/**
 * Dữ liệu màn Chưa đến giờ học cho hồ sơ đã kiểm quyền. Đang trong khung giờ (hoặc đang được bố mẹ mở tạm) thì trả null để màn đưa bé về trang chủ.
 */
export function getOutsideHours(learner: Learner, now: Date = new Date()): OutsideHoursData | null {
  const window: StudyWindow | null = learner.settings.studyWindow;
  const clock = vnClock(now);
  if (isStudyAllowed(window, clock, learner.settings.tempOpenUntil, now.getTime()) || !window) return null;
  const reason = windowReason(window, clock) as Exclude<WindowReason, "open">;
  const next = nextOpening(window, clock);
  const hours = isFullDay(window) ? "Cả ngày" : `${window.from}–${window.to}`;
  const from = window.from === FULL_DAY.from ? "00:00" : window.from;
  const when = (offset: number, day: number) => (offset === 0 ? "hôm nay" : offset === 1 ? "ngày mai" : DAY_NAMES[day - 1]);
  return {
    name: learner.name,
    reason,
    from,
    to: window.to,
    next: next ? { when: when(next.dayOffset, next.day), day: DAY_NAMES[next.day - 1], from: next.from } : null,
    minutesUntil: reason === "before" ? Math.max(1, (Number(window.from.slice(0, 2)) * 60 + Number(window.from.slice(3))) - clock.minutes) : null,
    week: DAY_LABELS.map((label, i) => ({ label, name: DAY_NAMES[i], allowed: window.days.includes(i + 1), hours: window.days.includes(i + 1) ? hours : null, today: clock.day === i + 1 })),
    summary: describeWindow(window),
  };
}

/**
 * Bố mẹ nhập đúng PIN thì cho bé học ngoài khung giờ trong 30 phút (lưu `tempOpenUntil` ở server, không tin giờ của trình duyệt).
 * Sai PIN dùng chung bộ đếm khóa 5 lần của cổng bố mẹ.
 */
export async function openOutsideHours(userId: number, learnerId: number, secret: unknown): Promise<AddTimeResult> {
  const learner = await requireLearner(userId, learnerId);
  const checked = await checkParentSecret(userId, secret, "pin");
  if (!checked.ok) return checked;
  const settings = learnerSettingsSchema.parse({ ...learner.settings, tempOpenUntil: tempOpenDeadline(Date.now()) });
  await db.learner.update({ where: { id: learnerId }, data: { settings } });
  return { ok: true };
}
