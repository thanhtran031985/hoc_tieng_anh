import type { CSSProperties } from "react";
import { Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";
import styles from "./rewards.module.css";

export type MedalProps = {
  /** Biểu tượng ở giữa huy hiệu. */
  icon: IconName;
  /** Cấp 1–10: màu lõi huy hiệu theo màu cấp. */
  level?: number;
  /** false = huy hiệu chưa nhận (xám, ô trống). */
  earned?: boolean;
  /** Đường kính vòng (px). */
  size?: number;
  className?: string;
};

/** Huy hiệu (Bong.R.medal): vòng vàng răng cưa, lõi màu cấp, hai dải ruy-băng. Chỉ trang trí; nơi dùng đặt nhãn đọc màn hình. */
export function Medal({ icon, level = 1, earned = true, size = 120, className }: MedalProps) {
  const style = { "--sz": `${size}px`, "--c": `var(--level-${level})`, "--c-soft": `var(--level-${level}-soft)` } as CSSProperties;
  return (
    <span className={cn(styles.medal, earned ? styles.earned : styles.locked, className)} style={style} aria-hidden="true">
      <svg className={styles.rib} viewBox="0 0 120 60" aria-hidden="true">
        <path d="M34 0 L18 52 L32 46 L40 58 L56 6 Z" fill={earned ? "var(--badge-ribbon-a)" : "var(--badge-locked)"} stroke="var(--dragon-line)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M86 0 L102 52 L88 46 L80 58 L64 6 Z" fill={earned ? "var(--badge-ribbon-b)" : "var(--badge-locked)"} stroke="var(--dragon-line)" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <span className={styles.ring}>
        <span className={styles.core}>
          <Icon name={icon} size={Math.round(size * 0.34)} />
        </span>
      </span>
    </span>
  );
}
