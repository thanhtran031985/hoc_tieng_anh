"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Button, Icon, IconButton, Mascot } from "@/components/ui";
import { BuildBoard, type BuildBoardWord } from "@/components/wordlab";
import { GameEndDialog } from "@/components/lesson";
import { burstStars } from "@/features/lesson/burst";
import { LessonFoot, LessonMain } from "@/features/lesson/LessonFrame";
import { buildStep, flushPending, initialBuild, onsetOfWord, typeOnset } from "@/lib/rules/build-flow";
import type { ItemResult } from "@/lib/rules/lesson-session";
import { buildDone, checkOnset, type FamilyView } from "@/lib/rules/word-family";
import { playSfx } from "@/lib/sound";
import { playPronunciation, stopPronunciation, type SpeechAccent } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import styles from "./family.module.css";

export type BuildPlayerProps = {
  /** `lesson`: một bước của bài (tìm đủ số từ thì có bảng kết thúc). `explore`: tự khám phá, không sao, không xu. */
  mode: "lesson" | "explore";
  family: FamilyView;
  /** Hàng chữ đầu đã chọn và xáo (`buildTiles`). */
  tiles: readonly string[];
  /** Từ cần ghép đầu tiên (mở từ thẻ ở Họ vần): mã từ. */
  first?: number | null;
  /** Tắt phím tắt khi hộp thoại đang mở. */
  active?: boolean;
  accent?: SpeechAccent;
  /** Bước bài học: gọi một lần khi bé bấm Tiếp tục ở bảng kết thúc. Ghép chữ không chấm điểm nên không có mục nào. */
  onComplete?: (items: ItemResult[]) => void;
  /** Tự khám phá: nút Đóng (Esc). */
  onClose?: () => void;
  /** Tự khám phá: nút “Về họ vần”. */
  onBackToFamily?: () => void;
  /** Backspace khi ô trống: quay lại bậc trước (tự khám phá). */
  onBack?: () => void;
  /** Bấm một từ trong “Đã tìm được” (tự khám phá): mở Khám phá của từ đó. */
  onOpenFound?: (wordId: number) => void;
  /** Chip của từ bị khóa khi đường dẫn đã đủ bậc. */
  isFoundLocked?: (wordId: number) => boolean;
  /** Xem như học sinh ở trang soạn. */
  preview?: boolean;
  /** Nhúng trong khung khác (có đầu màn riêng): chỉ vẽ phần thân. */
  embedded?: boolean;
};

const SETTLE_MS = { ok: 1900, again: 1900, fake: 2400 } as const;
const AUTO_CHECK_MS = 450;
const TYPE_WAIT_MS = 700;
const END_DELAY_MS = 900;

/**
 * Ghép chữ đầu (Screen51): kéo, bấm hoặc gõ một chữ đầu vào ô trống trước vần rồi kiểm tra; từ thật bay vào “Đã tìm được”,
 * từ không có thật chỉ nhắc nhẹ (không trừ điểm). Phím: gõ chữ (s rồi h cho “sh”), Enter kiểm tra, Backspace xóa ô, ? gợi ý, Space nghe vần.
 */
