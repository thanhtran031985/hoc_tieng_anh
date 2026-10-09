"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Icon, SpeakerButton, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import { gradeOrder, nextCorrectCard, wordKey, type PositionMark } from "@/lib/rules/grading/sentence-order";
import { stopPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { burstStars } from "./burst";
import { useLadder } from "./ladder";
import { LessonFoot, LessonMain } from "./LessonFrame";
import lesson from "./lesson.module.css";
import styles from "./sentence-order.module.css";
import { sayAsync, wait } from "./speak";
import { TypedFeedback } from "./TypedFeedback";
import type { StepProps } from "./types";

const LIT_MS = 420;
const SENTENCE_RATE = 0.8;

/** Sắp xếp các từ thành câu (Screen26): bấm thẻ hoặc phím 1–9 để xếp, kéo để đổi chỗ; nghe lại câu. */
export function SentenceOrderStep({ step, active, onComplete }: StepProps<"sentence_order">) {
  const { cards, answer, alternatives, picture } = step;
  const ladder = useLadder();
  // Các thẻ đã xếp, theo thứ tự (số thẻ `n`).
  const [typed, setPlaced] = useState<number[]>([]);
  const [hinted, setHinted] = useState(false);
  const [lit, setLit] = useState<number | null>(null);
  const [celebrated, setCelebrated] = useState(false);
  const [marks, setMarks] = useState<PositionMark[]>([]);
  const dragging = useRef<number | null>(null);
  const alive = useRef(true);

  // Sai lần 3: hiện sẵn đáp án đúng.
  const answerPlaced = useMemo(() => {
    const left = [...cards];
    return answer.flatMap((w) => {
      const i = left.findIndex((c) => wordKey(c.word) === wordKey(w));
      return i >= 0 ? left.splice(i, 1).map((c) => c.n) : [];
    });
  }, [cards, answer]);
  const placed = ladder.phase === "reveal" ? answerPlaced : typed;

  const byN = useMemo(() => new Map(cards.map((c) => [c.n, c])), [cards]);
  const words = placed.map((n) => byN.get(n)?.word ?? "");
  const bank = cards.filter((c) => !placed.includes(c.n));
  const full = placed.length === answer.length;
  const sentence = step.sentence;

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      stopPronunciation();
    };
  }, []);

  const hear = () => void sayAsync(sentence, { rate: SENTENCE_RATE });

  function add(n: number, at?: number) {
    if (!ladder.answering || placed.includes(n) || !byN.has(n)) return;
    setMarks([]);
    setPlaced((prev) => (at === undefined ? [...prev, n] : [...prev.slice(0, at), n, ...prev.slice(at)]));
  }
  function remove(n: number) {
    if (!ladder.answering) return;
    setMarks([]);
    setPlaced((prev) => prev.filter((x) => x !== n));
  }
  const toggle = (n: number) => (placed.includes(n) ? remove(n) : add(n));
  function backspace() {
    if (ladder.answering && placed.length) {
      setMarks([]);
      setPlaced((prev) => prev.slice(0, -1));
    }
  }

  /** Giữ phần đầu đã đúng, rồi đặt thẻ đúng kế tiếp. */
  function placeNext(from: number[]): number[] {
    const grade = gradeOrder(from.map((n) => byN.get(n)?.word ?? ""), answer, alternatives);
    const kept = from.slice(0, grade.prefix);
    const rest = cards.filter((c) => !kept.includes(c.n));
    const i = nextCorrectCard(rest, grade.answer, kept.length);
    return i >= 0 ? [...kept, rest[i].n] : kept;
  }
  function hint() {
    if (!ladder.answering) return;
    setHinted(true);
    setMarks([]);
    setPlaced(placeNext(placed));
  }

  function check() {
    if (!ladder.answering || !full) return;
    const grade = gradeOrder(words, answer, alternatives);
    setMarks(grade.marks);
    ladder.submit(grade.correct, words.join(" "));
  }

  // Sau khi sai: giữ phần đầu đã đúng; từ lần sai thứ hai tự đặt giúp thẻ kế tiếp.
  function retry() {
    const grade = gradeOrder(words, answer, alternatives);
    const kept = placed.slice(0, grade.prefix);
    setMarks([]);
    setPlaced(ladder.tries >= 2 ? placeNext(kept) : kept);
    ladder.retry();
  }

  // Đúng: đọc cả câu, mỗi thẻ sáng lên lần lượt.
  useEffect(() => {
    if (ladder.phase !== "ok") return;
    burstStars(document.querySelector("[data-zone]"));
    void sayAsync(sentence, { rate: SENTENCE_RATE });
    void (async () => {
      for (let i = 0; i < placed.length && alive.current; i++) {
        setLit(i);
        await wait(LIT_MS);
      }
      if (alive.current) {
        setLit(null);
        setCelebrated(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ladder.phase]);

  const keys: Record<string, () => void> = { Enter: check, Space: hear, h: hint, Backspace: backspace };
  cards.forEach((c) => {
    if (c.n <= 9) keys[String(c.n)] = () => toggle(c.n);
  });
  useHotkeys(keys, { enabled: active && ladder.answering, captureNative: true });

  const showHint = hinted || ladder.autoHint;
  return (
    <>
      <LessonMain>
        <div className={styles.head}>
          <h1 className={lesson.instr}>Sắp xếp các từ thành câu</h1>
          <span className={styles.caption}>Bấm thẻ hoặc phím 1–9 · Backspace bỏ thẻ cuối</span>
        </div>
        <div className={styles.stage}>
          <div className={styles.pic}>
            {picture ? <WordPicture word={picture.word} src={picture.image} size={200} label="Hình minh họa" /> : <Icon name="grammar" size={72} />}
          </div>
          <div className={styles.work}>
            <div className={styles.label}>
              <span>Câu của cậu</span>
              <SpeakerButton word={sentence} size="s" label="Nghe câu" rate={SENTENCE_RATE} />
              {showHint && <span className={styles.tip}>Bông gợi ý thẻ kế tiếp</span>}
            </div>
            <ul
              className={styles.zone}
              aria-label="Câu đang xếp"
              data-zone
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragging.current !== null) {
                  const n = dragging.current;
                  setPlaced((prev) => [...prev.filter((x) => x !== n), n]);
                  dragging.current = null;
                }
              }}
            >
              {placed.length === 0 && <li className={styles.placeholder}>Bấm hoặc kéo thẻ từ xuống đây…</li>}
              {placed.map((n, i) => {
                const mark = marks[i];
                return (
                  <li key={n}>
                    <button
                      type="button"
                      className={cn(styles.card, lit === i && styles.lit, mark === "ok" && styles.ok, mark === "bad" && styles.bad, ladder.phase === "ok" && styles.ok)}
                      draggable={ladder.answering}
                      onDragStart={() => (dragging.current = n)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.stopPropagation();
                        const from = dragging.current;
                        dragging.current = null;
                        if (from === null || from === n) return;
                        setPlaced((prev) => {
                          const without = prev.filter((x) => x !== from);
                          const at = without.indexOf(n);
                          return [...without.slice(0, at), from, ...without.slice(at)];
                        });
                      }}
                      onClick={() => remove(n)}
                      aria-label={`Thẻ ${byN.get(n)?.word}. Bấm để bỏ ra`}
                      lang="en"
                    >
                      {byN.get(n)?.word}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className={styles.label}>
              <span>Thẻ từ</span>
            </div>
            <ul className={styles.bank} aria-label="Thẻ từ xáo trộn">
              {cards.map((c) => {
                const isPlaced = placed.includes(c.n);
                return (
                  <li key={c.n}>
                    <button
                      type="button"
                      className={cn(styles.card, styles.bankCard, isPlaced && styles.gone)}
                      disabled={isPlaced}
                      draggable={!isPlaced && ladder.answering}
                      onDragStart={() => (dragging.current = c.n)}
                      onClick={() => add(c.n)}
                      aria-keyshortcuts={c.n <= 9 ? String(c.n) : undefined}
                      lang="en"
                    >
                      {c.n <= 9 && <span className={styles.key}>{c.n}</span>}
                      {c.word}
                    </button>
                  </li>
                );
              })}
            </ul>
            <span className={styles.left} aria-live="polite">
              {bank.length > 0 ? `Còn ${bank.length} thẻ` : ""}
            </span>
          </div>
        </div>
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button variant="secondary" size="l" icon="speaker" label="Nghe lại" shortcut="Space" onClick={hear} />
            <Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="H" disabled={!ladder.answering} onClick={hint} />
          </>
        }
        right={<Button variant="primary" size="l" label="Kiểm tra" shortcut="Enter" disabled={!ladder.answering || !full} onClick={check} />}
      />
      <TypedFeedback
        phase={ladder.phase}
        ready={celebrated}
        okTitle="Đúng rồi! Câu hay quá!"
        okDetail={
          <span className={lesson.answer}>
            <span className={lesson.answerWord} lang="en">
              {sentence}
            </span>
          </span>
        }
        wrongDetail={`Thẻ màu cam chưa đúng chỗ. Câu bắt đầu bằng “${answer[0].replace(/[.,!?]+$/, "")}” nhé.`}
        revealDetail={
          <span className={lesson.answer}>
            <span className={lesson.answerWord} lang="en">
              {sentence}
            </span>
          </span>
        }
        onContinue={() => onComplete([ladder.result({ wordId: picture?.id ?? null, questionId: step.questionId })])}
        onRetry={retry}
      />
    </>
  );
}
