"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được tiến độ: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function ParentProgressError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được tiến độ của con" code="PRG-503" onRetry={retry} />
    </AdultCard>
  );
}
