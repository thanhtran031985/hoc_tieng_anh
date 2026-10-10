// Nạp nội dung chi tiết từ prisma/seed/content/level-NN/<slug-chủ-đề>.json: từ vựng, chủ đề từ, bài học và các bước.
// Mỗi chủ đề được ghi trong một giao dịch rồi đổi sang `published`. Chạy lại không trùng:
// - từ khớp theo (từ, cấp); chủ đề từ khớp theo tên; liên kết từ–chủ đề dùng khóa chính;
// - bài học của chủ đề được xóa rồi tạo lại bằng buildLessons (bản 2: có dạng bài mới và trò chơi, task 19) khi chưa bé nào học;
//   chủ đề đã có bé học thì GIỮ NGUYÊN các bước cũ và chỉ thêm bước dạng mới / trò chơi chưa có ở cuối từng bài (không mất sao, tiến độ);
// - câu hỏi dạng mới của chủ đề (content-extra) được nạp trước, khớp theo (cấp, dạng, chữ chính).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import type { PrismaClient } from "../../src/generated/prisma/client.ts";
import { extraKeyOf, extrasOf } from "../../src/lib/rules/content-extra.ts";
import { buildLessons, planAppend, storyKey } from "../../src/lib/rules/lesson-builder.ts";
import { pictureSlug, pictureUrl } from "../../src/lib/picture-path.ts";
import { contentTopicSchema } from "../../src/lib/schemas/content.ts";
import { buildUnitExtras, loadExtraFile, upsertExtraQuestions } from "./content-extra.ts";

const CONTENT_DIR = new URL("./content/", import.meta.url);
const PICTURE_DIR = new URL("../../public/media/pictures/", import.meta.url);

const levelDir = (n: number) => new URL(`level-${String(n).padStart(2, "0")}/`, CONTENT_DIR);
const hasPictureFile = (word: string) => existsSync(new URL(`${pictureSlug(word)}.svg`, PICTURE_DIR));

export async function seedContent(db: PrismaClient) {
  const levels = await db.level.findMany({ select: { id: true, number: true }, orderBy: { number: "asc" } });
  let units = 0;
  let words = 0;
  let lessons = 0;
  let extraQuestions = 0;
  let addedSteps = 0;
  const kept: string[] = [];

  for (const level of levels) {
    const dir = levelDir(level.number);
    if (!existsSync(dir)) continue;

    for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
      const slug = file.replace(/\.json$/, "");
      const unit = await db.unit.findUnique({ where: { levelId_slug: { levelId: level.id, slug } } });
      if (!unit) throw new Error(`Cấp ${level.number}: có nội dung "${slug}" nhưng chưa có chủ đề trong khung chương trình`);
      const entries = contentTopicSchema.parse(JSON.parse(readFileSync(new URL(file, dir), "utf8")));

      const extraFile = loadExtraFile(level.number, slug);
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

        // Câu hỏi dạng mới của chủ đề (gắn hình từ ngân hàng từ của chính chủ đề).
        const bank = new Map<string, { id: number; word: string; image: string | null }>();
        for (const [word, id] of wordIds) bank.set(word.toLowerCase(), { id, word, image: hasPictureFile(word) ? pictureUrl(word) : null });
        // Truyện tranh của chủ đề (đã nạp bởi seedStories): mỗi truyện thành một bước `story`.
        const stories = await tx.story.findMany({ where: { unitId: unit.id }, orderBy: { sortOrder: "asc" }, select: { id: true, slug: true } });
        const storyIds = new Map(stories.map((st) => [storyKey(st.slug), st.id]));
        const extraItems = extraFile ? buildUnitExtras(extraFile, level.number, bank, `cấp ${level.number}/${slug}`) : [];
        const questionIds = await upsertExtraQuestions(tx, level.id, extraItems);
        extraQuestions += extraItems.length;

        const built = buildLessons(
          entries.map((e) => ({ word: e.word, hasPicture: hasPictureFile(e.word) })),
          { unitTitle: unit.title, seed: unit.slug, levelNumber: level.number, extras: extrasOf(extraItems), stories: stories.map((st) => st.slug) },
        );
        const studied = await tx.lessonAttempt.count({ where: { lesson: { unitId: unit.id } } });
        const progressed = await tx.lessonProgress.count({ where: { lesson: { unitId: unit.id } } });
        if (studied + progressed > 0) {
          // Đã có bé học: không xóa bước nào, chỉ thêm bước dạng mới / trò chơi còn thiếu ở cuối từng bài thường.
          const current = await tx.lesson.findMany({
            where: { unitId: unit.id, kind: "lesson" },
            orderBy: { sortOrder: "asc" },
            select: { id: true, steps: { orderBy: { sortOrder: "asc" }, select: { sortOrder: true, activityType: true, question: { select: { type: true, prompt: true } } } } },
          });
          const regular = built.filter((l) => l.kind === "lesson");
          for (const [i, lesson] of current.entries()) {
            const plan = regular[i];
            if (!plan) continue;
            const have = lesson.steps.map((st) => ({ activityType: st.activityType, questionKey: st.question ? extraKeyOf(st.question.type, st.question.prompt) : null }));
            let order = lesson.steps.reduce((m, st) => Math.max(m, st.sortOrder), 0);
            for (const step of planAppend(have, plan.steps)) {
              const storyId = step.activityType === "story" && step.questionKey ? storyIds.get(step.questionKey) : undefined;
              const questionId = step.activityType !== "story" && step.questionKey ? questionIds.get(step.questionKey) : null;
              if (step.questionKey && (step.activityType === "story" ? storyId === undefined : questionId === undefined)) continue;
              const config = storyId !== undefined ? { storyId } : (step.config as object);
              await tx.lessonStep.create({ data: { lessonId: lesson.id, sortOrder: ++order, activityType: step.activityType, wordId: null, questionId: questionId ?? null, config } });
              addedSteps += 1;
            }
          }
          kept.push(`cấp ${level.number}/${slug}`);
        } else {
          await tx.lesson.deleteMany({ where: { unitId: unit.id } });
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
                    questionId: step.activityType !== "story" && step.questionKey ? (questionIds.get(step.questionKey) ?? null) : null,
                    config: (step.activityType === "story" ? { storyId: storyIds.get(step.questionKey ?? "") ?? 0 } : step.config) as object,
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

  console.log(`Nội dung: ${units} chủ đề, ${words} từ, ${extraQuestions} câu hỏi dạng mới, ${lessons} bài học tạo mới.`);
  if (kept.length) console.log(`Giữ nguyên bài học (bé đã học) của: ${kept.join(", ")}; thêm ${addedSteps} bước dạng mới / trò chơi vào các bài đó.`);
}
