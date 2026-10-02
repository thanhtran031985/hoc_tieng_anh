import { levelStatus, type LevelStatus } from "@/lib/rules/unlock";
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
