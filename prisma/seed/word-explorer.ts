// Nạp Khám phá từ mẫu (task 25): “bird” và “cat” (dữ liệu ở src/lib/rules/word-explorer-data.ts), trạng thái Nháp.
// Chạy lại không nhân đôi và không ghi đè phần đã sửa: từ nào đã có nhánh hoặc đoạn văn thì bỏ qua. Từ chưa có trong kho từ vựng cũng bỏ qua.
import type { PrismaClient } from "../../src/generated/prisma/client.ts";
import { EXPLORER_SEED } from "../../src/lib/rules/word-explorer-data.ts";

export async function seedWordExplorer(db: PrismaClient): Promise<number> {
  let count = 0;
  for (const entry of EXPLORER_SEED) {
    const word = await db.word.findFirst({ where: { word: entry.word }, orderBy: [{ levelId: "asc" }, { id: "asc" }], select: { id: true } });
    if (!word) continue;

    if ((await db.wordQuestion.count({ where: { wordId: word.id } })) === 0) {
      await db.wordQuestion.createMany({
        data: entry.branches.map((b, i) => ({
          wordId: word.id,
          sortOrder: i + 1,
          kind: b.kind,
          questionEn: b.questionEn,
          questionVi: b.questionVi,
          answers: b.answers,
          distractors: b.distractors,
          status: "draft" as const,
        })),
      });
      count += 1;
    }

    const reading = await db.wordReading.findUnique({ where: { ownerType_ownerId: { ownerType: "word", ownerId: word.id } }, select: { id: true } });
    if (!reading) {
      await db.wordReading.create({ data: { ownerType: "word", ownerId: word.id, sentences: entry.branches.map((b) => b.sentence), status: "draft" } });
    }
  }
  return count;
}
