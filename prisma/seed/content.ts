// Nạp nội dung chi tiết từ prisma/seed/content/level-NN/<slug-chủ-đề>.json: từ vựng, chủ đề từ, bài học và các bước.
// Mỗi chủ đề được ghi trong một giao dịch rồi đổi sang `published`. Chạy lại không trùng:
// - từ khớp theo (từ, cấp); chủ đề từ khớp theo tên; liên kết từ–chủ đề dùng khóa chính;
// - bài học của chủ đề được xóa rồi tạo lại bằng buildLessons, TRỪ khi bé nào đã học một bài của chủ đề (tránh mất kết quả học).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import type { PrismaClient } from "../../src/generated/prisma/client.ts";
import { buildLessons } from "../../src/lib/rules/lesson-builder.ts";
import { pictureSlug, pictureUrl } from "../../src/lib/picture-path.ts";
import { contentTopicSchema } from "../../src/lib/schemas/content.ts";

const CONTENT_DIR = new URL("./content/", import.meta.url);
const PICTURE_DIR = new URL("../../public/media/pictures/", import.meta.url);

const levelDir = (n: number) => new URL(`level-${String(n).padStart(2, "0")}/`, CONTENT_DIR);
const hasPictureFile = (word: string) => existsSync(new URL(`${pictureSlug(word)}.svg`, PICTURE_DIR));

export async function seedContent(db: PrismaClient) {
  const levels = await db.level.findMany({ select: { id: true, number: true }, orderBy: { number: "asc" } });
  let units = 0;
  let words = 0;
  let lessons = 0;
  const kept: string[] = [];

  for (const level of levels) {
    const dir = levelDir(level.number);
    if (!existsSync(dir)) continue;

    for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
      const slug = file.replace(/\.json$/, "");
      const unit = await db.unit.findUnique({ where: { levelId_slug: { levelId: level.id, slug } } });
      if (!unit) throw new Error(`Cấp ${level.number}: có nội dung "${slug}" nhưng chưa có chủ đề trong khung chương trình`);
      const entries = contentTopicSchema.parse(JSON.parse(readFileSync(new URL(file, dir), "utf8")));

      await db.$transaction(async (tx) => {
        const topic = await tx.topic.upsert({ where: { name: unit.title }, create: { name: unit.title, nameVi: unit.titleVi }, update: { nameVi: unit.titleVi } });

        const wordIds = new Map<string, number>();
        for (const entry of entries) {
          const fields = {
            ipa: entry.ipa,
            partOfSpeech: entry.part_of_speech,
            meaningVi: entry.meaning_vi,
            exampleEn: entry.example_en,
            exampleVi: entry.example_vi,
            image: hasPictureFile(entry.word) ? pictureUrl(entry.word) : null,
          };
          const existing = await tx.word.findFirst({ where: { word: entry.word, levelId: level.id } });
          const row = existing
            ? await tx.word.update({ where: { id: existing.id }, data: fields })
            : await tx.word.create({ data: { word: entry.word, levelId: level.id, ...fields } });
          wordIds.set(entry.word, row.id);
          await tx.wordTopic.upsert({ where: { wordId_topicId: { wordId: row.id, topicId: topic.id } }, create: { wordId: row.id, topicId: topic.id }, update: {} });
        }
        words += entries.length;

        const studied = await tx.lessonAttempt.count({ where: { lesson: { unitId: unit.id } } });
        const progressed = await tx.lessonProgress.count({ where: { lesson: { unitId: unit.id } } });
        if (studied + progressed > 0) {
          kept.push(`cấp ${level.number}/${slug}`);
        } else {
          await tx.lesson.deleteMany({ where: { unitId: unit.id } });
          const built = buildLessons(
            entries.map((e) => ({ word: e.word, hasPicture: hasPictureFile(e.word) })),
            { unitTitle: unit.title, seed: unit.slug },
          );
          for (const [index, lesson] of built.entries()) {
            await tx.lesson.create({
              data: {
                unitId: unit.id,
                title: lesson.title,
                kind: lesson.kind,
                sortOrder: index + 1,
                status: "published",
                steps: {
                  create: lesson.steps.map((step, i) => ({
                    sortOrder: i + 1,
                    activityType: step.activityType,
                    wordId: step.word === null ? null : wordIds.get(step.word)!,
                    config: step.config as object,
                  })),
                },
              },
            });
          }
          lessons += built.length;
        }

        await tx.unit.update({ where: { id: unit.id }, data: { status: "published" } });
      });
      units++;
    }
  }

  console.log(`Nội dung: ${units} chủ đề, ${words} từ, ${lessons} bài học tạo mới.`);
  if (kept.length) console.log(`Giữ nguyên bài học (bé đã học) của: ${kept.join(", ")}.`);
}
