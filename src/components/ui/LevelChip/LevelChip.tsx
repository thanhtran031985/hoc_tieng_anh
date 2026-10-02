import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import styles from "./LevelChip.module.css";

export type LevelChipProps = Omit<ComponentProps<"span">, "children"> & {
  /** Cấp 1–10: quyết định màu qua `data-level`. */
  level: number;
  /** Tên cấp lấy từ database (vd "Hạt giống"). */
  name: string;
  /** Không nền, không đệm: dùng cạnh tên bé trên thanh trên cùng. */
  plain?: boolean;
};

/** Nhãn cấp: "Cấp 3 · Lá xanh". */
export function LevelChip({ level, name, plain, className, ...rest }: LevelChipProps) {
  return (
    <span className={cn(styles.chip, plain && styles.plain, className)} data-level={level} {...rest}>
      Cấp {level} · {name}
    </span>
  );
}
