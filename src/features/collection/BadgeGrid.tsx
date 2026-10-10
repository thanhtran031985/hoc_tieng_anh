"use client";

import { useState } from "react";
import { Medal } from "@/components/rewards";
import { Dialog, Icon, ProgressBar, SpeakerButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { CollectionBadge } from "@/server/collection";
import styles from "./collection.module.css";

const NAME_RATE = 0.85;

function label(b: CollectionBadge): string {
  if (b.earned) return `${b.vi}, đã nhận ngày ${b.date}`;
  const progress = b.progress ? `, ${b.progress.have} trên ${b.progress.goal} ${b.progress.unit}` : "";
  return `${b.vi}, chưa đạt, ${b.cond}${progress}`;
}

/** Tab Huy hiệu (Screen39): lưới huy hiệu; đã nhận có vành vàng và ngày nhận, chưa đạt có điều kiện + thanh tiến độ kèm số. Bấm hoặc Enter mở thẻ chi tiết, Esc đóng. */
export function BadgeGrid({ badges }: { badges: CollectionBadge[] }) {
  const [shown, setShown] = useState<CollectionBadge | null>(null);
  const [open, setOpen] = useState(false);

  function show(b: CollectionBadge) {
    setShown(b);
    setOpen(true);
  }

  return (
    <>
      <div className={styles.bg} role="list">
        {badges.map((b) => (
          <div key={b.code} role="listitem" className={styles.bdItem}>
            <button type="button" className={cn(styles.bd, b.earned ? styles.bdOn : styles.bdLocked)} aria-label={label(b)} onClick={() => show(b)}>
              {b.earned && b.isNew && <span className={styles.newTag}>Mới</span>}
              <Medal icon={b.icon} level={b.level} earned={b.earned} size={96} />
              <b>{b.vi}</b>
              {b.earned ? (
                <span className={styles.sub}>Nhận ngày {b.date}</span>
              ) : b.progress ? (
                <span className={styles.pr}>
                  <span>
                    {b.progress.have}/{b.progress.goal} {b.progress.unit}
                  </span>
                  <ProgressBar value={b.progress.have} max={b.progress.goal} size="s" label={`${b.vi}: ${b.progress.have} trên ${b.progress.goal} ${b.progress.unit}`} />
                </span>
              ) : (
                <span className={styles.sub}>{b.cond}</span>
              )}
            </button>
          </div>
        ))}
      </div>
      <Dialog
        open={open && shown !== null}
        onClose={() => setOpen(false)}
        title={shown?.vi ?? ""}
        art={shown ? <span className={styles.dmedal}><Medal icon={shown.icon} level={shown.level} earned={shown.earned} size={140} /></span> : undefined}
        body={
          shown && (
            <span className={styles.dt}>
              <span className={styles.en} lang="en">
                {shown.en}
                <SpeakerButton word={shown.en} size="s" rate={NAME_RATE} />
              </span>
              <span className={styles.chips}>
                <span className={styles.chip}>
                  <Icon name="check" size={18} />
                  {shown.cond}
                </span>
                {shown.coins > 0 && (
                  <span className={styles.chip}>
                    <Icon name="coin" size={20} />
                    +{shown.coins} xu
                  </span>
                )}
              </span>
              {shown.earned ? (
                <span className={styles.dtText}>
                  Bé nhận huy hiệu này ngày <b>{shown.date}</b>. Giỏi quá!
                </span>
              ) : shown.progress ? (
                <span className={styles.dtProgress}>
                  <b>
                    {shown.progress.have}/{shown.progress.goal} {shown.progress.unit} · còn {shown.progress.goal - shown.progress.have} {shown.progress.unit} nữa
                  </b>
                  <ProgressBar value={shown.progress.have} max={shown.progress.goal} size="s" label={`Tiến độ ${shown.progress.have} trên ${shown.progress.goal} ${shown.progress.unit}`} />
                </span>
              ) : (
                <span className={styles.dtText}>Cố lên, bé sắp có rồi!</span>
              )}
            </span>
          )
        }
        actions={[{ label: "Đóng", variant: "primary", shortcut: "Enter" }]}
      />
    </>
  );
}
