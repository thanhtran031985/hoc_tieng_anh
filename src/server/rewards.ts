import type { Prisma } from "@/generated/prisma/client";
import { COINS } from "@/lib/rules/constants";
import { ALBUMS } from "@/lib/rules/reward-catalog";
import { WORDS_MASTERED_BOX, earnedBadges, pickSticker, type BadgeStats } from "@/lib/rules/rewards";
import { openRewardInputSchema, parseBadgeCondition, type EarnedBadge, type OpenedReward, type StickerGift } from "@/lib/schemas";
import { db } from "./db";
import { requireLearner } from "./learners";

// Phần thưởng bé nhận được (bảng rewards / learner_rewards). Hàm ghi: nơi gọi phải đã kiểm hồ sơ thuộc tài khoản (requireLearner).
// Hàm nhận `tx` chạy trong cùng giao dịch với việc ghi kết quả bài để huy hiệu, quà và sao/xu luôn đi cùng nhau.

type Tx = Prisma.TransactionClient;

export type AwardedBadge = { name: string; isNew: boolean };

/** Quà không thuộc hồ sơ này, không phải sticker, hoặc không tồn tại (không phân biệt, tránh dò mã). */
export class RewardAccessError extends Error {
  constructor() {
    super("Không tìm thấy phần thưởng");
    this.name = "RewardAccessError";
  }
}

/**
 * Cấp phần thưởng theo `code` cho hồ sơ, một lần duy nhất (cấp lại thì không thêm). Trả tên phần thưởng và cờ “mới nhận”; mã lạ thì null.
 */
export async function awardReward(tx: Tx, learnerId: number, code: string): Promise<AwardedBadge | null> {
  const reward = await tx.reward.findUnique({ where: { code }, select: { id: true, name: true } });
  if (!reward) return null;
  const existing = await tx.learnerReward.findUnique({ where: { learnerId_rewardId: { learnerId, rewardId: reward.id } }, select: { id: true } });
  if (existing) return { name: reward.name, isNew: false };
  await tx.learnerReward.create({ data: { learnerId, rewardId: reward.id, openedAt: new Date() } });
  return { name: reward.name, isNew: true };
}

/** Số liệu của bé để tính huy hiệu thành tích. Gọi sau khi đã ghi kết quả (chuỗi ngày, tiến độ bài) trong cùng giao dịch. */
export async function collectBadgeStats(tx: Tx, learnerId: number): Promise<BadgeStats> {
  const learner = await tx.learner.findUniqueOrThrow({ where: { id: learnerId }, select: { streakDays: true, currentLevel: { select: { number: true } } } });
  const wordsMastered = await tx.reviewCard.count({ where: { learnerId, wordId: { not: null }, box: { gte: WORDS_MASTERED_BOX } } });
  const bossWins = await tx.lessonProgress.count({ where: { learnerId, bestStars: { gte: 1 }, lesson: { kind: "unit_test" } } });
  const stars3Lessons = await tx.lessonProgress.count({ where: { learnerId, bestStars: 3, lesson: { kind: "lesson" } } });
  const speaking = await tx.recording.findMany({ where: { learnerId, stars: { gte: 1 }, questionId: { not: null } }, distinct: ["questionId"], select: { questionId: true } });
  return {
    streakDays: learner.streakDays,
    wordsMastered,
    levelsPassed: Math.max(0, (learner.currentLevel?.number ?? 1) - 1),
    bossWins,
    stars3Lessons,
    speakingLines: speaking.length,
  };
}

/**
 * Cấp các huy hiệu thành tích vừa đủ điều kiện (bản nháp không cấp): lưu ngay, cộng xu thưởng (`rewards.coins`, mặc định 50) trong giao dịch.
 * Trả danh sách huy hiệu mới để màn kết thúc hiện hộp quà huy hiệu.
 */
export async function grantAchievements(tx: Tx, learnerId: number): Promise<EarnedBadge[]> {
  const [rows, ownedRows] = await Promise.all([
    tx.reward.findMany({ where: { type: "badge", status: "published" }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { id: true, code: true, name: true, nameEn: true, coins: true, condition: true } }),
    tx.learnerReward.findMany({ where: { learnerId }, select: { reward: { select: { code: true } } } }),
  ]);
  const codes = earnedBadges(rows, new Set(ownedRows.map((r) => r.reward.code)), await collectBadgeStats(tx, learnerId));
  const granted: EarnedBadge[] = [];
  for (const code of codes) {
    const reward = rows.find((r) => r.code === code)!;
    const condition = parseBadgeCondition(reward.condition)!;
    const created = await tx.learnerReward.createMany({ data: [{ learnerId, rewardId: reward.id, openedAt: new Date() }], skipDuplicates: true });
    if (created.count === 0) continue;
    const coins = reward.coins ?? COINS.badge;
    if (coins > 0) await tx.learner.update({ where: { id: learnerId }, data: { coins: { increment: coins } } });
    granted.push({ code, en: reward.nameEn ?? reward.name, vi: reward.name, kind: condition.kind, goal: condition.goal, coins });
  }
  return granted;
}

