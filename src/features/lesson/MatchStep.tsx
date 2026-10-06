"use client";

import {
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  Bubble,
  Button,
  ChoiceCard,
  FeedbackBar,
  KeyHint,
  Mascot,
  SpeakerButton,
  WordPicture,
  type Expr,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import type { PlayWord } from "@/lib/rules/lesson-play";
import type { ItemResult } from "@/lib/rules/lesson-session";
import { seededRandom, shuffled } from "@/lib/rules/random";
import { playPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { burstStars } from "./burst";
import { LessonFoot, LessonMain } from "./LessonFrame";
import lesson from "./lesson.module.css";
import styles from "./match.module.css";
import type { StepProps } from "./types";

const KEYS = ["1", "2", "3", "4", "5", "6"] as const;
const PRAISE = ["Giỏi quá!", "Đúng rồi!", "Tuyệt vời!", "Xuất sắc!"];
/** Kéo ít hơn chừng này (px) thì coi là bấm chứ không phải kéo. */
const DRAG_THRESHOLD = 4;

type Tip = { expr: Expr; text: React.ReactNode };
type Drag = { wordId: number; dx: number; dy: number; over: number | null };
type Stat = { wrong: number; picks: string[] };

/**
 * Nối từ với hình (Screen09): kéo chip từ vào ô dưới hình bằng chuột; hoặc bằng bàn phím: 1–6 nhấc từ ở khay, rồi 1–6 thả vào hình
 * (Tab + Enter/Space cũng được, Esc bỏ nhấc). Thả sai thì chip về khay, không phạt.
 */
export function MatchStep({
  step,
  active,
  onComplete,
}: StepProps<"match_pairs">) {
  const { pairs } = step;
  const tray = useMemo(
    () => shuffled(pairs, seededRandom(step.id)),
    [pairs, step.id],
  );
  const [placed, setPlaced] = useState<ReadonlySet<number>>(new Set());
  const [held, setHeld] = useState<number | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [shake, setShake] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [tip, setTip] = useState<Tip>({
    expr: "chao",
    text: "Kéo từ vào đúng hình nhé!",
  });
  const stats = useRef<Map<number, Stat>>(new Map());
  const gesture = useRef<{
    wordId: number;
    sx: number;
    sy: number;
    moved: boolean;
  } | null>(null);
  const picRefs = useRef<Map<number, HTMLElement>>(new Map());

  const remaining = pairs.length - placed.size;
  const byId = useMemo(() => new Map(pairs.map((w) => [w.id, w])), [pairs]);

  function stat(wordId: number): Stat {
    let s = stats.current.get(wordId);
    if (!s) stats.current.set(wordId, (s = { wrong: 0, picks: [] }));
    return s;
  }

  function attempt(wordId: number, picId: number) {
    setHeld(null);
    const word = byId.get(wordId);
    const pic = byId.get(picId);
    if (!word || !pic || placed.has(picId)) return;
    stat(wordId).picks.push(pic.word);
    if (wordId === picId) {
      const next = new Set(placed).add(picId);
      setPlaced(next);
      playPronunciation(word.word);
      burstStars(picRefs.current.get(picId) ?? null, 8);
      setTip({ expr: "vui", text: PRAISE[next.size % PRAISE.length] });
      if (next.size === pairs.length)
        window.setTimeout(() => setDone(true), 600);
    } else {
      stat(wordId).wrong += 1;
      setShake(picId);
      window.setTimeout(() => setShake(null), 650);
      setTip({
        expr: "dongvien",
        text: (
          <>
            Gần đúng rồi! Đây là <b>{pic.meaningVi}</b>, bé thử hình khác nhé.
          </>
        ),
      });
    }
  }

  function hold(wordId: number, viaKeyboard = false) {
    if (placed.has(wordId)) return;
    const next = held === wordId ? null : wordId;
    setHeld(next);
    if (next !== null && viaKeyboard) {
      // Nhấc bằng bàn phím thì đưa focus tới hình đầu tiên chưa nối.
      const first = pairs.find((w) => !placed.has(w.id));
      if (first)
        window.setTimeout(() => picRefs.current.get(first.id)?.focus(), 0);
    }
  }

  function reset() {
    setPlaced(new Set());
    setHeld(null);
    setTip({ expr: "chao", text: "Kéo từ vào đúng hình nhé!" });
  }

  // 1–6: chưa nhấc thì nhấc từ ở vị trí đó trong khay, đang nhấc thì thả vào hình đó. Esc chỉ bắt khi đang nhấc (để Esc còn mở "Dừng bài học?").
  const keys: Record<string, () => void> = {};
  pairs.forEach((_, i) => {
    keys[KEYS[i]] = () => {
      if (held === null) {
        const chip = tray[i];
        if (chip) hold(chip.id);
      } else {
        attempt(held, pairs[i].id);
      }
    };
  });
  if (held !== null) keys.Escape = () => setHeld(null);
  useHotkeys(keys, { enabled: active && !done, capture: true });

  // ---- Kéo thả bằng con trỏ ----
  const picAt = (x: number, y: number): number | null => {
    const el = document
      .elementFromPoint(x, y)
      ?.closest<HTMLElement>("[data-pic]");
    const id = el ? Number(el.dataset.pic) : NaN;
    return Number.isFinite(id) && !placed.has(id) ? id : null;
  };

  function onPointerDown(event: PointerEvent<HTMLDivElement>, wordId: number) {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button"))
      return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = {
      wordId,
      sx: event.clientX,
      sy: event.clientY,
      moved: false,
    };
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g) return;
    const dx = event.clientX - g.sx;
    const dy = event.clientY - g.sy;
    if (!g.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) g.moved = true;
    if (g.moved)
      setDrag({
        wordId: g.wordId,
        dx,
        dy,
        over: picAt(event.clientX, event.clientY),
      });
  }
  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    gesture.current = null;
    if (!g) return;
    if (!g.moved) return hold(g.wordId);
    const over = picAt(event.clientX, event.clientY);
    setDrag(null);
    if (over !== null) attempt(g.wordId, over);
  }
  function onPointerCancel() {
    gesture.current = null;
    setDrag(null);
  }

  function onChipKey(event: KeyboardEvent<HTMLDivElement>, wordId: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      hold(wordId, true);
    }
  }

  function results(): ItemResult[] {
    return pairs.map((w) => {
      const s = stat(w.id);
      return {
        wordId: w.id,
        firstTryCorrect: s.wrong === 0,
        wrong: s.wrong,
        revealed: false,
        picks: s.picks,
        scored: true,
      };
    });
  }

  return (
    <>
      <LessonMain>
        <h1 className={lesson.instr}>Kéo từ vào đúng hình</h1>
        <div className={styles.board}>
          <div
            className={styles.pics}
            style={{ "--cols": pairs.length } as React.CSSProperties}
          >
            {pairs.map((w, i) => {
              const matched = placed.has(w.id);
              return (
                <ChoiceCard
                  key={w.id}
                  ref={(el: HTMLButtonElement | null) => {
                    if (el) picRefs.current.set(w.id, el);
                    else picRefs.current.delete(w.id);
                  }}
                  className={cn(styles.pic, drag?.over === w.id && styles.over)}
                  state={
                    matched ? "correct" : shake === w.id ? "retry" : "default"
                  }
                  keyHint={held !== null && !matched ? KEYS[i] : undefined}
                  data-pic={w.id}
                  aria-label={
                    matched ? `Hình ${i + 1}, đã nối` : `Hình ${i + 1}`
                  }
                  onClick={() =>
                    held !== null && !matched && attempt(held, w.id)
                  }
                >
                  <WordPicture
                    word={w.word}
                    src={w.image}
                    size={120}
                    label=""
                    aria-hidden="true"
                  />
                  <span className={cn(styles.slot, matched && styles.slotDone)}>
                    {matched ? (
                      <span lang="en">{w.word}</span>
                    ) : (
                      "Thả từ vào đây"
                    )}
                  </span>
                </ChoiceCard>
              );
            })}
          </div>
          <div className={styles.bottom}>
            <div className={cn(styles.tray, held !== null && styles.holding)}>
              {remaining === 0 ? (
                <span className={styles.trayEmpty}>Hết từ rồi!</span>
              ) : (
                tray.map((w, i) =>
                  placed.has(w.id) ? null : (
                    <div
                      key={w.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={held === w.id}
                      aria-label={`Từ ${w.word}`}
                      aria-keyshortcuts={KEYS[i]}
                      className={cn(
                        styles.chip,
                        held === w.id && styles.held,
                        drag?.wordId === w.id && styles.dragging,
                      )}
                      style={
                        drag?.wordId === w.id
                          ? {
                              transform: `translate(${drag.dx}px, ${drag.dy}px)`,
                            }
                          : undefined
                      }
                      onPointerDown={(e) => onPointerDown(e, w.id)}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      onPointerCancel={onPointerCancel}
                      onKeyDown={(e) => onChipKey(e, w.id)}
                    >
                      <SpeakerButton word={w.word} size="s" />
                      <span lang="en">{w.word}</span>
                      <KeyHint>{KEYS[i]}</KeyHint>
                    </div>
                  ),
                )
              )}
            </div>
            <div className={styles.tip}>
              <Bubble tail="right">{tip.text}</Bubble>
              <Mascot expr={tip.expr} size={110} />
            </div>
          </div>
        </div>
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button
              variant="secondary"
              size="l"
              icon="replay"
              label="Làm lại"
              disabled={placed.size === 0 || done}
              onClick={reset}
            />
            <span className={styles.count}>
              {placed.size}/{pairs.length} cặp đã nối
            </span>
          </>
        }
      />
      <FeedbackBar
        open={done}
        type="ok"
        title="Nối đúng hết rồi!"
        detail={`Bé nối đúng ${pairs.length} cặp. Mình sang phần tiếp nhé!`}
        onAction={() => onComplete(results())}
      />
    </>
  );
}

export type { PlayWord };
