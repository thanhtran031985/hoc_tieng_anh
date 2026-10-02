"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ChoiceCard, Dialog, Icon, Mascot, SpeakerButton, WordPicture, type MascotColor } from "@/components/ui";
import { cn } from "@/lib/cn";
import { PLACEMENT_QUESTIONS } from "@/lib/rules/placement";
import { playPronunciation, stopPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import type { PlacementQuestion } from "@/server/placement";
import { LessonFoot, LessonFrame, LessonMain } from "@/features/lesson/LessonFrame";
import styles from "./placement.module.css";

const KEYS = ["1", "2", "3", "4"] as const;

type Props = {
  question: PlacementQuestion;
  /** Số câu đã làm. */
  answered: number;
  /** Cấp để lấy màu khung (cấp theo lớp, cố định để màu không lộ cấp bé đang ở). */
  themeLevel: number;
  mascot: MascotColor;
  learnerName: string;
  grade: number;
  onAnswer: (correct: boolean) => void;
  /** Bé dừng giữa chừng. */
  onStop: () => void;
};

/**
 * Câu hỏi bài xếp lớp (Screen16): nghe và chọn hình, KHÔNG báo đúng hay sai. 1–4 chọn, Space nghe lại, Enter tiếp tục,
 * "Tớ chưa biết" cũng sang câu mới. Thanh tiến độ là 12 ngôi sao nhỏ.
 */
export function PlacementQuiz({ question, answered, themeLevel, mascot, learnerName, grade, onAnswer, onStop }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  const speakerRef = useRef<HTMLButtonElement>(null);
  const { target, options } = question;

  // Tự đọc từ khi câu hỏi hiện ra (nếu trình duyệt cho phép), ngừng đọc khi rời câu.
  useEffect(() => {
    const timer = window.setTimeout(() => playPronunciation(target.word), 350);
    return () => {
      window.clearTimeout(timer);
      stopPronunciation();
    };
  }, [target.word]);

  const replay = () => speakerRef.current?.click();
  const next = () => {
    if (selected !== null) onAnswer(options[selected].id === target.id);
  };
  const keys: Record<string, () => void> = { Space: replay, Enter: next };
  options.forEach((_, i) => {
    keys[KEYS[i]] = () => setSelected(i);
  });
  useHotkeys(keys, { enabled: !exitOpen, captureNative: true });
  useHotkeys({ Escape: () => setExitOpen(true) }, { enabled: !exitOpen });

  function closeExit() {
    setExitOpen(false);
    window.setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    }, 0);
  }

  const head = (
    <>
      <div className={styles.stars} role="progressbar" aria-label="Tiến độ bài xếp lớp" aria-valuemin={0} aria-valuemax={PLACEMENT_QUESTIONS} aria-valuenow={answered} aria-valuetext={`Đã làm ${answered} trên ${PLACEMENT_QUESTIONS} câu`}>
        {Array.from({ length: PLACEMENT_QUESTIONS }, (_, i) => (
          <span key={i} className={cn(styles.pip, i < answered && styles.pipOn, i === answered && styles.pipCur)}>
            <Icon name={i < answered ? "star" : "starEmpty"} />
          </span>
        ))}
      </div>
      <span className={styles.count} aria-hidden="true">
        {Math.min(answered + 1, PLACEMENT_QUESTIONS)}/{PLACEMENT_QUESTIONS}
      </span>
    </>
  );

  return (
    <LessonFrame level={themeLevel} mascot={mascot} value={answered} max={PLACEMENT_QUESTIONS} onExit={() => setExitOpen(true)} head={head}>
      <LessonMain>
        <h1 className={styles.instr}>Nghe và chọn hình</h1>
        <div className={styles.q}>
          <div className={styles.side}>
            <Mascot expr="chao" size={120} />
          </div>
          <div className={styles.speakCol}>
            <SpeakerButton ref={speakerRef} word={target.word} size="l" label="Nghe từ cần chọn" />
            <span className={styles.caption}>Bấm loa hoặc Space</span>
          </div>
          <div className={styles.side} />
        </div>
        <div className={styles.opts} role="group" aria-label="Chọn hình">
          {options.map((o, i) => (
            <ChoiceCard key={o.id} className={styles.opt} state={selected === i ? "selected" : "default"} keyHint={KEYS[i]} aria-label={`Hình ${i + 1}`} onClick={() => setSelected(i)}>
              <WordPicture word={o.word} src={o.image} size={120} label="" aria-hidden="true" />
            </ChoiceCard>
          ))}
        </div>
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button variant="secondary" size="l" icon="replay" label="Nghe lại" shortcut="Space" onClick={replay} />
            <Button variant="secondary" size="l" icon="bulb" label="Tớ chưa biết" onClick={() => onAnswer(false)} />
          </>
        }
        right={<Button variant="primary" size="l" icon="next" label="Tiếp tục" shortcut="Enter" disabled={selected === null} onClick={next} />}
      />
      <Dialog
        open={exitOpen}
        onClose={closeExit}
        expr="tiec"
        title="Dừng bài xếp lớp?"
        body={`Còn ${Math.max(0, PLACEMENT_QUESTIONS - answered)} câu nữa thôi! Nếu dừng, Bông cho ${learnerName} bắt đầu theo lớp ${grade}.`}
        actions={[
          { label: "Chơi tiếp", variant: "primary", shortcut: "Enter" },
          { label: "Dừng lại", variant: "secondary", onClick: onStop },
        ]}
      />
    </LessonFrame>
  );
}
