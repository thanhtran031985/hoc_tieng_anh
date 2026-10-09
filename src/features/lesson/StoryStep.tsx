"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, ChoiceCard, Icon, Mascot, SpeakerButton } from "@/components/ui";
import { ClickableWords } from "@/components/lesson";
import type { StoryPlay, StoryPlayPage } from "@/lib/rules/lesson-play";
import type { ItemResult } from "@/lib/rules/lesson-session";
import { litInSentence, pageText } from "@/lib/rules/lesson-story";
import { splitSentence } from "@/lib/rules/sentence-words";
import { playPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { burstStars } from "./burst";
import { useLadder } from "./ladder";
import { LessonFoot, LessonMain } from "./LessonFrame";
import lesson from "./lesson.module.css";
import styles from "./story.module.css";
import { useStoryReader } from "./story-reader";
import { TypedFeedback } from "./TypedFeedback";
import type { StepProps } from "./types";

type Mode = "auto" | "self";
const AUTO_READ_MS = 500;
const KEYS = ["1", "2", "3"] as const;

/** Truyện tranh có đọc to (Screen24): đọc cho tớ nghe hoặc tự đọc, ← → đổi trang, trang câu hỏi xen giữa, trang “Hết truyện” có từ mới. */
export function StoryStep({ step, active, onComplete }: StepProps<"story">) {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("auto");
  // Kết quả các câu hỏi xen giữa truyện (mỗi trang một mục); bước truyện không có câu hỏi thì báo rỗng.
  const results = useRef(new Map<number, ItemResult>());
  const total = step.pages.length;
  const page = step.pages[index];
  const storyPages = step.pages.filter((p) => p.kind === "page");
  const numberOf = (i: number) => step.pages.slice(0, i + 1).filter((p) => p.kind === "page").length;

  const go = (to: number) => setIndex(Math.max(0, Math.min(total, to)));

  if (index >= total) {
    return <StoryEnd step={step} active={active} onRestart={() => go(0)} onFinish={() => onComplete([...results.current.values()])} />;
  }
  if (page.kind === "question") {
    return (
      <StoryQuestion
        key={page.id}
        page={page}
        active={active}
        onPrev={index > 0 ? () => go(index - 1) : undefined}
        onDone={(item) => {
          results.current.set(page.id, item);
          go(index + 1);
        }}
      />
    );
  }
  return (
    <StoryPageView
      key={page.id}
      story={step}
      page={page}
      pageNo={numberOf(index)}
      pageCount={storyPages.length}
      mode={mode}
      onMode={setMode}
      active={active}
      onPrev={index > 0 ? () => go(index - 1) : undefined}
      onNext={() => go(index + 1)}
    />
  );
}

type PageViewProps = {
  story: StoryPlay;
  page: Extract<StoryPlayPage, { kind: "page" }>;
  pageNo: number;
  pageCount: number;
  mode: Mode;
  onMode: (mode: Mode) => void;
  active: boolean;
  onPrev?: () => void;
  onNext: () => void;
};

function StoryPageView({ story, page, pageNo, pageCount, mode, onMode, active, onPrev, onNext }: PageViewProps) {
  const reader = useStoryReader();
  const [hint, setHint] = useState(false);
  const text = pageText(page.sentences);
  const readPage = () => reader.read(text, page.audio);

  // “Đọc cho tớ nghe”: tự đọc khi vào trang; “Tự đọc”: không tự phát.
  useEffect(() => {
    if (mode !== "auto") return;
    const timer = setTimeout(() => reader.read(text, page.audio), AUTO_READ_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, text, page.audio]);

  // Từ khó của trang: từ mới của truyện (nếu có trong trang), không thì vài chữ có nghĩa trong bảng.
  const hardWords = useMemo(() => {
    const onPage = [...new Set(splitSentence(text).flatMap((t) => (t.word ? [t.word] : [])))];
    const fresh = onPage.filter((w) => story.newWords.some((n) => n.word.toLowerCase() === w || n.word.toLowerCase().replace(/s$/, "") === w.replace(/s$/, "")));
    const pool = fresh.length > 0 ? fresh : onPage.filter((w) => story.glossary[w]);
    return pool.slice(0, 3).map((w) => ({ word: w, meaning: story.glossary[w] ?? null }));
  }, [text, story]);

  useHotkeys(
    { ArrowRight: onNext, ArrowLeft: () => onPrev?.(), Space: readPage, h: () => setHint(true), Enter: onNext },
    { enabled: active, captureNative: true },
  );

  const last = pageNo === pageCount;
  return (
    <>
      <LessonMain>
        <h1 className={styles.srOnly}>{`Truyện ${story.title}, trang ${pageNo}`}</h1>
        <div className={styles.book}>
          <div className={styles.art}>
            {/* eslint-disable-next-line @next/next/no-img-element -- tranh SVG tĩnh, không cần tối ưu ảnh */}
            {page.image ? <img src={page.image} alt={`Tranh trang ${pageNo}`} /> : <Icon name="book" size={96} />}
            <span className={styles.pg}>{`Trang ${pageNo} / ${pageCount}`}</span>
          </div>
          <div className={styles.txt}>
            <p className={styles.lines} lang="en">
              {page.sentences.map((sentence, i) => (
                <span key={i} className={styles.line}>
                  <ClickableWords text={sentence} glossary={story.glossary} litIndex={litInSentence(reader.lit, page.sentences, i)} />
                </span>
              ))}
            </p>
            <div className={styles.mode} role="group" aria-label="Cách đọc">
              <button type="button" aria-pressed={mode === "auto"} onClick={() => onMode("auto")}>
                <Icon name="speaker" size={20} />
                Đọc cho tớ nghe
              </button>
              <button type="button" aria-pressed={mode === "self"} onClick={() => (reader.stop(), onMode("self"))}>
                <Icon name="book" size={20} />
                Tự đọc
              </button>
            </div>
            <Button variant="secondary" icon="back" label="Trang trước" shortcut="←" disabled={!onPrev} onClick={() => onPrev?.()} />
            {hint && hardWords.length > 0 ? (
              <ul className={styles.hard} aria-label="Từ khó">
                {hardWords.map((w) => (
                  <li key={w.word}>
                    <SpeakerButton word={w.word} size="s" />
                    <b lang="en">{w.word}</b>
                    {w.meaning && <span>{w.meaning}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.caption}>Bấm vào từ bất kỳ để nghe riêng từ đó và xem nghĩa.</p>
            )}
          </div>
        </div>
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button variant="secondary" size="l" icon="speaker" label="Đọc lại trang" shortcut="Space" onClick={readPage} />
            <Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="H" disabled={hint} onClick={() => setHint(true)} />
          </>
        }
        right={<Button variant="primary" size="l" icon="next" label={last ? "Xong truyện" : "Trang sau"} shortcut="Enter" onClick={onNext} />}
      />
    </>
  );
}

type QuestionProps = {
  page: Extract<StoryPlayPage, { kind: "question" }>;
  active: boolean;
  onPrev?: () => void;
  onDone: (item: ItemResult) => void;
};

/** Trang câu hỏi giữa truyện: chọn 1 trong 3 đáp án (phím 1–3); không phạt, sai 2 lần tự bật gợi ý, sai 3 lần cho xem đáp án rồi đi tiếp. */
function StoryQuestion({ page, active, onPrev, onDone }: QuestionProps) {
  const ladder = useLadder();
  const [sel, setSel] = useState<number | null>(null);
  const [dim, setDim] = useState<number[]>([]);
  const correctIndex = page.choices.findIndex((c) => c.id === page.correct);

  function dimOne() {
    const i = page.choices.findIndex((_, idx) => idx !== correctIndex && idx !== sel && !dim.includes(idx));
    if (i >= 0) setDim((d) => [...d, i]);
  }
  function choose(i: number) {
    if (!ladder.answering || dim.includes(i)) return;
    setSel(i);
  }
  function check() {
    if (!ladder.answering || sel === null) return;
    const right = sel === correctIndex;
    ladder.submit(right, page.choices[sel].text);
    if (right) burstStars(document.querySelector(`[data-card="${sel}"]`));
    else if (ladder.tries + 1 === 2) dimOne();
  }
  function retry() {
    ladder.retry();
    setSel(null);
  }

  const hear = () => playPronunciation(page.text);
  const keys: Record<string, () => void> = { Enter: check, Space: hear, h: () => ladder.answering && dimOne(), ArrowLeft: () => onPrev?.() };
  page.choices.forEach((_, i) => {
    keys[KEYS[i]] = () => choose(i);
  });
  useHotkeys(keys, { enabled: active && ladder.answering, captureNative: true });

  const cardState = (i: number) => (dim.includes(i) ? "dim" : ladder.phase === "ok" && i === sel ? "correct" : ladder.phase === "reveal" && i === correctIndex ? "correct" : ladder.phase === "wrong" && i === sel ? "retry" : sel === i ? "selected" : "default");
  return (
    <>
      <LessonMain>
        <h1 className={lesson.instr}>Câu hỏi giữa truyện</h1>
        <p className={styles.question} lang="en">
          {page.text}
          <SpeakerButton word={page.text} size="m" label="Nghe câu hỏi" />
        </p>
        <div className={styles.opts} role="group" aria-label="Chọn đáp án">
          {page.choices.map((c, i) => (
            <ChoiceCard key={c.id} className={styles.opt} state={cardState(i)} keyHint={KEYS[i]} data-card={i} lang="en" onClick={() => choose(i)}>
              <span className={styles.optText}>{c.text}</span>
            </ChoiceCard>
          ))}
        </div>
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button variant="secondary" size="l" icon="speaker" label="Nghe câu hỏi" shortcut="Space" onClick={hear} />
            <Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="H" disabled={!ladder.answering || dim.length > 0} onClick={dimOne} />
          </>
        }
        right={<Button variant="primary" size="l" label="Kiểm tra" shortcut="Enter" disabled={!ladder.answering || sel === null} onClick={check} />}
      />
      <TypedFeedback
        phase={ladder.phase}
        okTitle="Đúng rồi! Giỏi quá!"
        okDetail={<Answer text={page.choices[correctIndex]?.text ?? ""} />}
        wrongDetail={ladder.tries >= 2 ? "Bông bật gợi ý cho cậu rồi đó. Nhìn lại tranh và đọc lại truyện nhé!" : "Nhìn lại tranh và đọc lại truyện nhé, Bông tin cậu làm được!"}
        revealDetail={<Answer text={page.choices[correctIndex]?.text ?? ""} />}
        onContinue={() => onDone({ ...ladder.result({ wordId: null, questionId: page.questionId }), revealed: false })}
        onRetry={retry}
      />
    </>
  );
}

function Answer({ text }: { text: string }) {
  return (
    <span className={lesson.answer}>
      <SpeakerButton word={text} size="s" />
      <span className={lesson.answerWord} lang="en">
        {text}
      </span>
    </span>
  );
}

function StoryEnd({ step, active, onRestart, onFinish }: { step: StoryPlay & { id: string }; active: boolean; onRestart: () => void; onFinish: () => void }) {
  const count = step.pages.filter((p) => p.kind === "page").length;
  useHotkeys({ Enter: onFinish, Space: onRestart }, { enabled: active, captureNative: true });
  return (
    <>
      <LessonMain>
        <div className={styles.end}>
          <div className={styles.endDragon}>
            <Mascot expr="chucmung" size={240} />
          </div>
          <div>
            <h1 className={styles.endTitle}>Hết truyện!</h1>
            <p className={styles.endSub}>
              <b lang="en">{step.title}</b> · {count} trang · cấp {step.levelNumber}
            </p>
            {step.newWords.length > 0 && (
              <>
                <h2 className={styles.endHead}>Từ mới trong truyện</h2>
                <ul className={styles.nw}>
                  {step.newWords.map((w) => (
                    <li key={w.word}>
                      <SpeakerButton word={w.word} size="s" />
                      <span>
                        <b lang="en">{w.word}</b>
                        {w.meaningVi && <small>{w.meaningVi}</small>}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </LessonMain>
      <LessonFoot
        left={<Button variant="secondary" size="l" icon="replay" label="Đọc lại từ đầu" shortcut="Space" onClick={onRestart} />}
        right={<Button variant="primary" size="l" icon="next" label="Tiếp tục" shortcut="Enter" onClick={onFinish} />}
      />
    </>
  );
}
