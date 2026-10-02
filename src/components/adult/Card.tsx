import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import styles from "./adult.module.css";

/** Thẻ nội dung của khu người lớn; `span` đặt số cột (lưới 12 cột) khi nằm trong `AdultGrid`. */
export function AdultCard({ span, className, ...rest }: ComponentProps<"section"> & { span?: 3 | 4 | 6 | 8 | 12 }) {
  const col = span === 3 ? styles.s3 : span === 4 ? styles.s4 : span === 6 ? styles.s6 : span === 8 ? styles.s8 : span === 12 ? styles.s12 : undefined;
  return <section className={cn(styles.card, col, className)} {...rest} />;
}

/** Tiêu đề thẻ: tên + chú thích bên trái, nút/phân đoạn bên phải. */
export function AdultCardHead({ title, sub, id, right }: { title: string; sub?: string; id?: string; right?: React.ReactNode }) {
  return (
    <div className={styles.cardH}>
      <div>
        <h2 className={styles.h2} id={id}>
          {title}
        </h2>
        {sub && <span className={cn(styles.small, styles.muted)}>{sub}</span>}
      </div>
      {right}
    </div>
  );
}

export function AdultGrid({ children }: { children: React.ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
