"use client";

import { useState, type MouseEvent } from "react";
import { Button, Icon, KeyHint, SpeakerButton, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useHotkeys } from "@/lib/use-hotkeys";
import { LessonFoot, LessonMain } from "./LessonFrame";
import styles from "./word-card.module.css";
import type { StepProps } from "./types";

/** In đậm từ đang học trong câu ví dụ (không phân biệt hoa thường, không đụng vào chữ khác). */
function highlight(sentence: string, word: string): React.ReactNode {
  const index = sentence.toLowerCase().indexOf(word.toLowerCase());
  if (index < 0) return sentence;
  return (
    <>
      {sentence.slice(0, index)}
      <b>{sentence.slice(index, index + word.length)}</b>
      {sentence.slice(index + word.length)}
    </>
  );
}

/** Thẻ từ (Screen08): lật bằng Space hoặc bấm vào thẻ, ← quay lại thẻ trước, → hoặc Enter sang thẻ kế (thẻ cuối chỉ Enter), loa đọc từ và câu ví dụ. */
export function WordCardStep({ step, active, unit, onBack, onComplete }: StepProps<"word_card">) {
  const { word } = step;
  const [flipped, setFlipped] = useState(false);
  const last = step.ordinal === step.total;

  const flip = () => setFlipped((f) => !f);
  const next = () => onComplete([]);
  useHotkeys(
    { Space: flip, Enter: next, ArrowLeft: () => onBack?.(), ArrowRight: () => !last && next() },
    { enabled: active, captureNative: true },
  );

  // Bấm vào thẻ thì lật, trừ khi bấm vào nút loa bên trong.
  function onCardClick(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    flip();
  }

  return (
    <>
      <LessonMain>
        <h1 className={styles.title}>{flipped ? "Nghĩa của từ" : "Học từ mới"}</h1>
        <div className={styles.row}>
          <div className={styles.arrowWrap}>
            <button type="button" className={styles.arrow} aria-label="Thẻ trước" aria-keyshortcuts="ArrowLeft" disabled={!onBack} onClick={onBack}>
              <Icon name="back" size={34} />
            </button>
            <KeyHint>←</KeyHint>
          </div>

          <div className={cn(styles.card, flipped && styles.flipped)} onClick={onCardClick}>
            <div className={styles.inner}>
              <div className={cn(styles.face, styles.front)} aria-hidden={flipped}>
                <div className={styles.art}>
                  <WordPicture word={word.word} src={word.image} size={260} />
                </div>
                <div className={styles.text}>
                  <span className={styles.topic}>
                    {unit.titleVi} · {unit.title}
                  </span>
                  <div className={styles.wordRow}>
                    <SpeakerButton word={word.word} size="m" />
                    <span className={styles.word} lang="en">
                      {word.word}
                    </span>
                  </div>
                  {word.ipa && <span className={styles.ipa}>{word.ipa}</span>}
                  {step.showExample && word.exampleEn && (
                    <div className={styles.example}>
                      <SpeakerButton word={word.exampleEn} size="s" label="Nghe câu ví dụ" />
                      <span lang="en">{highlight(word.exampleEn, word.word)}</span>
                    </div>
                  )}
                  <span className={styles.flipNote}>
                    <Icon name="flip" size={22} />
                    Bấm vào thẻ hoặc Space để xem nghĩa
                  </span>
                </div>
              </div>
              <div className={cn(styles.face, styles.back)} aria-hidden={!flipped}>
                <WordPicture word={word.word} src={word.image} size={120} />
                <div className={styles.backWord}>
                  <SpeakerButton word={word.word} size="s" />
                  <b lang="en">{word.word}</b>
                </div>
                <span className={styles.vi}>{word.meaningVi}</span>
                {word.exampleVi && <p className={styles.exVi}>{word.exampleVi}</p>}
              </div>
            </div>
          </div>

          <div className={styles.arrowWrap}>
            <button type="button" className={styles.arrow} aria-label={last ? "Làm bài tập" : "Thẻ sau"} aria-keyshortcuts="Enter" onClick={next}>
              <Icon name="next" size={34} />
            </button>
            <KeyHint>Enter</KeyHint>
          </div>
        </div>
        <div className={styles.dots} aria-hidden="true">
          {Array.from({ length: step.total }, (_, i) => (
            <span key={i} className={cn(styles.dot, i + 1 === step.ordinal && styles.dotOn)} />
          ))}
        </div>
      </LessonMain>
      <LessonFoot
        left={<Button variant="secondary" size="l" icon="flip" label={flipped ? "Xem từ" : "Lật thẻ"} shortcut="Space" onClick={flip} />}
        right={<Button variant="primary" size="l" label={last ? "Làm bài tập" : "Thẻ tiếp"} shortcut="Enter" onClick={next} />}
      />
    </>
  );
}
