import { AdultSkeleton } from "@/components/adult";

// Đang tải danh sách họ vần: khung xương của bảng (khung menu giữ nguyên vì nằm ở layout).
export default function AdminFamiliesLoading() {
  return <AdultSkeleton height="calc(var(--space-16) * 6)" />;
}
