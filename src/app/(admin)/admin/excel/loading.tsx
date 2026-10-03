import { AdultSkeleton } from "@/components/adult";

// Đang tải trang Nhập & xuất Excel: khung xương (khung menu giữ nguyên vì nằm ở layout).
export default function AdminExcelLoading() {
  return <AdultSkeleton height="calc(var(--space-16) * 4)" />;
}
