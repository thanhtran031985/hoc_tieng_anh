import { AdultSkeleton } from "@/components/adult";
import styles from "@/features/admin/tree.module.css";

// Đang tải Cây lộ trình: khung xương cây và khung sửa (khung menu giữ nguyên vì nằm ở layout).
export default function AdminTreeLoading() {
  return (
    <div className={styles.layout} aria-busy="true">
      <AdultSkeleton height="calc(var(--space-16) * 6)" />
      <AdultSkeleton height="calc(var(--space-16) * 4)" />
    </div>
  );
}
