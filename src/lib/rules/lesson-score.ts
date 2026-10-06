// Sao và thưởng sau một bài học (hàm thuần). Sao tính theo tỷ lệ đúng ngay lần đầu của thiết kế (khác PRD Phần F đếm lần sai):
// 3 sao khi đúng từ 90%, 2 sao từ 70%, còn lại 1 sao (luôn có ít nhất 1 sao). Thưởng theo PRD Phần F.

export type ScoreItem = { firstTryCorrect: boolean };

export const THREE_STAR_RATIO = 0.9;
export const TWO_STAR_RATIO = 0.7;

/** Tỷ lệ mục đúng ngay lần đầu (0–1). Bài không có mục chấm (chỉ thẻ từ) coi như đúng hết. */
export function accuracy(items: readonly ScoreItem[]): number {
  if (items.length === 0) return 1;
  return items.filter((i) => i.firstTryCorrect).length / items.length;
}

export function starsFor(items: readonly ScoreItem[]): 1 | 2 | 3 {
  const ratio = accuracy(items);
  if (ratio >= THREE_STAR_RATIO) return 3;
  if (ratio >= TWO_STAR_RATIO) return 2;
  return 1;
}

/** Cấp 1–5 dùng giao diện Tiểu học (thưởng xu), cấp 6–10 dùng THCS (thưởng XP). */
export const isPrimaryLevel = (levelNumber: number) => levelNumber <= 5;

export type Reward = { coins: number; xp: number };

/** Xong một bài: Tiểu học 10 xu + 5 xu mỗi sao; THCS 20 XP + 10 XP mỗi sao. */
export function rewardFor(stars: number, levelNumber: number): Reward {
  return isPrimaryLevel(levelNumber) ? { coins: 10 + 5 * stars, xp: 0 } : { coins: 0, xp: 20 + 10 * stars };
}

/** Số sao cộng thêm vào hồ sơ: chỉ phần vượt kết quả tốt nhất trước đó (làm lại không cộng trùng). */
export function newStars(stars: number, previousBest: number): number {
  return Math.max(0, stars - previousBest);
}
