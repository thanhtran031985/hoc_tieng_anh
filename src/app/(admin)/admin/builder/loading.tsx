import { AdultSkeleton } from "@/components/adult";
import styles from "@/features/admin/builder.module.css";

// Đang tải Soạn bài học: khung xương ba cột (khung menu giữ nguyên vì nằm ở layout).
export default function AdminBuilderLoading() {
  return (
    <div className={styles.lb} aria-busy="true">
      <AdultSkeleton height="calc(var(--space-16) * 6)" />
      <AdultSkeleton height="calc(var(--space-16) * 6)" />
      <AdultSkeleton height="calc(var(--space-16) * 4)" />
    </div>
  );
}
