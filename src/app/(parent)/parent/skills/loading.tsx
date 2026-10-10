import { AdultGrid, AdultSkeleton } from "@/components/adult";
import styles from "@/features/parent/skills.module.css";

// Đang tải Kỹ năng: khung xương biểu đồ và danh sách từ hay sai (khung menu giữ nguyên vì nằm ở layout).
export default function ParentSkillsLoading() {
  return (
    <div className={styles.page} aria-busy="true">
      <AdultGrid>
        <div style={{ gridColumn: "span 8" }}>
          <AdultSkeleton height="calc(var(--space-16) * 4)" />
        </div>
        <div style={{ gridColumn: "span 4" }}>
          <AdultSkeleton height="calc(var(--space-16) * 4)" />
        </div>
      </AdultGrid>
    </div>
  );
}
