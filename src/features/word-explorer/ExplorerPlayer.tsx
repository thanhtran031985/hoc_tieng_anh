"use client";

import { useEffect, useRef, useState } from "react";
import { FeedbackBar, Button, IconButton, Icon, Mascot, SpeakerButton, WordPicture } from "@/components/ui";
import { ExplorerMap, ReadAloudParagraph } from "@/components/wordlab";
import { burstStars } from "@/features/lesson/burst";
import { LessonFoot, LessonMain } from "@/features/lesson/LessonFrame";
import type { ItemResult } from "@/lib/rules/lesson-session";
import type { ExplorerContent, ExplorerViewBranch } from "@/lib/rules/word-explorer";
import { playSfx } from "@/lib/sound";
import { playPronunciation, stopPronunciation, type SpeechAccent } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { AlongSpeak } from "./AlongSpeak";
import { useExplorerFlow, type ExplorerMode } from "./explorer-flow";
import styles from "./explorer.module.css";

export type ExplorerWord = { id: number; word: string; ipa: string | null; meaningVi: string; image: string | null; exampleEn: string | null; exampleVi: string | null };

export type ExplorerPlayerProps = {
  /** `lesson`: một bước của bài (bé đoán từng nhánh, có sao). `explore`: tự khám phá từ Sổ từ (bấm là mở, không tính điểm). */
  mode: ExplorerMode;
  word: ExplorerWord;
  branches: readonly ExplorerViewBranch[];
  reading: ExplorerContent["reading"];
  glossary: Record<string, string>;
  /** Tắt phím tắt khi hộp thoại đang mở. */
  active?: boolean;
  accent?: SpeechAccent;
  /** Bước bài học: gọi một lần khi bé bấm Tiếp tục sau khi mở đủ nhánh. */
  onComplete?: (items: ItemResult[]) => void;
  /** Tự khám phá: nút Đóng (Esc). */
  onClose?: () => void;
  /** Đường dẫn bản in (Screen49); bỏ trống thì ẩn nút In. */
  printHref?: string;
  /** Nút “Nói theo” chấm phát âm hay chỉ ghi nhận (cài đặt “Chấm phát âm” của hồ sơ). */
  speechScoring?: boolean;
  /** Xem như học sinh ở trang soạn: không có khung bài học, không có Đóng. */
  preview?: boolean;
};

const OPEN_DELAY_MS = 1400;

/**
 * Khám phá từ (Screen48): thẻ từ + 4–6 nhánh câu hỏi quanh từ; mở đủ thì “Đọc cả đoạn”, “Nói theo”, “In”, “Xem lại sơ đồ”.
 * Phím: 1–6 chọn nhánh (hoặc hình), ↑ ↓ đi giữa các nhánh, Space nghe lại câu hỏi, H gợi ý, Enter kiểm tra, Esc thôi hỏi nhánh.
 */
