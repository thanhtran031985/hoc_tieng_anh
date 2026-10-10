"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RewardPopup } from "@/components/rewards";
import { Button, Icon, ProgressBar, type MascotColor } from "@/components/ui";
import { openRewardAction } from "@/features/rewards/actions";
import kid from "@/features/kid/kid.module.css";
import { KidTopbar, type KidTopbarProps } from "@/features/kid/KidTopbar";
import { cn } from "@/lib/cn";
import type { StickerGift } from "@/lib/schemas";
import type { CollectionData } from "@/server/collection";
import { BadgeGrid } from "./BadgeGrid";
import { StickerBook } from "./StickerBook";
import styles from "./collection.module.css";

export type CollectionTab = "stickers" | "badges";

type Props = { topbar: KidTopbarProps; mascot: MascotColor; data: CollectionData; initialTab: CollectionTab };

/** Bộ sưu tập (Screen38–39): hai tab Sticker và Huy hiệu, tổng “đã có/tổng” kèm thanh tiến độ, và quà sticker chưa mở (mở bằng hộp nhận quà). */
export function CollectionView({ topbar, mascot, data, initialTab }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<CollectionTab>(initialTab);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gift, setGift] = useState<{ gift: StickerGift; coins: number } | null>(null);
  const waiting = data.pending[0];

  async function openPending() {
    if (!waiting || opening) return;
    setOpening(true);
    setError(null);
    try {
      const res = await openRewardAction({ id: waiting.id });
      if (res.ok) setGift({ gift: waiting, coins: res.reward.coins });
      else setError(res.message);
    } catch {
      setError("Mất kết nối. Bé thử mở lại nhé, quà vẫn được giữ!");
    }
    setOpening(false);
  }

  const have = tab === "stickers" ? data.stickersHave : data.badgesHave;
  const total = tab === "stickers" ? data.stickersTotal : data.badgesTotal;
  const unit = tab === "stickers" ? "sticker" : "huy hiệu";

  return (
    <div className={kid.screen} data-level={topbar.learner.level} data-dragon={mascot}>
      <KidTopbar {...topbar} backHref="/home" backLabel="Về trang chủ" />
      <main className={styles.cw}>
        <div className={styles.ch}>
          <h1 className={styles.title}>Bộ sưu tập</h1>
          <div className={styles.tabs} role="tablist" aria-label="Bộ sưu tập">
            <button type="button" role="tab" aria-selected={tab === "stickers"} className={cn(styles.tab, tab === "stickers" && styles.tabOn)} onClick={() => setTab("stickers")}>
              <Icon name="gem" size={22} />
              Sticker
            </button>
            <button type="button" role="tab" aria-selected={tab === "badges"} className={cn(styles.tab, tab === "badges" && styles.tabOn)} onClick={() => setTab("badges")}>
              <Icon name="medal" size={22} />
              Huy hiệu
            </button>
          </div>
          <div className={styles.total}>
            <b>
              {have}/{total}
            </b>
            <span>{unit}</span>
            <ProgressBar value={have} max={Math.max(1, total)} size="s" label={`Đã có ${have} trên ${total} ${unit}`} />
          </div>
        </div>

        {waiting && (
          <div className={styles.pending} role="status">
            <Icon name="gift" size={32} />
            <span>
              Bé có <b>{data.pending.length} quà</b> chưa mở!
              {error ? <span className={styles.pendingError}> {error}</span> : null}
            </span>
            <Button size="m" icon="gift" label={opening ? "Đang mở…" : "Mở quà"} disabled={opening} onClick={() => void openPending()} />
          </div>
        )}

        {tab === "stickers" ? <StickerBook data={data} /> : <BadgeGrid badges={data.badges} />}
      </main>
      {gift && (
        <RewardPopup
          open
          kind="sticker"
          word={gift.gift.key}
          src={gift.gift.image}
          en={gift.gift.en}
          vi={gift.gift.vi}
          coins={gift.coins}
          skipGift
          onAdd={() => {
            setGift(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
