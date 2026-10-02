import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import styles from "./ProgressBar.module.css";

export type ProgressBarProps = Omit<ComponentProps<"div">, "children" | "role"> & {
  value: number;
  max: number;
  /** m = trong bài học (giữa nút thoát và bộ đếm) · s = trên thẻ, bản đồ. */
  size?: "m" | "s";
  /** Nhãn đọc được cho trình đọc màn hình. */
  label?: string;
};

/** Thanh tiến độ màu cấp (đặt `data-level` trên vùng chứa; không có thì dùng brand). Luôn kèm số dạng chữ ("3/10") cạnh thanh. Chỉ đi tới, không lùi khi làm sai. */
export function ProgressBar({ value, max, size = "m", label = "Tiến độ", className, ...rest }: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const safeValue = Math.min(safeMax, Math.max(0, value));
  return (
    <div
      className={cn(styles.progress, size === "s" && styles.small, className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
      {...rest}
    >
      <span style={{ width: `${(100 * safeValue) / safeMax}%` }} />
    </div>
  );
}
