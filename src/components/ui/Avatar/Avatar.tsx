import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { AVATAR_AFTER_HAIR, AVATAR_BEFORE_HAIR, AVATAR_HAIR, type AvatarHair } from "./avatar-art";
import styles from "./Avatar.module.css";

export type { AvatarHair };

export type AvatarProps = Omit<ComponentProps<"svg">, "children" | "role"> & {
  /** Tên bé, dùng cho aria-label "Ảnh của <tên>". */
  name: string;
  /** Cấp hiện tại (1–10): quyết định màu nền và áo. */
  level: number;
  hair?: AvatarHair;
  /** Cỡ (px), khung vuông 120×120. 48 trên thanh trên cùng. */
  size?: number;
};

/** Ảnh hồ sơ bé (hình minh họa), có viền tròn nổi. */
export function Avatar({ name, level, hair = "short", size = 96, className, ...rest }: AvatarProps) {
  const safeLevel = Math.min(10, Math.max(1, Math.round(level)));
  return (
    <svg
      className={cn(styles.avatar, className)}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Ảnh của ${name}`}
      {...rest}
      // Nội dung là hằng số trong avatar-art.ts, cấp đã được giới hạn 1–10.
      dangerouslySetInnerHTML={{ __html: AVATAR_BEFORE_HAIR(safeLevel) + AVATAR_HAIR[hair] + AVATAR_AFTER_HAIR }}
    />
  );
}
