import { AdultSkeleton } from "@/components/adult";

// Đang tải Ngân hàng từ vựng: khung xương của bảng (khung menu giữ nguyên vì nằm ở layout).
export default function AdminVocabLoading() {
  return <AdultSkeleton height="calc(var(--space-16) * 6)" />;
}
