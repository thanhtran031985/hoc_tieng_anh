import { cn } from "@/lib/cn";
import styles from "./TestDots.module.css";

export type TestDotsProps = {
  /** Số câu đã làm xong (chấm xanh); chấm kế tiếp là câu đang làm (viền xanh). */
  value: number;
  max: number;
  label?: string;
};

/**
 * Thanh tiến độ bài thi: một chấm cho mỗi câu (`size-test-dot`), kèm số “n/N” bằng chữ. Chỉ đi tới, không lùi khi làm sai;
 * câu đang làm có viền và to hơn nên không chỉ dựa vào màu.
 */
export function TestDots({ value, max, label = "Tiến độ bài thi" }: TestDotsProps) {
  const done = Math.min(Math.max(0, value), max);
  return (
    <>
      <div className={styles.dots} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={done} aria-valuetext={`${done} trên ${max} câu`}>
        {Array.from({ length: max }, (_, i) => (
          <i key={i} className={cn(styles.dot, i < done && styles.done, i === done && styles.cur)} />
        ))}
      </div>
      <span className={styles.count} aria-hidden="true">
        {Math.min(done + 1, max)}/{max}
      </span>
    </>
  );
}
