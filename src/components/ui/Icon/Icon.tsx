import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { COLORED_ICONS, ICON_PATHS, type IconName } from "./icon-paths";
import styles from "./Icon.module.css";

export type IconProps = Omit<ComponentProps<"svg">, "name" | "children"> & {
  name: IconName;
  /** Cỡ icon (px): 22 trong nút, 26–28 trên thanh trên cùng, 32–40 trên nút lớn. */
  size?: number;
};

/** Icon tự vẽ trên lưới 24px, nét 2.4, màu theo currentColor (trừ star, starEmpty, coin, flame). Luôn đi kèm chữ hoặc aria-label của nút chứa nó. */
export function Icon({ name, size = 24, className, ...rest }: IconProps) {
  const strokeProps = COLORED_ICONS.has(name)
    ? {}
    : { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg
      className={cn(styles.ico, className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...strokeProps}
      {...rest}
      // Nội dung là hằng số trong icon-paths.ts, không có dữ liệu người dùng.
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
    />
  );
}
