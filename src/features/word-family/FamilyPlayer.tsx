"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Icon, IconButton, Mascot } from "@/components/ui";
import { FamilyMap, ReadAloudParagraph } from "@/components/wordlab";
import { LessonFoot, LessonMain } from "@/features/lesson/LessonFrame";
import type { ItemResult } from "@/lib/rules/lesson-session";
import { listenProgress, unheardLearned, type FamilyView } from "@/lib/rules/word-family";
import { playPronunciation, stopPronunciation, type SpeechAccent } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import styles from "./family.module.css";

export type FamilyPlayerProps = {
  /** `lesson`: một bước của bài (nghe đủ các từ đã học rồi Tiếp tục). `explore`: tự khám phá (Sổ từ, liên kết), không tính điểm. */
  mode: "lesson" | "explore";
  family: FamilyView;
  /** Tắt phím tắt khi hộp thoại đang mở. */
  active?: boolean;
  accent?: SpeechAccent;
  /** Bước bài học: gọi một lần khi bé bấm Tiếp tục. Họ vần không chấm điểm nên không có mục nào. */
  onComplete?: (items: ItemResult[]) => void;
  /** Tự khám phá: nút Đóng (Esc). */
  onClose?: () => void;
  /** Thẻ có nút “Ghép” và “Khám phá” (tự khám phá). */
  onBuild?: (wordId: number) => void;
  onExplore?: (wordId: number) => void;
  /** Nút đi tiếp của thẻ bị khóa khi đường dẫn đã đủ bậc. */
  isLocked?: (kind: "build" | "explore", wordId: number) => boolean;
  /** Từ được tô nổi (từ bé đang xem khi đi từ Khám phá sang). */
  highlight?: number | null;
  /** Xem như học sinh ở trang soạn: không có khung bài học, không có Đóng. */
  preview?: boolean;
  /** Nhúng trong khung khác (có đầu màn riêng): chỉ vẽ phần thân, không vẽ đầu màn tự khám phá. */
  embedded?: boolean;
};

/** Nghỉ sau khi đọc vần rồi mới đọc từ đầu tiên, và giữa hai thẻ khi nghe cả họ. */
const GAP_AFTER_RIME_MS = 700;
const CARD_GAP_MS = 950;

/**
 * Họ vần (Screen50): bấm thẻ nghe từ, bấm vần ở giữa (hoặc Space) nghe lần lượt cả họ, bấm “Bẫy chính tả” nghe từ bẫy, “Đọc cả đoạn” câu vui.
 * Trong bài: nghe đủ các từ đã học rồi bấm Tiếp tục; Gợi ý (H) chỉ thẻ chưa nghe. Từ chưa học (“Sắp học”) vẫn nghe được nhưng không bắt buộc.
 * Phím: ← → đi giữa các thẻ, Space nghe cả họ, Enter nghe thẻ đang chọn.
 */
