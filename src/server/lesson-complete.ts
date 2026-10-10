import { completeLessonInputSchema, parseLessonStepConfig, type EarnedBadge, type LessonCompletion, type StickerGift } from "@/lib/schemas";
import { today } from "@/lib/rules/dates";
import { bossBadgeCode, bossFor } from "@/lib/rules/bosses";
import { isPrimaryLevel, newStars, rewardFor, starsFor } from "@/lib/rules/lesson-score";
import { bossReward, dropsSticker } from "@/lib/rules/rewards";
import { nextReview } from "@/lib/rules/review-box";
import { recordStudyDay } from "@/lib/rules/streak";
import { findNextLesson, levelStatus } from "@/lib/rules/unlock";
import { db } from "./db";
import { getLevelNodes } from "./level-nodes";
import { requireLearner } from "./learners";
import { LessonLockedError } from "./lesson-play";
import { awardReward, dropSticker, giftOfAttempt, grantAchievements, type AwardedBadge } from "./rewards";

// Ghi kết quả một lượt học bài. Sao, xu và XP do server tính từ kết quả từng mục (client không gửi số này).
// Một lượt học chỉ ghi một lần: gửi lại cùng `startedAtMs` (vd bấm Thử lại sau khi mất mạng) trả về kết quả đã lưu.

const MAX_PAST_MS = 7 * 24 * 60 * 60 * 1000;
const FUTURE_SLACK_MS = 5 * 60 * 1000;

async function nextLessonIdFor(learnerId: number, levelId: number): Promise<number | null> {
  const { nodes } = await getLevelNodes(learnerId, levelId);
  return findNextLesson(nodes)?.id ?? null;
}

