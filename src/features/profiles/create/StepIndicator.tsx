import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui";
import styles from "./create.module.css";

export const STEP_LABELS = ["Tên và lớp", "Bạn đồng hành", "Loa và micro"] as const;

/** Thanh bước 1–3. Bấm được các bước đã tới; bước đã xong có dấu ✓. */
export function StepIndicator({ step, reached, onGo }: { step: number; reached: number; onGo: (step: number) => void }) {
  return (
    <nav className={styles.steps} aria-label="Các bước tạo hồ sơ">
      {STEP_LABELS.map((label, index) => {
        const n = index + 1;
        const done = n < step;
        return (
          <Fragment key={label}>
            {index > 0 && <span className={cn(styles.bar, n <= step && styles.barOn)} />}
            <button
              type="button"
              className={cn(styles.step, done && styles.done, n === step && styles.current)}
              aria-current={n === step ? "step" : undefined}
              disabled={n > reached}
              onClick={() => onGo(n)}
            >
              <span className={styles.dot}>{done ? <Icon name="check" size={22} /> : n}</span>
              <span className={styles.stepLabel}>{label}</span>
            </button>
          </Fragment>
        );
      })}
    </nav>
  );
}
