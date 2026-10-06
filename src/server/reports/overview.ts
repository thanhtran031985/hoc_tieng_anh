import { APP_TIME_ZONE, addDays, dayStartInstant, today, weekStart } from "@/lib/rules/dates";
import { activityWhen, cefrForLevel, compareWeeks, dayLabel, formatDelta, lastDays, minutesPerDay, percentDone, type CefrEstimate } from "@/lib/rules/report";
import { streakForDisplay } from "@/lib/rules/streak";
import { db } from "../db";
import { requireLearner } from "../learners";

// Tổng quan học tập của một bé cho bố mẹ. Mọi truy cập đi qua `requireLearner` nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập.

export type ChartPoint = { k: string; v: number; tip: string };

export type RangeSummary = { points: ChartPoint[]; averageMinutes: number; offDays: number };

export type Activity = {
  when: string;
  icon: "star" | "cards" | "target";
  /** Câu mô tả, vd "Hoàn thành bài Fruits · Bài 3". */
  title: string;
  sub: string;
};

export type OverviewData = {
  kid: { id: number; name: string; grade: number | null; levelNumber: number; levelName: string };
  /** Bé đã có buổi học nào (trong 30 ngày) hoặc bài đã xong chưa; chưa thì hiện trạng thái trống. */
  hasActivity: boolean;
  week: { minutes: number; delta: string; compared: boolean };
  streak: number;
  words: { mastered: number; learned: number; newThisWeek: number };
  level: { number: number; name: string; percent: number };
  cefr: CefrEstimate;
  /** Giới hạn phút mỗi ngày bố mẹ đặt (null là không giới hạn). */
  limitMinutes: number | null;
  d7: RangeSummary;
  d30: RangeSummary;
  activities: Activity[];
};

const MAX_ACTIVITIES = 8;
const timeFormat = new Intl.DateTimeFormat("vi-VN", { timeZone: APP_TIME_ZONE, hour: "2-digit", minute: "2-digit", hour12: false });

function summarize(minutes: number[], days: Date[], shortLabel: (d: Date) => string): RangeSummary {
  const total = minutes.reduce((a, b) => a + b, 0);
  return {
    points: days.map((d, i) => ({ k: shortLabel(d), v: minutes[i], tip: `${dayLabel(d)}: ${minutes[i]} phút` })),
    averageMinutes: Math.round(total / Math.max(1, minutes.length)),
    offDays: minutes.filter((m) => m === 0).length,
  };
}

export async function getOverview(userId: number, learnerId: number): Promise<OverviewData> {
  const learner = await requireLearner(userId, learnerId);
  const now = new Date();
  const day = today(now);
  const monday = weekStart(day);
  const levelNumber = learner.currentLevel?.number ?? 1;

  const days30 = lastDays(day, 30);
  const days7 = lastDays(day, 7);
  const fromDay = days30[0].getTime() < addDays(monday, -7).getTime() ? days30[0] : addDays(monday, -7);

  const level = await db.level.findUnique({ where: { number: levelNumber }, select: { id: true, name: true } });
  const levelLessons = { status: "published" as const, unit: { levelId: level?.id ?? -1, status: "published" as const } };

  const [sessions, mastered, learned, newWords, lessonTotal, lessonDone, attempts, reviewMarks, placement] = await Promise.all([
    db.studySession.findMany({ where: { learnerId, startedAt: { gte: dayStartInstant(fromDay) } }, select: { startedAt: true, minutes: true } }),
    db.reviewCard.count({ where: { learnerId, wordId: { not: null }, box: { gte: 5 }, correctCount: { gt: 0 } } }),
    db.reviewCard.count({ where: { learnerId, wordId: { not: null } } }),
    db.answerLog.findMany({ where: { learnerId, source: "lesson", wordId: { not: null }, createdAt: { gte: dayStartInstant(monday) } }, distinct: ["wordId"], select: { wordId: true } }),
    db.lesson.count({ where: levelLessons }),
    db.lessonProgress.count({ where: { learnerId, bestStars: { gte: 1 }, lesson: levelLessons } }),
    db.lessonAttempt.findMany({
      where: { learnerId, finishedAt: { not: null } },
      orderBy: { finishedAt: "desc" },
      take: MAX_ACTIVITIES,
      select: { finishedAt: true, correct: true, wrong: true, stars: true, lesson: { select: { title: true, unit: { select: { title: true } } } } },
    }),
    db.studySession.findMany({ where: { learnerId, minutes: 0, endedAt: { not: null } }, orderBy: { endedAt: "desc" }, take: MAX_ACTIVITIES, select: { endedAt: true } }),
    db.answerLog.findFirst({ where: { learnerId, source: "exam" }, orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
  ]);

  const compare = compareWeeks(sessions, day);
  const m30 = minutesPerDay(sessions, days30);
  const m7 = minutesPerDay(sessions, days7);

  // Phiên ôn tập: số mục ôn và số mục đúng ngay lần đầu trong khoảng quanh lúc kết thúc phiên.
  const reviewActivities: (Activity & { at: Date })[] = [];
  for (const mark of reviewMarks) {
    const end = mark.endedAt!;
    const logs = await db.answerLog.findMany({
      where: { learnerId, source: "review", createdAt: { gte: new Date(end.getTime() - 60_000), lte: new Date(end.getTime() + 60_000) } },
      select: { isCorrect: true },
    });
    if (logs.length === 0) continue;
    reviewActivities.push({ at: end, when: "", icon: "cards", title: `Ôn ${logs.length} câu từ đến hạn`, sub: `${logs.filter((l) => l.isCorrect).length}/${logs.length} đúng ngay lần đầu` });
  }

  const merged: (Activity & { at: Date })[] = [
    ...attempts.map((a) => ({
      at: a.finishedAt!,
      when: "",
      icon: "star" as const,
      title: `Hoàn thành bài ${a.lesson.unit.title} · ${a.lesson.title}`,
      sub: `${a.stars} sao · ${a.correct}/${a.correct + a.wrong} đúng`,
    })),
    ...reviewActivities,
    ...(placement ? [{ at: placement.createdAt, when: "", icon: "target" as const, title: "Làm bài xếp lớp", sub: "Chọn cấp bắt đầu" }] : []),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, MAX_ACTIVITIES);
  const activities: Activity[] = merged.map(({ at, ...rest }) => ({ ...rest, when: activityWhen(at, now, timeFormat.format(at)) }));

  return {
    kid: { id: learner.id, name: learner.name, grade: learner.schoolGrade, levelNumber, levelName: level?.name ?? learner.currentLevel?.name ?? "" },
    hasActivity: m30.some((m) => m > 0) || attempts.length > 0,
    week: { minutes: compare.thisWeek, delta: formatDelta(compare.deltaPercent), compared: compare.deltaPercent !== null },
    streak: streakForDisplay(learner, day),
    words: { mastered, learned, newThisWeek: newWords.length },
    level: { number: levelNumber, name: level?.name ?? "", percent: percentDone(lessonDone, lessonTotal) },
    cefr: cefrForLevel(levelNumber),
    limitMinutes: learner.settings.dailyLimitMinutes,
    d7: summarize(m7, days7, (d) => dayLabel(d).split(" ")[0]),
    d30: summarize(m30, days30, (d) => `${d.getUTCDate()}/${d.getUTCMonth() + 1}`),
    activities,
  };
}
