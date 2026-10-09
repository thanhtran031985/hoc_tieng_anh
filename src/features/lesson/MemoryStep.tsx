"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bubble, Button, FeedbackBar, Icon, Mascot, WordPicture, type Expr } from "@/components/ui";
import { cn } from "@/lib/cn";
import { seededRandom, shuffled } from "@/lib/rules/random";
import { playPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { playSfx } from "@/lib/sound";
import { burstStars } from "./burst";
import { LessonFoot, LessonMain } from "./LessonFrame";
import lesson from "./lesson.module.css";
import styles from "./memory.module.css";
import type { StepProps } from "./types";

/** Thẻ không khớp úp lại sau chừng này (ms); không đếm giờ làm bài. */
const FLIP_BACK_MS = 1100;
const DEFAULT_TIP: { expr: Expr; text: string } = { expr: "chao", text: "Tìm hình và chữ giống nhau nhé!" };

type Card = { key: string; pairId: number; kind: "pic" | "word" };

/**
 * Lật thẻ ghép cặp (Screen10): mỗi cặp là một hình và một chữ, úp xuống, lật hai thẻ mỗi lượt. Đếm lượt, không đếm giờ, không phạt.
 * Mũi tên di chuyển giữa các thẻ (←→ ±1, ↑↓ nhảy một hàng), Enter/Space lật.
 */
export function MemoryStep({ step, active, onComplete }: StepProps<"memory_game">) {
  const { pairs } = step;
  const [round, setRound] = useState(0);
  const deck = useMemo<Card[]>(() => {
    const cards = pairs.flatMap((w): Card[] => [
      { key: `p${w.id}`, pairId: w.id, kind: "pic" },
      { key: `w${w.id}`, pairId: w.id, kind: "word" },
    ]);
    return shuffled(cards, seededRandom(`${step.id}:${round}`));
  }, [pairs, step.id, round]);
  const byId = useMemo(() => new Map(pairs.map((w) => [w.id, w])), [pairs]);

  const [up, setUp] = useState<number[]>([]);
  const [bad, setBad] = useState<number[]>([]);
  const [matched, setMatched] = useState<ReadonlySet<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const [tip, setTip] = useState(DEFAULT_TIP);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  function flip(index: number) {
    const card = deck[index];
    if (busy.current || done || matched.has(card.pairId) || up.includes(index)) return;
    const word = byId.get(card.pairId)!;
    if (card.kind === "word") playPronunciation(word.word);
    const next = [...up, index];
    setUp(next);
    if (next.length < 2) return;

    setMoves((m) => m + 1);
    const [a, b] = next.map((i) => deck[i]);
    if (a.pairId === b.pairId && a.kind !== b.kind) {
      const nextMatched = new Set(matched).add(a.pairId);
      setMatched(nextMatched);
      setUp([]);
      burstStars(cardRefs.current[index], 6);
      setTip({ expr: "vui", text: `${word.word} là ${word.meaningVi}. Giỏi quá!` });
      if (nextMatched.size === pairs.length) later(() => setDone(true), 700);
    } else {
      busy.current = true;
      playSfx("retry");
      setBad(next);
      setTip({ expr: "dongvien", text: "Chưa khớp rồi. Nhớ vị trí và thử lại nhé!" });
      later(() => {
        setUp([]);
        setBad([]);
        busy.current = false;
      }, FLIP_BACK_MS);
    }
  }

  function restart() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    busy.current = false;
    setRound((r) => r + 1);
    setUp([]);
    setBad([]);
    setMatched(new Set());
    setMoves(0);
    setTip(DEFAULT_TIP);
  }

  const cols = pairs.length;
  function moveFocus(delta: number) {
    const current = cardRefs.current.findIndex((el) => el === document.activeElement);
    const target = current < 0 ? 0 : Math.min(deck.length - 1, Math.max(0, current + delta));
    cardRefs.current[target]?.focus();
  }
  useHotkeys(
    { ArrowRight: () => moveFocus(1), ArrowLeft: () => moveFocus(-1), ArrowDown: () => moveFocus(cols), ArrowUp: () => moveFocus(-cols) },
    { enabled: active && !done },
  );

  return (
    <>
      <LessonMain>
        <div className={styles.head}>
          <h1 className={lesson.instr}>Lật thẻ ghép cặp</h1>
          <span className={styles.chip}>
            <Icon name="check" size={18} />
            {matched.size}/{pairs.length} cặp
          </span>
          <span className={styles.chip}>
            <Icon name="flip" size={18} />
            {moves} lượt
          </span>
        </div>
        <div className={styles.grid} style={{ "--cols": cols } as React.CSSProperties} role="group" aria-label={`${deck.length} thẻ`}>
          {deck.map((card, i) => {
            const word = byId.get(card.pairId)!;
            const isMatched = matched.has(card.pairId);
            const isUp = isMatched || up.includes(i);
            return (
              <button
                key={card.key}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                type="button"
                className={cn(styles.card, isUp && styles.up, isMatched && styles.ok, bad.includes(i) && styles.no)}
                aria-label={isUp ? `${card.kind === "pic" ? "Hình" : "Chữ"} ${word.word}` : `Thẻ úp số ${i + 1}`}
                aria-disabled={isMatched || undefined}
                onClick={() => flip(i)}
              >
                <span className={styles.inner}>
                  <span className={cn(styles.face, styles.back)} aria-hidden="true">
                    <Icon name="star" size={64} />
                  </span>
                  <span className={cn(styles.face, styles.front)} aria-hidden="true">
                    {card.kind === "pic" ? <WordPicture word={word.word} src={word.image} size={120} label="" /> : <span className={styles.word}>{word.word}</span>}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button variant="secondary" size="l" icon="replay" label="Chơi lại" disabled={done} onClick={restart} />
            <div className={styles.tip} aria-live="polite">
              <Mascot expr={tip.expr} size={60} />
              <Bubble tail="side">{tip.text}</Bubble>
            </div>
          </>
        }
        right={<span className={styles.note}>Không giới hạn lượt, cứ thong thả nhé!</span>}
      />
      <FeedbackBar
        open={done}
        type="ok"
        title={`Ghép xong ${pairs.length} cặp!`}
        detail={`Bé dùng ${moves} lượt. Mình sang phần tiếp nhé!`}
        action="Tiếp tục"
        onAction={() => onComplete([])}
      />
    </>
  );
}
