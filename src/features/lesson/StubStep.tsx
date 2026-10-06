"use client";

import { Button } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import { LessonFoot, LessonMain } from "./LessonFrame";
import styles from "./lesson.module.css";
import type { StepProps } from "./types";

// Bước tạm cho tới khi các dạng bài thật được dựng (bước 1–5 của task 07).
export function StubStep({ step, active, onComplete }: StepProps) {
  const next = () => onComplete([]);
  useHotkeys({ Enter: next }, { enabled: active, captureNative: true });
  return (
    <>
      <LessonMain>
        <h1 className={styles.instr}>{step.kind}</h1>
      </LessonMain>
      <LessonFoot right={<Button variant="primary" size="l" label="Tiếp tục" shortcut="Enter" onClick={next} />} />
    </>
  );
}
