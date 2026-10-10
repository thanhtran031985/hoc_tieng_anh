"use client";

import { useEffect, useMemo } from "react";
import { Button, ChoiceCard, Icon, Mascot, WordPicture } from "@/components/ui";
import { ADAPT, NORMAL_DIFFICULTY, adaptOptions } from "@/lib/rules/adaptive";
import { playPronunciation, stopPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { ChoiceFeedback } from "./ChoiceFeedback";
import { burstStars } from "./burst";
import { useChoiceFlow } from "./choice-flow";
import { LessonFoot, LessonMain } from "./LessonFrame";
import lesson from "./lesson.module.css";
import styles from "./pick-word.module.css";
import type { StepProps } from "./types";

const KEYS = ["1", "2", "3", "4"] as const;
// Phím chữ A–D chọn đáp án giống phím số (PRD Phần B).
const LETTERS = ["a", "b", "c", "d"] as const;

/** Chọn từ đúng cho hình (Screen18): như nghe-chọn nhưng đáp án là chữ; chọn thẻ nào thì Bông đọc từ đó. */
export function PickWordStep({ step, active, difficulty = NORMAL_DIFFICULTY, onComplete }: StepProps<"choose_word_for_picture">) {
  const { target } = step;
  // Độ khó thích ứng: đúng liên tiếp thì thêm 1 từ nhiễu, sai liên tiếp thì bớt 1 từ và đọc chậm.
  const { extraOption, fewerOption, slow } = difficulty;
  const options = useMemo(() => adaptOptions(step.options, step.target, step.spare ?? [], { extraOption, fewerOption, slow }), [step.options, step.target, step.spare, extraOption, fewerOption, slow]);
  const flow = useChoiceFlow(target, options);

  // Rời câu thì ngừng đọc.
  useEffect(() => () => stopPronunciation(), []);

  useEffect(() => {
    if (flow.phase === "ok") burstStars(document.querySelector(`[data-card="${flow.selected}"]`));
  }, [flow.phase, flow.selected]);

  function choose(id: number) {
    const option = options.find((o) => o.id === id);
    if (!option || flow.removed.includes(id) || flow.phase !== "answering") return;
    flow.select(id);
    playPronunciation(option.word, { rate: slow ? ADAPT.slowRate : undefined });
  }

  const keys: Record<string, () => void> = { h: flow.hint, Enter: flow.check };
  options.forEach((o, i) => {
    keys[KEYS[i]] = keys[LETTERS[i]] = () => choose(o.id);
  });
  useHotkeys(keys, { enabled: active && !flow.feedbackOpen, captureNative: true });

  const left = options.length - flow.removed.length;
  return (
    <>
      <LessonMain>
        <div className={styles.head}>
          <h1 className={lesson.instr}>Chọn từ đúng cho hình</h1>
          {flow.hintUsed ? (
            <span className={styles.hintTip}>
              <Icon name="bulb" size={20} />
              Còn {left} từ thôi!
            </span>
          ) : (
            <span className={styles.caption}>Bấm vào chữ để nghe đọc</span>
          )}
        </div>
        <div className={styles.stage}>
          <div className={styles.pic}>
            <WordPicture word={target.word} src={target.image} size={260} label="Hình cần chọn từ" />
            <div className={styles.dragon}>
              <Mascot expr={flow.hintUsed ? "suynghi" : "chao"} size={110} />
            </div>
          </div>
          <div className={styles.words} role="group" aria-label="Chọn từ">
            {options.map((o, i) => (
              <ChoiceCard
                key={o.id}
                className={styles.word}
                state={flow.cardState(o.id)}
                keyHint={KEYS[i]}
                data-card={o.id}
                lang="en"
                onClick={() => choose(o.id)}
              >
                <span className={styles.text}>{o.word}</span>
                <span className={styles.snd} aria-hidden="true">
                  <Icon name="speaker" size={22} />
                </span>
              </ChoiceCard>
            ))}
          </div>
        </div>
      </LessonMain>
      <LessonFoot
        left={<Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="H" disabled={!flow.canHint} onClick={flow.hint} />}
        right={<Button variant="primary" size="l" label="Kiểm tra" shortcut="Enter" disabled={!flow.canCheck} onClick={flow.check} />}
      />
      <ChoiceFeedback
        phase={flow.phase}
        tries={flow.tries}
        target={target}
        lastWrong={flow.lastWrong}
        kind="word"
        onContinue={() => onComplete([flow.result()])}
        onRetry={flow.retry}
      />
    </>
  );
}
