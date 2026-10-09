"use client";

import { useRef, useState } from "react";
import { Button, FeedbackBar, Icon, KeyHint, SpeakerButton, WordPicture } from "@/components/ui";
import { ClickableWords } from "@/components/lesson";
import { cn } from "@/lib/cn";
import { dimTarget, isCorrect, neighbourQuestion, nextUndone } from "@/lib/rules/grading/reading";
import type { ItemResult } from "@/lib/rules/lesson-session";
import { litInSentence } from "@/lib/rules/lesson-story";
import { playSfx } from "@/lib/sound";
import { playPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { burstStars } from "./burst";
import { LessonFoot, LessonMain } from "./LessonFrame";
import lesson from "./lesson.module.css";
import styles from "./reading.module.css";
import { useStoryReader } from "./story-reader";
import type { StepProps } from "./types";

const KEYS = ["1", "2", "3"] as const;
const HINT_RATE = 0.75;
const OK_TITLES = ["Chính xác! Giỏi quá!", "Tuyệt vời!", "Đúng rồi!"];

type Feedback = { kind: "ok" | "wrong" | "reveal"; qi: number };
type Q = { sel: number | null; done: boolean; tries: number; hint: boolean; dimmed: number[]; picks: string[]; revealed: boolean };

const blank = (): Q => ({ sel: null, done: false, tries: 0, hint: false, dimmed: [], picks: [], revealed: false });

/** Đọc hiểu ngắn (Screen29): đoạn văn bên trái (nghe cả đoạn, bấm từ nghe + nghĩa), 2–3 câu hỏi chọn đáp án bên phải. */
export function ReadingStep({ step, active, onComplete }: StepProps<"short_reading">) {
  const { questions, sentences } = step;
  const reader = useStoryReader();
  const [qs, setQs] = useState<Q[]>(() => questions.map(blank));
  const [cur, setCur] = useState(0);
  const [hl, setHl] = useState<number | null>(null);
  const [fb, setFb] = useState<Feedback | null>(null);
  const [lastWrongText, setLastWrongText] = useState("");
  const answered = useRef<Map<number, ItemResult>>(new Map());

  const q = questions[cur];
  const st = qs[cur];
  const doneFlags = qs.map((x) => x.done);
  const passage = sentences.join(" ");
  const update = (i: number, patch: Partial<Q>) => setQs((prev) => prev.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  function pick(qi: number, j: number) {
    if (fb || qs[qi].done || qs[qi].dimmed.includes(j)) return;
    setCur(qi);
    update(qi, { sel: j });
    playPronunciation(questions[qi].choices[j], { rate: 0.85 });
  }

  function giveHint(qi: number) {
    if (qs[qi].done || qs[qi].hint) return;
    const target = dimTarget(questions[qi].choices.length, questions[qi].correct, qs[qi].dimmed, qs[qi].sel);
    update(qi, { hint: true, dimmed: target === null ? qs[qi].dimmed : [...qs[qi].dimmed, target] });
    setHl(questions[qi].evidence);
    playPronunciation(sentences[questions[qi].evidence], { rate: HINT_RATE });
  }

  function check() {
    if (fb || st.done || st.sel === null) return;
    const text = q.choices[st.sel];
    const picks = [...st.picks, text];
    if (isCorrect(st.sel, q.correct)) {
      update(cur, { done: true, picks });
      answered.current.set(cur, { wordId: null, questionId: step.questionId ?? undefined, firstTryCorrect: st.tries === 0, wrong: st.tries, revealed: false, picks, scored: true });
      setHl(null);
      setFb({ kind: "ok", qi: cur });
      burstStars(document.querySelector(`[data-opt="${cur}-${st.sel}"]`));
      playPronunciation(text, { rate: 0.85 });
      return;
    }
    const tries = st.tries + 1;
    setLastWrongText(text);
    playSfx("retry");
    if (tries >= 3) {
      update(cur, { done: true, tries, picks, sel: q.correct, revealed: true });
      answered.current.set(cur, { wordId: null, questionId: step.questionId ?? undefined, firstTryCorrect: false, wrong: tries, revealed: true, picks, scored: true });
      setHl(q.evidence);
      setFb({ kind: "reveal", qi: cur });
      return;
    }
    // Sai lần 2: tự bật gợi ý (sáng câu chứa đáp án, làm mờ một đáp án sai).
    const target = tries >= 2 && !st.hint ? dimTarget(q.choices.length, q.correct, st.dimmed, st.sel) : null;
    update(cur, { tries, picks, ...(tries >= 2 && !st.hint ? { hint: true, dimmed: target === null ? st.dimmed : [...st.dimmed, target] } : {}) });
    if (tries >= 2) setHl(q.evidence);
    setFb({ kind: "wrong", qi: cur });
  }

  function proceed() {
    if (!fb) return;
    const { kind, qi } = fb;
    setFb(null);
    if (kind === "wrong") {
      update(qi, { sel: null });
      return;
    }
    const left = qs.map((x, i) => (i === qi ? true : x.done));
    const next = nextUndone(left, qi);
    if (next < 0) {
      onComplete(questions.flatMap((_, i) => (answered.current.get(i) ? [answered.current.get(i) as ItemResult] : [])));
      return;
    }
    setCur(next);
    setHl(null);
  }

  const hear = () => reader.read(passage, null);
  const keys: Record<string, () => void> = {
    Enter: check,
    Space: hear,
    h: () => giveHint(cur),
    ArrowDown: () => setCur((c) => neighbourQuestion(doneFlags, c, 1)),
    ArrowUp: () => setCur((c) => neighbourQuestion(doneFlags, c, -1)),
  };
  q.choices.forEach((_, j) => {
    keys[KEYS[j]] = () => pick(cur, j);
  });
  useHotkeys(keys, { enabled: active && !fb, captureNative: true });

  const allDone = qs.every((x) => x.done);
  const evidence = sentences[q.evidence] ?? "";
  const doneCount = qs.filter((x) => x.done).length;
  return (
    <>
      <LessonMain>
        <div className={styles.head}>
          <h1 className={lesson.instr}>Đọc rồi trả lời</h1>
          <span className={styles.caption}>Bấm từ để nghe · phím 1–3 chọn đáp án · ↑ ↓ đổi câu hỏi</span>
        </div>
        <div className={styles.sr}>
          <article className={styles.psg} aria-labelledby="psg-title">
            <div className={styles.top}>
              {step.picture && (
                <div className={styles.pic}>
                  <WordPicture word={step.picture.word} src={step.picture.image} size={130} label={`Hình minh họa: ${step.picture.word}`} />
                </div>
              )}
              <div className={styles.h}>
                <h2 id="psg-title" lang="en">
                  {step.title}
                </h2>
                <Button variant="secondary" icon="speaker" label="Nghe cả đoạn" onClick={hear} />
              </div>
            </div>
            <p className={styles.txt} lang="en">
              {sentences.map((s, i) => (
                <span key={i} className={cn(styles.s, hl === i && styles.hl)}>
                  <ClickableWords text={s} glossary={step.glossary} litIndex={litInSentence(reader.lit, sentences, i)} />{" "}
                </span>
              ))}
            </p>
          </article>
          <ol className={styles.qs} aria-label="Câu hỏi">
            {questions.map((item, qi) => {
              const s = qs[qi];
              const isCur = qi === cur && !s.done;
              return (
                <li key={qi} className={cn(styles.q, isCur && styles.cur, s.done && styles.done)} data-q={qi}>
                  <div className={styles.row}>
                    <span className={styles.n} aria-hidden="true">
                      {s.done ? <Icon name="check" size={22} /> : qi + 1}
                    </span>
                    <span className={styles.qt} lang="en" id={`qt${qi}`}>
                      {item.text}
                    </span>
                    {s.done && <span className={styles.ok}>Đã trả lời</span>}
                    <SpeakerButton word={item.text} size="s" label={`Nghe câu hỏi ${qi + 1}`} />
                  </div>
                  <div className={styles.opts} role="radiogroup" aria-labelledby={`qt${qi}`}>
                    {item.choices.map((c, j) => {
                      const correct = s.done && j === item.correct;
                      const selected = !s.done && s.sel === j;
                      const retry = !s.done && fb?.kind === "wrong" && fb.qi === qi && s.sel === j;
                      const dim = s.dimmed.includes(j) && !s.done;
                      return (
                        <button
                          key={j}
                          type="button"
                          role="radio"
                          aria-checked={selected || correct}
                          aria-keyshortcuts={isCur ? KEYS[j] : undefined}
                          data-opt={`${qi}-${j}`}
                          lang="en"
                          disabled={s.done || dim}
                          className={cn(styles.opt, selected && styles.selected, correct && styles.correct, retry && styles.retry, dim && styles.dim)}
                          onClick={() => pick(qi, j)}
                        >
                          <KeyHint>{KEYS[j]}</KeyHint>
                          {c}
                          {correct && (
                            <span className={styles.tick}>
                              <Icon name="check" size={22} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button variant="secondary" size="l" icon="speaker" label="Nghe cả đoạn" shortcut="Space" onClick={hear} />
            <Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="H" disabled={st.hint || st.done} onClick={() => giveHint(cur)} />
          </>
        }
        right={<Button variant="primary" size="l" label="Kiểm tra" shortcut="Enter" disabled={allDone || st.done || st.sel === null} onClick={check} />}
      />
      <FeedbackBar
        open={fb !== null}
        type={fb?.kind === "ok" ? "ok" : "retry"}
        title={fb?.kind === "ok" ? (allDone && doneCount === questions.length ? `Cậu trả lời xong cả ${questions.length} câu!` : OK_TITLES[(fb?.qi ?? 0) % OK_TITLES.length]) : fb?.kind === "reveal" ? "Mình xem đáp án nhé!" : "Chưa đúng rồi, thử lại nhé!"}
        detail={
          fb?.kind === "wrong" ? (
            `${step.glossary[lastWrongText.toLowerCase()] ? `“${lastWrongText}” là “${step.glossary[lastWrongText.toLowerCase()]}”. ` : ""}Đọc lại đoạn văn nhé.`
          ) : fb ? (
            <span className={lesson.answer}>
              <SpeakerButton word={evidence} size="s" />
              <span className={lesson.answerWord} lang="en" style={{ fontSize: "var(--text-stat)" }}>
                {evidence}
              </span>
              {fb.kind === "reveal" && <span>Câu này mình làm lại ở cuối bài nha.</span>}
            </span>
          ) : undefined
        }
        action={fb?.kind === "wrong" ? "Thử lại" : allDone ? "Tiếp tục" : "Câu tiếp"}
        onAction={proceed}
      />
    </>
  );
}
