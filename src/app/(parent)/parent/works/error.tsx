"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được bản ghi âm: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function ParentWorksError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được bài của con" code="WRK-502" onRetry={retry} />
    </AdultCard>
  );
}
