import { computeLessonStates, levelStatus, lockUnlessManual, manualLessonIds, type MapLesson, type MapNode } from "@/lib/rules/unlock";
import { db } from "./db";
import { getManualUnlocks } from "./manual-unlock";

/**
 * Trạng thái mọi chặng và trùm của một cấp đối với một bé (khóa, đang học, xong…).
 * Bài bố mẹ đã mở thủ công (cấp, chủ đề hoặc bài) vào chơi được ngay.
 * Không tự kiểm quyền: người gọi phải đã đi qua `requireLearner` cho `learnerId`.
 */
export async function getLevelNodes(learnerId: number, levelId: number): Promise<{ nodes: MapNode[]; bestStars: Map<number, number> }> {
  const [lessons, progress, manual, level, learner] = await Promise.all([
    db.lesson.findMany({
      where: { status: "published", unit: { levelId, status: "published" } },
      orderBy: [{ unit: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      select: { id: true, unitId: true, kind: true },
    }),
    db.lessonProgress.findMany({ where: { learnerId, lesson: { unit: { levelId } } }, select: { lessonId: true, bestStars: true } }),
    getManualUnlocks(learnerId),
    db.level.findUnique({ where: { id: levelId }, select: { number: true } }),
    db.learner.findUnique({ where: { id: learnerId }, select: { currentLevel: { select: { number: true } } } }),
  ]);
  const mapLessons: MapLesson[] = lessons.map((l) => ({ id: l.id, unitId: l.unitId, kind: l.kind }));
  const bestStars = new Map(progress.map((p) => [p.lessonId, p.bestStars]));
  const opened = manualLessonIds(mapLessons, levelId, manual);
  const nodes = computeLessonStates(mapLessons, bestStars, opened);
  // Cấp còn khóa theo quy tắc thường mà chỉ được mở một phần: chỉ các bài đã mở thủ công chơi được.
  const gated = level !== null && levelStatus(level.number, learner?.currentLevel?.number ?? 1) === "locked" && !manual.levels.has(levelId);
  return { nodes: gated ? lockUnlessManual(nodes, opened) : nodes, bestStars };
}
