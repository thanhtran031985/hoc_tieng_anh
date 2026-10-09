"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, SpeakerButton, WordPicture } from "@/components/ui";
import { gradePhonics, tileForKey, tileForSlot } from "@/lib/rules/grading/phonics";
import { phonicsSay } from "@/lib/rules/phonics";
import { cn } from "@/lib/cn";
import { stopPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { burstStars } from "./burst";
import { useLadder } from "./ladder";
import { LessonFoot, LessonMain } from "./LessonFrame";
import lesson from "./lesson.module.css";
import styles from "./phonics.module.css";
import { sayAsync, wait } from "./speak";
import { TypedFeedback } from "./TypedFeedback";
import type { StepProps } from "./types";

/** Mỗi âm sáng lên khi được đọc (khớp --duration-read-word × 2). */
const LIT_MS = 840;
const AFTER_WORD_MS = 900;
const SOUND_RATE = 0.7;

/** Ghép âm thành từ (Screen23): bấm, kéo hoặc gõ chữ để xếp các ô chữ vào ô trống đúng thứ tự; nghe từng âm. */
export function PhonicsStep({ step, active, onComplete }: StepProps<"phonics">) {
  const { tiles, order, sounds, picture } = step;
  const ladder = useLadder();
  // Ô trống i chứa id của ô chữ đã đặt (null nếu trống).
  const [typed, setSlots] = useState<(number | null)[]>(() => order.map(() => null));
  const [hint, setHint] = useState(false);
  const [lit, setLit] = useState<number | null>(null);
  const [celebrated, setCelebrated] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const [wrongSlots, setWrongSlots] = useState<number[]>([]);
  const alive = useRef(true);

  // Sai lần 3: hiện sẵn đáp án đúng.
  const revealed = ladder.phase === "reveal";
  const answerSlots = useMemo(() => {
    const left = tiles.map((t) => ({ text: t.text, used: false }));
    return order.map((expected) => {
      const idx = tileForSlot(left, expected);
      if (idx >= 0) left[idx].used = true;
      return idx >= 0 ? tiles[idx].id : null;
    });
  }, [tiles, order]);
  const slots = revealed ? answerSlots : typed;

  const tileById = useMemo(() => new Map(tiles.map((t) => [t.id, t])), [tiles]);
  const used = useMemo(() => new Set(slots.filter((s): s is number => s !== null)), [slots]);
  const placedText = slots.map((s) => (s === null ? null : (tileById.get(s)?.text ?? null)));
  const full = slots.every((s) => s !== null);
  const ghost = hint || ladder.autoHint;

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      stopPronunciation();
    };
  }, []);

  const playSound = useCallback(
    (sound: string): Promise<void> => sayAsync(phonicsSay(sound), { rate: SOUND_RATE, audioUrl: sounds[sound]?.audio ?? null }),
    [sounds],
  );

  function hearTile(id: number) {
    const tile = tileById.get(id);
    if (!tile) return;
    setPlaying(id);
    void playSound(tile.sound).then(() => alive.current && setPlaying((p) => (p === id ? null : p)));
  }

  function place(id: number, at?: number) {
    if (!ladder.answering || used.has(id)) return;
    const index = at !== undefined && slots[at] === null ? at : slots.indexOf(null);
    if (index < 0) return;
    setSlots((prev) => prev.map((s, i) => (i === index ? id : s)));
    setWrongSlots([]);
    hearTile(id);
  }

  function clearSlot(i: number) {
    if (!ladder.answering || slots[i] === null) return;
    setSlots((prev) => prev.map((s, j) => (j === i ? null : s)));
    setWrongSlots([]);
  }

  function backspace() {
    for (let i = slots.length - 1; i >= 0; i--) {
      if (slots[i] !== null) return clearSlot(i);
    }
  }

  function hearWord() {
    void sayAsync(step.text, { audioUrl: undefined });
  }

  // Gợi ý: hiện chữ mờ ở các ô trống; nếu ô kế đang để sai chỗ thì bỏ ra và đặt ô đúng vào.
  function giveHint() {
    if (!ladder.answering) return;
    setHint(true);
  }

  function check() {
    if (!ladder.answering || !full) return;
    const grade = gradePhonics(placedText, order);
    ladder.submit(grade.correct, placedText.join(""));
    if (!grade.correct) {
      setWrongSlots(grade.marks.flatMap((m, i) => (m === "ok" ? [] : [i])));
    }
  }

  // Sau khi sai: giữ các ô đúng, trả ô sai về khay; từ lần sai thứ hai tự đặt giúp ô kế tiếp.
  function retry() {
    const grade = gradePhonics(placedText, order);
    let next = slots.map((s, i) => (grade.marks[i] === "ok" ? s : null));
    if (ladder.tries >= 2) {
      const at = next.indexOf(null);
      const id = at >= 0 ? tileForSlot(tiles.map((t) => ({ text: t.text, used: next.includes(t.id) })), order[at]) : -1;
      if (id >= 0) next = next.map((s, i) => (i === at ? tiles[id].id : s));
    }
    setSlots(next);
    setWrongSlots([]);
    ladder.retry();
  }

  // Đúng: đọc lần lượt từng âm (sáng từng ô), rồi cả từ.
  useEffect(() => {
    if (ladder.phase !== "ok") return;
    burstStars(document.querySelector("[data-slots]"));
    void (async () => {
      for (let i = 0; i < order.length && alive.current; i++) {
        setLit(i);
        const tile = tileById.get(slots[i] ?? -1);
        await Promise.all([tile ? playSound(tile.sound) : Promise.resolve(), wait(LIT_MS)]);
      }
      if (!alive.current) return;
      setLit(null);
      await sayAsync(step.text);
      await wait(AFTER_WORD_MS);
      if (alive.current) setCelebrated(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ladder.phase]);

  const keys: Record<string, (e: KeyboardEvent) => void> = {
    Enter: () => {
      const focused = document.activeElement;
      const tileId = focused instanceof HTMLElement && focused.dataset.tile !== undefined ? Number(focused.dataset.tile) : null;
      if (tileId !== null && !used.has(tileId)) place(tileId);
      else check();
    },
    Space: hearWord,
    h: giveHint,
    Backspace: backspace,
  };
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    if (letter === "h") continue;
    keys[letter] = () => {
      const i = tileForKey(tiles.map((t) => ({ text: t.text, used: used.has(t.id) })), letter);
      if (i >= 0) place(tiles[i].id);
    };
  }
  // "h" vừa là chữ vừa là Gợi ý: có ô bắt đầu bằng h còn trống thì đặt ô đó, không thì xin gợi ý.
  keys.h = () => {
    const i = tileForKey(tiles.map((t) => ({ text: t.text, used: used.has(t.id) })), "h");
    if (i >= 0) place(tiles[i].id);
    else giveHint();
  };
  useHotkeys(keys, { enabled: active && ladder.answering, captureNative: true });

  const answerText = order.join(" · ");
  return (
    <>
      <LessonMain>
        <div className={styles.head}>
          <h1 className={lesson.instr}>Ghép âm thành từ</h1>
          <span className={styles.caption}>Bấm ô chữ để nghe âm · kéo vào ô trống hoặc gõ chữ</span>
        </div>
        <div className={styles.stage}>
          <div className={styles.pic}>
            {picture ? (
              <>
                <WordPicture word={picture.word} src={picture.image} size={200} label="Hình của từ cần ghép" />
                <SpeakerButton word={step.text} size="m" label="Nghe cả từ" className={styles.picSpeaker} />
              </>
            ) : (
              <SpeakerButton word={step.text} size="l" label="Nghe cả từ" />
            )}
          </div>
          <div className={styles.work}>
            <div className={styles.slots} role="group" aria-label="Các ô trống theo thứ tự" data-slots>
              {order.map((expected, i) => {
                const id = slots[i];
                const tile = id === null ? null : tileById.get(id);
                const state = lit === i ? "lit" : ladder.phase === "ok" ? "ok" : wrongSlots.includes(i) ? "bad" : tile ? "filled" : "empty";
                return (
                  <button
                    key={i}
                    type="button"
                    className={cn(styles.slot, styles[state], expected.length > 1 && styles.wide)}
                    aria-label={tile ? `Ô ${i + 1}: ${tile.text}. Bấm để bỏ ra` : `Ô trống ${i + 1}`}
                    onClick={() => clearSlot(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const raw = e.dataTransfer.getData("text/plain");
                      if (raw !== "") place(Number(raw), i);
                    }}
                  >
                    {tile ? tile.text : ghost ? <span className={styles.ghost}>{expected}</span> : null}
                  </button>
                );
              })}
            </div>
            <div className={styles.pool} role="group" aria-label="Ô chữ xáo trộn">
              {tiles.map((tile) => {
                const isUsed = used.has(tile.id);
                return (
                  <button
                    key={tile.id}
                    type="button"
                    data-tile={tile.id}
                    draggable={!isUsed && ladder.answering}
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", String(tile.id))}
                    className={cn(styles.tile, tile.text.length > 1 && styles.wide, isUsed && styles.used, playing === tile.id && styles.playing)}
                    disabled={isUsed}
                    aria-label={`Ô chữ ${tile.text}`}
                    onClick={() => place(tile.id)}
                  >
                    <span className={styles.letter} lang="en">
                      {tile.text}
                    </span>
                    {sounds[tile.sound]?.ipa && <span className={styles.ipa}>{sounds[tile.sound].ipa}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button variant="secondary" size="l" icon="speaker" label="Nghe lại" shortcut="Space" onClick={hearWord} />
            <Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="H" disabled={!ladder.answering || ghost} onClick={giveHint} />
          </>
        }
        right={<Button variant="primary" size="l" label="Kiểm tra" shortcut="Enter" disabled={!ladder.answering || !full} onClick={check} />}
      />
      <TypedFeedback
        phase={ladder.phase}
        ready={celebrated}
        okTitle="Ghép đúng rồi!"
        okDetail={
          <span className={lesson.answer}>
            <span className={lesson.answerWord} lang="en">
              {step.text}
            </span>
            <span>{[picture?.ipa, picture?.meaningVi].filter(Boolean).join(" · ")}</span>
          </span>
        }
        wrongDetail={
          ladder.tries >= 2 ? "Nghe lại từng âm rồi xếp theo thứ tự nhé. Bông bật gợi ý cho cậu rồi đó!" : "Nghe lại từng âm rồi xếp theo thứ tự nhé."
        }
        revealDetail={
          <span className={lesson.answer}>
            <span className={lesson.answerWord} lang="en">
              {step.text}
            </span>
            <span>{answerText}</span>
          </span>
        }
        onContinue={() => onComplete([ladder.result({ wordId: picture?.id ?? null, questionId: step.questionId })])}
        onRetry={retry}
      />
    </>
  );
}
