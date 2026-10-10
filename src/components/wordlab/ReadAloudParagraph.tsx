"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ClickableWords } from "@/components/lesson/ClickableWords";
import { Button, Icon, KeyHint } from "@/components/ui";
import { cn } from "@/lib/cn";
import { litInSentence } from "@/lib/rules/lesson-story";
import type { SpeechAccent } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import styles from "./ReadAloudParagraph.module.css";
import { useParagraphReader } from "./use-paragraph-reader";

export type ParagraphSentence = { en: string; vi: string };

export type ReadAloudParagraphProps = {
  sentences: readonly ParagraphSentence[];
  /** Tệp mp3 đọc cả đoạn (nếu có). Không có thì dùng giọng trình duyệt. */
  audioUrl?: string | null;
  /** Nghĩa ngắn theo chữ thường, hiện trong bong bóng khi bấm một chữ. */
  glossary?: Record<string, string>;
  accent?: SpeechAccent;
  title?: string;
  /** Thu gọn (dùng trong Sổ từ và cột bên): khung và chữ nhỏ hơn. */
  compact?: boolean;
  /** Bật phím P (đọc/tạm dừng) và T (dịch). Tắt khi đã có nơi khác xử lý hai phím này. Mặc định bật. */
  hotkeys?: boolean;
  /** Tự đọc sau chừng này mili giây khi hiện ra (bỏ trống thì không tự đọc). */
  autoPlay?: number;
  /** Đọc xong cả đoạn từ đầu đến cuối. */
  onDone?: () => void;
  /** Bé bật hoặc tắt dịch nghĩa cả đoạn. */
  onTranslate?: (on: boolean) => void;
  className?: string;
};

/**
 * Đọc cả đoạn và dịch nghĩa (ReadAloudParagraph): khung đoạn văn dùng chung ở Khám phá từ và Họ vần.
 * P đọc / tạm dừng / đọc tiếp, "Đọc chậm", bấm một câu (hoặc loa cuối câu) nghe riêng câu đó, bấm một chữ nghe chữ đó kèm nghĩa.
 * T bật/tắt "Dịch nghĩa" (mặc định ẩn để bé tự nghe hiểu trước); nút dịch đầu câu chỉ dịch riêng câu đó.
 */
export function ReadAloudParagraph({ sentences, audioUrl = null, glossary, accent, title = "Đọc cả đoạn", compact, hotkeys = true, autoPlay, onDone, onTranslate, className }: ReadAloudParagraphProps) {
  const titleId = useId();
  const [slow, setSlow] = useState(false);
  const [shown, setShown] = useState<boolean[]>(() => sentences.map(() => false));
  const [live, setLive] = useState("");
  const english = sentences.map((s) => s.en);
  const reader = useParagraphReader({ sentences: english, audioUrl, accent, onDone: () => { setLive("Đã đọc xong cả đoạn."); onDone?.(); } });

  const tr = sentences.length > 0 && sentences.every((_, i) => shown[i]);

  function setAll(on: boolean) {
    setShown(sentences.map(() => on));
    setLive(on ? "Đã hiện bản dịch tiếng Việt." : "Đã ẩn bản dịch.");
    onTranslate?.(on);
  }
  function toggleRead() {
    if (reader.reading) setLive("Tạm dừng.");
    reader.toggle(slow);
  }
  function toggleSlow() {
    const next = !slow;
    setSlow(next);
    reader.changeSpeed(next);
  }
  function toggleOne(i: number) {
    setShown((cur) => sentences.map((_, j) => (j === i ? !cur[j] : (cur[j] ?? false))));
  }

  useHotkeys({ p: toggleRead, t: () => setAll(!tr) }, { enabled: hotkeys });

  // Tự đọc một lần sau khi hiện ra.
  const start = useRef(() => undefined as void);
  useEffect(() => {
    start.current = () => reader.toggle(slow);
  });
  useEffect(() => {
    if (autoPlay === undefined) return;
    const timer = setTimeout(() => start.current(), autoPlay);
    return () => clearTimeout(timer);
  }, [autoPlay]);

  const label = reader.reading ? "Tạm dừng" : reader.paused ? "Đọc tiếp" : "Đọc cả đoạn";
  return (
    <section className={cn(styles.rap, compact && styles.compact, className)} aria-labelledby={titleId} data-reading={reader.reading ? "" : undefined}>
      <header className={styles.head}>
        <h2 className={styles.title} id={titleId}>
          <Icon name="book" size={22} />
          {title}
        </h2>
        <div className={styles.tools}>
          <Button size={compact ? "s" : "m"} icon={reader.reading ? "pause" : "speaker"} label={label} shortcut="P" onClick={toggleRead} />
          <button type="button" className={styles.chip} aria-pressed={slow} onClick={toggleSlow}>
            <Icon name="snail" size={20} />
            Đọc chậm
          </button>
          <button type="button" className={styles.chip} aria-pressed={tr} aria-keyshortcuts="T" onClick={() => setAll(!tr)}>
            <Icon name="translate" size={20} />
            Dịch nghĩa
            <KeyHint>T</KeyHint>
          </button>
        </div>
      </header>

      <ol className={styles.body}>
        {sentences.map((s, i) => (
          <li
            key={i}
            className={cn(styles.sent, reader.sentence === i && styles.reading)}
            data-rs={i}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("button")) return;
              reader.readSentence(i, slow);
            }}
          >
            <button type="button" className={styles.one} aria-pressed={shown[i] ?? false} aria-label={`Dịch riêng câu ${i + 1}`} onClick={() => toggleOne(i)}>
              <Icon name="translate" size={18} />
            </button>
            <span className={styles.en} lang="en">
              <ClickableWords text={s.en} glossary={glossary} accent={accent} litIndex={litInSentence(reader.lit, english, i)} />
            </span>
            <button type="button" className={styles.say} aria-label={`Nghe câu ${i + 1}: ${s.en}`} onClick={() => reader.readSentence(i, slow)}>
              <Icon name="speaker" size={18} />
            </button>
            <span className={styles.vi} lang="vi" hidden={!shown[i]}>
              {s.vi || "Chưa có bản dịch."}
            </span>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        {live}
      </p>
    </section>
  );
}
