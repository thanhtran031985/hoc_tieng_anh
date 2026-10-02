"use client";

import type { PlayStep } from "@/lib/rules/lesson-play";
import { ListenChooseStep } from "./ListenChooseStep";
import { MatchStep } from "./MatchStep";
import { StubStep } from "./StubStep";
import type { StepProps } from "./types";
import { WordCardStep } from "./WordCardStep";

/** Chọn màn hình theo dạng bài của bước. */
export function StepView({ step, ...rest }: StepProps & { step: PlayStep }) {
  switch (step.kind) {
    case "word_card":
      return <WordCardStep step={step} {...rest} />;
    case "listen_choose_picture":
      return <ListenChooseStep step={step} {...rest} />;
    case "match_pairs":
      return <MatchStep step={step} {...rest} />;
    default:
      return <StubStep step={step} {...rest} />;
  }
}
