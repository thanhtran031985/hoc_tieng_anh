"use client";

import { useState } from "react";
import { RewardPopup } from "@/components/rewards";
import { BADGE_KIND_INFO, conditionText } from "@/lib/rules/reward-catalog";
import type { EarnedBadge } from "@/lib/schemas";

/** Số cấp (1–10) cho màu lõi huy hiệu: loại có màu riêng, qua đảo lấy theo cấp của huy hiệu. */
export function badgeLevel(kind: EarnedBadge["kind"], goal: number): number {
  const info = BADGE_KIND_INFO[kind];
  return info.color === 0 ? Math.min(10, Math.max(1, goal)) : info.color;
}

/**
 * Hộp nhận huy hiệu thành tích vừa đạt, lần lượt từng cái (RewardPopup bỏ bước hộp quà, +xu đã cộng sẵn ở server).
 * "Cho vào bộ sưu tập" (Enter) sang huy hiệu kế; hết thì gọi `onDone`. `enabled` false thì chưa hiện.
 */
export function EarnedBadgePopups({ badges, enabled = true, onDone }: { badges: readonly EarnedBadge[]; enabled?: boolean; onDone?: () => void }) {
  const [index, setIndex] = useState(0);
  const badge = badges[index];
  if (!badge) return null;
  const info = BADGE_KIND_INFO[badge.kind];
  return (
    <RewardPopup
      open={enabled}
      kind="badge"
      icon={info.icon}
      level={badgeLevel(badge.kind, badge.goal)}
      en={badge.en}
      vi={badge.vi}
      cond={conditionText(badge.kind, badge.goal)}
      coins={badge.coins}
      skipGift
      onAdd={() => {
        if (index + 1 >= badges.length) onDone?.();
        setIndex(index + 1);
      }}
    />
  );
}
