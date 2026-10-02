import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "../Icon/Icon";
import { KeyHint } from "../KeyHint/KeyHint";
import styles from "./ChoiceCard.module.css";

export type ChoiceState = "default" | "selected" | "correct" | "retry" | "dim";

export type ChoiceCardProps = Omit<ComponentProps<"button">, "children"> & {
  /** Nội dung: hình, từ… (nhãn phím và dấu đúng/chưa đúng do thẻ tự thêm). */
  children?: React.ReactNode;
  /** default: thường · selected: đang chọn (brand) · correct: đúng (✓, nảy) · retry: chưa đúng (↻, lắc nhẹ) · dim: bị gợi ý loại bỏ. */
  state?: ChoiceState;
  /** Nhãn phím ở góc trên trái ("1"–"4"). Thẻ phải thật sự phản hồi phím đó (dùng useHotkeys). */
  keyHint?: string;
};

/** Thẻ đáp án (hình hoặc chữ). Đúng/chưa đúng luôn có biểu tượng đi kèm màu, không chỉ đổi màu. */
export function ChoiceCard({ children, state = "default", keyHint, className, type = "button", disabled, ...rest }: ChoiceCardProps) {
  return (
    <button
      type={type}
      className={cn(styles.choice, state !== "default" && styles[state], className)}
      aria-pressed={state === "selected" ? true : undefined}
      aria-keyshortcuts={keyHint}
      disabled={disabled || state === "dim"}
      {...rest}
    >
      {keyHint && <KeyHint corner>{keyHint}</KeyHint>}
      {state === "correct" && (
        <span className={styles.badge}>
          <Icon name="check" size={24} />
          <span className="sr-only">Đúng</span>
        </span>
      )}
      {state === "retry" && (
        <span className={styles.badge}>
          <Icon name="replay" size={22} />
          <span className="sr-only">Chưa đúng, thử lại</span>
        </span>
      )}
      {children}
    </button>
  );
}
