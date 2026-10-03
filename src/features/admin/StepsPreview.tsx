"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AdultButton } from "@/components/adult";
import { LessonFrame } from "@/features/lesson/LessonFrame";
import { StepView } from "@/features/lesson/StepView";
import type { PlayStep } from "@/lib/rules/lesson-play";
import styles from "./questions.module.css";

type Props = {
  steps: readonly PlayStep[];
  /** Cấp của bài (1–10): quyết định giao diện Tiểu học (1–5) hay THCS (6–10) và màu cấp. */
  level: number;
  onClose: () => void;
};

/**
 * Xem như học sinh: chạy các bước bằng chính khung và dạng bài của trình học (task 07) trên lớp phủ toàn màn hình.
 * Có nhiều bước thì có thanh "Bước trước / Bước sau"; làm xong một bước thì sang bước kế, hết bài thì bắt đầu lại. Không lưu kết quả.
 */
export function StepsPreview({ steps, level, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState(0);
  const step = steps[Math.min(index, steps.length - 1)];
  if (!step) return null;
  const go = (to: number) => {
    setIndex(Math.max(0, Math.min(steps.length - 1, to)));
    setRound((r) => r + 1);
  };
  return createPortal(
    <div className={styles.preview} data-theme={level <= 5 ? "tieu-hoc" : "thcs"} role="dialog" aria-modal="true" aria-label="Xem như học sinh">
      <LessonFrame level={level} mascot="ngoc" value={index} max={steps.length} onExit={onClose}>
        <StepView key={`${index}-${round}`} step={step} active unit={{ title: "Xem thử", titleVi: "Xem thử" }} onComplete={() => go(index + 1 < steps.length ? index + 1 : 0)} />
      </LessonFrame>
      {steps.length > 1 && (
        <div className={styles.previewBar} role="group" aria-label="Chuyển bước xem thử">
          <AdultButton label="Bước trước" icon="back" variant="secondary" size="s" disabled={index === 0} onClick={() => go(index - 1)} />
          <span aria-live="polite">
            Bước {index + 1} / {steps.length}
          </span>
          <AdultButton label="Bước sau" icon="next" variant="secondary" size="s" disabled={index === steps.length - 1} onClick={() => go(index + 1)} />
        </div>
      )}
    </div>,
    document.body,
  );
}
