"use client";

import { useEffect, useMemo, useRef } from "react";
import { Button, ChoiceCard, Icon, Mascot, SpeakerButton, WordPicture } from "@/components/ui";
import { ADAPT, NORMAL_DIFFICULTY, adaptOptions } from "@/lib/rules/adaptive";
import { playPronunciation, stopPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { ChoiceFeedback } from "./ChoiceFeedback";
import { burstStars } from "./burst";
import { useChoiceFlow } from "./choice-flow";
import { LessonFoot, LessonMain } from "./LessonFrame";
import styles from "./listen-choose.module.css";
import lesson from "./lesson.module.css";
import type { StepProps } from "./types";

const KEYS = ["1", "2", "3", "4"] as const;
// Phím chữ A–D chọn đáp án giống phím số (PRD Phần B).
const LETTERS = ["a", "b", "c", "d"] as const;

/** Nghe và chọn hình (Screen07): 1–4 (hoặc A–D) chọn, Space nghe lại, H gợi ý, Enter kiểm tra; sai không phạt. */
export function ListenChooseStep({ step, active, difficulty = NORMAL_DIFFICULTY, onComplete }: StepProps<"listen_choose_picture">) {
  const { target } = step;
  // Độ khó thích ứng: đúng liên tiếp thì thêm 1 hình nhiễu, sai liên tiếp thì bớt 1 hình và đọc chậm.
  const { extraOption, fewerOption, slow } = difficulty;
  const options = useMemo(() => adaptOptions(step.options, step.target, step.spare ?? [], { extraOption, fewerOption, slow }), [step.options, step.target, step.spare, extraOption, fewerOption, slow]);
  const rate = slow ? ADAPT.slowRate : undefined;
  const flow = useChoiceFlow(target, options);
  const speakerRef = useRef<HTMLButtonElement>(null);

  // Tự đọc từ khi câu hỏi hiện ra (nếu trình duyệt cho phép), và ngừng đọc khi rời câu.
  useEffect(() => {
    if (!step.autoPlay) return;
    const timer = window.setTimeout(() => playPronunciation(target.word, { rate }), 350);
    return () => {
      window.clearTimeout(timer);
      stopPronunciation();
    };
  }, [step.autoPlay, target.word, rate]);

  // Đúng thì sao bay từ thẻ vừa chọn vào thanh tiến độ.
  useEffect(() => {
    if (flow.phase === "ok") burstStars(document.querySelector(`[data-card="${flow.selected}"]`));
  }, [flow.phase, flow.selected]);

  const replay = () => speakerRef.current?.click();
  const keys: Record<string, () => void> = { Space: replay, h: flow.hint, Enter: flow.check };
  options.forEach((o, i) => {
    keys[KEYS[i]] = keys[LETTERS[i]] = () => flow.select(o.id);
  });
  useHotkeys(keys, { enabled: active && !flow.feedbackOpen, captureNative: true });

  function retry() {
    flow.retry();
    replay();
  }

  const left = options.length - flow.removed.length;
  return (
    <>
      <LessonMain>
        <h1 className={lesson.instr}>Nghe và chọn hình đúng</h1>
        <div className={styles.q}>
          <div className={styles.side}>
            <Mascot expr={flow.hintUsed ? "suynghi" : "chao"} size={120} />
          </div>
          <div className={styles.speakCol}>
            <SpeakerButton ref={speakerRef} word={target.word} size="l" label="Nghe từ cần chọn" rate={rate} />
            {flow.hintUsed ? (
              <span className={styles.hintTip}>
                <Icon name="bulb" size={20} />
                Còn {left} hình thôi!
              </span>
            ) : (
              <span className={styles.caption}>Bấm loa hoặc Space</span>
            )}
          </div>
          <div className={styles.side} />
        </div>
        <div className={styles.opts} style={{ "--cols": options.length } as React.CSSProperties} role="group" aria-label="Chọn hình">
          {options.map((o, i) => (
            <ChoiceCard
              key={o.id}
              className={styles.opt}
              state={flow.cardState(o.id)}
              keyHint={KEYS[i]}
              data-card={o.id}
              aria-label={`Hình ${i + 1}`}
              onClick={() => flow.select(o.id)}
            >
              <WordPicture word={o.word} src={o.image} size={120} label="" aria-hidden="true" />
            </ChoiceCard>
          ))}
        </div>
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button variant="secondary" size="l" icon="replay" label="Nghe lại" shortcut="Space" onClick={replay} />
            <Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="H" disabled={!flow.canHint} onClick={flow.hint} />
          </>
        }
        right={<Button variant="primary" size="l" label="Kiểm tra" shortcut="Enter" disabled={!flow.canCheck} onClick={flow.check} />}
      />
      <ChoiceFeedback
        phase={flow.phase}
        tries={flow.tries}
        target={target}
        lastWrong={flow.lastWrong}
        kind="picture"
        onContinue={() => onComplete([flow.result()])}
        onRetry={retry}
      />
    </>
  );
}
