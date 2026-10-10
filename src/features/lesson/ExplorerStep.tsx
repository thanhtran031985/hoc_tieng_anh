"use client";

import { ExplorerPlayer } from "@/features/word-explorer";
import type { StepProps } from "./types";

/** Khám phá từ (8.27) trong bài học: bé đoán từng nhánh (mỗi nhánh là một mục chấm của từ), mở đủ thì đọc cả đoạn, nói theo, in. */
export function ExplorerStep({ step, active, onComplete }: StepProps<"word_explorer">) {
  return (
    <ExplorerPlayer
      mode="lesson"
      word={step.word}
      branches={step.branches}
      reading={step.reading}
      glossary={step.glossary}
      active={active}
      printHref={`/explore/${step.word.id}/print`}
      onComplete={onComplete}
    />
  );
}