export function FamilyPlayer({ mode, family, active = true, accent, onComplete, onClose, onBuild, onExplore, isLocked, highlight = null, preview = false, embedded = false }: FamilyPlayerProps) {
  const lessonMode = mode === "lesson";
  const [heard, setHeard] = useState<number[]>([]);
  const [playing, setPlaying] = useState<number | null>(null);
  const [hubPlaying, setHubPlaying] = useState(false);
  const [glow, setGlow] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [heardCount, learnedCount] = listenProgress(family.members, heard);
  const canContinue = heardCount >= learnedCount;

  const say = useCallback((text: string, rate = 0.8) => playPronunciation(text, { accent, rate }), [accent]);
  const markHeard = useCallback((wordId: number) => setHeard((cur) => (cur.includes(wordId) ? cur : [...cur, wordId])), []);

  const stopAll = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setPlaying(null);
    setHubPlaying(false);
  }, []);

  // Rời màn thì ngừng đọc.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      stopPronunciation();
    },
    [],
  );

  function sayCard(wordId: number) {
    const m = family.members.find((x) => x.wordId === wordId);
    if (!m) return;
    stopAll();
    say(m.word);
    markHeard(wordId);
    setGlow((g) => (g === wordId ? null : g));
  }

  function sayTrap(wordId: number) {
    const t = family.traps.find((x) => x.wordId === wordId);
    if (!t) return;
    stopAll();
    say(t.word);
  }

  /** Đọc vần rồi từng thẻ của họ; thẻ nào được đọc thì sáng lên và được tính là đã nghe. */
  function playAll() {
    stopAll();
    setHubPlaying(true);
    say(family.pattern, 0.7);
    let i = 0;
    const next = () => {
      const m = family.members[i];
      if (!m) return stopAll();
      i += 1;
      setPlaying(m.wordId);
      say(m.word);
      markHeard(m.wordId);
      timer.current = setTimeout(next, CARD_GAP_MS);
    };
    timer.current = setTimeout(next, GAP_AFTER_RIME_MS);
  }

  function hint() {
    const [first] = unheardLearned(family.members, heard);
    if (first === undefined) return;
    setGlow(first);
    rootRef.current?.querySelector<HTMLElement>(`[data-fsay="${first}"]`)?.focus({ preventScroll: true });
  }

  function main() {
    if (canContinue) onComplete?.([]);
  }

  const keys: Record<string, () => void> = {
    Space: () => {
      const a = document.activeElement;
      if (a instanceof HTMLButtonElement && !a.closest("[data-foot]")) return a.click();
      playAll();
    },
    Enter: () => {
      const a = document.activeElement;
      if (a instanceof HTMLButtonElement && !a.matches("[data-main]")) return a.click();
      if (lessonMode) main();
    },
    h: () => lessonMode && hint(),
  };
  useHotkeys(keys, { enabled: active, captureNative: true });
  useHotkeys({ Escape: () => onClose?.() }, { enabled: active && !lessonMode && onClose !== undefined, capture: true });

  const instruction = lessonMode
    ? "Bấm từng thẻ để nghe. Nghe đủ các từ đã học rồi bấm Tiếp tục."
    : `Các từ cùng vần -${family.pattern}. Bấm thẻ để nghe, bấm vần ở giữa để nghe cả họ.`;

  const body = (
    <div className={styles.stage}>
      {(lessonMode || !embedded) && (
        <div className={styles.instr}>
          <Mascot expr="chao" size={60} />
          <p className={styles.say} aria-live="polite">
            {instruction}
          </p>
          {lessonMode && (
            <span className={styles.count} aria-label={`Đã nghe ${heardCount} trên ${learnedCount} từ đã học`}>
              {heardCount}/{learnedCount} từ
            </span>
          )}
        </div>
      )}
      <FamilyMap
        pattern={family.pattern}
        soundIpa={family.soundIpa}
        members={family.members}
        traps={family.traps}
        trapNote={family.trapNote}
        heard={heard}
        playing={playing}
        hubPlaying={hubPlaying}
        glow={glow}
        hl={highlight}
        showActions={!lessonMode}
        isLocked={isLocked}
        onSay={sayCard}
        onHub={playAll}
        onTrap={sayTrap}
        onBuild={onBuild}
        onExplore={onExplore}
      />
      {family.reading && (
        <ReadAloudParagraph
          sentences={family.reading.sentences}
          audioUrl={family.reading.audio}
          glossary={family.glossary}
          accent={accent}
          title={`Đọc cả đoạn · câu vui của họ -${family.pattern}`}
          compact
          hotkeys={active}
        />
      )}
    </div>
  );

  if (lessonMode) {
    return (
      <div ref={rootRef} className={styles.root}>
        <LessonMain>{body}</LessonMain>
        <LessonFoot
          left={
            <div data-foot className={styles.footGrp}>
              <Button variant="secondary" size="l" icon="replay" label="Nghe cả họ" shortcut="Space" onClick={playAll} />
              <Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="H" disabled={canContinue} onClick={hint} />
            </div>
          }
          right={<Button data-main variant="primary" size="l" label="Tiếp tục" shortcut="Enter" disabled={!canContinue} onClick={main} />}
        />
      </div>
    );
  }

  if (embedded) return <div ref={rootRef}>{body}</div>;

  return (
    <div ref={rootRef} className={styles.screen}>
      <header className={styles.top}>
        {onClose && <IconButton icon="close" label="Đóng, về Sổ từ (Esc)" onClick={onClose} data-hotkey-skip />}
        <div className={styles.ttl}>
          <span className={styles.kind}>
            <Icon name="family" size={18} />
            Họ vần
          </span>
          <h1 className={styles.title}>
            Họ vần -{family.pattern} {family.soundIpa}
          </h1>
        </div>
        <span className={styles.free}>
          <Icon name="compass" size={18} />
          {preview ? "Xem như học sinh" : "Tự khám phá · không tính điểm"}
        </span>
      </header>
      <main className={styles.mainFree}>{body}</main>
    </div>
  );
}
