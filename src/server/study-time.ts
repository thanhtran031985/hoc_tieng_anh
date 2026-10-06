import { dayStartInstant, today } from "@/lib/rules/dates";
import { learnerSettingsSchema } from "@/lib/schemas";
import { grantBonus, studyAllowance } from "@/lib/rules/study-time";
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
};

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
