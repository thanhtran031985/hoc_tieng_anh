import { AdultSkeleton } from "@/components/adult";

// Đang tải màn Âm phonics: khung xương (khung menu giữ nguyên vì nằm ở layout).
export default function AdminPhonicsLoading() {
  return <AdultSkeleton height="calc(var(--space-16) * 6)" />;
}
