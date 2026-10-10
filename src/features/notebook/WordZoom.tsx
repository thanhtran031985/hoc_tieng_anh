"use client";

import { useEffect, useId, useRef } from "react";
import { Button, SpeakerButton, WordPicture } from "@/components/ui";
import { MASTERY_NAMES } from "@/lib/rules/review-box";
import type { NotebookWord } from "@/server/notebook";
import styles from "./notebook.module.css";

type Props = {
  word: NotebookWord;
  /** Vị trí trong danh sách đã lọc (bắt đầu từ 0) và tổng số từ. */
  index: number;
  total: number;
  topicLabel: string | null;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

/**
 * Thẻ phóng to (Screen44): hình lớn, từ + loa, phiên âm · cấp · chủ đề, nghĩa, câu ví dụ + loa, mức thuộc.
 * ← → xem từ trước / sau (đi theo danh sách đang lọc), Esc hoặc Đóng để đóng; Tab xoay vòng trong thẻ, đóng xong tiêu điểm về thẻ đã mở.
 */
export function WordZoom({ word, index, total, topicLabel, onPrev, onNext, onClose }: Props) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const latest = useRef({ onPrev, onNext, onClose });
  useEffect(() => {
    latest.current = { onPrev, onNext, onClose };
  });

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus({ preventScroll: true });
    function onKeyDown(event: KeyboardEvent) {
      const { onPrev: prev, onNext: next, onClose: close } = latest.current;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        (event.key === "ArrowLeft" ? prev : next)();
      } else if (event.key === "Tab") {
        const items = Array.from(ref.current?.querySelectorAll<HTMLElement>("button:not(:disabled)") ?? []);
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (!ref.current?.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      } else if (event.key === "Enter") {
        // Chặn phím tắt của màn phía sau; nút đang focus vẫn tự kích hoạt.
        event.stopPropagation();
      }
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      previous?.focus({ preventScroll: true });
    };
  }, []);

  const meta = [word.ipa, word.levelNumber ? `Cấp ${word.levelNumber}` : null, topicLabel].filter(Boolean).join(" · ");
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={styles.zoomDlg} role="dialog" aria-modal="true" aria-labelledby={titleId} style={{ "--m": `var(--mastery-${word.mastery})` } as React.CSSProperties} data-level={word.levelNumber ?? undefined}>
        <span id={titleId} className="sr-only">
          Thẻ từ {word.word}, {index + 1} trên {total}
        </span>
        <div className={styles.zoomArt}>
          <WordPicture word={word.word} src={word.image} size={180} label="" aria-hidden="true" />
        </div>
        <div className={styles.zoomText}>
          <h2 className={styles.zoomTitle}>
            <span lang="en">{word.word}</span>
            <SpeakerButton word={word.word} size="m" label={`Nghe từ ${word.word}`} />
          </h2>
          {meta && <div className={styles.zoomMeta}>{meta}</div>}
          <p className={styles.zoomMean}>{word.meaningVi}</p>
          {word.exampleEn && (
            <div className={styles.example}>
              <SpeakerButton word={word.exampleEn} size="s" label="Nghe câu ví dụ" />
              <span>
                <b lang="en">{word.exampleEn}</b>
                {word.exampleVi && <span className={styles.exVi}>{word.exampleVi}</span>}
              </span>
            </div>
          )}
          <div className={styles.zoomMastery}>
            <span className={styles.zoomBar} aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <i key={n} className={n <= word.mastery ? styles.pipOn : undefined} />
              ))}
            </span>
            Mức thuộc: {MASTERY_NAMES[word.mastery - 1]} ({word.mastery}/5)
          </div>
        </div>
        <div className={styles.zoomActions}>
          <Button label="Từ trước" variant="secondary" size="m" icon="back" shortcut="←" disabled={index <= 0} onClick={onPrev} />
          <Button ref={closeRef} label="Đóng" variant="primary" size="m" shortcut="Esc" onClick={onClose} />
          <Button label="Từ sau" variant="secondary" size="m" icon="next" shortcut="→" disabled={index >= total - 1} onClick={onNext} />
        </div>
      </div>
    </div>
  );
}
