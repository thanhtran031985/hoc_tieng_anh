"use client";

import { useId, useRef } from "react";
import { cn } from "@/lib/cn";
import styles from "./adult.module.css";

type Props<T extends string> = {
  label: string;
  value: T;
  options: readonly (readonly [T, string])[];
  onChange: (value: T) => void;
  className?: string;
};

/** Nhóm lựa chọn một (radiogroup): ← → hoặc ↑ ↓ đổi lựa chọn, Tab ra khỏi nhóm. */
export function AdultSegmented<T extends string>({ label, value, options, onChange, className }: Props<T>) {
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className={cn(styles.field, className)}>
      <span className={styles.h3} id={`${id}-l`}>
        {label}
      </span>
      <div className={styles.seg} role="radiogroup" aria-labelledby={`${id}-l`}>
        {options.map(([v, text], index) => (
          <button
            key={v}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={v === value}
            tabIndex={v === value ? 0 : -1}
            onClick={() => onChange(v)}
            onKeyDown={(event) => {
              const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
              if (step === 0) return;
              event.preventDefault();
              const next = (index + step + options.length) % options.length;
              onChange(options[next][0]);
              refs.current[next]?.focus();
            }}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
