import { AdultSkeleton } from "@/components/adult";
import styles from "@/features/parent/settings.module.css";

// Đang tải Cài đặt: khung xương nhóm cài đặt và biểu mẫu (khung menu giữ nguyên vì nằm ở layout).
export default function ParentSettingsLoading() {
  return (
    <div className={styles.set} aria-busy="true">
      <AdultSkeleton height="calc(var(--space-16) + var(--space-16))" />
      <AdultSkeleton height="calc(var(--space-16) * 4)" />
    </div>
  );
}
