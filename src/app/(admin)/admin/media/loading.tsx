import { AdultSkeleton } from "@/components/adult";

// Đang tải Thư viện hình và âm thanh: khung xương (khung menu giữ nguyên vì nằm ở layout).
export default function AdminMediaLoading() {
  return <AdultSkeleton height="calc(var(--space-16) * 6)" />;
}
