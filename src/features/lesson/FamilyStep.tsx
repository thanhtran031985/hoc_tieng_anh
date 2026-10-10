"use client";

import { BuildPlayer, FamilyPlayer } from "@/features/word-family";
import type { StepProps } from "./types";

/** Họ vần (8.28) trong bài học: bé nghe đủ các từ đã học trong họ rồi Tiếp tục. Không chấm điểm, không phạt. */
export function FamilyStep({ step, active, onComplete }: StepProps<"word_family">) {
  return <FamilyPlayer mode="lesson" family={step.family} active={active} onComplete={onComplete} />;
}

/** Ghép chữ đầu (8.28) trong bài học: tìm đủ số từ thì có bảng kết thúc 3 sao. Không chấm điểm, không phạt. */
export function BuildStep({ step, active, onComplete }: StepProps<"build_family">) {
  return <BuildPlayer mode="lesson" family={step.family} tiles={step.tiles} active={active} onComplete={onComplete} />;
}
