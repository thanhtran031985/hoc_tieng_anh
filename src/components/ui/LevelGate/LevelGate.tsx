import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "../Icon/Icon";
import styles from "./LevelGate.module.css";

export type LevelGateProps = Omit<ComponentProps<"button">, "children"> & {
  /** Cổng khóa: lòng cổng tối, song chắn và ổ khóa. Cổng mở: lòng cổng sáng, lấp lánh. */
  locked?: boolean;
  /** Số vùng còn lại khi cổng khóa. */
  left?: number;
  /** Tên nơi cổng dẫn tới, vd “đảo Cành cây”; dùng cho nhãn đọc của trình đọc màn hình. */
  next?: string;
};

/**
 * Cổng bài thi lên cấp ở cuối đường đảo (thiết kế `Bong.LevelGate`). Khóa thì vẫn bấm được (mở thẻ liệt kê vùng còn thiếu) nên chỉ báo `aria-disabled`,
 * không dùng `disabled`; trạng thái luôn có chữ (“Còn N vùng” / “Bài thi lên cấp”), không chỉ dựa vào màu.
 */
export function LevelGate({ locked = true, left = 0, next = "đảo mới", className, ...rest }: LevelGateProps) {
  return (
    <button
      type="button"
      className={cn(styles.gate, locked ? styles.locked : styles.open, className)}
      aria-label={locked ? `Cổng lên ${next} đang khoá: còn ${left} vùng chưa xong` : `Cổng lên ${next} đã mở: vào bài thi lên cấp`}
      aria-disabled={locked || undefined}
      {...rest}
    >
      <svg className={styles.art} viewBox="0 0 160 170" aria-hidden="true">
        <g stroke="var(--dragon-line)" strokeWidth="3.5" strokeLinejoin="round">
          <path d="M14 168 V70 C14 26 44 6 80 6 C116 6 146 26 146 70 V168 Z" fill="var(--gate-stone)" />
          <path d="M34 168 V76 C34 46 54 28 80 28 C106 28 126 46 126 76 V168 Z" fill={locked ? "var(--gate-dark)" : "var(--gate-glow)"} />
        </g>
        <path d="M14 100 H34 M126 100 H146 M14 134 H34 M126 134 H146 M24 50 L38 60 M136 50 L122 60 M80 6 V28" stroke="var(--gate-stone-shade)" strokeWidth="3" fill="none" />
        {locked ? (
          <>
            <path d="M50 168 V90 M66 168 V80 M80 168 V78 M94 168 V80 M110 168 V90" stroke="var(--gate-stone-shade)" strokeWidth="6" fill="none" />
            <g stroke="var(--dragon-line)" strokeWidth="3.5" strokeLinejoin="round">
              <rect x="58" y="112" width="44" height="36" rx="8" fill="var(--star)" />
              <path d="M66 112 V100 a14 14 0 0 1 28 0 V112" fill="none" />
            </g>
            <circle cx="80" cy="128" r="4" fill="var(--dragon-line)" />
          </>
        ) : (
          <g fill="var(--star)" stroke="var(--star-shade)" strokeWidth="2">
            <path d="M60 70 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
            <path d="M100 96 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
            <path d="M76 130 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
          </g>
        )}
      </svg>
      <span className={styles.label}>
        {locked ? (
          <>
            <Icon name="lock" size={18} />
            Còn {left} vùng
          </>
        ) : (
          <>
            <Icon name="star" size={20} />
            Bài thi lên cấp
          </>
        )}
      </span>
    </button>
  );
}
