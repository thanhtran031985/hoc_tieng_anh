import {
  computeLessonStates,
  levelStatus,
  summarizeUnits,
  type BossNodeState,
  type LessonNodeState,
  type LevelStatus,
  type MapLesson,
  type UnitState,
} from "@/lib/rules/unlock";
import { db } from "./db";
import { requireLearner } from "./learners";

// Dữ liệu cho tổng quan 10 cấp và bản đồ đảo. Mọi hàm đi qua `requireLearner` nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập.

export type LevelStop = {
  number: number;
  name: string;
  status: LevelStatus;
  /** Cấp có ít nhất một chủ đề đã xuất bản. */
  hasContent: boolean;
};

export type LevelsOverview = {
  currentLevel: number;
  levels: LevelStop[];
  /** Bé đã từng xong ít nhất một bài. */
  hasStarted: boolean;
};

/** 10 cấp với trạng thái so với cấp hiện tại của bé: đã qua, đang học, còn khóa. */
export async function getLevelsOverview(userId: number, learnerId: number): Promise<LevelsOverview> {
  const learner = await requireLearner(userId, learnerId);
  const currentLevel = learner.currentLevel?.number ?? 1;
  const [levels, startedCount] = await Promise.all([
    db.level.findMany({
      orderBy: { number: "asc" },
      select: { number: true, name: true, _count: { select: { units: { where: { status: "published" } } } } },
    }),
    db.lessonProgress.count({ where: { learnerId, bestStars: { gte: 1 } } }),
  ]);
  return {
    currentLevel,
    hasStarted: startedCount > 0,
    levels: levels.map((l) => ({ number: l.number, name: l.name, status: levelStatus(l.number, currentLevel), hasContent: l._count.units > 0 })),
  };
}

// ---- Bản đồ đảo ----

export type MapWord = { word: string; image: string | null };

export type IslandLesson = {
  id: number;
  /** Chặng thứ mấy trong chủ đề (bắt đầu từ 1). */
  ordinal: number;
  state: LessonNodeState;
  stars: number;
  /** Các từ của bài (từ các bước thẻ từ), cho thẻ nổi của chặng. */
  words: MapWord[];
};

export type IslandBoss = { id: number; title: string; state: BossNodeState; stars: number };

export type IslandUnit = {
  id: number;
  title: string;
  titleVi: string;
  state: UnitState;
  doneCount: number;
  lessonCount: number;
  stars: number;
  maxStars: number;
  lessons: IslandLesson[];
  boss: IslandBoss | null;
};

export type IslandMap = {
  level: { number: number; name: string };
  units: IslandUnit[];
  /** Số thứ tự (từ 0) của chủ đề có chặng đang học; null nếu xong hết cấp hoặc chưa có bài. */
  currentUnitIndex: number | null;
};

/** Cấp không tồn tại thì null; cấp còn khóa với bé này thì ném `LevelLockedError` (không lộ nội dung). */
export class LevelLockedError extends Error {
  constructor() {
    super("Cấp này còn khóa");
    this.name = "LevelLockedError";
  }
}

export async function getIslandMap(userId: number, learnerId: number, levelNumber: number): Promise<IslandMap | null> {
  const learner = await requireLearner(userId, learnerId);
  const level = await db.level.findUnique({ where: { number: levelNumber }, select: { id: true, number: true, name: true } });
  if (!level) return null;
  if (levelStatus(level.number, learner.currentLevel?.number ?? 1) === "locked") throw new LevelLockedError();

  const [units, progress] = await Promise.all([
    db.unit.findMany({
      where: { levelId: level.id, status: "published" },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        title: true,
        titleVi: true,
        lessons: {
          where: { status: "published" },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            kind: true,
            title: true,
            steps: { where: { activityType: "word_card" }, orderBy: { sortOrder: "asc" }, select: { word: { select: { word: true, image: true } } } },
          },
        },
      },
    }),
    db.lessonProgress.findMany({
      where: { learnerId, lesson: { status: "published", unit: { levelId: level.id, status: "published" } } },
      select: { lessonId: true, bestStars: true },
    }),
  ]);

  const mapLessons: MapLesson[] = units.flatMap((u) => u.lessons.map((l) => ({ id: l.id, unitId: u.id, kind: l.kind })));
  const nodes = computeLessonStates(mapLessons, new Map(progress.map((p) => [p.lessonId, p.bestStars])));
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const summaries = new Map(summarizeUnits(nodes).map((s) => [s.unitId, s]));

  const islandUnits: IslandUnit[] = units.map((unit) => {
    const summary = summaries.get(unit.id);
    const lessons: IslandLesson[] = [];
    let boss: IslandBoss | null = null;
    for (const lesson of unit.lessons) {
      const node = nodeById.get(lesson.id);
      if (!node) continue;
      if (node.kind === "lesson") {
        lessons.push({
          id: lesson.id,
          ordinal: lessons.length + 1,
          state: node.state,
          stars: node.stars,
          words: lesson.steps.flatMap((s) => (s.word ? [s.word] : [])),
        });
      } else {
        boss = { id: lesson.id, title: lesson.title, state: node.state, stars: node.stars };
      }
    }
    return {
      id: unit.id,
      title: unit.title,
      titleVi: unit.titleVi,
      state: summary?.state ?? "locked",
      doneCount: summary?.doneCount ?? 0,
      lessonCount: summary?.lessonCount ?? 0,
      stars: summary?.stars ?? 0,
      maxStars: summary?.maxStars ?? 0,
      lessons,
      boss,
    };
  });

  const currentIndex = islandUnits.findIndex((u) => u.lessons.some((l) => l.state === "current"));
  return { level: { number: level.number, name: level.name }, units: islandUnits, currentUnitIndex: currentIndex >= 0 ? currentIndex : null };
}
