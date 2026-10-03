"use client";

import type { PlayStep } from "@/lib/rules/lesson-play";
import { StepsPreview } from "./StepsPreview";

/** "Xem như học sinh" cho một câu hỏi: chạy một bước bằng trình học của bé (xem StepsPreview). */
export function QuestionPreview({ step, level, onClose }: { step: PlayStep; level: number; onClose: () => void }) {
  return <StepsPreview steps={[step]} level={level} onClose={onClose} />;
}
