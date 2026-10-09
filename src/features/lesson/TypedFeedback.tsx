"use client";

import { useEffect } from "react";
import { FeedbackBar } from "@/components/ui";
import { playSfx } from "@/lib/sound";
import type { ChoicePhase } from "./choice-flow";
import styles from "./lesson.module.css";

type Props = {
  phase: ChoicePhase;
  /** Dải phản hồi chỉ mở khi true (vd đợi đọc xong các âm). */
  ready?: boolean;
  okTitle: string;
  okDetail: React.ReactNode;
  /** Lời nhắn khi chưa đúng (lần 1–2). */
  wrongDetail: React.ReactNode;
  /** Đáp án đúng, hiện khi sai lần 3. */
  revealDetail: React.ReactNode;
  onContinue: () => void;
  onRetry: () => void;
};

/** Dải phản hồi của các dạng bài gõ và xếp. Đúng: xanh lá; chưa đúng: cam nhẹ, không trừ gì; sai lần 3 thì cho xem đáp án và làm lại cuối bài. */
export function TypedFeedback({ phase, ready = true, okTitle, okDetail, wrongDetail, revealDetail, onContinue, onRetry }: Props) {
  useEffect(() => {
    if (phase === "wrong" || phase === "reveal") playSfx("retry");
  }, [phase]);
  if (phase === "answering" || phase === "ok") return <FeedbackBar open={phase === "ok" && ready} type="ok" title={okTitle} detail={okDetail} onAction={onContinue} />;
  if (phase === "reveal") {
    return (
      <FeedbackBar
        open
        type="retry"
        title="Mình xem đáp án nhé!"
        detail={
          <>
            {revealDetail}
            <span className={styles.note}>Câu này mình làm lại ở cuối bài nha.</span>
          </>
        }
        action="Tiếp tục"
        onAction={onContinue}
      />
    );
  }
  return <FeedbackBar open type="retry" title="Chưa đúng rồi, thử lại nhé!" detail={wrongDetail} action="Thử lại" onAction={onRetry} />;
}
