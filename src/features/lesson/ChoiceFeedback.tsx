"use client";

import { FeedbackBar, SpeakerButton } from "@/components/ui";
import type { PlayWord } from "@/lib/rules/lesson-play";
import type { ChoicePhase } from "./choice-flow";
import styles from "./lesson.module.css";

const OK_TITLES = ["Chính xác! Giỏi quá!", "Tuyệt vời!", "Đúng rồi!"];

type Props = {
  phase: ChoicePhase;
  tries: number;
  target: PlayWord;
  lastWrong: PlayWord | null;
  /** Dạng câu hỏi: hình (nghe và chọn hình) hay chữ (chọn từ cho hình), để diễn đạt lời nhắn. */
  kind: "picture" | "word";
  onContinue: () => void;
  onRetry: () => void;
};

function Answer({ word }: { word: PlayWord }) {
  return (
    <span className={styles.answer}>
      <SpeakerButton word={word.word} size="s" />
      <span className={styles.answerWord} lang="en">
        {word.word}
      </span>
      <span>
        {word.ipa ? `${word.ipa} · ` : ""}
        {word.meaningVi}
      </span>
    </span>
  );
}

/** Dải phản hồi sau khi bé bấm Kiểm tra. Đúng: xanh lá; chưa đúng: cam nhẹ, không trừ gì; sai lần 3 thì cho xem đáp án. */
export function ChoiceFeedback({ phase, tries, target, lastWrong, kind, onContinue, onRetry }: Props) {
  const open = phase !== "answering";
  if (phase === "ok" || phase === "answering") {
    return <FeedbackBar open={open} type="ok" title={OK_TITLES[target.id % OK_TITLES.length]} detail={<Answer word={target} />} onAction={onContinue} />;
  }
  if (phase === "reveal") {
    return (
      <FeedbackBar
        open
        type="retry"
        title="Mình xem đáp án nhé!"
        detail={
          <>
            <Answer word={target} />
            <span className={styles.note}>Câu này mình làm lại ở cuối bài nha.</span>
          </>
        }
        action="Tiếp tục"
        onAction={onContinue}
      />
    );
  }
  const picked = lastWrong;
  const detail =
    tries >= 2
      ? `Bông bật gợi ý cho bé rồi đó. ${kind === "picture" ? "Nghe lại" : "Nhìn hình"} thật kỹ nha!`
      : picked
        ? kind === "picture"
          ? `Đây là ${picked.meaningVi}. Bé nghe lại thật kỹ nha, Bông tin bé làm được!`
          : `${picked.word} là ${picked.meaningVi}. Bé nhìn hình thật kỹ nha, Bông tin bé làm được!`
        : "Bé thử lại nhé, Bông tin bé làm được!";
  return <FeedbackBar open type="retry" title="Chưa đúng rồi, thử lại nhé!" detail={detail} action="Thử lại" onAction={onRetry} />;
}
