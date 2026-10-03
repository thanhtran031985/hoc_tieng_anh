import { AdultGrid, AdultSkeleton } from "@/components/adult";
import styles from "@/features/admin/dashboard.module.css";

// Đang tải Bảng điều khiển: khung xương số liệu, biểu đồ, cảnh báo và bảng (khung menu giữ nguyên vì nằm ở layout).
export default function AdminDashboardLoading() {
  return (
    <div className={styles.page} aria-busy="true">
      <div className={styles.kpis}>
        {[0, 1, 2, 3].map((i) => (
          <AdultSkeleton key={i} height="var(--space-8)" />
        ))}
      </div>
      <AdultGrid>
        <div className={styles.span8}>
          <AdultSkeleton height="calc(var(--space-16) * 3)" />
        </div>
        <div className={styles.span4}>
          <AdultSkeleton height="calc(var(--space-16) * 3)" />
        </div>
        <div className={styles.span12}>
          <AdultSkeleton height="calc(var(--space-16) * 2)" />
        </div>
        <div className={styles.span12}>
          <AdultSkeleton height="calc(var(--space-16) * 3)" />
        </div>
      </AdultGrid>
    </div>
  );
}
