// Nạp khung chương trình từ prisma/seed/curriculum/level-NN.json vào bảng units (trạng thái planned).
// Chạy lại không trùng: khóa là (level, slug). Chủ đề đã soạn (draft/published) không bị đè; chủ đề planned được cập nhật theo tệp.
import { existsSync, readFileSync } from "node:fs";
import type { PrismaClient } from "../../src/generated/prisma/client.ts";
import { curriculumLevelSchema } from "../../src/lib/schemas/curriculum.ts";

export const CURRICULUM_DIR = new URL("./curriculum/", import.meta.url);

export function curriculumFile(levelNumber: number) {
  return new URL(`level-${String(levelNumber).padStart(2, "0")}.json`, CURRICULUM_DIR);
}

export async function seedCurriculum(db: PrismaClient) {
  const levels = await db.level.findMany({ select: { id: true, number: true }, orderBy: { number: "asc" } });
  let created = 0;
  let updated = 0;
  let kept = 0;

  for (const level of levels) {
    const file = curriculumFile(level.number);
    if (!existsSync(file)) continue;
    const topics = curriculumLevelSchema.parse(JSON.parse(readFileSync(file, "utf8")));

    for (const [index, topic] of topics.entries()) {
      const fields = { title: topic.title, titleVi: topic.title_vi, source: topic.source, targetWords: topic.target_words, sortOrder: index + 1 };
      const existing = await db.unit.findUnique({ where: { levelId_slug: { levelId: level.id, slug: topic.slug } } });
      if (!existing) {
        await db.unit.create({ data: { levelId: level.id, slug: topic.slug, status: "planned", ...fields } });
        created++;
      } else if (existing.status === "planned") {
        await db.unit.update({ where: { id: existing.id }, data: fields });
        updated++;
      } else {
        kept++;
      }
    }
  }
  console.log(`Khung chương trình: tạo ${created}, cập nhật ${updated}, giữ nguyên ${kept} chủ đề đã soạn.`);
}
