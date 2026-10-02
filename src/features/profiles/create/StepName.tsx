"use client";

import type { KeyboardEvent } from "react";
import { Bubble, Card, LevelChip, Mascot, TextField } from "@/components/ui";
import { cn } from "@/lib/cn";
import { levelForGrade } from "@/lib/learner-rules";
import styles from "./create.module.css";

type Props = {
  name: string;
  onName: (value: string) => void;
  grade: number | null;
  onGrade: (grade: number) => void;
  levelNames: Record<number, string>;
  onEnter: () => void;
};

const GROUPS = [
  { label: "Tiểu học", grades: [1, 2, 3, 4, 5] },
  { label: "THCS", grades: [6, 7, 8, 9] },
] as const;
const ALL_GRADES: number[] = GROUPS.flatMap((g) => [...g.grades]);

/** Bước 1: tên (tối đa 16 chữ) và lớp 1–9; lớp được chọn tô màu cấp tương ứng. */
export function StepName({ name, onName, grade, onGrade, levelNames, onEnter }: Props) {
  const trimmed = name.trim();

  // Radio: mũi tên trái/phải đổi lớp (chỉ lớp đang chọn nằm trong thứ tự Tab).
  function onGradeKey(event: KeyboardEvent<HTMLButtonElement>, current: number) {
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = ALL_GRADES[(ALL_GRADES.indexOf(current) + delta + ALL_GRADES.length) % ALL_GRADES.length];
    onGrade(next);
    (event.currentTarget.closest('[role="radiogroup"]')?.querySelector(`[data-grade="${next}"]`) as HTMLElement | null)?.focus();
  }

  return (
    <Card className={styles.card}>
      <div className={styles.mas}>
        <Bubble>{trimmed ? `Chào ${trimmed}! Tên đẹp quá!` : "Bé tên là gì nhỉ?"}</Bubble>
        <Mascot expr={trimmed ? "chao" : "suynghi"} className={styles.masMascot} />
      </div>
      <div className={styles.col}>
        <TextField
          className={styles.nameField}
          label="Tên của bé"
          name="name"
          maxLength={16}
          placeholder="Gõ tên bé, ví dụ: An"
          autoComplete="off"
          value={name}
          onChange={(e) => onName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter()}
          hint={trimmed ? undefined : "Chỉ cần tên gọi ở nhà, tối đa 16 chữ."}
        />
        <div className={styles.col}>
          <span className={styles.title}>Bé đang học lớp mấy?</span>
          <div className={styles.grades} role="radiogroup" aria-label="Lớp">
            {GROUPS.map((group) => (
              <div key={group.label} className={styles.gg}>
                <span className={styles.ggLabel}>{group.label}</span>
                <div className={styles.chips}>
                  {group.grades.map((g) => (
                    <button
                      key={g}
                      type="button"
                      role="radio"
                      className={styles.gchip}
                      data-level={levelForGrade(g)}
                      data-grade={g}
                      aria-checked={grade === g}
                      aria-label={`Lớp ${g}`}
                      tabIndex={grade === g || (grade === null && g === 1) ? 0 : -1}
                      onClick={() => onGrade(g)}
                      onKeyDown={(e) => onGradeKey(e, g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {grade !== null && (
          <div className={cn(styles.start)} data-level={levelForGrade(grade)}>
            <span className={styles.startLabel}>Bé sẽ bắt đầu ở</span>
            <LevelChip level={levelForGrade(grade)} name={levelNames[levelForGrade(grade)] ?? ""} />
            <span className={styles.muted}>Bố mẹ đổi được sau.</span>
          </div>
        )}
      </div>
    </Card>
  );
}
