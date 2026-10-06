import { completeReviewInputSchema, type ReviewCompletion, type ReviewMove } from "@/lib/schemas";
import { diffDays, today } from "@/lib/rules/dates";
import type { PlayStep, PlayWord } from "@/lib/rules/lesson-play";
import { MAX_BOX, nextReview } from "@/lib/rules/review-box";
import { buildReviewSteps, maxReviewItems, rewardForReview, wordResults, type DueWord } from "@/lib/rules/review-play";
import { recordStudyDay } from "@/lib/rules/streak";
import { db } from "./db";
import { requireLearner } from "./learners";

// Ôn tập hôm nay. Đi qua `requireLearner` nên chỉ đọc/ghi được hồ sơ thuộc tài khoản đang đăng nhập.
// Chỉ từ có hình và đến hạn (hộp nào cũng vậy) vào phiên ôn; đúng thì lên hộp, sai về hộp 1 (src/lib/rules/review-box.ts).

const MAX_PAST_MS = 7 * 24 * 60 * 60 * 1000;
const FUTURE_SLACK_MS = 5 * 60 * 1000;
const NOISE_POOL = 60;
const PICTURES_PER_BOX = 4;

const wordSelect = { id: true, word: true, ipa: true, meaningVi: true, exampleEn: true, exampleVi: true, image: true } as const;

/** Thẻ từ đến hạn hôm nay mà ôn được (từ có hình). Dùng chung với trang chủ để hai nơi đếm giống nhau. */
export const dueCardWhere = (learnerId: number, day: Date) => ({ learnerId, wordId: { not: null }, dueOn: { lte: day }, word: { image: { not: null } } });

export type BoxSummary = {
  box: number;
  /** Số từ trong hộp. */
  count: number;
  /** Số từ đến hạn ôn hôm nay. */
  due: number;
  /** Tối đa 4 hình mẫu (ưu tiên từ đến hạn). */
  pictures: { word: string; image: string }[];
  /** Hộp không có từ đến hạn: "Ôn vào ngày mai", "Ôn vào 12/10"; null nếu hộp trống. */
  nextLabel: string | null;
};

export type ReviewOverview = {
  levelNumber: number;
  /** Số từ phiên hôm nay sẽ ôn (đã cắt theo giới hạn). */
  sessionCount: number;
  dueTotal: number;
  boxes: BoxSummary[];
};

