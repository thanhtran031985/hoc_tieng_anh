"use client";

import { useEffect, useRef, useState } from "react";
import { Sticker } from "@/components/rewards";
import { Bubble, Button, Icon, SpeakerButton, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import { playPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import type { CollectionData } from "@/server/collection";
import styles from "./collection.module.css";

/** Độ nghiêng nhẹ của 6 ô mỗi trang (độ), theo thiết kế. */
const TILT = [-4, 3, -2, 4, -3, 2] as const;
/** Tốc độ đọc tên sticker, chậm hơn một chút cho bé nghe rõ. */
const NAME_RATE = 0.85;
const TIP_MS = 2600;

/**
 * Tab Sticker (Screen38): album bên trái (tab dọc, ↑ ↓), trang bên phải 6 ô, ← → đổi trang. Sticker đã có bấm để nghe; ô chưa có là bóng mờ, bấm xem cách nhận.
 */
export function StickerBook({ data }: { data: CollectionData }) {
  const { albums } = data;
  const [page, setPage] = useState(0);
  const [tip, setTip] = useState<{ text: string; cell: number } | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const album = albums[Math.min(page, albums.length - 1)];

  useEffect(() => {
    if (!tip) return;
    const timer = window.setTimeout(() => setTip(null), TIP_MS);
    return () => window.clearTimeout(timer);
  }, [tip]);

  function go(next: number, focus?: "tab" | "nav") {
    const clamped = Math.max(0, Math.min(albums.length - 1, next));
    setPage(clamped);
    setTip(null);
    if (focus === "tab") window.setTimeout(() => tabRefs.current[clamped]?.focus(), 0);
  }

  useHotkeys({ ArrowLeft: () => go(page - 1), ArrowRight: () => go(page + 1) });

  if (!album) return null;
  const empty = data.stickersHave === 0;

  return (
    <>
      {empty && (
        <Bubble tail="left" className={styles.emptyBubble}>
          Album còn trống! Học xong một bài là có thể nhận <b>sticker bất ngờ</b> đó.
        </Bubble>
      )}
      <div className={styles.book}>
        <nav className={styles.idx} aria-label="Các album">
          <h2 className={styles.idxTitle}>Album</h2>
          <div role="tablist" aria-orientation="vertical" className={styles.albums}>
            {albums.map((a, i) => (
              <button
                key={a.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={i === page}
                tabIndex={i === page ? 0 : -1}
                className={styles.al}
                style={{ "--a": a.tint } as React.CSSProperties}
                onClick={() => go(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    e.preventDefault();
                    e.stopPropagation();
                    go(i + (e.key === "ArrowDown" ? 1 : -1), "tab");
                  }
                }}
              >
                <span className={styles.alIcon}>
                  <WordPicture word={a.items[0].key} src={a.items[0].image} size={44} label="" aria-hidden="true" />
                </span>
                <span className={styles.alText}>
                  <b>{a.vi}</b>
                  <small>
                    {a.have}/{a.items.length} sticker
                  </small>
                  <span className={styles.mini} aria-hidden="true">
                    <span style={{ width: `${(100 * a.have) / Math.max(1, a.items.length)}%` }} />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </nav>
        <div className={styles.rings} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} />
          ))}
        </div>
        <section className={styles.page} style={{ "--a": album.tint } as React.CSSProperties} aria-labelledby="album-title">
          <div className={styles.band}>
            <h2 className={styles.albumTitle} id="album-title">
              {album.vi} <span lang="en">{album.en}</span>
            </h2>
            <div className={styles.nav}>
              <Button variant="secondary" size="m" icon="back" aria-label="Trang trước (phím ←)" aria-keyshortcuts="ArrowLeft" disabled={page === 0} onClick={() => go(page - 1)} />
              <span className={styles.pn} aria-live="polite">
                Trang {page + 1}/{albums.length}
              </span>
              <Button variant="secondary" size="m" icon="next" aria-label="Trang sau (phím →)" aria-keyshortcuts="ArrowRight" disabled={page === albums.length - 1} onClick={() => go(page + 1)} />
            </div>
          </div>
          <div className={styles.grid}>
            {album.items.map((s, i) => (
              <div key={s.code} className={styles.cell}>
                <Sticker
                  word={s.key}
                  src={s.image}
                  owned={s.owned}
                  isNew={s.isNew}
                  tilt={TILT[i % TILT.length]}
                  size={120}
                  label={s.owned ? `Sticker ${s.en}, ${s.vi}${s.isNew ? ", mới" : ""}` : "Sticker chưa có, bấm để xem cách nhận"}
                  onClick={() => (s.owned ? playPronunciation(s.en, { rate: NAME_RATE }) : setTip({ text: `Học bài ở ${album.from} để có cơ hội nhận sticker này!`, cell: i }))}
                />
                {s.owned ? (
                  <span className={styles.lab}>
                    <SpeakerButton word={s.en} rate={NAME_RATE} size="s" label={`Nghe: ${s.en}`} />
                    <span>
                      <b lang="en">{s.en}</b>
                      <small>{s.vi}</small>
                    </span>
                  </span>
                ) : (
                  <span className={cn(styles.lab, styles.labQ)}>
                    <Icon name="lock" size={18} />
                    Chưa có
                  </span>
                )}
                {tip?.cell === i && (
                  <span className={styles.tip} role="status">
                    {tip.text}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className={styles.gk}>
            <Icon name="bulb" size={20} />
            Sticker {album.vi.toLowerCase()} rơi bất ngờ khi bé học xong bài ở {album.from}.
          </p>
        </section>
      </div>
    </>
  );
}
