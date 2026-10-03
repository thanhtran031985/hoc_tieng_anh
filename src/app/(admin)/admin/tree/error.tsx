"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được cấu trúc: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function AdminTreeError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được cấu trúc lộ trình" code="TRE-500" onRetry={reset} />
    </AdultCard>
  );
}
