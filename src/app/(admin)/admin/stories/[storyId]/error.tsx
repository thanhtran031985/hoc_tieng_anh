"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được truyện: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ (STY-500 theo thiết kế).
export default function AdminStoryEditorError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được truyện" code="STY-500" onRetry={retry} />
    </AdultCard>
  );
}
