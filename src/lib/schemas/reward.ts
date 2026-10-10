import { z } from "zod";
import { BADGE_KINDS, BADGE_KIND_INFO, type BadgeCondition } from "../rules/reward-catalog.ts";

// Dữ liệu phần thưởng: điều kiện huy hiệu (cột JSON `rewards.condition`), đầu vào mở quà, và kết quả trả về cho màn kết thúc bài.

const rewardCode = z.number().int().positive();

/** Điều kiện huy hiệu thành tích hoặc qua đảo: loại + mức cần đạt trong khoảng của loại đó. */
export const badgeConditionSchema = z
  .object({ kind: z.enum(BADGE_KINDS, { error: "Chọn loại điều kiện." }), goal: z.number({ error: "Nhập mức cần đạt." }).int("Mức cần đạt phải là số nguyên.") })
  .superRefine((value, ctx) => {
    const info = BADGE_KIND_INFO[value.kind];
    if (value.goal < info.min || value.goal > info.max) {
      const unit = info.unit ? ` ${info.unit}` : "";
      ctx.addIssue({ code: "custom", path: ["goal"], message: value.kind === "level_test" ? `Chọn cấp từ ${info.min} đến ${info.max}.` : `Mức cần đạt từ ${info.min} đến ${info.max}${unit}.` });
    }
  });

/** Đọc cột `condition` của một huy hiệu; không hợp lệ (vd huy hiệu trùm `kind: "boss"`) thì null. */
export function parseBadgeCondition(raw: unknown): BadgeCondition | null {
  const parsed = badgeConditionSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

/** Mở một quà sticker: mã dòng `learner_rewards`. */
export const openRewardInputSchema = z.object({ id: rewardCode });
export type OpenRewardInput = z.infer<typeof openRewardInputSchema>;

/** Sticker vừa rơi ở cuối bài (chưa mở): đủ để hiện hộp quà và mở. */
export type StickerGift = {
  /** Mã dòng `learner_rewards` (dùng để mở quà). */
  id: number;
  key: string;
  en: string;
  vi: string;
  album: string;
  albumVi: string;
  image: string | null;
  coins: number;
};

/** Huy hiệu thành tích vừa đạt (đã cấp, xu đã cộng). */
export type EarnedBadge = { code: string; en: string; vi: string; kind: (typeof BADGE_KINDS)[number]; goal: number; coins: number };

/** Kết quả mở quà. */
export type OpenedReward = { coins: number; en: string; vi: string; album: string; albumVi: string };