export function ExplorerPlayer({ mode, word, branches, reading, glossary, active = true, accent, onComplete, onClose, printHref, speechScoring = true, preview = false }: ExplorerPlayerProps) {
  const { state, dispatch } = useExplorerFlow(branches.length);
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const [aloud, setAloud] = useState(false);
  const total = branches.length;
  const openCount = state.open.filter(Boolean).length;
  const lessonMode = mode === "lesson";
  const asked = state.ask >= 0 ? branches[state.ask] : null;
  const lastOpened = openCount === total;

  const say = (text: string, rate = 0.82, audioUrl?: string | null) => playPronunciation(text, { accent, rate, audioUrl: audioUrl ?? undefined });
  const focus = (selector: string) => {
    pendingFocus.current = selector;
  };
  const firstClosed = (from = -1) => {
    for (let step = 1; step <= total; step++) {
      const i = (from + step + total) % total;
      if (!state.open[i]) return i;
    }
    return null;
  };

  // Chuyển focus sau khi giao diện vẽ lại (nhánh vừa hỏi, hình vừa chọn, nhánh kế tiếp…).
  useEffect(() => {
    if (!pendingFocus.current) return;
    const target = rootRef.current?.querySelector<HTMLElement>(pendingFocus.current) ?? document.querySelector<HTMLElement>(pendingFocus.current);
    pendingFocus.current = null;
    target?.focus({ preventScroll: true });
  });

  // Tự khám phá: mở đủ thì sau một nhịp ngắn chuyển sang đoạn văn.
  useEffect(() => {
    if (mode !== "explore" || state.done || !lastOpened) return;
    const timer = window.setTimeout(() => {
      dispatch({ type: "finish" });
      focus("[data-rap-focus] button");
    }, OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [mode, state.done, lastOpened, dispatch]);

  // Rời màn thì ngừng đọc.
  useEffect(() => () => stopPronunciation(), []);

  function choose(index: number) {
    if (index < 0 || index >= total) return;
    const branch = branches[index];
    if (state.open[index]) return void say(`${branch.questionEn} ${branch.sentence.en}`);
    if (mode === "explore") {
      dispatch({ type: "choose", index, mode });
      focus(`[data-bq="${index}"]`);
      return void say(`${branch.questionEn} ${branch.sentence.en}`);
    }
    if (state.phase !== "idle") return;
    dispatch({ type: "choose", index, mode });
    focus("[data-opt]");
    say(branch.questionEn, 0.8);
  }

  function pick(id: number) {
    if (!asked) return;
    const choice = asked.choices.find((c) => c.id === id);
    if (!choice || state.dim === id) return;
    dispatch({ type: "pick", id });
    focus(`[data-opt="${id}"]`);
    say(choice.text, 0.85);
  }

  function check() {
    if (!asked || state.sel === null || state.phase !== "idle") return;
    const correct = asked.choices.find((c) => c.correct);
    if (!correct) return;
    const card = rootRef.current?.querySelector(`[data-opt="${state.sel}"]`) ?? null;
    dispatch({ type: "check", correctId: correct.id, choices: asked.choices, wordId: word.id });
    if (state.sel === correct.id) {
      burstStars(card);
      window.setTimeout(() => say(asked.sentence.en), 450);
    } else {
      playSfx("retry");
    }
  }

  function retry() {
    if (!asked) return;
    dispatch({ type: "retry", choices: asked.choices });
    focus("[data-opt]:not([disabled])");
    say(asked.questionEn, 0.8);
  }

  function advance() {
    const next = firstClosed(state.ask);
    dispatch({ type: "advance" });
    focus(lastOpened ? "[data-rap-focus] button" : next !== null ? `[data-bq="${next}"]` : "[data-bq]");
  }

  function hint() {
    if (state.done) return;
    if (asked) {
      dispatch({ type: "hint", choices: asked.choices });
      focus("[data-opt]:not([disabled])");
      return void say(asked.questionEn, 0.7);
    }
    const next = firstClosed(-1);
    if (next !== null) choose(next);
  }

  function replay() {
    if (asked) return void say(asked.questionEn, 0.8);
    say(`${word.word}. ${word.exampleEn ?? ""}`, 0.8);
  }

  function cancelAsk() {
    const was = state.ask;
    dispatch({ type: "cancel" });
    focus(`[data-bq="${was}"]`);
  }

  function main() {
    if (state.done && !state.diagram) return onComplete?.(state.results);
    if (state.phase === "ok") return advance();
    if (state.phase === "wrong") return retry();
    check();
  }

  const keys: Record<string, () => void> = {
    Enter: () => {
      const a = document.activeElement;
      if (a instanceof HTMLButtonElement && !a.matches("[data-opt], [data-main]")) return a.click();
      if (lessonMode) main();
    },
    Space: () => {
      const a = document.activeElement;
      if (a instanceof HTMLButtonElement && !a.closest("[data-foot]")) return a.click();
      replay();
    },
    h: () => lessonMode && hint(),
  };
  for (let n = 1; n <= 6; n++) {
    keys[String(n)] = () => {
      if (state.done && !state.diagram) return;
      if (asked) {
        const choice = asked.choices[n - 1];
        if (choice) pick(choice.id);
      } else choose(n - 1);
    };
  }
  useHotkeys(keys, { enabled: active, captureNative: true });
  // Esc thôi hỏi nhánh (chạy trước phím Esc của khung bài học); không đang hỏi thì màn tự khám phá đóng lại. Trong bài học, Esc khi không hỏi
  // nhánh nào vẫn để khung bài học hỏi “Dừng bài học?”.
  const escapeAsk = asked !== null && state.phase === "idle";
  useHotkeys({ Escape: () => (escapeAsk ? cancelAsk() : onClose?.()) }, { enabled: active && (escapeAsk || (!lessonMode && onClose !== undefined)), capture: true });

  const toast = lessonMode ? `Chọn một nhánh (phím 1–${total}) để Bông hỏi. Đoán sai cũng không sao!` : `Bấm một câu hỏi (phím 1–${total}) để xem câu trả lời. Không tính điểm.`;

  const mapNode = (
    <ExplorerMap
      word={word}
      branches={branches}
      open={state.open}
      ask={state.ask}
      sel={state.sel}
      wrong={state.wrong}
      dim={state.dim}
      glow={state.glow}
      accent={accent}
      onBranch={choose}
      onPick={pick}
      onSayAnswer={(a) => say(a.text, 0.82, a.audio)}
    />
  );

  const instr = (
    <div className={styles.instr}>
      <Mascot expr={asked ? "suynghi" : "chao"} size={60} />
      <p className={styles.say} aria-live="polite">
        {asked ? (
          <>
            Bông hỏi: <b lang="en">{asked.questionEn}</b> <span className={styles.muted}>({asked.questionVi}) · chọn hình, phím 1–{asked.choices.length}</span>
          </>
        ) : (
          toast
        )}
      </p>
      {lessonMode && (
        <span className={styles.count} aria-label={`Đã mở ${openCount} trên ${total} nhánh`}>
          {openCount}/{total} nhánh
        </span>
      )}
    </div>
  );

  const doneView = (
    <div className={styles.done}>
      <div className={styles.doneLeft}>
        <div className={styles.hi}>
          <Mascot expr="chucmung" size={120} />
          <div>
            <h2 className={styles.hiTitle}>Cậu mở đủ {total} nhánh rồi!</h2>
            <p className={styles.hiText}>
              Giờ mình đọc cả đoạn về <b lang="en">{word.word}</b> nhé.
            </p>
          </div>
        </div>
        <div className={styles.miniCard}>
          <WordPicture word={word.word} src={word.image} size={96} label={`Hình: ${word.meaningVi}`} />
          <div>
            <b lang="en" className={styles.miniWord}>
              {word.word}
            </b>
            <span className={styles.miniIpa}>
              {word.ipa ? `${word.ipa} · ` : ""}
              {word.meaningVi}
            </span>
          </div>
          <SpeakerButton word={word.word} size="m" accent={accent} />
        </div>
        <div className={styles.acts}>
          {word.exampleEn && <Button variant="secondary" icon="mic" label="Nói theo" aria-expanded={aloud} onClick={() => setAloud((v) => !v)} />}
          {printHref && <Button variant="secondary" icon="print" label="In" onClick={() => window.open(printHref, "_blank", "noopener")} />}
          <Button variant="ghost" icon="branch" label="Xem lại sơ đồ" onClick={() => dispatch({ type: "diagram", on: true })} />
        </div>
        {aloud && word.exampleEn && <AlongSpeak text={word.exampleEn} accent={accent} scoring={speechScoring} />}
      </div>
      <div className={styles.doneRight} data-rap-focus>
        <ReadAloudParagraph sentences={reading.sentences} audioUrl={reading.audio} glossary={glossary} accent={accent} title={`Đọc cả đoạn về ${word.word}`} hotkeys={active} />
      </div>
    </div>
  );

  const body = state.done && !state.diagram ? doneView : (
    <>
      {instr}
      {mapNode}
      {state.done && (
        <div className={styles.after}>
          <Button variant="secondary" icon="book" label="Về đoạn văn" onClick={() => dispatch({ type: "diagram", on: false })} />
        </div>
      )}
    </>
  );

  const feedback = lessonMode ? (
    <FeedbackBar
      open={state.phase !== "idle"}
      type={state.phase === "wrong" ? "retry" : "ok"}
      title={state.phase === "wrong" ? "Chưa đúng rồi, thử hình khác nhé!" : lastOpened ? `Cậu mở đủ ${total} nhánh rồi!` : "Đúng rồi! Giỏi quá!"}
      detail={
        state.phase === "wrong" ? (
          asked && (
            <span>
              Bông hỏi: <b lang="en">{asked.questionEn}</b> ({asked.questionVi})
            </span>
          )
        ) : asked ? (
          <span className={styles.fbDetail}>
            <SpeakerButton word={asked.sentence.en} size="s" accent={accent} />
            <b lang="en" className={styles.fbEn}>
              {asked.sentence.en}
            </b>
            <span>{asked.sentence.vi}</span>
          </span>
        ) : undefined
      }
      action={state.phase === "wrong" ? "Thử lại" : "Tiếp tục"}
      onAction={state.phase === "wrong" ? retry : advance}
    />
  ) : null;

  if (lessonMode) {
    const inDone = state.done && !state.diagram;
    return (
      <div ref={rootRef} className={styles.root}>
        <LessonMain>
          <div className={styles.stage}>{body}</div>
        </LessonMain>
        <LessonFoot
          left={
            <div data-foot className={styles.footGrp}>
              <Button variant="secondary" size="l" icon="replay" label="Nghe lại" shortcut="Space" onClick={replay} />
              <Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="H" disabled={state.done || state.phase !== "idle" || (asked !== null && state.dim !== null)} onClick={hint} />
            </div>
          }
          right={
            <Button
              data-main
              variant="primary"
              size="l"
              label={inDone || state.done ? "Tiếp tục" : "Kiểm tra"}
              shortcut="Enter"
              disabled={!state.done && state.sel === null}
              onClick={() => (state.done ? onComplete?.(state.results) : check())}
            />
          }
        />
        {feedback}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={styles.screen}>
      <header className={styles.top}>
        {onClose && <IconButton icon="close" label="Đóng, về Sổ từ (Esc)" onClick={onClose} data-hotkey-skip />}
        <div className={styles.ttl}>
          <span className={styles.kind}>
            <Icon name="branch" size={18} />
            Khám phá từ
          </span>
          <h1 className={styles.title} lang="en">
            {word.word}
          </h1>
        </div>
        <span className={styles.free}>
          <Icon name="compass" size={18} />
          {preview ? "Xem như học sinh" : "Tự khám phá · không tính điểm"}
        </span>
      </header>
      <main className={styles.mainFree}>
        <div className={styles.stage}>{body}</div>
      </main>
    </div>
  );
}
