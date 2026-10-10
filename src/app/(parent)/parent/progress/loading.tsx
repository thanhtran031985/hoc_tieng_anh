import { AdultGrid, AdultSkeleton } from "@/components/adult";
import styles from "@/features/parent/progress.module.css";

// Đang tải Tiến độ: khung xương cây lộ trình và cột tóm tắt (khung menu giữ nguyên vì nằm ở layout).
export default function ParentProgressLoading() {
  return (
    <div className={styles.page} aria-busy="true">
      <AdultGrid>
        <div style={{ gridColumn: "span 8" }}>
          <AdultSkeleton height="calc(var(--space-16) * 5)" />
        </div>
        <div style={{ gridColumn: "span 4" }}>
          <AdultSkeleton height="calc(var(--space-16) * 5)" />
        </div>
      </AdultGrid>
    </div>
  );
}
