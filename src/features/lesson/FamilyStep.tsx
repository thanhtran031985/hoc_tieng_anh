"use client";

import { FamilyPlayer } from "@/features/word-family";
import type { StepProps } from "./types";

/** Họ vần (8.28) trong bài học: bé nghe đủ các từ đã học trong họ rồi Tiếp tục. Không chấm điểm, không phạt. */
export function FamilyStep({ step, active, onComplete }: StepProps<"word_family">) {
  return <FamilyPlayer mode="lesson" family={step.family} active={active} onComplete={onComplete} />;
}
