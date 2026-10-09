import { AdultSkeleton } from "@/components/adult";

// Đang tải Câu hỏi dạng mới: khung xương của bảng (khung menu giữ nguyên vì nằm ở layout).
export default function AdminQuestionTypesLoading() {
  return <AdultSkeleton height="calc(var(--space-16) * 6)" />;
}
