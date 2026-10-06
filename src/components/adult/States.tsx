import { Icon, Mascot, Skeleton, type Expr } from "@/components/ui";
import { cn } from "@/lib/cn";
import { AdultButton } from "./AdultButton";
import styles from "./adult.module.css";

/** Khung xương của một thẻ (đang tải). */
export function AdultSkeleton({ height = "var(--space-16)" }: { height?: string }) {
  return (
    <section className={styles.card} aria-busy="true">
      <Skeleton width="38%" height="var(--space-4)" radius="pill" />
      <div style={{ height: "var(--space-3)" }} />
      <Skeleton width="100%" height={height} radius="md" />
    </section>
  );
}

/** Trạng thái trống: rồng Bông nhỏ (nơi duy nhất khu người lớn có linh vật) + câu giải thích + một nút. */
export function AdultEmpty({ title, text, action, expr = "suynghi" }: { title: string; text?: string; action?: React.ReactNode; expr?: Expr }) {
  return (
    <div className={styles.state} role="status">
      <Mascot expr={expr} size={64} />
      <h2 className={styles.h2}>{title}</h2>
      {text && <p className={cn(styles.body, styles.muted)}>{text}</p>}
      {action}
    </div>
  );
}

/** Trạng thái lỗi: giải thích nhẹ nhàng, nút Thử lại và mã lỗi nhỏ. */
export function AdultError({
  title = "Chưa tải được dữ liệu",
  text = "Kết nối máy chủ bị gián đoạn. Dữ liệu đã lưu không bị ảnh hưởng.",
  code,
  onRetry,
}: {
  title?: string;
  text?: string;
  code?: string;
  onRetry?: () => void;
}) {
  return (
    <div className={styles.state} role="alert">
      <span className={styles.stateIc}>
        <Icon name="wifi" size={26} />
      </span>
      <h2 className={styles.h2}>{title}</h2>
      <p className={cn(styles.body, styles.muted)}>{text}</p>
      <AdultButton label="Thử lại" icon="replay" onClick={onRetry} data-retry="" />
      {code && <span className={cn(styles.small, styles.muted)}>Mã lỗi: {code}</span>}
    </div>
  );
}
