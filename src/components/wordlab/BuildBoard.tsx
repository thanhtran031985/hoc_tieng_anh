"use client";

import { Icon, Mascot, SpeakerButton, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { BuildPhase } from "@/lib/rules/build-flow";
import { splitRime } from "@/lib/rules/word-family";
import type { SpeechAccent } from "@/lib/speech";
import styles from "./BuildBoard.module.css";

/** Một từ thật ghép được: chữ đầu, từ và dữ liệu hiện ở ô kết quả và “Đã tìm được”. */
export type BuildBoardWord = { wordId: number; onset: string; word: string; image: string | null; meaningVi: string; hasExplorer?: boolean };

export type BuildBoardProps = {
  /** Vần cố định bên phải ô trống. */
  rime: string;
  /** Hàng chữ đầu (đã gồm chữ nhiễu). */
  tiles: readonly string[];
  /** Chữ đầu đang ở ô trống (rỗng nếu chưa đặt). */
  slot: string;
  phase: BuildPhase;
  /** Từ thật ứng với chữ ở ô trống (có khi phase là ok hoặc again). */
  slotWord: BuildBoardWord | null;
  /** Chữ được gợi ý (viền sáng). */
  hint: string | null;
  /** “Từ cần ghép đầu tiên” (mở từ thẻ ở Họ vần), chưa tìm được. */
  target: BuildBoardWord | null;
  /** Các từ đã tìm, theo thứ tự tìm được. */
  found: readonly BuildBoardWord[];
  goal: number;
  /** Lời nhắc khi bé gõ chữ không có trong hàng chữ. */
  message: string;
  /** Chữ đầu vừa được thêm vào “Đã tìm được” (chip nảy lên). */
  fresh?: string | null;
  /** Ô chữ đang được kéo (mờ đi) và ô trống đang được thả lên (sáng nền). */
  dragging?: string | null;
  over?: boolean;
  accent?: SpeechAccent;
  /** Ô chữ đang được kéo theo con trỏ (toạ độ màn hình). */
  ghost?: { onset: string; x: number; y: number } | null;
  slotRef?: React.Ref<HTMLDivElement>;
  /** Bắt đầu bấm hoặc kéo một ô chữ. */
  onTilePointerDown?: (event: React.PointerEvent<HTMLButtonElement>, onset: string) => void;
  onTile?: (onset: string) => void;
  /** Bấm một từ trong “Đã tìm được” (tự khám phá: mở Khám phá của từ); bỏ trống thì chip không bấm được. */
  onOpenFound?: (word: BuildBoardWord) => void;
};

/**
 * Ghép chữ đầu (Screen51): hàng ô chữ đầu bên trái, ô trống + vần cố định ở giữa, ô kết quả bên phải, thanh “Đã tìm được” bên dưới.
 * Chỉ vẽ; luồng và phím do `BuildPlayer` lo.
 */
export function BuildBoard({ rime, tiles, slot, phase, slotWord, hint, target, found, goal, message, fresh = null, dragging = null, over = false, accent, ghost = null, slotRef, onTilePointerDown, onTile, onOpenFound }: BuildBoardProps) {
  const done = found.length >= goal && goal > 0;
  const slotsCount = Math.max(goal, found.length);
  const shown = slotWord && (phase === "ok" || phase === "again") ? slotWord : null;

  return (
    <div className={styles.bd} data-build>
      <div className={styles.row}>
        <div className={styles.letters} role="group" aria-label="Chữ đầu: kéo vào ô trống, bấm, hoặc gõ chữ trên bàn phím">
          {tiles.map((letter) => (
            <button
              key={letter}
              type="button"
              className={cn(styles.tile, (slot === letter || dragging === letter) && styles.used, hint === letter && styles.glow, target?.onset === letter && styles.target)}
              data-letter={letter}
              lang="en"
              aria-label={`Chữ ${letter}`}
              aria-keyshortcuts={letter.split("").join(" ")}
              onPointerDown={(event) => onTilePointerDown?.(event, letter)}
              onClick={(event) => {
                // Bấm bằng bàn phím (Enter) mới có `detail` bằng 0; chuột và chạm đã xử lý ở pointer.
                if (event.detail === 0) onTile?.(letter);
              }}
            >
              {letter}
            </button>
          ))}
        </div>
        <span className={styles.arrow} aria-hidden="true">
          <Icon name="next" size={34} />
        </span>
        <div className={styles.eq}>
          <div
            ref={slotRef}
            className={cn(styles.slot, slot && styles.filled, over && styles.over, phase === "fake" && styles.fake, (phase === "ok" || phase === "again") && styles.ok)}
            data-slot
            lang="en"
            aria-label={`Ô chữ đầu: ${slot || "trống"}`}
          >
            {slot}
          </div>
          <div className={styles.rime} lang="en" aria-label={`Vần ${rime}`}>
            {rime}
          </div>
        </div>

        {phase === "ok" && shown ? (
          <div className={cn(styles.res, styles.resOk)} role="status">
            <WordPicture word={shown.word} src={shown.image} size={112} label={`Hình: ${shown.meaningVi}`} />
            <b lang="en">
              <RimeText word={shown.word} rime={rime} />
            </b>
            <SpeakerButton word={shown.word} size="s" accent={accent} />
            <span>{shown.meaningVi}</span>
          </div>
        ) : phase === "again" && shown ? (
          <div className={styles.res} role="status">
            <WordPicture word={shown.word} src={shown.image} size={96} label={`Hình: ${shown.meaningVi}`} />
            <b lang="en">{shown.word}</b>
            <span>Cậu tìm được từ này rồi! Thử chữ khác nhé.</span>
          </div>
        ) : phase === "fake" ? (
          <div className={cn(styles.res, styles.resFake)} role="status">
            <Mascot expr="dongvien" size={84} />
            <p>
              <b lang="en">{slot + rime}</b> — Từ này không có trong tiếng Anh, thử chữ khác nhé.
            </p>
          </div>
        ) : target ? (
          <div className={cn(styles.res, styles.resTarget)}>
            <WordPicture word={target.word} src={target.image} size={96} label={`Hình: ${target.meaningVi}`} />
            <span className={styles.targetLabel}>Từ cần ghép đầu tiên</span>
            <b lang="en">
              <RimeText word={target.word} rime={rime} />
            </b>
            <SpeakerButton word={target.word} size="s" accent={accent} />
          </div>
        ) : (
          <div className={cn(styles.res, styles.resIdle)}>
            <Mascot expr={done ? "chucmung" : "chao"} size={84} />
            <p aria-live="polite">{message || (done ? `Cậu tìm đủ ${goal} từ rồi! Tìm thêm nếu cậu muốn nhé.` : "Kéo một chữ vào ô trống, hoặc gõ chữ đó trên bàn phím.")}</p>
          </div>
        )}
      </div>

      {ghost && (
        <div className={styles.ghost} style={{ left: ghost.x, top: ghost.y }} aria-hidden="true" lang="en">
          {ghost.onset}
        </div>
      )}

      <section className={styles.found} aria-labelledby="build-found-title">
        <h3 id="build-found-title">
          <Icon name="star" size={22} />
          Đã tìm được{" "}
          <b>
            {found.length}/{goal}
          </b>
        </h3>
        <ol>
          {Array.from({ length: slotsCount }, (_, i) => {
            const w = found[i];
            if (!w) {
              return (
                <li key={`empty-${i}`}>
                  <span className={styles.empty} aria-label="Ô trống" />
                </li>
              );
            }
            const content = (
              <>
                <WordPicture word={w.word} src={w.image} size={34} label="" aria-hidden="true" />
                <b lang="en">
                  <RimeText word={w.word} rime={rime} />
                </b>
              </>
            );
            return (
              <li key={w.word}>
                {onOpenFound && w.hasExplorer ? (
                  <button type="button" className={cn(styles.chip, styles.link, fresh === w.onset && styles.fresh)} aria-label={`${w.word}: mở Khám phá từ ${w.word}`} onClick={() => onOpenFound(w)}>
                    {content}
                    <Icon name="branch" size={16} />
                  </button>
                ) : (
                  <span className={cn(styles.chip, fresh === w.onset && styles.fresh)} title={onOpenFound ? "Từ này chưa có Khám phá" : undefined}>
                    {content}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

/** Từ viết thường với phần vần tô màu. */
function RimeText({ word, rime }: { word: string; rime: string }) {
  const { before, rime: r, after } = splitRime(word, rime);
  return (
    <>
      {before}
      {r && <span className={styles.mark}>{r}</span>}
      {after}
    </>
  );
}
