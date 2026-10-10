import { AdultGrid, AdultSkeleton } from "@/components/adult";

// Đang tải Bài viết & ghi âm: khung xương danh sách và chi tiết (khung menu giữ nguyên vì nằm ở layout).
export default function ParentWorksLoading() {
  return (
    <AdultGrid>
      <div style={{ gridColumn: "span 4" }} aria-busy="true">
        <AdultSkeleton height="calc(var(--space-16) * 3)" />
      </div>
      <div style={{ gridColumn: "span 8" }} aria-busy="true">
        <AdultSkeleton height="calc(var(--space-16) * 3)" />
      </div>
    </AdultGrid>
  );
}
