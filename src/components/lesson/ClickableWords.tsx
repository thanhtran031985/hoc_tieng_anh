"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { splitSentence } from "@/lib/rules/sentence-words";
import { playPronunciation, stopPronunciation, type SpeechAccent } from "@/lib/speech";
import { SpeakerButton } from "@/components/ui";
import styles from "./ClickableWords.module.css";

/** Thời gian bong bóng nghĩa còn hiện và chữ sáng (ms). Không phải đồng hồ đếm ngược: chỉ là hiệu ứng ngắn. */
const GLOSS_MS = 2600;
const LIT_MS = 900;
/** Đọc một từ lẻ chậm hơn một chút so với đọc cả câu. */
const WORD_RATE = 0.8;

export type ClickableWordsProps = {
  /** Câu tiếng Anh. */
  text: string;
  /** Nghĩa ngắn theo chữ thường ({ bird: "con chim" }). Chữ không có trong bảng thì chỉ nghe, không hiện nghĩa. */
  glossary?: Record<string, string>;
  /** Chữ (theo thứ tự trong câu) đang sáng theo giọng đọc cả câu; bỏ trống thì không chữ nào sáng. */
  litIndex?: number | null;
  /** Gọi khi bé bấm một chữ (vd để ghi "đã nghe từ này"). */
  onWord?: (word: string, index: number) => void;
  accent?: SpeechAccent;
  className?: string;
};

type Gloss = { word: string; left: number; top: number };

/**
 * Chữ bấm được (Bong.L.words): mỗi chữ trong câu là một nút nhỏ. Bấm (hoặc Tab rồi Enter) thì nghe đúng chữ đó và hiện bong bóng
 * "loa · chữ · nghĩa" ngay trên chữ. Bàn phím dùng được hoàn toàn; nhãn đọc màn hình có cả nghĩa.
 */
export function ClickableWords({ text, glossary, litIndex = null, onWord, accent, className }: ClickableWordsProps) {
  const tokens = useMemo(() => splitSentence(text), [text]);
  const [gloss, setGloss] = useState<Gloss | null>(null);
  const [lit, setLit] = useState<number | null>(null);

  useEffect(() => {
    if (!gloss) return;
    const timer = setTimeout(() => setGloss(null), GLOSS_MS);
    return () => clearTimeout(timer);
  }, [gloss]);

  useEffect(() => {
    if (lit === null) return;
    const timer = setTimeout(() => setLit(null), LIT_MS);
    return () => clearTimeout(timer);
  }, [lit]);

  // Rời khỏi màn thì ngừng đọc.
  useEffect(() => () => stopPronunciation(), []);

  function pick(index: number, word: string, button: HTMLButtonElement) {
    setGloss({ word, left: button.offsetLeft + button.offsetWidth / 2, top: button.offsetTop });
    setLit(index);
    playPronunciation(word, { accent, rate: WORD_RATE });
    onWord?.(word, index);
  }

  const meaning = gloss ? glossary?.[gloss.word] : undefined;
  let wordIndex = -1;
  return (
    <span className={cn(styles.host, className)}>
      {tokens.map((t, i) => {
        if (!t.word) {
          return (
            <span key={i}>
              {i > 0 && " "}
              {t.core}
              {t.punct && <span className={styles.punct}>{t.punct}</span>}
            </span>
          );
        }
        const index = ++wordIndex;
        const note = glossary?.[t.word];
        return (
          <span key={i}>
            {i > 0 && " "}
            <button
              type="button"
              className={cn(styles.kw, (lit === index || litIndex === index) && styles.lit)}
              data-kw={index}
              data-w={t.word}
              aria-label={note ? `${t.core}, nghĩa: ${note}` : t.core}
              onClick={(event) => pick(index, t.word, event.currentTarget)}
            >
              {t.core}
            </button>
            {t.punct && <span className={styles.punct}>{t.punct}</span>}
          </span>
        );
      })}
      {gloss && (
        <span className={styles.gloss} role="status" style={{ left: gloss.left, top: gloss.top }}>
          <SpeakerButton word={gloss.word} size="s" accent={accent} rate={WORD_RATE} />
          <b lang="en">{gloss.word}</b>
          {meaning && <span>{meaning}</span>}
        </span>
      )}
    </span>
  );
}
