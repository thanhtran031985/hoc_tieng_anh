"use client";

import { useEffect, useMemo, useRef } from "react";
import { Button, ChoiceCard, FeedbackBar, Icon, Mascot, SpeakerButton, WordPicture } from "@/components/ui";
import type { PlayWord } from "@/lib/rules/lesson-play";
import { playSfx } from "@/lib/sound";
import { playPronunciation, stopPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { burstStars } from "./burst";
import { useChoiceFlow } from "./choice-flow";
import { LessonFoot, LessonMain } from "./LessonFrame";
import styles from "./listen-choose.module.css";
import lesson from "./lesson.module.css";
import type { StepProps } from "./types";

const KEYS = ["1", "2", "3"] as const;
const LETTERS = ["a", "b", "c"] as const;

/**
 * Ôn tập: một câu hỏi nhánh của Khám phá từ. Bông hỏi (đọc to), bé chọn 1 trong 2–3 hình; sai không phạt (sai 2 lần thì một hình sai mờ đi).
 * Kết quả tính cho từ của Khám phá như câu ôn thường (đi vào 5 hộp).
 */
export function ExplorerBranchStep({ step, active, onComplete }: StepProps<"explorer_branch">) {
  const { word, branch } = step;
  // Dùng lại luồng câu chọn đáp án: mỗi hình là một “từ” có mã là vị trí trong danh sách.
  const options = useMemo<PlayWord[]>(() => branch.choices.map((c) => ({ id: c.id, word: c.text, ipa: null, meaningVi: "", exampleEn: null, exampleVi: null, image: c.image })), [branch.choices]);
  const target = options.find((o) => branch.choices[o.id]?.correct) ?? options[0];
  const flow = useChoiceFlow(target, options);
  const speakerRef = useRef<HTMLButtonElement>(null);

  // Tự đọc câu hỏi khi hiện ra, và ngừng đọc khi rời câu.
  useEffect(() => {
    const timer = window.setTimeout(() => playPronunciation(branch.questionEn, { rate: 0.8 }), 350);
    return () => {
      window.clearTimeout(timer);
      stopPronunciation();
    };
  }, [branch.questionEn]);

  useEffect(() => {
    if (flow.phase === "ok") {
      burstStars(document.querySelector(`[data-card="${flow.selected}"]`));
      window.setTimeout(() => playPronunciation(branch.sentence.en), 450);
    } else if (flow.phase === "wrong" || flow.phase === "reveal") playSfx("retry");
  }, [flow.phase, flow.selected, branch.sentence.en]);

  const replay = () => speakerRef.current?.click();
  const keys: Record<string, () => void> = { Space: replay, h: flow.hint, Enter: flow.check };
  options.forEach((o, i) => {
    keys[KEYS[i]] = keys[LETTERS[i]] = () => flow.select(o.id);
  });
  useHotkeys(keys, { enabled: active && !flow.feedbackOpen, captureNative: true });

  const finish = () => onComplete([{ ...flow.result(), wordId: word.id }]);
  function retry() {
    flow.retry();
    replay();
  }

  const left = options.length - flow.removed.length;
  const ok = flow.phase === "ok";
  const reveal = flow.phase === "reveal";
  return (
    <>
      <LessonMain>
        <h1 className={lesson.instr}>
          Trả lời câu hỏi về <span lang="en">{word.word}</span>
        </h1>
        <div className={styles.q}>
          <div className={styles.side}>
            <Mascot expr={flow.hintUsed ? "suynghi" : "chao"} size={120} />
          </div>
          <div className={styles.speakCol}>
            <SpeakerButton ref={speakerRef} word={branch.questionEn} size="l" label="Nghe câu hỏi" rate={0.8} />
            <b lang="en" className={lesson.answerWord}>
              {branch.questionEn}
            </b>
            {flow.hintUsed ? (
              <span className={styles.hintTip}>
                <Icon name="bulb" size={20} />
                Còn {left} hình thôi!
              </span>
            ) : (
              <span className={styles.caption}>{branch.questionVi || "Bấm loa hoặc Space"}</span>
            )}
          </div>
          <div className={styles.side} />
        </div>
        <div className={styles.opts} style={{ "--cols": options.length } as React.CSSProperties} role="group" aria-label="Chọn hình">
          {options.map((o, i) => (
            <ChoiceCard key={o.id} className={styles.opt} state={flow.cardState(o.id)} keyHint={KEYS[i]} data-card={o.id} aria-label={`Hình ${i + 1}: ${o.word}`} onClick={() => flow.select(o.id)}>
              <WordPicture word={o.word} src={o.image} size={120} label="" aria-hidden="true" />
            </ChoiceCard>
          ))}
        </div>
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button variant="secondary" size="l" icon="replay" label="Nghe lại" shortcut="Space" onClick={replay} />
            <Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="H" disabled={!flow.canHint} onClick={flow.hint} />
          </>
        }
        right={<Button variant="primary" size="l" label="Kiểm tra" shortcut="Enter" disabled={!flow.canCheck} onClick={flow.check} />}
      />
      <FeedbackBar
        open={flow.feedbackOpen}
        type={ok ? "ok" : "retry"}
        title={ok ? "Chính xác! Giỏi quá!" : reveal ? "Mình xem đáp án nhé!" : "Chưa đúng rồi, thử hình khác nhé!"}
        detail={
          ok || reveal ? (
            <span className={lesson.answer}>
              <SpeakerButton word={branch.sentence.en} size="s" />
              <b lang="en" className={lesson.answerWord}>
                {branch.sentence.en}
              </b>
              <span>{branch.sentence.vi}</span>
              {reveal && <span className={lesson.note}>Câu này mình làm lại ở cuối phiên nha.</span>}
            </span>
          ) : (
            <span>
              Bông hỏi: <b lang="en">{branch.questionEn}</b>. Bé nhìn hình thật kỹ nha, Bông tin bé làm được!
            </span>
          )
        }
        action={flow.phase === "wrong" ? "Thử lại" : "Tiếp tục"}
        onAction={flow.phase === "wrong" ? retry : finish}
      />
    </>
  );
}