type StickerRow = { id: number; code: string; name: string; nameEn: string | null; album: string | null; image: string | null; coins: number | null };

function toGift(learnerRewardId: number, reward: StickerRow): StickerGift {
  const album = ALBUMS.find((a) => a.id === reward.album);
  return {
    id: learnerRewardId,
    key: reward.code.replace(/^sticker:/, ""),
    en: reward.nameEn ?? reward.name,
    vi: reward.name,
    album: reward.album ?? "",
    albumVi: album?.vi ?? "",
    image: reward.image,
    coins: reward.coins ?? COINS.stickerLesson,
  };
}

const stickerSelect = { id: true, code: true, name: true, nameEn: true, album: true, image: true, coins: true } as const;

/**
 * Rơi một sticker bé chưa có (chưa mở: xu cộng khi mở). Gọi khi LẦN ĐẦU hoàn thành một bài thường hoặc trận trùm; hết sticker thì null.
 * `attemptId` ghi vào dòng quà để gửi lại kết quả bài trả đúng quà này, không rơi thêm.
 */
export async function dropSticker(tx: Tx, learnerId: number, ctx: { unitSlug: string; isBoss: boolean; seed: string; attemptId: number }): Promise<StickerGift | null> {
  const [catalog, ownedRows] = await Promise.all([
    tx.reward.findMany({ where: { type: "sticker", status: "published" }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: stickerSelect }),
    tx.learnerReward.findMany({ where: { learnerId, reward: { type: "sticker" } }, select: { reward: { select: { code: true } } } }),
  ]);
  const pick = pickSticker({ catalog: catalog.map((r) => ({ code: r.code, album: r.album ?? "", row: r })), owned: new Set(ownedRows.map((r) => r.reward.code)), unitSlug: ctx.unitSlug, isBoss: ctx.isBoss, seed: ctx.seed });
  if (!pick) return null;
  const created = await tx.learnerReward.create({ data: { learnerId, rewardId: pick.row.id, openedAt: null, sourceAttemptId: ctx.attemptId }, select: { id: true } });
  return toGift(created.id, pick.row);
}

/** Quà sticker chưa mở của một lượt học (gửi lại kết quả sau lỗi mạng); không có hoặc đã mở thì null. */
export async function giftOfAttempt(learnerId: number, attemptId: number): Promise<StickerGift | null> {
  const row = await db.learnerReward.findFirst({ where: { learnerId, sourceAttemptId: attemptId, openedAt: null, reward: { type: "sticker" } }, select: { id: true, reward: { select: stickerSelect } } });
  return row ? toGift(row.id, row.reward) : null;
}

/** Mọi quà sticker chưa mở của hồ sơ (quà bé thoát khi chưa mở vẫn được giữ), cũ nhất trước. */
export async function pendingGifts(learnerId: number): Promise<StickerGift[]> {
  const rows = await db.learnerReward.findMany({ where: { learnerId, openedAt: null, reward: { type: "sticker" } }, orderBy: { id: "asc" }, select: { id: true, reward: { select: stickerSelect } } });
  return rows.map((r) => toGift(r.id, r.reward));
}

/**
 * Mở quà sticker của hồ sơ: đánh dấu đã mở và cộng xu một lần (mở lại cùng quà không cộng thêm nhưng vẫn trả thông tin để hiện lại hộp quà).
 * Quà phải thuộc đúng hồ sơ của tài khoản đang đăng nhập.
 */
export async function openReward(userId: number, learnerId: number, input: unknown): Promise<OpenedReward> {
  await requireLearner(userId, learnerId);
  const { id } = openRewardInputSchema.parse(input);
  const row = await db.learnerReward.findFirst({ where: { id, learnerId, reward: { type: "sticker" } }, select: { id: true, openedAt: true, reward: { select: stickerSelect } } });
  if (!row) throw new RewardAccessError();
  const gift = toGift(row.id, row.reward);
  if (row.openedAt === null) {
    await db.$transaction(async (tx) => {
      const claimed = await tx.learnerReward.updateMany({ where: { id: row.id, learnerId, openedAt: null }, data: { openedAt: new Date() } });
      if (claimed.count === 1 && gift.coins > 0) await tx.learner.update({ where: { id: learnerId }, data: { coins: { increment: gift.coins } } });
    });
  }
  return { coins: gift.coins, en: gift.en, vi: gift.vi, album: gift.album, albumVi: gift.albumVi };
}
