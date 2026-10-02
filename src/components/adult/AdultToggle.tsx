"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import styles from "./adult.module.css";

type Props = { label: string; sub?: string; checked: boolean; onChange: (checked: boolean) => void };

/** Công tắc bật/tắt (role="switch"): Space hoặc Enter để đổi. */
export function AdultToggle({ label, sub, checked, onChange }: Props) {
  const id = useId();
  return (
    <div className={styles.toggle}>
      <span>
        <b className={styles.h3} id={`${id}-l`}>
          {label}
        </b>
        {sub && (
          <>
            <br />
            <span className={cn(styles.small, styles.muted)}>{sub}</span>
          </>
        )}
      </span>
      <button type="button" role="switch" className={styles.switch} aria-checked={checked} aria-labelledby={`${id}-l`} onClick={() => onChange(!checked)}>
        <i />
      </button>
    </div>
  );
}
