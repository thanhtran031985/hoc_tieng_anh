import { Skeleton } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";
import styles from "@/features/notebook/print.module.css";

// Đang chuẩn bị bản in Khám phá từ: khung trang A4 trống.
export default function ExplorerPrintLoading() {
  return (
    <div className={`${kid.screen} ${styles.screen}`} aria-busy="true">
      <main className={styles.pv}>
        <Skeleton width="calc(var(--space-16) * 8)" height="var(--space-8)" radius="pill" />
        <Skeleton width="calc(var(--space-16) * 8)" height="100%" radius="md" />
      </main>
    </div>
  );
}
