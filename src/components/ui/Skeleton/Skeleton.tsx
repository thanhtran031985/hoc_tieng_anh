import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import styles from "./Skeleton.module.css";

export type SkeletonRadius = "sm" | "md" | "lg" | "xl" | "pill" | "round";

export type SkeletonProps = Omit<ComponentProps<"span">, "children"> & {
  /** Chiều rộng (độ dài CSS, vd "60%", "var(--size-speaker-s)"). */
  width: string;
  height: string;
  /** Bo góc theo token: round cho ảnh tròn, pill cho dòng chữ. Mặc định md. */
  radius?: SkeletonRadius;
};

/** Khung xương khi đang tải: cùng bố cục với nội dung thật (hình tròn cho ảnh, thanh bo pill cho chữ), có vệt sáng chạy. Không dùng vòng xoay toàn màn. */
export function Skeleton({ width, height, radius = "md", className, style, ...rest }: SkeletonProps) {
  return (
    <span
      className={cn(styles.sk, className)}
      style={{ width, height, borderRadius: `var(--radius-${radius})`, ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
}
