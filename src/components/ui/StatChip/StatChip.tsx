import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/icon-paths";
import styles from "./StatChip.module.css";

export type StatKind = "stars" | "coins" | "streak";

export type StatChipProps = Omit<ComponentProps<"div">, "children" | "title"> & {
  kind: StatKind;
  value: number | string;
  /** Tên của số đó ("sao", "xu", "ngày học liên tiếp"): hiện khi rê chuột và đọc cho trình đọc màn hình. */
  label: string;
  /** Bật khi vừa nhận thưởng: chip nảy một lần. */
  bump?: boolean;
};

const ICON: Record<StatKind, IconName> = { stars: "star", coins: "coin", streak: "flame" };

/** Chip thống kê bo tròn: biểu tượng màu + số. Luôn theo thứ tự Sao · Xu · Chuỗi ngày ở bên phải thanh trên cùng. */
export function StatChip({ kind, value, label, bump, className, ...rest }: StatChipProps) {
  return (
    <div className={cn(styles.stat, bump && styles.bump, className)} data-stat={kind} title={label} {...rest}>
      <Icon name={ICON[kind]} size={28} />
      <span className={styles.value}>{value}</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}
