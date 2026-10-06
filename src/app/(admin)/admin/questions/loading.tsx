import { AdultSkeleton } from "@/components/adult";

// Đang tải Ngân hàng câu hỏi: khung xương của bảng (khung menu giữ nguyên vì nằm ở layout).
export default function AdminQuestionsLoading() {
  return <AdultSkeleton height="calc(var(--space-16) * 6)" />;
}