function dueLabel(dueOn: Date, day: Date): string {
  const days = diffDays(dueOn, day);
  if (days <= 1) return "Ôn vào ngày mai";
  return `Ôn vào ${String(dueOn.getUTCDate()).padStart(2, "0")}/${String(dueOn.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function getReviewOverview(userId: number, learnerId: number): Promise<ReviewOverview> {
  const learner = await requireLearner(userId, learnerId);
  const levelNumber = learner.currentLevel?.number ?? 1;
  const day = today();
  const cards = await db.reviewCard.findMany({
    where: { learnerId, wordId: { not: null } },
    orderBy: [{ dueOn: "asc" }, { id: "asc" }],
    select: { box: true, dueOn: true, word: { select: { word: true, image: true } } },
  });

  const boxes: BoxSummary[] = Array.from({ length: MAX_BOX }, (_, i) => {
    const inBox = cards.filter((c) => c.box === i + 1);
    const isDue = (c: (typeof cards)[number]) => c.dueOn <= day && c.word?.image != null;
    const dueCards = inBox.filter(isDue);
    const sample = [...dueCards, ...inBox.filter((c) => !isDue(c))].flatMap((c) => (c.word?.image ? [{ word: c.word.word, image: c.word.image }] : [])).slice(0, PICTURES_PER_BOX);
    const upcoming = inBox.find((c) => c.dueOn > day);
    return { box: i + 1, count: inBox.length, due: dueCards.length, pictures: sample, nextLabel: dueCards.length === 0 && upcoming ? dueLabel(upcoming.dueOn, day) : null };
  });
  const dueTotal = boxes.reduce((sum, b) => sum + b.due, 0);
  return { levelNumber, sessionCount: Math.min(dueTotal, maxReviewItems(levelNumber)), dueTotal, boxes };
}

export type ReviewPlay = {
  levelNumber: number;
  steps: PlayStep[];
  /** Các từ của phiên, theo thứ tự ôn (cho màn tổng kết). */
  words: PlayWord[];
  /** Ngày phiên ôn (yyyy-mm-dd), khóa giữ tiến độ dở theo ngày. */
  day: string;
};

/** Bộ câu hỏi ôn hôm nay; rỗng nếu không có từ đến hạn. */
export async function getReviewPlay(userId: number, learnerId: number): Promise<ReviewPlay> {
  const learner = await requireLearner(userId, learnerId);
  const levelNumber = learner.currentLevel?.number ?? 1;
  const day = today();
  const limit = maxReviewItems(levelNumber);

  const cards = await db.reviewCard.findMany({
    where: dueCardWhere(learnerId, day),
    orderBy: [{ box: "asc" }, { dueOn: "asc" }, { id: "asc" }],
    take: limit,
    select: { box: true, word: { select: { ...wordSelect, levelId: true } } },
  });
  const due: DueWord[] = cards.flatMap((c) => (c.word ? [{ ...c.word, box: c.box }] : []));
  if (due.length === 0) return { levelNumber, steps: [], words: [], day: day.toISOString().slice(0, 10) };

  const pool = await db.word.findMany({
    where: { image: { not: null }, levelId: { in: [...new Set(cards.flatMap((c) => (c.word ? [c.word.levelId] : [])))] }, id: { notIn: due.map((w) => w.id) } },
    orderBy: { id: "asc" },
    take: NOISE_POOL,
    select: wordSelect,
  });
  const dayKey = day.toISOString().slice(0, 10);
  const steps = buildReviewSteps(due, pool, `${learnerId}:review:${dayKey}`, limit);
  const inSteps = new Set(steps.flatMap((s) => (s.kind === "match_pairs" ? s.pairs.map((p) => p.id) : s.kind === "word_card" || s.kind === "memory_game" ? [] : [s.target.id])));
  return { levelNumber, steps, words: due.filter((w) => inSteps.has(w.id)), day: dayKey };
}

/**
 * Ghi kết quả một phiên ôn. Chỉ nhận từ có thẻ đến hạn hôm nay (ôn thừa không đẩy hộp). Gửi lại cùng `startedAtMs`
 * (vd Thử lại sau khi mất mạng) trả về kết quả đã tính, không ghi lần hai.
 */
export async function completeReview(userId: number, learnerId: number, input: unknown): Promise<ReviewCompletion> {
  const learner = await requireLearner(userId, learnerId);
  const data = completeReviewInputSchema.parse(input);
  const levelNumber = learner.currentLevel?.number ?? 1;

  const now = new Date();
  const day = today(now);
  const outOfRange = data.startedAtMs > now.getTime() + FUTURE_SLACK_MS || data.startedAtMs < now.getTime() - MAX_PAST_MS;
  const startedAt = new Date(outOfRange ? now.getTime() - data.durationMs : data.startedAtMs);
  const minutes = Math.max(1, Math.ceil(data.durationMs / 60000));

  // Đã ghi phiên này rồi (gửi lại sau khi mất mạng): báo lại số liệu, không cộng thêm (các thẻ đã được chuyển hộp nên không còn danh sách từ lên hộp).
  const existing = await db.studySession.findFirst({ where: { learnerId, startedAt, endedAt: { not: null } } });
  if (existing) {
    const total = new Set(data.items.map((i) => i.wordId)).size;
    return { ...rewardForReview(total, levelNumber), total, minutes: Math.max(1, existing.minutes), up: [], back: 0 };
  }

  const dueCards = await db.reviewCard.findMany({
    where: dueCardWhere(learnerId, day),
    select: { id: true, wordId: true, box: true, correctCount: true, wrongCount: true, word: { select: { word: true, meaningVi: true, image: true } } },
  });
  const cardByWord = new Map(dueCards.map((c) => [c.wordId, c]));
  const items = data.items.filter((i) => cardByWord.has(i.wordId));
  const results = wordResults(items.filter((i) => i.scored)).slice(0, maxReviewItems(levelNumber));
  const reward = rewardForReview(results.length, levelNumber);

  const toMove = (wordId: number, to: number): ReviewMove => {
    const card = cardByWord.get(wordId)!;
    return { wordId, word: card.word?.word ?? "", meaningVi: card.word?.meaningVi ?? "", image: card.word?.image ?? null, from: card.box, to };
  };

  if (results.length === 0) throw new Error("Không có từ nào đến hạn ôn");

  const streak = recordStudyDay({ streakDays: learner.streakDays, streakFreezes: learner.streakFreezes, lastStudyDate: learner.lastStudyDate }, day);
  const moves: ReviewMove[] = [];

  await db.$transaction(async (tx) => {
    for (const r of results) {
      const card = cardByWord.get(r.wordId)!;
      const next = nextReview({ box: card.box, correctCount: card.correctCount, wrongCount: card.wrongCount }, r.right, day);
      await tx.reviewCard.update({
        where: { id: card.id },
        data: { box: next.box, dueOn: next.dueOn, correctCount: next.correctCount, wrongCount: next.wrongCount, lastReviewedAt: now },
      });
      moves.push(toMove(r.wordId, next.box));
    }
    await tx.answerLog.createMany({
      data: items.map((i) => ({
        learnerId,
        source: "review" as const,
        wordId: i.wordId,
        attemptId: null,
        isCorrect: i.firstTryCorrect,
        answer: i.picks.length > 0 ? { selected: i.picks } : undefined,
      })),
    });
    await tx.learner.update({
      where: { id: learnerId },
      data: {
        stars: { increment: reward.stars },
        coins: { increment: reward.coins },
        xp: { increment: reward.xp },
        streakDays: streak.streakDays,
        streakFreezes: streak.streakFreezes,
        lastStudyDate: streak.lastStudyDate,
      },
    });
    // Dòng đánh dấu phiên ôn (chống ghi đôi theo `startedAt`); phút học do StudyClock ghi từng phút nên ở đây là 0.
    await tx.studySession.create({ data: { learnerId, startedAt, endedAt: now, minutes: 0 } });
  });

  return { ...reward, total: results.length, minutes, up: moves.filter((m) => m.to > m.from), back: moves.filter((m) => m.to <= m.from).length };
}
