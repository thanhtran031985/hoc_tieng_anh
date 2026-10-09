"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Icon, Mascot, SpeakerButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import { firstLetterHint, gradeDictation, type CharMark } from "@/lib/rules/grading/dictation";
import { stopPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { burstStars } from "./burst";
import styles from "./dictation.module.css";
import { useLadder } from "./ladder";
import { LessonFoot, LessonMain } from "./LessonFrame";
import lesson from "./lesson.module.css";
import { sayAsync } from "./speak";
import { TypedFeedback } from "./TypedFeedback";
import type { StepProps } from "./types";

const AUTO_READ_MS = 200;
const SLOW_RATE = 0.45;
const RETRY_RATE = 0.5;

/** Nghe và gõ (Screen27): nghe từ hoặc câu rồi gõ lại. Từ ngắn gõ mỗi chữ một ô; câu gõ một dòng. Gợi ý bằng phím ?, nghe lại bằng Space / Ctrl+Space. */
export function DictationStep({ step, active, onComplete }: StepProps<"dictation">) {
  const { text, accepted, short } = step;
  const options = useMemo(() => ({ ignoreCase: step.ignoreCase, ignoreEndPunct: step.ignoreEndPunct }), [step.ignoreCase, step.ignoreEndPunct]);
  const ladder = useLadder();
  const letters = text.trim().length;
  const [typedChars, setChars] = useState<string[]>(() => Array.from({ length: letters }, () => ""));
  const [typedLine, setLine] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [marks, setMarks] = useState<CharMark[]>([]);
  const [slowRead, setSlowRead] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const lineRef = useRef<HTMLInputElement>(null);

  const first = firstLetterHint(accepted);
  const given = hintLevel >= 1 && first !== "";
  const revealed = ladder.phase === "reveal";
  // Chữ đầu được gợi ý thì điền sẵn (ô khóa); sai lần 3 thì hiện đáp án.
  const chars = revealed
    ? Array.from(accepted[0].trim().padEnd(letters)).slice(0, letters)
    : given
      ? typedChars.map((c, i) => (i === 0 ? first : c))
      : typedChars;
  const line = revealed ? accepted[0] : given && typedLine === "" ? first : typedLine;
  const value = short ? chars.join("") : line;

  useEffect(() => {
    const timer = setTimeout(() => void sayAsync(text), AUTO_READ_MS);
    return () => {
      clearTimeout(timer);
      stopPronunciation();
    };
  }, [text]);

  useEffect(() => {
    if (!active || !ladder.answering) return;
    (short ? refs.current[given ? 1 : 0] : lineRef.current)?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ladder.answering]);

  const hear = (rate?: number) => void sayAsync(text, rate ? { rate } : {});
  function hint() {
    if (!ladder.answering) return;
    if (hintLevel === 0) setHintLevel(1);
    else {
      setHintLevel(2);
      setSlowRead(true);
      hear(SLOW_RATE);
    }
  }

  function check() {
    if (!ladder.answering || value.trim() === "") return;
    const grade = gradeDictation(value, accepted, options);
    setMarks(grade.marks);
    ladder.submit(grade.correct, value);
  }

  function retry() {
    ladder.retry();
    // Từ lần sai thứ hai bật gợi ý chữ đầu; đọc lại chậm cho bé nghe rõ.
    if (ladder.tries >= 2 && hintLevel === 0) setHintLevel(1);
    setSlowRead(true);
    hear(RETRY_RATE);
  }

  useEffect(() => {
    if (ladder.phase === "ok") {
      burstStars(document.querySelector("[data-dictation]"));
      void sayAsync(text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ladder.phase]);

  function setChar(i: number, raw: string) {
    if (!ladder.answering || (given && i === 0)) return;
    const letter = raw.replace(/[^A-Za-z']/g, "").slice(-1);
    setMarks([]);
    setChars((prev) => prev.map((c, j) => (j === i ? letter : c)));
    if (letter && i < letters - 1) refs.current[i + 1]?.focus();
  }
  function onCharKey(i: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && chars[i] === "" && i > (given ? 1 : 0)) {
      event.preventDefault();
      refs.current[i - 1]?.focus();
    } else if (event.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (event.key === "ArrowRight" && i < letters - 1) {
      refs.current[i + 1]?.focus();
    }
  }

  const keys: Record<string, () => void> = { "?": hint, Enter: check, "Ctrl+Space": () => hear() };
  if (short) keys.Space = () => hear();
  useHotkeys(keys, { enabled: active && ladder.answering, captureNative: true, inInputs: short ? ["?", "Enter", "Space"] : ["?", "Enter"] });

  const status = (i: number) => (marks[i] ? marks[i].state : undefined);
  const readOnly = !ladder.answering;
  return (
    <>
      <LessonMain>
        <div className={styles.head}>
          <h1 className={lesson.instr}>{short ? "Nghe và gõ từ" : "Nghe và gõ câu"}</h1>
          <span className={styles.caption}>Bấm loa hoặc {short ? "Space" : "Ctrl+Space"} để nghe lại</span>
        </div>
        <div className={styles.stage} data-dictation>
          <div className={styles.dragon}>
            <Mascot expr={hintLevel > 0 || ladder.tries > 0 ? "suynghi" : "chao"} size={120} />
          </div>
          <SpeakerButton word={text} size="l" label="Nghe lại" rate={slowRead ? RETRY_RATE : undefined} />
        </div>
        <div className={styles.chips} aria-live="polite">
          {given && (
            <span className={styles.chip}>
              <Icon name="bulb" size={18} />
              Chữ đầu: {first}
            </span>
          )}
          {hintLevel >= 2 && (
            <span className={styles.chip}>
              <Icon name="speaker" size={18} />
              Bông đã đọc chậm
            </span>
          )}
        </div>
        {short ? (
          <div className={styles.boxes} role="group" aria-label={`Gõ từ vừa nghe, ${letters} chữ cái`}>
            {chars.map((c, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className={cn(styles.box, status(i) === "bad" && styles.bad, status(i) === "ok" && ladder.phase !== "answering" && styles.good, given && i === 0 && styles.given)}
                value={c}
                maxLength={2}
                readOnly={readOnly || (given && i === 0)}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label={`Chữ cái ${i + 1}`}
                inputMode="text"
                lang="en"
                onChange={(e) => setChar(i, e.target.value)}
                onKeyDown={(e) => onCharKey(i, e)}
                onFocus={(e) => e.currentTarget.select()}
              />
            ))}
          </div>
        ) : (
          <div className={styles.sentence}>
            <label className={styles.srOnly} htmlFor="dictation-line">
              Gõ câu vừa nghe
            </label>
            <input
              id="dictation-line"
              ref={lineRef}
              className={styles.line}
              value={line}
              placeholder={given ? `${first} …` : "Gõ câu vừa nghe…"}
              readOnly={readOnly}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              lang="en"
              onChange={(e) => {
                setMarks([]);
                setLine(e.target.value);
              }}
            />
            <div className={styles.diff} aria-live="polite" lang="en">
              {marks.length > 0 && ladder.phase === "wrong" && (
                <>
                  {marks.map((m, i) => (
                    <span key={i} className={cn(m.state === "bad" && styles.diffBad, m.state === "missing" && styles.diffMissing)}>
                      {m.char}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
        {revealed && <span className={styles.caption}>Đáp án: {accepted[0]}</span>}
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button variant="secondary" size="l" icon="speaker" label="Nghe lại" shortcut={short ? "Space" : "Ctrl+Space"} onClick={() => hear()} />
            <Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="?" disabled={!ladder.answering || hintLevel >= 2} onClick={hint} />
          </>
        }
        right={<Button variant="primary" size="l" label="Kiểm tra" shortcut="Enter" disabled={!ladder.answering || value.trim() === ""} onClick={check} />}
      />
      <TypedFeedback
        phase={ladder.phase}
        okTitle="Gõ đúng rồi! Giỏi quá!"
        okDetail={
          <span className={lesson.answer}>
            <span className={lesson.answerWord} lang="en">
              {text}
            </span>
          </span>
        }
        wrongDetail="Chữ tô cam chưa đúng, phần còn lại cậu gõ đúng rồi. Nghe lại nhé."
        revealDetail={
          <span className={lesson.answer}>
            <span className={lesson.answerWord} lang="en">
              {accepted[0]}
            </span>
          </span>
        }
        onContinue={() => onComplete([ladder.result({ wordId: null, questionId: step.questionId })])}
        onRetry={retry}
      />
    </>
  );
}
