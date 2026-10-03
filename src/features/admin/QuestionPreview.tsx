"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { LessonFrame } from "@/features/lesson/LessonFrame";
import { StepView } from "@/features/lesson/StepView";
import type { PlayStep } from "@/lib/rules/lesson-play";
import styles from "./questions.module.css";

/**
 * "Xem như học sinh": dựng lại câu hỏi bằng chính khung và dạng bài của trình học (task 07) trên một lớp phủ toàn màn hình,
 * theo giao diện của cấp (Tiểu học cho cấp 1–5, THCS cho cấp 6–10). Làm xong một lượt thì bắt đầu lại; không lưu kết quả.
 */
export function QuestionPreview({ step, level, onClose }: { step: PlayStep; level: number; onClose: () => void }) {
  const [round, setRound] = useState(0);
  return createPortal(
    <div className={styles.preview} data-theme={level <= 5 ? "tieu-hoc" : "thcs"} role="dialog" aria-modal="true" aria-label="Xem như học sinh">
      <LessonFrame level={level} mascot="ngoc" value={0} max={1} onExit={onClose}>
        <StepView key={round} step={step} active unit={{ title: "Xem thử", titleVi: "Xem thử" }} onComplete={() => setRound((r) => r + 1)} />
      </LessonFrame>
    </div>,
    document.body,
  );
}
