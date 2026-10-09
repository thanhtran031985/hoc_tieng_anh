"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được bài học: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function AdminBuilderError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được bài học" code="LSN-500" onRetry={retry} />
    </AdultCard>
  );
}
