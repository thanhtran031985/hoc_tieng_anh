import { AdultSkeleton } from "@/components/adult";

// Đang tải Danh mục phần thưởng: khung xương của bảng (khung menu giữ nguyên vì nằm ở layout).
export default function AdminRewardsLoading() {
  return <AdultSkeleton height="calc(var(--space-16) * 6)" />;
}
