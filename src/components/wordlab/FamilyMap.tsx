"use client";

import { useLayoutEffect, useRef } from "react";
import { Icon, Mascot, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import { cardNav, splitRime, type FamilyMemberView, type FamilyTrapView } from "@/lib/rules/word-family";
import styles from "./FamilyMap.module.css";

export type FamilyMapProps = {
  /** Vần của họ (“at”) và âm của cả họ (“/æt/”). */
  pattern: string;
  soundIpa: string;
  members: readonly FamilyMemberView[];
  traps: readonly FamilyTrapView[];
  /** Lời Bông giải thích ô “Bẫy chính tả”. */
  trapNote: string;
  /** Các từ bé đã nghe (hiện dấu tích). */
  heard?: readonly number[];
  /** Thẻ đang được đọc trong lượt “nghe cả họ”, và vần ở giữa đang đọc. */
  playing?: number | null;
  hubPlaying?: boolean;
  /** Thẻ được gợi ý (viền sáng), và thẻ được tô nổi (từ đang xem ở Sổ từ). */
  glow?: number | null;
  hl?: number | null;
  /** Hiện nút “Ghép” và “Khám phá” ở thẻ (tự khám phá; trong bài thì ẩn). */
  showActions?: boolean;
  /** Nút đi tiếp (“Ghép”, “Khám phá”) của thẻ bị khóa khi đường dẫn đã đủ bậc. */
  isLocked?: (kind: "build" | "explore", wordId: number) => boolean;
  /** Thu gọn (Sổ từ): thẻ và vần nhỏ hơn. */
  compact?: boolean;
  /** Ẩn ô Bẫy chính tả (đặt riêng chỗ khác). */
  noTrap?: boolean;
  onSay?: (wordId: number) => void;
  onHub?: () => void;
  onTrap?: (wordId: number) => void;
  onBuild?: (wordId: number) => void;
  onExplore?: (wordId: number) => void;
  className?: string;
};

/** Chữ của từ với phần vần tô màu (`rime-ink` trên `rime-bg`); `trap` thì gạch lượn sóng thay vì tô. */
function RimeWord({ word, pattern, trap }: { word: string; pattern: string; trap?: boolean }) {
  const { before, rime, after } = splitRime(word, pattern);
  return (
    <span lang="en">
      {before}
      {rime && <span className={trap ? styles.mark : styles.rime}>{rime}</span>}
      {after}
    </span>
  );
}

/**
 * Họ vần (Screen50): vần ở giữa (bấm để nghe cả họ), các thẻ từ cùng âm hai bên, ô “Bẫy chính tả” bên cạnh.
 * Từ bé chưa học: thẻ mờ nét đứt, nhãn “Sắp học”, vẫn nghe được. ← → đi giữa các thẻ (không vòng quanh).
 */
export function FamilyMap({
  pattern,
  soundIpa,
  members,
  traps,
  trapNote,
  heard = [],
  playing = null,
  hubPlaying = false,
  glow = null,
  hl = null,
  showActions = false,
  isLocked,
  compact,
  noTrap,
  onSay,
  onHub,
  onTrap,
  onBuild,
  onExplore,
  className,
}: FamilyMapProps) {
  const ringRef = useRef<HTMLDivElement>(null);
  const half = Math.ceil(members.length / 2);

  // Đường nối vần ở giữa tới từng thẻ, đo từ bố cục thật; vẽ lại khi khung đổi cỡ.
  useLayoutEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    function draw() {
      const el = ring;
      const svg = el?.querySelector<SVGSVGElement>("[data-lines]");
      const hub = el?.querySelector<HTMLElement>("[data-fhub]");
      if (!el || !svg || !hub) return;
      const box = el.getBoundingClientRect();
      if (box.width === 0) return;
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      svg.setAttribute("width", String(box.width));
      svg.setAttribute("height", String(box.height));
      const h = hub.getBoundingClientRect();
      const cx = h.left - box.left + h.width / 2;
      const cy = h.top - box.top + h.height / 2;
      el.querySelectorAll<HTMLElement>("[data-fw]").forEach((card) => {
        const r = card.getBoundingClientRect();
        const path = svg.querySelector(`[data-path="${card.dataset.fw}"]`);
        path?.setAttribute("d", `M${cx} ${cy} L${r.left - box.left + r.width / 2} ${r.top - box.top + r.height / 2}`);
      });
    }
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(ring);
    return () => observer.disconnect();
  }, [members, compact]);

  function moveBetweenCards(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const target = event.target as HTMLElement;
    if (!target.matches("[data-fsay]")) return;
    const all = [...event.currentTarget.querySelectorAll<HTMLElement>("[data-fsay]")];
    const at = all.indexOf(target);
    if (at < 0) return;
    event.preventDefault();
    all[cardNav(at, event.key, all.length)]?.focus({ preventScroll: true });
  }

  function card(m: FamilyMemberView) {
    const isHeard = heard.includes(m.wordId);
    return (
      <li
        key={m.wordId}
        className={cn(styles.card, !m.learned && styles.soon, hl === m.wordId && styles.hl, isHeard && styles.heard, glow === m.wordId && styles.glow, playing === m.wordId && styles.playing)}
        data-fw={m.wordId}
      >
        <button
          type="button"
          className={styles.main}
          data-fsay={m.wordId}
          aria-label={`${m.word}${m.partOfSpeech ? `, ${m.partOfSpeech}` : ""}, nghĩa: ${m.meaningVi}${m.learned ? "" : ", sắp học"}${isHeard ? ", đã nghe" : ""}. Bấm để nghe.`}
          onClick={() => onSay?.(m.wordId)}
        >
          <span className={styles.pic}>
            <WordPicture word={m.word} src={m.image} size={60} label="" aria-hidden="true" />
          </span>
          <span className={styles.w}>
            <RimeWord word={m.word} pattern={pattern} />
          </span>
          {m.ipa && <span className={styles.ipa}>{m.ipa}</span>}
          {m.partOfSpeech && <span className={styles.pos}>{m.partOfSpeech}</span>}
          <span className={styles.vi}>{m.meaningVi}</span>
        </button>
        {!m.learned && (
          <span className={styles.soonTag} aria-hidden="true">
            Sắp học
          </span>
        )}
        {isHeard && (
          <span className={styles.tick} aria-hidden="true">
            <Icon name="check" size={16} />
          </span>
        )}
        {showActions && ((m.buildable && onBuild) || (m.hasExplorer && onExplore)) && (
          <div className={styles.go}>
            {m.buildable && onBuild && (
              <button type="button" className={styles.mini} disabled={isLocked?.("build", m.wordId)} aria-label={`Ghép từ ${m.word} ở màn Ghép chữ đầu`} onClick={() => onBuild(m.wordId)}>
                <Icon name="blocks" size={16} />
                Ghép
              </button>
            )}
            {m.hasExplorer && onExplore && (
              <button type="button" className={styles.mini} disabled={isLocked?.("explore", m.wordId)} aria-label={`Khám phá từ ${m.word}`} onClick={() => onExplore(m.wordId)}>
                <Icon name="branch" size={16} />
                Khám phá
              </button>
            )}
          </div>
        )}
      </li>
    );
  }

  return (
    <div className={cn(styles.fam, compact && styles.compact, noTrap && styles.noTrap, className)} data-fam>
      <div ref={ringRef} className={styles.ring} onKeyDown={moveBetweenCards}>
        <svg className={styles.lines} data-lines aria-hidden="true">
          {members.map((m) => (
            <path key={m.wordId} data-path={m.wordId} className={m.learned ? undefined : styles.dash} />
          ))}
        </svg>
        <ul className={styles.side} aria-label={`Từ trong họ -${pattern} (1)`}>
          {members.slice(0, half).map(card)}
        </ul>
        <button type="button" className={cn(styles.hub, hubPlaying && styles.hubPlaying)} data-fhub aria-label={`Vần ${pattern}, đọc ${soundIpa}. Bấm để nghe lần lượt cả họ.`} onClick={() => onHub?.()}>
          <span className={styles.hubRime} lang="en">
            -{pattern}
          </span>
          <span className={styles.hubIpa}>{soundIpa}</span>
          <span className={styles.hubCap}>
            <Icon name="speaker" size={18} />
            Nghe cả họ
          </span>
        </button>
        <ul className={styles.side} aria-label={`Từ trong họ -${pattern} (2)`}>
          {members.slice(half).map(card)}
        </ul>
      </div>

      {!noTrap && traps.length > 0 && (
        <aside className={styles.trap} aria-labelledby="family-trap-title">
          <h3 className={styles.trapTitle} id="family-trap-title">
            <Icon name="bulb" size={20} />
            Bẫy chính tả
          </h3>
          <ul className={styles.trapList}>
            {traps.map((t) => (
              <li key={t.wordId}>
                <button type="button" className={styles.trapWord} aria-label={`Từ bẫy ${t.word}${t.ipa ? `, đọc ${t.ipa}` : ""}, nghĩa: ${t.meaningVi}. Bấm để nghe.`} onClick={() => onTrap?.(t.wordId)}>
                  <b>
                    <RimeWord word={t.word} pattern={pattern} trap />
                  </b>
                  {t.ipa && <span className={styles.trapIpa}>{t.ipa}</span>}
                  <span className={styles.trapVi}>{t.meaningVi}</span>
                  <Icon name="speaker" size={18} />
                </button>
              </li>
            ))}
          </ul>
          {trapNote && (
            <div className={styles.trapBong}>
              <Mascot expr="suynghi" size={56} />
              <p>{trapNote}</p>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
