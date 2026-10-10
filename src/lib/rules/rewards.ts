// Phần thưởng của trận trùm và bài thi lên cấp (task 20). Hàm thuần.
import { COINS } from "./constants.ts";

/** Mã và tên huy hiệu “Qua đảo …” khi đạt bài thi lên cấp. */
export const levelBadgeCode = (levelNumber: number): string => `level:${levelNumber}`;
export const levelBadgeName = (levelName: string): string => `Qua đảo ${levelName}`;

/** Thưởng đạt bài thi lên cấp (thiết kế Screen36): +50 sao, +100 xu. */
export const LEVEL_UP_REWARD = { stars: 50, coins: 100 } as const;

/** Thưởng thắng trận trùm: 30 xu (Tiểu học) hoặc 60 XP (THCS) mỗi lần thắng; huy hiệu chỉ nhận lần đầu. */
export function bossReward(isPrimary: boolean): { coins: number; xp: number } {
  return isPrimary ? { coins: COINS.boss, xp: 0 } : { coins: 0, xp: COINS.boss * 2 };
}
