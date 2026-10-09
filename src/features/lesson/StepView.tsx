"use client";

import type { PlayStep } from "@/lib/rules/lesson-play";
import { DictationStep } from "./DictationStep";
import { FillBlankStep } from "./FillBlankStep";
import { ListenChooseStep } from "./ListenChooseStep";
import { MatchStep } from "./MatchStep";
import { PickWordStep } from "./PickWordStep";
import { MemoryStep } from "./MemoryStep";
import { PhonicsStep } from "./PhonicsStep";
import { ReadingStep } from "./ReadingStep";
import { SentenceOrderStep } from "./SentenceOrderStep";
import { StoryStep } from "./StoryStep";
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
    case "choose_word_for_picture":
      return <PickWordStep step={step} {...rest} />;
    case "memory_game":
      return <MemoryStep step={step} {...rest} />;
    case "phonics":
      return <PhonicsStep step={step} {...rest} />;
    case "sentence_order":
      return <SentenceOrderStep step={step} {...rest} />;
    case "dictation":
      return <DictationStep step={step} {...rest} />;
    case "fill_blank":
      return <FillBlankStep step={step} {...rest} />;
    case "short_reading":
      return <ReadingStep step={step} {...rest} />;
    case "story":
      return <StoryStep step={step} {...rest} />;
    default:
      return <StubStep step={step} {...rest} />;
  }
}
