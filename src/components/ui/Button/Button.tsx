import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/icon-paths";
import { KeyHint } from "../KeyHint/KeyHint";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "level" | "success" | "retry" | "ghost";
export type ButtonSize = "l" | "m" | "s";

export type ButtonProps = Omit<ComponentProps<"button">, "children"> & {
  /** Nhãn tiếng Việt, động từ đứng đầu (≤ 2 từ cho bé). Có thể truyền bằng `children`. */
  label?: string;
  children?: React.ReactNode;
  /** primary: hành động chính · secondary: phụ · level: màu cấp (--lv) · success / retry: chỉ trong dải phản hồi · ghost: dạng liên kết */
  variant?: ButtonVariant;
  /** l = 64 (bài học), m = 52, s = 40 */
  size?: ButtonSize;
  /** Tên icon trong bộ Icon. */
  icon?: IconName;
  /** Nhãn phím tắt hiển thị trong nút, ví dụ "Enter". Nút có nhãn phím phải thật sự phản hồi phím đó (dùng useHotkeys). */
  shortcut?: string;
  block?: boolean;
};

/** Nút "kẹo dẻo" 3D: mặt màu + gờ dưới đậm hơn; rê chuột nhô lên, nhấn lún xuống, vô hiệu thì xám phẳng. */
export function Button({
  label,
  children,
  variant = "primary",
  size = "m",
  icon,
  shortcut,
  block,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const text = label ?? children;
  return (
    <button
      type={type}
      className={cn(styles.btn, styles[variant], styles[size], block && styles.block, className)}
      aria-keyshortcuts={shortcut}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === "l" ? 28 : 22} />}
      {text != null && text !== false && <span>{text}</span>}
      {shortcut && <KeyHint>{shortcut}</KeyHint>}
    </button>
  );
}