export async function completeLesson(userId: number, learnerId: number, input: unknown): Promise<LessonCompletion> {
  const learner = await requireLearner(userId, learnerId);
  const data = completeLessonInputSchema.parse(input);

  const lesson = await db.lesson.findFirst({
    where: { id: data.lessonId, status: "published", kind: { in: ["lesson", "unit_test"] }, unit: { status: "published" } },
    select: { id: true, kind: true, unit: { select: { slug: true, levelId: true, level: { select: { number: true } } } }, steps: { select: { wordId: true, questionId: true, activityType: true, config: true } } },
  });
  if (!lesson) throw new Error("Không tìm thấy bài học");
  const { levelId } = lesson.unit;
  const levelNumber = lesson.unit.level.number;

  if (levelStatus(levelNumber, learner.currentLevel?.number ?? 1) === "locked") throw new LessonLockedError();
  const before = await getLevelNodes(learnerId, levelId);
  const node = before.nodes.find((n) => n.id === lesson.id);
  if (!node || node.state === "locked") throw new LessonLockedError();

  const now = new Date();
  const outOfRange = data.startedAtMs > now.getTime() + FUTURE_SLACK_MS || data.startedAtMs < now.getTime() - MAX_PAST_MS;
  const startedAt = new Date(outOfRange ? now.getTime() - data.durationMs : data.startedAtMs);

  // Đã ghi lượt học này rồi (gửi lại sau khi mất mạng): trả về kết quả đã lưu, không cộng thêm.
  const existing = await db.lessonAttempt.findFirst({ where: { learnerId, lessonId: lesson.id, startedAt, finishedAt: { not: null } } });
  if (existing) {
    return {
      stars: Math.min(3, Math.max(1, existing.stars)) as 1 | 2 | 3,
      coins: existing.coins,
      xp: existing.xp,
      correct: existing.correct,
      total: existing.correct + existing.wrong,
      minutes: Math.max(1, Math.ceil(((existing.finishedAt ?? now).getTime() - existing.startedAt.getTime()) / 60000)),
      nextLessonId: await nextLessonIdFor(learnerId, levelId),
      // Gửi lại sau lỗi mạng: quà đã rơi ở lượt này (chưa mở) được trả lại, không rơi thêm.
      gift: await giftOfAttempt(learnerId, existing.id),
    };
  }

  // Chỉ nhận kết quả của các từ và câu hỏi thuộc bài này.
  const lessonWordIds = new Set(lesson.steps.flatMap((s) => (s.wordId === null ? [] : [s.wordId])));
  const lessonQuestionIds = new Set(lesson.steps.flatMap((s) => (s.questionId === null ? [] : [s.questionId])));
  // Câu hỏi xen giữa truyện thuộc bài qua bước `story` (config.storyId → story_pages.question_id).
  const storyIds = lesson.steps.flatMap((s) => (s.activityType === "story" ? [parseLessonStepConfig("story", s.config)] : [])).flatMap((c) => (c && "storyId" in c ? [c.storyId] : []));
  if (storyIds.length) {
    const pages = await db.storyPage.findMany({ where: { storyId: { in: storyIds }, questionId: { not: null } }, select: { questionId: true } });
    for (const p of pages) if (p.questionId !== null) lessonQuestionIds.add(p.questionId);
  }
  const items = data.items.filter((i) => (i.questionId !== undefined ? lessonQuestionIds.has(i.questionId) : i.wordId !== null && lessonWordIds.has(i.wordId)));
  const scored = items.filter((i) => i.scored);
  const stars = starsFor(scored);
  // Trận trùm: thưởng cố định 30 xu (Tiểu học) mỗi lần thắng; các bài thường thưởng theo sao.
  const isBoss = lesson.kind === "unit_test";
  const reward = isBoss ? bossReward(isPrimaryLevel(levelNumber)) : rewardFor(stars, levelNumber);
  let badge: AwardedBadge | null = null;
  let gift: StickerGift | null = null;
  let badges: EarnedBadge[] = [];
  const correct = scored.filter((i) => i.firstTryCorrect).length;
  const wrong = scored.length - correct;
  const minutes = Math.max(1, Math.ceil(data.durationMs / 60000));
  const day = today(now);

  const wordIds = [...lessonWordIds];
  const cards = await db.reviewCard.findMany({ where: { learnerId, wordId: { in: wordIds } } });
  const cardByWord = new Map(cards.map((c) => [c.wordId, c]));
  const previous = await db.lessonProgress.findUnique({ where: { learnerId_lessonId: { learnerId, lessonId: lesson.id } } });
  const streak = recordStudyDay({ streakDays: learner.streakDays, streakFreezes: learner.streakFreezes, lastStudyDate: learner.lastStudyDate }, day);

  await db.$transaction(async (tx) => {
    const attempt = await tx.lessonAttempt.create({
      data: { learnerId, lessonId: lesson.id, startedAt, finishedAt: now, correct, wrong, stars, xp: reward.xp, coins: reward.coins },
    });
    if (items.length > 0) {
      await tx.answerLog.createMany({
        data: items.map((i) => ({
          learnerId,
          source: "lesson" as const,
          wordId: i.wordId,
          questionId: i.questionId,
          attemptId: attempt.id,
          isCorrect: i.firstTryCorrect,
          // Câu hỏi chữ (ghép âm, sắp xếp câu, nghe và gõ, điền từ): ghi chữ bé đã gõ/xếp; câu chọn đáp án: ghi các lựa chọn.
          answer: i.picks.length === 0 ? undefined : i.questionId !== undefined ? { text: i.picks.join(" | ").slice(0, 500) } : { selected: i.picks },
        })),
      });
    }
    if (isBoss) badge = await awardReward(tx, learnerId, bossBadgeCode(bossFor(levelNumber, lesson.unit.slug)));
    // Sticker bất ngờ: chỉ lần đầu hoàn thành bài (chưa có tiến độ); xu cộng khi bé mở quà.
    if (dropsSticker(isBoss ? "unit_test" : "lesson", previous === null)) gift = await dropSticker(tx, learnerId, { unitSlug: lesson.unit.slug, isBoss, seed: `${learnerId}:${lesson.id}:${attempt.id}`, attemptId: attempt.id });
    await tx.lessonProgress.upsert({
      where: { learnerId_lessonId: { learnerId, lessonId: lesson.id } },
      create: { learnerId, lessonId: lesson.id, bestStars: stars, attempts: 1, completedAt: now },
      update: { bestStars: Math.max(previous?.bestStars ?? 0, stars), attempts: { increment: 1 }, completedAt: previous?.completedAt ?? now },
    });
    await tx.learner.update({
      where: { id: learnerId },
      data: {
        stars: { increment: newStars(stars, previous?.bestStars ?? 0) },
        coins: { increment: reward.coins },
        xp: { increment: reward.xp },
        streakDays: streak.streakDays,
        streakFreezes: streak.streakFreezes,
        lastStudyDate: streak.lastStudyDate,
      },
    });
    // Thẻ ôn tập của từng từ trong bài: từ nào bé đúng ngay lần đầu ở mọi câu thì tính là đúng.
    for (const wordId of wordIds) {
      const right = scored.filter((i) => i.wordId === wordId).every((i) => i.firstTryCorrect);
      const card = cardByWord.get(wordId);
      const next = nextReview(card ? { box: card.box, correctCount: card.correctCount, wrongCount: card.wrongCount } : null, right, day);
      const fields = { box: next.box, dueOn: next.dueOn, correctCount: next.correctCount, wrongCount: next.wrongCount, lastReviewedAt: now };
      await tx.reviewCard.upsert({
        where: { learnerId_wordId: { learnerId, wordId } },
        create: { learnerId, wordId, ...fields },
        update: fields,
      });
    }
    // Huy hiệu thành tích: tính sau khi tiến độ bài, chuỗi ngày và thẻ ôn đã ghi.
    badges = await grantAchievements(tx, learnerId);
  });

  return { stars, coins: reward.coins, xp: reward.xp, correct, total: scored.length, minutes, nextLessonId: await nextLessonIdFor(learnerId, levelId), badge, gift, badges };
}
