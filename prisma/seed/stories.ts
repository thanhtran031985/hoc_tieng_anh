// Nạp truyện tranh mẫu (task 16): dữ liệu ở src/lib/rules/story-data.ts. Truyện ở trạng thái Nháp cho tới khi các trang có âm thanh.
// Chạy lại không trùng: truyện khớp theo (cấp, slug), trang khớp theo thứ tự; KHÔNG đụng trạng thái, tệp âm thanh đã tạo hoặc tải lên.
import type { PrismaClient } from "../../src/generated/prisma/client.ts";
import { STORY_SEED, storyQuestionFields } from "../../src/lib/rules/story-data.ts";
import { STORY_QUESTION_TYPE } from "../../src/lib/schemas/story.ts";

export async function seedStories(db: PrismaClient): Promise<number> {
  let count = 0;
  for (const [index, story] of STORY_SEED.entries()) {
    const level = await db.level.findUnique({ where: { number: story.levelNumber }, select: { id: true } });
    if (!level) continue;
    const unit = await db.unit.findUnique({ where: { levelId_slug: { levelId: level.id, slug: story.unitSlug } }, select: { id: true } });
    const fields = { unitId: unit?.id ?? null, title: story.title, titleVi: story.titleVi, cover: story.pages.find((p) => p.kind === "page")?.image ?? null, newWords: [...story.newWords], sortOrder: index + 1 };
    const saved = await db.story.upsert({
      where: { levelId_slug: { levelId: level.id, slug: story.slug } },
      create: { levelId: level.id, slug: story.slug, status: "draft", ...fields },
      update: fields,
      select: { id: true },
    });

    const existing = await db.storyPage.findMany({ where: { storyId: saved.id }, orderBy: { sortOrder: "asc" }, select: { id: true, questionId: true } });
    for (const [i, page] of story.pages.entries()) {
      const sortOrder = i + 1;
      const row = existing[i];
      if (page.kind === "question") {
        const q = storyQuestionFields(page);
        const data = { type: STORY_QUESTION_TYPE, prompt: q.prompt, options: q.options, answer: q.answer, levelId: level.id, skill: "reading", difficulty: 1, status: "published" as const };
        const questionId = row?.questionId ? (await db.question.update({ where: { id: row.questionId }, data, select: { id: true } })).id : (await db.question.create({ data, select: { id: true } })).id;
        const pageData = { sortOrder, kind: "question" as const, image: null, sentences: [], questionId };
        if (row) await db.storyPage.update({ where: { id: row.id }, data: pageData });
        else await db.storyPage.create({ data: { storyId: saved.id, ...pageData } });
      } else {
        const pageData = { sortOrder, kind: "page" as const, image: page.image, sentences: page.sentences.map((en) => ({ en })), questionId: null };
        if (row) await db.storyPage.update({ where: { id: row.id }, data: pageData });
        else await db.storyPage.create({ data: { storyId: saved.id, ...pageData } });
      }
    }
    // Truyện ngắn đi thì bỏ các trang thừa (kèm câu hỏi của chúng).
    for (const extra of existing.slice(story.pages.length)) {
      await db.storyPage.delete({ where: { id: extra.id } });
      if (extra.questionId) await db.question.delete({ where: { id: extra.questionId } }).catch(() => undefined);
    }
    count += 1;
  }
  return count;
}
