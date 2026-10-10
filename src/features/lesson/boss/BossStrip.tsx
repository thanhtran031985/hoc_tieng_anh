"use client";

import { BossArt, type BossMood } from "@/components/lesson";
import { Mascot } from "@/components/ui";
import type { Boss } from "@/lib/rules/bosses";
import styles from "./boss.module.css";

export type BossBeat = { mood: BossMood; line: string; n: number };

/**
 * Dải trên cùng của trận trùm (Screen33): trùm, thanh “Năng lượng của trùm” (luôn kèm số n/N để không chỉ dựa vào màu) và Bông.
 * Mỗi câu đúng làm năng lượng giảm một nấc; trùm lắc khi trúng chiêu, trêu nhẹ khi bé từng sai; không bao giờ có màn thua.
 */
export function BossStrip({ boss, energy, total, beat }: { boss: Pick<Boss, "name" | "accessory" | "fur">; energy: number; total: number; beat: BossBeat }) {
  const pct = total > 0 ? Math.round((energy / total) * 100) : 0;
  return (
    <div className={styles.strip}>
      <BossArt key={beat.n} boss={boss} mood={beat.mood} size={96} />
      <div className={styles.energy}>
        <div className={styles.top}>
          <span>Năng lượng của trùm</span>
          <b>
            {energy}/{total}
          </b>
        </div>
        <div className={styles.track} role="progressbar" aria-label="Năng lượng của trùm" aria-valuemin={0} aria-valuemax={total} aria-valuenow={energy} aria-valuetext={`${energy} trên ${total}`}>
          <span style={{ width: `${pct}%` }} />
        </div>
        <p className={styles.taunt} aria-live="polite">
          {beat.line}
        </p>
      </div>
      <Mascot expr={beat.mood === "hit" ? "vui" : "chao"} size={72} />
    </div>
  );
}
