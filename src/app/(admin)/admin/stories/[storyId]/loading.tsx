import { AdultSkeleton } from "@/components/adult";

// Đang tải màn soạn truyện: khung xương 3 cột.
export default function AdminStoryEditorLoading() {
  return <AdultSkeleton height="calc(var(--space-16) * 8)" />;
}
