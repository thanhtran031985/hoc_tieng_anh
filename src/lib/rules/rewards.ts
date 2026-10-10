// Phần thưởng của trận trùm và bài thi lên cấp (task 20). Hàm thuần.
import { COINS } from "./constants.ts";
import { parseBadgeCondition } from "../schemas/reward.ts";
import { ALBUMS, type BadgeCondition, type StickerAlbum } from "./reward-catalog.ts";
import { seededRandom, shuffled } from "./random.ts";

/** Mã và tên huy hiệu “Qua đảo …” khi đạt bài thi lên cấp. */
export const levelBadgeCode = (levelNumber: number): string => `level:${levelNumber}`;
export const levelBadgeName = (levelName: string): string => `Qua đảo ${levelName}`;

/** Thưởng đạt bài thi lên cấp (thiết kế Screen36): +50 sao, +100 xu. */
export const LEVEL_UP_REWARD = { stars: 50, coins: 100 } as const;

/** Thưởng thắng trận trùm: 30 xu (Tiểu học) hoặc 60 XP (THCS) mỗi lần thắng; huy hiệu chỉ nhận lần đầu. */
export function bossReward(isPrimary: boolean): { coins: number; xp: number } {
  return isPrimary ? { coins: COINS.boss, xp: 0 } : { coins: 0, xp: COINS.boss * 2 };
}

// ---- Sticker rơi cuối bài (task 21) ----

/** Loại bài ở cuối lượt học. Bài ôn tập không rơi quà. */
export type DropKind = "lesson" | "unit_test" | "review";

/** Rơi sticker khi bé LẦN ĐẦU hoàn thành một bài thường hoặc trận trùm (đã học lại thì không rơi nữa); bài ôn tập không rơi. */
export function dropsSticker(kind: DropKind, firstCompletion: boolean): boolean {
  return firstCompletion && (kind === "lesson" || kind === "unit_test");
}

/** Album hợp với bài: trận trùm → khủng long; chủ đề có album riêng (Con vật, Trái cây, Xe cộ) → album đó; không thì null. */
export function preferredAlbum(unitSlug: string | null | undefined, isBoss: boolean): StickerAlbum | null {
  if (isBoss) return ALBUMS.find((a) => a.bossPreferred)?.id ?? null;
  return ALBUMS.find((a) => unitSlug !== null && unitSlug !== undefined && a.unitSlugs.includes(unitSlug))?.id ?? null;
}

export type StickerCandidate = { code: string; album: string };

/**
 * Chọn một sticker bé chưa có: ưu tiên album hợp chủ đề, hết thì lấy album khác; không bao giờ trùng sticker đã có; hết sticker thì null.
 * Cùng hạt giống cho cùng kết quả (gửi lại kết quả bài không đổi quà).
 */
export function pickSticker<T extends StickerCandidate>(input: { catalog: readonly T[]; owned: ReadonlySet<string>; unitSlug?: string | null; isBoss: boolean; seed: string }): T | null {
  const free = input.catalog.filter((s) => !input.owned.has(s.code));
  if (free.length === 0) return null;
  const album = preferredAlbum(input.unitSlug, input.isBoss);
  const preferred = album ? free.filter((s) => s.album === album) : [];
  const pool = preferred.length > 0 ? preferred : free;
  return shuffled(pool, seededRandom(input.seed))[0];
}

/** “Mới”: nhận trong vài ngày gần nhất. */
export const NEW_REWARD_DAYS = 3;
export function isNewReward(acquiredAt: Date, now: Date, days: number = NEW_REWARD_DAYS): boolean {
  return now.getTime() - acquiredAt.getTime() < days * 24 * 60 * 60 * 1000;
}

// ---- Huy hiệu thành tích ----

/** Từ “đã thuộc” cho huy hiệu 100 từ: thẻ ôn từ hộp 4 (“Nhớ tốt”) trở lên. */
export const WORDS_MASTERED_BOX = 4;

/** Số liệu của bé để tính huy hiệu. `levelsPassed` = số cấp đã qua (cấp hiện tại − 1). */
export type BadgeStats = { streakDays: number; wordsMastered: number; levelsPassed: number; bossWins: number; stars3Lessons: number; speakingLines: number };

export type BadgeProgress = { have: number; goal: number; done: boolean };

const progress = (have: number, goal: number): BadgeProgress => ({ have: Math.min(Math.max(0, have), goal), goal, done: have >= goal });

/** Tiến độ tới một huy hiệu. Qua đảo chỉ có hai trạng thái (0/1), tính theo số cấp đã qua. */
export function badgeProgress(condition: BadgeCondition, stats: BadgeStats): BadgeProgress {
  const goal = condition.goal;
  switch (condition.kind) {
    case "streak":
      return progress(stats.streakDays, goal);
    case "words_mastered":
      return progress(stats.wordsMastered, goal);
    case "boss_wins":
      return progress(stats.bossWins, goal);
    case "stars3_lessons":
      return progress(stats.stars3Lessons, goal);
    case "speaking":
      return progress(stats.speakingLines, goal);
    case "level_test":
      return { have: stats.levelsPassed >= goal ? 1 : 0, goal: 1, done: stats.levelsPassed >= goal };
  }
}

export type BadgeDef = { code: string; condition: unknown };

/**
 * Các huy hiệu thành tích vừa đủ điều kiện mà bé chưa có (theo thứ tự danh mục). Huy hiệu qua đảo do bài thi lên cấp cấp trực tiếp và huy hiệu trùm
 * do trận trùm cấp, nên không nằm ở đây; điều kiện hỏng hoặc không biết thì bỏ qua.
 */
export function earnedBadges(defs: readonly BadgeDef[], owned: ReadonlySet<string>, stats: BadgeStats): string[] {
  return defs.flatMap((d) => {
    if (owned.has(d.code)) return [];
    const condition = parseBadgeCondition(d.condition);
    if (!condition || condition.kind === "level_test") return [];
    return badgeProgress(condition, stats).done ? [d.code] : [];
  });
}
