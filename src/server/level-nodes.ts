import { computeLessonStates, type MapLesson, type MapNode } from "@/lib/rules/unlock";
import { db } from "./db";

/**
 * Trạng thái mọi chặng và trùm của một cấp đối với một bé (khóa, đang học, xong…).
 * Không tự kiểm quyền: người gọi phải đã đi qua `requireLearner` cho `learnerId`.
 */
export async function getLevelNodes(learnerId: number, levelId: number): Promise<{ nodes: MapNode[]; bestStars: Map<number, number> }> {
  const [lessons, progress] = await Promise.all([
    db.lesson.findMany({
      where: { status: "published", unit: { levelId, status: "published" } },
      orderBy: [{ unit: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      select: { id: true, unitId: true, kind: true },
    }),
    db.lessonProgress.findMany({ where: { learnerId, lesson: { unit: { levelId } } }, select: { lessonId: true, bestStars: true } }),
  ]);
  const mapLessons: MapLesson[] = lessons.map((l) => ({ id: l.id, unitId: l.unitId, kind: l.kind }));
  const bestStars = new Map(progress.map((p) => [p.lessonId, p.bestStars]));
  return { nodes: computeLessonStates(mapLessons, bestStars), bestStars };
}
