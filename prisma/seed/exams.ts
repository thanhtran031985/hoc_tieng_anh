// Nạp đề thi lên cấp (task 20): mỗi cấp 1–5 một đề `level_test`, 20 câu, đạt từ 80%. Chạy lại không trùng (khớp theo loại đề + cấp).
// Bộ câu của từng lượt thi tự dựng khi bé bắt đầu (xem src/server/exam.ts), nên đề này chỉ giữ cấu hình.
import type { PrismaClient } from "../../src/generated/prisma/client.ts";
import { EXAM_PASS_PERCENT, EXAM_QUESTION_COUNT } from "../../src/lib/rules/level-test.ts";
import { hasLevelExam } from "../../src/lib/rules/level-gate.ts";

export async function seedExams(db: PrismaClient): Promise<number> {
  const levels = await db.level.findMany({ select: { id: true, number: true }, orderBy: { number: "asc" } });
  let count = 0;
  for (const level of levels.filter((l) => hasLevelExam(l.number))) {
    const fields = { title: `Bài thi lên cấp ${level.number}`, questionCount: EXAM_QUESTION_COUNT, passPercent: EXAM_PASS_PERCENT };
    await db.exam.upsert({ where: { kind_levelId: { kind: "level_test", levelId: level.id } }, create: { kind: "level_test", levelId: level.id, ...fields }, update: fields });
    count += 1;
  }
  return count;
}
