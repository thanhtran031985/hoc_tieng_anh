"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonLink, Icon, Mascot, Skeleton, SpeakerButton, WordPicture, type MascotColor } from "@/components/ui";
import { cn } from "@/lib/cn";
import kid from "@/features/kid/kid.module.css";
import { KidTopbar, type KidTopbarProps } from "@/features/kid/KidTopbar";
import type { ReviewCompletion } from "@/lib/schemas";
import { useHotkeys } from "@/lib/use-hotkeys";
import styles from "./review-end.module.css";

export type ReviewSaveState = { status: "idle" } | { status: "ok"; completion: ReviewCompletion } | { status: "error"; message: string };

/** Số từ hiện chi tiết trong danh sách "lên hộp"; còn lại gộp thành một dòng. */
const SHOWN_MOVES = 3;
const BOX_COLORS = ["tím nhạt", "vàng", "xanh dương", "tím", "xanh lá"];

type Props = {
  topbar: KidTopbarProps;
  learnerName: string;
  mascot: MascotColor;
  levelNumber: number;
  /** Số liệu tính ngay trên máy (cùng hàm với server) để hiện thưởng khi chưa lưu xong hoặc lưu lỗi. */
  preview: ReviewCompletion;
  save: ReviewSaveState;
  onRetry: () => void;
};

function Hop({ from, to }: { from: number; to: number }) {
  return (
    <span className={styles.hop} role="img" aria-label={`Từ hộp ${from} lên hộp ${to}`}>
      <i style={{ "--m": `var(--mastery-${from})`, "--ms": `var(--mastery-${from}-soft)` } as React.CSSProperties}>{from}</i>
      <Icon name="next" size={20} />
      <i style={{ "--m": `var(--mastery-${to})`, "--ms": `var(--mastery-${to}-soft)` } as React.CSSProperties}>{to}</i>
    </span>
  );
}

/** Màn tổng kết ôn tập (Screen20): lời chúc, sao và xu, danh sách từ lên hộp, số từ về hộp 1. Lưu lỗi vẫn giữ kết quả và cho Thử lại. */
export function ReviewEnd({ topbar, learnerName, mascot, levelNumber, preview, save, onRetry }: Props) {
  const router = useRouter();
  const saving = save.status === "idle";
  const failed = save.status === "error";
  const result = save.status === "ok" ? save.completion : preview;
  useHotkeys({ Enter: () => (failed ? onRetry() : router.push("/home")) }, { enabled: !saving });

  const shown = result.up.slice(0, SHOWN_MOVES);
  const others = result.up.length - shown.length;
  const targets = new Set(result.up.map((m) => m.to));
  const targetName = targets.size === 1 ? `hộp ${BOX_COLORS[[...targets][0] - 1]}` : "hộp cao hơn";
  const primary = levelNumber <= 5;
  const reward = primary ? { value: `+${result.coins}`, label: "xu · thưởng ôn tập", icon: "coin" as const } : { value: `+${result.xp}`, label: "XP · thưởng ôn tập", icon: "star" as const };

  return (
    <div className={kid.screen} data-level={levelNumber} data-dragon={mascot}>
      <KidTopbar {...topbar} />
      <div className={styles.confetti} aria-hidden="true">
        {Array.from({ length: 22 }, (_, i) => (
          <i key={i} style={{ "--x": `${(i * 37) % 100}%`, "--d": `${(i % 7) * 0.35}s` } as React.CSSProperties} />
        ))}
      </div>
      <main className={styles.end}>
        <div className={styles.hero}>
          <Mascot expr={failed ? "dongvien" : saving ? "suynghi" : "chucmung"} className={styles.dragon} />
          <h1 className={styles.title}>
            {saving
              ? "Ôn xong rồi!"
              : `Hôm nay ${learnerName} đã ôn ${result.total} từ${result.up.length > 0 && !failed ? `, ${result.up.length} từ được chuyển lên ${targetName}!` : "!"}`}
          </h1>
          {saving && <p className={styles.sub}>Bông đang cất từ vào đúng hộp…</p>}
        </div>

        <section className={styles.card} aria-label="Kết quả ôn tập">
          <div className={styles.tiles}>
            {saving ? (
              [0, 1].map((i) => <Skeleton key={i} width="100%" height="var(--size-tile-h)" radius="lg" />)
            ) : (
              <>
                <div className={styles.tile}>
                  <Icon name="star" size={36} />
                  <b>+{result.stars}</b>
                  <span>sao · mỗi từ ôn 1 sao</span>
                </div>
                <div className={cn(styles.tile, styles.tileCoin)}>
                  <Icon name={reward.icon} size={36} />
                  <b>{reward.value}</b>
                  <span>{reward.label}</span>
                </div>
              </>
            )}
          </div>

          {failed && (
            <div className={styles.note} role="alert">
              <Icon name="wifi" size={28} />
              <div>
                <b>Chưa lưu được kết quả</b>
                <span>Đừng lo, kết quả ôn của bé vẫn được giữ trên máy.</span>
              </div>
            </div>
          )}

          {save.status === "ok" && shown.length > 0 && (
            <div className={styles.moves}>
              <h2 className={styles.movesTitle}>{targets.size === 1 ? `Lên ${targetName}` : "Từ lên hộp"}</h2>
              <ul className={styles.moveList}>
                {shown.map((m) => (
                  <li key={m.wordId} className={styles.mv}>
                    <WordPicture word={m.word} src={m.image} size={48} label="" aria-hidden="true" />
                    <span className={styles.mvText}>
                      <span className={styles.mvEn}>
                        <SpeakerButton word={m.word} size="s" />
                        <b lang="en">{m.word}</b>
                      </span>
                      <span className={styles.mvVi}>{m.meaningVi}</span>
                    </span>
                    <Hop from={m.from} to={m.to} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {save.status === "ok" && (others > 0 || result.back > 0) && (
            <ul className={styles.rest}>
              {others > 0 && (
                <li>
                  <span className={styles.restOk}>
                    <Icon name="check" size={20} />
                  </span>
                  {others} từ khác lên hộp tiếp theo
                </li>
              )}
              {result.back > 0 && (
                <li>
                  <span className={styles.restBack}>
                    <Icon name="replay" size={20} />
                  </span>
                  {result.back} từ về hộp 1 để ôn sớm hơn
                </li>
              )}
            </ul>
          )}

          <div className={styles.acts}>
            {failed ? (
              <Button size="l" icon="replay" label="Thử lại" shortcut="Enter" onClick={onRetry} />
            ) : (
              <ButtonLink href="/home" size="l" icon="house" label="Về trang chủ" shortcut="Enter" aria-disabled={saving || undefined} onClick={(event) => saving && event.preventDefault()} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
