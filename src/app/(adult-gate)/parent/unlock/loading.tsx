import { Skeleton } from "@/components/ui";
import styles from "@/features/parent/gate.module.css";

// Đang tải cổng vào khu bố mẹ: khung xương của thẻ.
export default function ParentUnlockLoading() {
  return (
    <div className={styles.gate} aria-busy="true">
      <div className={styles.card}>
        <Skeleton width="var(--adm-lock-icon)" height="var(--adm-lock-icon)" radius="lg" />
        <Skeleton width="70%" height="var(--space-6)" radius="pill" />
        <Skeleton width="100%" height="var(--adm-pin-cell)" radius="md" />
        <Skeleton width="100%" height="var(--adm-control-l)" radius="md" />
      </div>
    </div>
  );
}