export function BuildPlayer({ mode, family, tiles, first = null, active = true, accent, onComplete, onClose, onBackToFamily, onBack, onOpenFound, isFoundLocked, preview = false, embedded = false }: BuildPlayerProps) {
  const lessonMode = mode === "lesson";
  const { build } = family;
  const rime = build.rime;

  const words = useMemo<BuildBoardWord[]>(
    () =>
      build.words.map((w) => {
        const member = family.members.find((m) => m.wordId === w.wordId);
        return { wordId: w.wordId, onset: w.onset, word: w.word, image: member?.image ?? null, meaningVi: member?.meaningVi ?? "", hasExplorer: member?.hasExplorer ?? false };
      }),
    [build.words, family.members],
  );
  const byOnset = useMemo(() => new Map(words.map((w) => [w.onset, w])), [words]);
  const firstOnset = useMemo(() => onsetOfWord(build, words.find((w) => w.wordId === first)?.word), [build, words, first]);
  const ctx = useMemo(() => ({ info: build, tiles, firstOnset }), [build, tiles, firstOnset]);
  const [state, dispatch] = useReducer((s: ReturnType<typeof initialBuild>, a: Parameters<typeof buildStep>[1]) => buildStep(s, a, ctx), firstOnset, initialBuild);

  const [end, setEnd] = useState(false);
  const [fresh, setFresh] = useState<string | null>(null);
  const [ghost, setGhost] = useState<{ onset: string; x: number; y: number } | null>(null);
  const [over, setOver] = useState(false);
  const slotRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef("");
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const say = useCallback((text: string, rate = 0.8) => playPronunciation(text, { accent, rate }), [accent]);
  const clearTimers = useCallback(() => {
    for (const t of [settleTimer, checkTimer, typeTimer]) {
      if (t.current) clearTimeout(t.current);
      t.current = null;
    }
  }, []);
  useEffect(
    () => () => {
      clearTimers();
      stopPronunciation();
    },
    [clearTimers],
  );

  /** Kiểm chữ ở ô trống; dùng trạng thái mới nhất vì được gọi từ hẹn giờ. */
  const check = useCallback(() => {
    const s = stateRef.current;
    if (!s.slot || s.phase !== "idle") return;
    if (checkTimer.current) clearTimeout(checkTimer.current);
    const result = checkOnset(build, s.found, s.slot);
    if (result === "empty") return;
    const word = byOnset.get(s.slot);
    dispatch({ type: "check" });
    if (result === "real" && word) {
      say(word.word);
      playSfx("correct");
      burstStars(slotRef.current);
      setFresh(s.slot);
    } else if (result === "dup" && word) say(word.word);
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => dispatch({ type: "settle" }), SETTLE_MS[result === "real" ? "ok" : result === "dup" ? "again" : "fake"]);
  }, [build, byOnset, say]);

  const place = useCallback(
    (onset: string) => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
      if (checkTimer.current) clearTimeout(checkTimer.current);
      dispatch({ type: "place", onset });
      setFresh(null);
      say(onset);
      // Tự khám phá: đặt chữ xong tự kiểm sau một nhịp ngắn. Trong bài bé bấm Kiểm tra (Enter).
      if (!lessonMode) checkTimer.current = setTimeout(check, AUTO_CHECK_MS);
    },
    [check, lessonMode, say],
  );

  function clearSlot() {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    if (checkTimer.current) clearTimeout(checkTimer.current);
    dispatch({ type: "clear" });
  }

  // Tìm đủ mục tiêu: trong bài hiện bảng kết thúc sau một nhịp ngắn (để bé thấy từ cuối vào Đã tìm được).
  const doneBefore = useRef(false);
  const done = buildDone(state.found, build.goal);
  useEffect(() => {
    if (!done || doneBefore.current) return;
    doneBefore.current = true;
    if (!lessonMode) return;
    const timer = setTimeout(() => setEnd(true), END_DELAY_MS);
    return () => clearTimeout(timer);
  }, [done, lessonMode]);

  function hear() {
    const s = stateRef.current;
    say(s.slot ? s.slot + rime : rime, 0.75);
  }

  function hint() {
    dispatch({ type: "hint" });
  }

  // ---- Kéo, bấm ô chữ ----
  const overSlot = (x: number, y: number) => {
    const r = slotRef.current?.getBoundingClientRect();
    return r !== undefined && x > r.left && x < r.right && y > r.top && y < r.bottom;
  };
  function onTilePointerDown(event: React.PointerEvent<HTMLButtonElement>, onset: string) {
    if (event.button !== 0 || !active || end) return;
    const start = { x: event.clientX, y: event.clientY };
    let moved = false;
    const move = (ev: PointerEvent) => {
      if (!moved && Math.abs(ev.clientX - start.x) + Math.abs(ev.clientY - start.y) < 8) return;
      moved = true;
      setGhost({ onset, x: ev.clientX, y: ev.clientY });
      setOver(overSlot(ev.clientX, ev.clientY));
    };
    const stop = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", cancel);
    };
    const up = (ev: PointerEvent) => {
      stop();
      setGhost(null);
      setOver(false);
      if (!moved || overSlot(ev.clientX, ev.clientY)) place(onset);
    };
    const cancel = () => {
      stop();
      setGhost(null);
      setOver(false);
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", cancel);
  }

  // ---- Phím ----
  const typeLetter = (letter: string) => {
    if (typeTimer.current) clearTimeout(typeTimer.current);
    const result = typeOnset(pending.current, letter, tiles);
    pending.current = result.pending;
    if (result.kind === "place") return place(result.onset);
    if (result.kind === "nope") return dispatch({ type: "nope", letter });
    typeTimer.current = setTimeout(() => {
      const onset = flushPending(pending.current, tiles);
      pending.current = "";
      if (onset) place(onset);
    }, TYPE_WAIT_MS);
  };
  const keys: Record<string, () => void> = {
    Enter: () => check(),
    Space: hear,
    Backspace: () => (state.slot ? clearSlot() : onBack?.()),
    Delete: clearSlot,
    "?": () => lessonMode && hint(),
  };
  for (const letter of "abcdefghijklmnopqrstuvwxyz") keys[letter] = () => typeLetter(letter);
  useHotkeys(keys, { enabled: active && !end, capture: true });
  useHotkeys({ Escape: () => onClose?.() }, { enabled: active && !end && !lessonMode && onClose !== undefined, capture: true });

  const foundWords = state.found.flatMap((o) => (byOnset.get(o) ? [byOnset.get(o)!] : []));
  const slotWord = state.slot ? (byOnset.get(state.slot) ?? null) : null;
  const target = state.target ? (byOnset.get(state.target) ?? null) : null;
  const shownProgress = Math.min(state.found.length, build.goal);

  const body = (
    <div className={styles.stage}>
      <div className={styles.instr}>
        <Mascot expr={state.phase === "fake" ? "dongvien" : state.phase === "ok" ? "vui" : "chao"} size={60} />
        <p className={styles.say} aria-live="polite">
          Ghép một chữ đầu với vần <b lang="en">{rime}</b> để thành từ. Tìm đủ {build.goal} từ nhé!
        </p>
        {lessonMode && (
          <span className={styles.count} aria-label={`Đã tìm ${shownProgress} trên ${build.goal} từ`}>
            {shownProgress}/{build.goal} từ
          </span>
        )}
      </div>
      <BuildBoard
        rime={rime}
        tiles={tiles}
        slot={state.slot}
        phase={state.phase}
        slotWord={slotWord}
        hint={state.hint}
        target={target}
        found={foundWords}
        goal={build.goal}
        message={state.message}
        fresh={fresh}
        dragging={ghost?.onset ?? null}
        over={over}
        ghost={ghost}
        accent={accent}
        slotRef={slotRef}
        onTilePointerDown={onTilePointerDown}
        onTile={place}
        onOpenFound={!lessonMode && onOpenFound ? (w) => onOpenFound(w.wordId) : undefined}
        isFoundLocked={isFoundLocked ? (w) => isFoundLocked(w.wordId) : undefined}
      />
    </div>
  );

  const endDialog = (
    <GameEndDialog
      open={end}
      result={{ correct: build.goal, total: build.goal, stars: 3, title: `Cậu ghép đủ ${build.goal} từ rồi!`, note: `Các từ: ${foundWords.map((w) => w.word).join(", ")}.` }}
      onNext={() => onComplete?.([])}
    />
  );

  if (lessonMode) {
    return (
      <div className={styles.root}>
        <LessonMain>{body}</LessonMain>
        <LessonFoot
          left={
            <div data-foot className={styles.footGrp}>
              <Button variant="secondary" size="l" icon="replay" label="Nghe lại" shortcut="Space" onClick={hear} />
              <Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="?" disabled={done} onClick={hint} />
            </div>
          }
          right={<Button data-main variant="primary" size="l" label="Kiểm tra" shortcut="Enter" disabled={!state.slot || state.phase !== "idle"} onClick={check} />}
        />
        {endDialog}
      </div>
    );
  }

  if (embedded) return body;

  return (
    <div className={styles.screen}>
      <header className={styles.top}>
        {onClose && <IconButton icon="close" label="Đóng, về Sổ từ (Esc)" onClick={onClose} data-hotkey-skip />}
        <div className={styles.ttl}>
          <span className={styles.kind}>
            <Icon name="blocks" size={18} />
            Ghép chữ đầu
          </span>
          <h1 className={styles.title}>Ghép chữ đầu với vần -{rime}</h1>
        </div>
        {onBackToFamily && <Button variant="secondary" size="m" icon="family" label="Về họ vần" onClick={onBackToFamily} />}
        <span className={styles.free}>
          <Icon name="compass" size={18} />
          {preview ? "Xem như học sinh" : "Tự khám phá · không tính điểm"}
        </span>
      </header>
      <main className={styles.mainFree}>{body}</main>
    </div>
  );
}
