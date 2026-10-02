"use client";

import type { PlayStep } from "@/lib/rules/lesson-play";
import { StubStep } from "./StubStep";
import type { StepProps } from "./types";
import { WordCardStep } from "./WordCardStep";

/** Chọn màn hình theo dạng bài của bước. */
export function StepView({ step, ...rest }: StepProps & { step: PlayStep }) {
  switch (step.kind) {
    case "word_card":
      return <WordCardStep step={step} {...rest} />;
    default:
      return <StubStep step={step} {...rest} />;
  }
}
