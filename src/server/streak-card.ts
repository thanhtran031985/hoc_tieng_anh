import { addDays, dateOnly, dayStartInstant, today, weekStart } from "@/lib/rules/dates";
import { WEEKDAY_NAMES, freezeDayOfWeek, freezesAvailable, streakForDisplay, weekCells, type WeekCell } from "@/lib/rules/streak";
import { db } from "./db";
import { requireLearner } from "./learners";

// Thẻ nổi “Chuỗi ngày” ở trang chủ: 7 ngày T2–CN và thẻ nghỉ phép. Đi qua `requireLearner` nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập.

export type StreakCardData = {
  /** Chuỗi ngày hiển thị hôm nay (đứt thì 0). */
  streak: number;
  cells: WeekCell[];
  /** Hôm nay bé đã học (bài hoặc lượt ôn) chưa. */
  studiedToday: boolean;
  /** Thẻ nghỉ phép còn dùng được tuần này; `usedOn` là tên thứ đã dùng thẻ (“thứ Tư”) nếu có. */
  freeze: { available: boolean; usedOn: string | null };
};

export async function getStreakCard(userId: number, learnerId: number): Promise<StreakCardData> {
  const learner = await requireLearner(userId, learnerId);
  const day = today();
  const from = dayStartInstant(addDays(weekStart(day), -1));
  const [attempts, reviews] = await Promise.all([
    db.lessonAttempt.findMany({ where: { learnerId, finishedAt: { gte: from } }, select: { finishedAt: true } }),
    db.answerLog.findMany({ where: { learnerId, source: "review", createdAt: { gte: from } }, select: { createdAt: true } }),
  ]);
  const studiedMs = new Set<number>();
  for (const a of attempts) if (a.finishedAt) studiedMs.add(dateOnly(a.finishedAt).getTime());
  for (const r of reviews) studiedMs.add(dateOnly(r.createdAt).getTime());
  // Ngày học gần nhất trong hồ sơ luôn được tính (khớp với chuỗi đã lưu).
  if (learner.lastStudyDate && learner.lastStudyDate.getTime() >= addDays(weekStart(day), -1).getTime()) studiedMs.add(learner.lastStudyDate.getTime());
  const studied = [...studiedMs].map((ms) => new Date(ms));

  const state = { streakDays: learner.streakDays, streakFreezes: learner.streakFreezes, lastStudyDate: learner.lastStudyDate };
  const cells = weekCells(state, studied, day);
  const used = freezeDayOfWeek(state, studied, day);
  return {
    streak: streakForDisplay(state, day),
    cells,
    studiedToday: studiedMs.has(day.getTime()),
    freeze: { available: freezesAvailable(state, day) > 0, usedOn: used ? WEEKDAY_NAMES[(used.getUTCDay() + 6) % 7] : null },
  };
}
