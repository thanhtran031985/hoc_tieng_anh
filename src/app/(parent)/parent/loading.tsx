import { AdultGrid, AdultSkeleton } from "@/components/adult";
import styles from "@/features/parent/overview.module.css";

// Đang tải Tổng quan: khung xương số liệu và biểu đồ (khung menu giữ nguyên vì nằm ở layout).
export default function ParentOverviewLoading() {
  return (
    <div className={styles.page} aria-busy="true">
      <div className={styles.kpis}>
        {[0, 1, 2, 3, 4].map((i) => (
          <AdultSkeleton key={i} height="var(--space-8)" />
        ))}
      </div>
      <AdultGrid>
        <div style={{ gridColumn: "span 8" }}>
          <AdultSkeleton height="var(--space-24)" />
        </div>
        <div style={{ gridColumn: "span 4" }}>
          <AdultSkeleton height="var(--space-24)" />
        </div>
      </AdultGrid>
    </div>
  );
}
