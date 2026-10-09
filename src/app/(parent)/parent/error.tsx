"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được số liệu: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function ParentOverviewError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được số liệu" code="PRG-503" onRetry={retry} />
    </AdultCard>
  );
}
