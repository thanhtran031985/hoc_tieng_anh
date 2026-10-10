import { computeLessonStates, findNextLesson, summarizeUnits, type MapLesson } from "@/lib/rules/unlock";
import { dayStartInstant, today } from "@/lib/rules/dates";
import { studyAllowance } from "@/lib/rules/study-time";
import { db } from "./db";
import { getCollectionCounts } from "./collection";
import { requireLearner } from "./learners";
import { dueCardWhere } from "./review";

// Dữ liệu cho trang chủ của bé. Đi qua `requireLearner` nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập.

export type PictureRef = { word: string; image: string | null };

export type HomeNextLesson = {
  lessonId: number;
  kind: "lesson" | "unit_test";
  unitTitle: string;
  unitTitleVi: string;
  /** Bài thứ mấy trong chủ đề (chỉ có với bài thường). */
  ordinal: number | null;
  unitDone: number;
  unitTotal: number;
  /** Từ đầu tiên của bài, để lấy hình minh họa. */
  picture: PictureRef | null;
};

export type HomeData = {
  levelNumber: number;
  levelName: string;
  /** Cấp có ít nhất một chủ đề đã xuất bản. */
  levelHasContent: boolean;
  /** Đã xong mọi bài của cấp (chờ bài thi lên cấp). */
  levelComplete: boolean;
  /** Bé đã từng xong ít nhất một bài (ở bất kỳ cấp nào). */
  hasStarted: boolean;
  /** `dueCount`: từ có hình đến hạn ôn hôm nay; `doneToday`: hôm nay bé đã ôn ít nhất một lượt. */
  review: { dueCount: number; doneToday: boolean; pictures: PictureRef[] };
  next: HomeNextLesson | null;
  /** Số chặng đã xong / tổng số chặng thường của cấp. */
  levelProgress: { done: number; total: number };
  /** Số từ bé đã học (có thẻ ôn tập). */
  learnedWords: number;
  /** Phút đã học hôm nay so với giới hạn bố mẹ đặt (không có thì mục tiêu ngày); `remainingMinutes` null là không giới hạn. */
  studyToday: { minutes: number; goalMinutes: number; remainingMinutes: number | null };
  /** Số sticker và huy hiệu đã có (nút Bộ sưu tập). */
  collection: { stickers: number; badges: number };
  /** Nhiệm vụ hôm nay: số đã xong / tổng. */
  missions: { done: number; total: number };
};

const SAMPLE_PICTURES = 3;

export async function getHomeData(userId: number, learnerId: number): Promise<HomeData> {
  const learner = await requireLearner(userId, learnerId);
  const levelNumber = learner.currentLevel?.number ?? 1;
  const now = new Date();
  const day = today(now);
  const dayStart = dayStartInstant(day);

  const level = await db.level.findUnique({ where: { number: levelNumber }, select: { id: true, number: true, name: true } });
  if (!level) throw new Error("Không tìm thấy cấp học");

  const [units, progress, dueCount, duePictures, learnedWords, startedCount, minutes, lessonsToday, reviewsToday] = await Promise.all([
    db.unit.findMany({
      where: { levelId: level.id, status: "published" },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        title: true,
        titleVi: true,
        lessons: { where: { status: "published" }, orderBy: { sortOrder: "asc" }, select: { id: true, kind: true } },
      },
    }),
    db.lessonProgress.findMany({
      where: { learnerId, lesson: { status: "published", unit: { levelId: level.id, status: "published" } } },
      select: { lessonId: true, bestStars: true },
    }),
    db.reviewCard.count({ where: dueCardWhere(learnerId, day) }),
    // Hình mẫu trên thẻ Ôn tập: chỉ lấy từ đã có hình để khỏi hiện khung trống.
    db.reviewCard.findMany({
      where: { learnerId, dueOn: { lte: day }, word: { image: { not: null } } },
      orderBy: { dueOn: "asc" },
      take: SAMPLE_PICTURES,
      select: { word: { select: { word: true, image: true } } },
    }),
    db.reviewCard.count({ where: { learnerId, wordId: { not: null } } }),
    db.lessonProgress.count({ where: { learnerId, bestStars: { gte: 1 } } }),
    db.studySession.aggregate({ where: { learnerId, startedAt: { gte: dayStart } }, _sum: { minutes: true } }),
    db.lessonAttempt.count({ where: { learnerId, finishedAt: { gte: dayStart } } }),
    db.answerLog.count({ where: { learnerId, source: "review", createdAt: { gte: dayStart } } }),
  ]);

  // Chuỗi bài của cấp: theo thứ tự chủ đề rồi thứ tự bài. Các quy tắc mở khóa nằm ở src/lib/rules/unlock.ts.
  const mapLessons: MapLesson[] = units.flatMap((unit) => unit.lessons.map((lesson) => ({ id: lesson.id, unitId: unit.id, kind: lesson.kind })));
  const bestStars = new Map(progress.map((p) => [p.lessonId, p.bestStars]));
  const nodes = computeLessonStates(mapLessons, bestStars);
  const summaries = summarizeUnits(nodes);
  const nextNode = findNextLesson(nodes);

  let next: HomeNextLesson | null = null;
  if (nextNode) {
    const unit = units.find((u) => u.id === nextNode.unitId)!;
    const summary = summaries.find((s) => s.unitId === nextNode.unitId)!;
    const firstStep = await db.lessonStep.findFirst({
      where: { lessonId: nextNode.id, wordId: { not: null } },
      orderBy: { sortOrder: "asc" },
      select: { word: { select: { word: true, image: true } } },
    });
    const normalIds = unit.lessons.filter((l) => l.kind === "lesson").map((l) => l.id);
    next = {
      lessonId: nextNode.id,
      kind: nextNode.kind,
      unitTitle: unit.title,
      unitTitleVi: unit.titleVi,
      ordinal: nextNode.kind === "lesson" ? normalIds.indexOf(nextNode.id) + 1 : null,
      unitDone: summary.doneCount,
      unitTotal: summary.lessonCount,
      picture: firstStep?.word ?? null,
    };
  }

  const usedMinutes = minutes._sum.minutes ?? 0;
  const allowance = studyAllowance(learner.settings.dailyLimitMinutes, learner.settings.bonus, day.toISOString().slice(0, 10), usedMinutes);
  const totalLessons = summaries.reduce((sum, s) => sum + s.lessonCount, 0);
  const doneLessons = summaries.reduce((sum, s) => sum + s.doneCount, 0);

  const reviewRelevant = dueCount > 0 || reviewsToday > 0;
  const lessonRelevant = next !== null || lessonsToday > 0;
  const missions = {
    total: Number(reviewRelevant) + Number(lessonRelevant),
    done: Number(reviewRelevant && dueCount === 0 && reviewsToday > 0) + Number(lessonRelevant && lessonsToday > 0),
  };

  return {
    levelNumber: level.number,
    levelName: level.name,
    levelHasContent: units.length > 0,
    levelComplete: units.length > 0 && next === null,
    hasStarted: startedCount > 0,
    review: { dueCount, doneToday: reviewsToday > 0, pictures: duePictures.flatMap((c) => (c.word ? [c.word] : [])) },
    next,
    levelProgress: { done: doneLessons, total: totalLessons },
    learnedWords,
    collection: await getCollectionCounts(learnerId),
    studyToday: { minutes: usedMinutes, goalMinutes: allowance.total ?? learner.settings.dailyGoalMinutes, remainingMinutes: allowance.remaining },
    missions,
  };
}
