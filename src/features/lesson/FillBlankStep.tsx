"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ChoiceCard, Icon, SpeakerButton, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import { fillSentence, matchCard, nextToDim } from "@/lib/rules/grading/fill-blank";
import { normalizeAnswer } from "@/lib/rules/grading/text";
import { stopPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { burstStars } from "./burst";
import styles from "./fill-blank.module.css";
import { useLadder } from "./ladder";
import { LessonFoot, LessonMain } from "./LessonFrame";
import lesson from "./lesson.module.css";
import { sayAsync } from "./speak";
import { TypedFeedback } from "./TypedFeedback";
import type { StepProps } from "./types";

const KEYS = ["1", "2", "3", "4"] as const;
const HINT_RATE = 0.5;

/** Điền từ vào chỗ trống (Screen28): chọn thẻ, kéo thẻ vào ô hoặc gõ thẳng vào ô trống. */
export function FillBlankStep({ step, active, onComplete }: StepProps<"fill_blank">) {
  const { cards, correct, before, after, picture, meanings } = step;
  const ladder = useLadder();
  const [typed, setValue] = useState("");
  const [dimmed, setDimmed] = useState<number[]>([]);
  const [hinted, setHinted] = useState(false);
  const [over, setOver] = useState(false);
  const [lastWrong, setLastWrong] = useState("");
  const dragging = useRef<string | null>(null);

  useEffect(() => () => stopPronunciation(), []);

  const value = ladder.phase === "reveal" ? correct : typed;
  const picked = matchCard(value, cards.map((c) => c.word));
  const answerIndex = cards.findIndex((c) => c.word === correct);
  const full = (word: string) => fillSentence(step.text, word);

  function choose(index: number) {
    if (!ladder.answering || dimmed.includes(index)) return;
    setValue(cards[index].word);
    void sayAsync(cards[index].word);
  }

  function hint() {
    if (!ladder.answering || hinted) return;
    const i = nextToDim(cards.map((c) => c.word), answerIndex, dimmed, picked >= 0 ? picked : null);
    setHinted(true);
    if (i !== null) setDimmed((prev) => [...prev, i]);
    void sayAsync(`${before} ${after}`.replace(/\s+/g, " ").trim(), { rate: HINT_RATE });
  }

  function check() {
    if (!ladder.answering || value.trim() === "") return;
    const right = normalizeAnswer(value) === normalizeAnswer(correct);
    setLastWrong(right ? "" : value.trim());
    ladder.submit(right, value);
  }

  function retry() {
    ladder.retry();
    setValue("");
    // Sai lần thứ hai: tự bật gợi ý nếu chưa dùng.
    if (ladder.tries >= 2 && !hinted) hint();
  }

  useEffect(() => {
    if (ladder.phase === "ok") {
      burstStars(document.querySelector("[data-blank]"));
      void sayAsync(full(correct));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ladder.phase]);

  const hear = () => void sayAsync(ladder.phase === "ok" ? full(correct) : `${before} ${after}`.replace(/\s+/g, " ").trim());
  const keys: Record<string, () => void> = { Enter: check, Space: hear, h: hint, "?": hint, "Ctrl+Space": hear };
  cards.forEach((_, i) => {
    keys[KEYS[i]] = () => choose(i);
  });
  useHotkeys(keys, { enabled: active && ladder.answering, captureNative: true, inInputs: ["Enter", "?"] });

  const wrongMeaning = lastWrong ? meanings[cards.find((c) => normalizeAnswer(c.word) === normalizeAnswer(lastWrong))?.word ?? ""] : undefined;
  const blankState = ladder.phase === "ok" || ladder.phase === "reveal" ? "ok" : ladder.phase === "wrong" ? "bad" : value ? "filled" : over ? "over" : "empty";
  return (
    <>
      <LessonMain>
        <div className={styles.head}>
          <h1 className={lesson.instr}>Điền từ vào chỗ trống</h1>
          <span className={styles.caption}>Bấm thẻ, kéo thẻ vào ô, hoặc gõ thẳng vào ô</span>
        </div>
        <div className={styles.stage}>
          <div className={styles.pic}>
            {picture ? <WordPicture word={picture.word} src={picture.image} size={200} label="Hình minh họa" /> : <Icon name="pen" size={72} />}
          </div>
          <div className={styles.sentence} lang="en">
            <SpeakerButton word={`${before} ${after}`} size="s" label="Nghe câu" />
            <span className={styles.text}>{before}</span>
            <input
              id="blank"
              data-blank
              className={cn(styles.blank, styles[blankState])}
              value={value}
              size={Math.max(6, Math.max(...cards.map((c) => c.word.length)) + 1)}
              readOnly={!ladder.answering}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Ô trống: gõ hoặc chọn từ"
              onChange={(e) => setValue(e.target.value)}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(true);
              }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setOver(false);
                if (dragging.current !== null) {
                  setValue(dragging.current);
                  dragging.current = null;
                }
              }}
            />
            <span className={styles.text}>{after}</span>
          </div>
        </div>
        <div className={styles.cards} role="group" aria-label="Thẻ từ">
          {cards.map((c, i) => (
            <ChoiceCard
              key={c.n}
              className={styles.card}
              state={dimmed.includes(i) ? "dim" : picked === i ? (ladder.phase === "wrong" ? "retry" : ladder.phase === "ok" ? "correct" : "selected") : "default"}
              keyHint={KEYS[i]}
              lang="en"
              draggable={ladder.answering && !dimmed.includes(i)}
              onDragStart={() => (dragging.current = c.word)}
              onClick={() => choose(i)}
              aria-keyshortcuts={KEYS[i]}
            >
              <span className={styles.word}>{c.word}</span>
            </ChoiceCard>
          ))}
        </div>
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button variant="secondary" size="l" icon="speaker" label="Nghe lại" shortcut="Space" onClick={hear} />
            <Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="H" disabled={!ladder.answering || hinted} onClick={hint} />
          </>
        }
        right={<Button variant="primary" size="l" label="Kiểm tra" shortcut="Enter" disabled={!ladder.answering || value.trim() === ""} onClick={check} />}
      />
      <TypedFeedback
        phase={ladder.phase}
        okTitle="Chính xác! Giỏi quá!"
        okDetail={
          <span className={lesson.answer}>
            <span className={lesson.answerWord} lang="en">
              {full(correct)}
            </span>
          </span>
        }
        wrongDetail={wrongMeaning ? `${lastWrong} là “${wrongMeaning}”. Nhìn lại hình nhé.` : "Kiểm tra lại chính tả và nhìn hình nhé."}
        revealDetail={
          <span className={lesson.answer}>
            <span className={lesson.answerWord} lang="en">
              {full(correct)}
            </span>
          </span>
        }
        onContinue={() => onComplete([ladder.result({ wordId: picture?.id ?? null, questionId: step.questionId })])}
        onRetry={retry}
      />
    </>
  );
}
