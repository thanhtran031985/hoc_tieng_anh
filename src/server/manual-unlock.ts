import type { ManualUnlocks } from "@/lib/rules/unlock";
import { db } from "./db";

// Mục bố mẹ đã mở khóa thủ công cho một bé (bảng `manual_unlocks`). Không tự kiểm quyền: người gọi phải đã đi qua `requireLearner` cho `learnerId`.

/**
 * Các cấp, chủ đề và bài bố mẹ đã mở khóa thủ công cho bé (id trong bảng `levels`, `units`, `lessons`), và các cấp vào được nhờ đó:
 * mở một chủ đề hoặc một bài thì cấp chứa nó cũng vào được (nhưng các bài khác của cấp vẫn theo quy tắc thường).
 */
export async function getManualUnlocks(learnerId: number): Promise<ManualUnlocks> {
  const rows = await db.manualUnlock.findMany({ where: { learnerId }, select: { targetType: true, targetId: true } });
  const pick = (type: "level" | "unit" | "lesson") => new Set(rows.filter((r) => r.targetType === type).map((r) => r.targetId));
  const levels = pick("level");
  const units = pick("unit");
  const lessons = pick("lesson");
  const access = new Set(levels);
  if (units.size > 0 || lessons.size > 0) {
    const [byUnit, byLesson] = await Promise.all([
      units.size ? db.unit.findMany({ where: { id: { in: [...units] } }, select: { levelId: true } }) : [],
      lessons.size ? db.lesson.findMany({ where: { id: { in: [...lessons] } }, select: { unit: { select: { levelId: true } } } }) : [],
    ]);
    for (const u of byUnit) access.add(u.levelId);
    for (const l of byLesson) access.add(l.unit.levelId);
  }
  return { levels, units, lessons, accessLevels: access };
}
