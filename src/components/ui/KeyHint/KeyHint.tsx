import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import styles from "./KeyHint.module.css";

export type KeyHintProps = Omit<ComponentProps<"kbd">, "aria-hidden"> & {
  /** Đặt ở góc trên trái của thẻ đáp án (thẻ cần `position: relative`). */
  corner?: boolean;
};

/** Nhãn phím tắt dạng nắp phím nhỏ. Chỉ trang trí nên aria-hidden; mô tả phím bằng aria-keyshortcuts trên điều khiển. */
export function KeyHint({ corner, className, children, ...rest }: KeyHintProps) {
  return (
    <kbd className={cn(styles.key, corner && styles.corner, className)} aria-hidden="true" {...rest}>
      {children}
    </kbd>
  );
}
