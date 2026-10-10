"use client";

import { useLayoutEffect, useRef } from "react";
import { Icon, KeyHint, SpeakerButton, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { ExplorerAnswer } from "@/lib/schemas";
import type { ExplorerViewBranch } from "@/lib/rules/word-explorer";
import type { SpeechAccent } from "@/lib/speech";
import styles from "./ExplorerMap.module.css";

export type ExplorerMapWord = { word: string; ipa: string | null; meaningVi: string; image: string | null; exampleEn: string | null };

export type ExplorerMapProps = {
  word: ExplorerMapWord;
  branches: readonly ExplorerViewBranch[];
  /** Nhánh đã mở (theo thứ tự nhánh). */
  open: readonly boolean[];
  /** Nhánh đang hỏi; -1 là chưa hỏi nhánh nào. */
  ask?: number;
  /** Hình bé đang chọn / hình vừa chọn sai / hình đã mờ (mã `choice.id`). */
  sel?: number | null;
  wrong?: number | null;
  dim?: number | null;
  /** Nhánh vừa mở, viền sáng một lúc. */
  glow?: number | null;
  /** Thu gọn (Sổ từ): thẻ và nhánh nhỏ hơn. */
  compact?: boolean;
  accent?: SpeechAccent;
  onBranch?: (index: number) => void;
  onPick?: (choiceId: number) => void;
  onSayAnswer?: (answer: ExplorerAnswer) => void;
  className?: string;
};

/**
 * Sơ đồ Khám phá từ (Screen48): thẻ từ ở bên trái, 4–6 nhánh câu hỏi tỏa ra bên phải. Nhánh chưa mở có ô “?”; nhánh đang hỏi hiện 2–3 hình để chọn
 * (phím 1–3); nhánh đã mở hiện các đáp án (hình + chữ, bấm để nghe). Đường cong nối thẻ tới từng nhánh vẽ bằng SVG, co giãn theo số nhánh.
 */
export function ExplorerMap({ word, branches, open, ask = -1, sel = null, wrong = null, dim = null, glow = null, compact, accent, onBranch, onPick, onSayAnswer, className }: ExplorerMapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const n = branches.length;

  // Đường nối đo từ bố cục thật (vị trí thẻ và từng nhánh), vẽ lại khi khung đổi cỡ hoặc nhánh mở ra.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    function draw() {
      const el = root;
      const svg = el?.querySelector<SVGSVGElement>("[data-lines]");
      const card = el?.querySelector<HTMLElement>("[data-card]");
      if (!el || !svg || !card) return;
      const box = el.getBoundingClientRect();
      if (box.width === 0) return;
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      svg.setAttribute("width", String(box.width));
      svg.setAttribute("height", String(box.height));
      const c = card.getBoundingClientRect();
      const x0 = c.right - box.left;
      const y0 = c.top - box.top + c.height / 2;
      const hub = svg.querySelector("[data-hub]");
      hub?.setAttribute("cx", String(x0));
      hub?.setAttribute("cy", String(y0));
      el.querySelectorAll<HTMLElement>("[data-node]").forEach((node) => {
        const i = node.dataset.node;
        const r = node.getBoundingClientRect();
        const x1 = r.left - box.left;
        const y1 = r.top - box.top + r.height / 2;
        const dx = x1 - x0;
        svg.querySelector(`[data-path="${i}"]`)?.setAttribute("d", `M${x0} ${y0} C${x0 + dx * 0.55} ${y0} ${x1 - dx * 0.5} ${y1} ${x1} ${y1}`);
        const dot = svg.querySelector(`[data-dot="${i}"]`);
        dot?.setAttribute("cx", String(x1));
        dot?.setAttribute("cy", String(y1));
      });
    }
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(root);
    return () => observer.disconnect();
  }, [open, ask, n, compact]);

  return (
    <div ref={rootRef} className={cn(styles.wx, compact && styles.compact, className)} style={{ "--n": n } as React.CSSProperties} data-wx>
      <svg className={styles.lines} data-lines aria-hidden="true">
        {branches.map((_, i) => {
          const tone = ask === i ? styles.isAsk : open[i] ? styles.isOpen : undefined;
          return (
            <g key={i}>
              <path data-path={i} className={tone} />
              <circle data-dot={i} r={5} className={tone} />
            </g>
          );
        })}
        <circle data-hub r={8} className={styles.hub} />
      </svg>

      <section className={styles.card} data-card aria-label={`Thẻ từ ${word.word}`}>
        <div className={styles.pic}>
          <WordPicture word={word.word} src={word.image} size={160} label={`Hình: ${word.meaningVi}`} />
        </div>
        <div className={styles.w}>
          <h2 className={styles.word} lang="en">
            {word.word}
          </h2>
          <SpeakerButton word={word.word} size="m" label={`Nghe từ ${word.word}`} accent={accent} />
        </div>
        <span className={styles.ipa}>
          {word.ipa ? `${word.ipa} · ` : ""}
          {word.meaningVi}
        </span>
        {word.exampleEn && (
          <p className={styles.ex}>
            <SpeakerButton word={word.exampleEn} size="s" label={`Nghe câu: ${word.exampleEn}`} accent={accent} />
            <span lang="en">{word.exampleEn}</span>
          </p>
        )}
      </section>

      <ol className={styles.br} aria-label={`${n} câu hỏi quanh từ ${word.word}`} onKeyDown={moveBetweenBranches}>
        {branches.map((b, i) => {
          const isOpen = open[i] === true;
          const isAsk = ask === i;
          const ind = Math.round(Math.sin((Math.PI * (i + 0.5)) / n) * (compact ? 28 : 44));
          return (
            <li key={b.id} className={cn(styles.node, isOpen && styles.open, isAsk && styles.ask, glow === i && styles.glow)} data-node={i} data-b={i} style={{ "--ind": `${ind}px` } as React.CSSProperties}>
              <button
                type="button"
                className={styles.q}
                data-bq={i}
                aria-label={`Nhánh ${i + 1}: ${b.questionEn}${isOpen ? ", đã mở" : isAsk ? ", đang hỏi" : ", chưa mở"}`}
                aria-keyshortcuts={isOpen ? undefined : String(i + 1)}
                aria-expanded={isAsk ? true : undefined}
                onClick={() => onBranch?.(i)}
              >
                <span className={styles.num} aria-hidden="true">
                  {isOpen ? <Icon name="check" size={18} /> : i + 1}
                </span>
                <span className={styles.qt} lang="en">
                  {b.questionEn}
                </span>
              </button>
              <SpeakerButton word={b.questionEn} size="s" label={`Nghe câu hỏi ${i + 1}`} accent={accent} />

              {isOpen ? (
                <div className={styles.ans}>
                  {b.answers.map((a, j) => (
                    <button key={j} type="button" className={styles.a} aria-label={`Nghe: ${a.text}${a.textVi ? `, nghĩa: ${a.textVi}` : ""}`} onClick={() => onSayAnswer?.(a)}>
                      <WordPicture word={a.text} src={a.image} size={40} label="" aria-hidden="true" />
                      <span lang="en">{a.text}</span>
                    </button>
                  ))}
                </div>
              ) : isAsk ? (
                <div className={styles.opts} role="radiogroup" aria-label={`Chọn hình trả lời câu ${i + 1} (phím 1–${b.choices.length})`}>
                  {b.choices.map((c, j) => (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      className={cn(styles.opt, sel === c.id && styles.selected, dim === c.id && styles.dim, wrong === c.id && styles.retry)}
                      data-opt={c.id}
                      aria-checked={sel === c.id}
                      aria-label={`Hình ${j + 1}: ${c.text}`}
                      disabled={dim === c.id}
                      onClick={() => onPick?.(c.id)}
                    >
                      <KeyHint corner>{j + 1}</KeyHint>
                      <WordPicture word={c.text} src={c.image} size={50} label="" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              ) : (
                <span className={styles.qm} aria-hidden="true">
                  ?
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** ↑ ↓ đi giữa các câu hỏi của nhánh (khi focus đang ở một nút của sơ đồ). */
function moveBetweenBranches(event: React.KeyboardEvent<HTMLOListElement>) {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  const node = (event.target as HTMLElement).closest<HTMLElement>("[data-b]");
  if (!node) return;
  const next = Number(node.dataset.b) + (event.key === "ArrowDown" ? 1 : -1);
  const target = event.currentTarget.querySelector<HTMLElement>(`[data-bq="${next}"]`);
  if (!target) return;
  event.preventDefault();
  target.focus({ preventScroll: true });
}
