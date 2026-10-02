"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, Bubble, Dialog, Icon, Mascot, type AvatarHair } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { LevelStop } from "@/server/map";
import { LevelArt } from "./LevelArt";
import { stopPosition } from "./level-layout";
import { LevelsRoad } from "./LevelsRoad";
import styles from "./levels.module.css";

export type LevelsMapProps = {
  levels: LevelStop[];
  learner: { name: string; level: number; hair: AvatarHair };
  /** Bé mới, chưa xong bài nào: hiện lời gợi ý của Bông. */
  showTip: boolean;
};

const placeName = (level: LevelStop) => `${level.number <= 5 ? "Đảo " : ""}${level.name}`;

function stopLabel(level: LevelStop): string {
  const state = level.status === "past" ? "đã qua" : level.status === "current" ? "bé đang ở đây" : "còn khoá";
  return `Cấp ${level.number} ${level.name}, ${state}`;
}

/** Tổng quan 10 cấp: bấm cấp đang học để vào bản đồ; cấp đã qua hỏi ôn lại; cấp còn khóa được giải thích nhẹ nhàng. */
export function LevelsMap({ levels, learner, showTip }: LevelsMapProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<LevelStop | null>(null);
  const [open, setOpen] = useState(false);

  const go = (level: LevelStop) => router.push(`/map/${level.number}`);
  function choose(level: LevelStop) {
    if (level.status === "current") return go(level);
    setSelected(level);
    setOpen(true);
  }

  const shown = selected ?? levels[0];
  const locked = shown.status === "locked";

  return (
    <div className={styles.lvw}>
      <div className={styles.lvmap}>
        <LevelsRoad />

        {levels.map((level) => (
          <button
            key={level.number}
            type="button"
            className={cn(styles.stop, level.status === "past" && styles.done, level.status === "current" && styles.cur, level.status === "locked" && styles.locked)}
            data-level={level.number}
            style={stopPosition(level.number)}
            aria-label={stopLabel(level)}
            onClick={() => choose(level)}
          >
            <LevelArt level={level.number} className={styles.art} />
            {level.status === "past" && (
              <span className={styles.badge}>
                <Icon name="check" size={24} />
              </span>
            )}
            {level.status === "locked" && (
              <span className={styles.badge}>
                <Icon name="lock" size={20} />
              </span>
            )}
            {level.status === "current" && (
              <span className={styles.pin}>
                <span className={styles.pinIn}>
                  <span className={styles.here}>Bé đang ở đây</span>
                  <Avatar name={learner.name} level={learner.level} hair={learner.hair} size={56} className={styles.pinAvatar} />
                </span>
              </span>
            )}
            <span className={styles.lab}>
              {level.number} <b>{level.name}</b>
            </span>
          </button>
        ))}

        <span className={styles.zone} style={{ left: "2%", top: "93%" }}>
          Tiểu học · 5 hòn đảo
        </span>
        <span className={styles.zone} style={{ left: "2%", top: "2%" }}>
          THCS · 5 thành phố
        </span>
      </div>

      <div className={styles.legend} aria-hidden="true">
        <span>
          <i className={styles.legendDone}>
            <Icon name="check" size={14} />
          </i>
          Đã qua
        </span>
        <span>
          <i className={styles.legendNow} />
          Đang học
        </span>
        <span>
          <i className={styles.legendLocked}>
            <Icon name="lock" size={12} />
          </i>
          Còn khoá
        </span>
      </div>

      {showTip && (
        <div className={styles.tip}>
          <Bubble className={styles.tipBubble}>
            Hành trình bắt đầu từ <b>đảo {levels[0].name}</b>. Đi thôi!
          </Bubble>
          <Mascot expr="vui" size={120} />
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        expr={locked ? "suynghi" : "vui"}
        title={locked ? `${placeName(shown)} còn khoá` : `Ôn lại ${shown.name}?`}
        body={locked ? "Bé học xong cấp đang học là mở được ngay. Cố lên nhé!" : "Bé đã qua cấp này rồi. Ôn lại để giữ sao thật sáng nhé!"}
        actions={
          locked
            ? [{ label: "Đã hiểu", variant: "primary", shortcut: "Enter" }]
            : [
                { label: "Ôn lại", variant: "primary", shortcut: "Enter", onClick: () => go(shown) },
                { label: "Để sau", variant: "secondary" },
              ]
        }
      />
    </div>
  );
}
