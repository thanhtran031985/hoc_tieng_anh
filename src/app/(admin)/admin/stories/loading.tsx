import { AdultSkeleton } from "@/components/adult";

// Đang tải danh sách truyện: khung xương của bảng (khung menu giữ nguyên vì nằm ở layout).
export default function AdminStoriesLoading() {
  return <AdultSkeleton height="calc(var(--space-16) * 6)" />;
}
