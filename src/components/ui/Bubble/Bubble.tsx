import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import styles from "./Bubble.module.css";

export type BubbleProps = ComponentProps<"div"> & {
  /** Vị trí đuôi bóng: left (dưới, bên trái) · right (dưới, bên phải) · side (bên trái, giữa). */
  tail?: "left" | "right" | "side";
};

/** Bóng thoại của rồng Bông: tối đa 2 dòng, xưng "Bông", gọi bé bằng tên. */
export function Bubble({ tail = "left", className, ...rest }: BubbleProps) {
  return <div className={cn(styles.bubble, styles[tail], className)} {...rest} />;
}
