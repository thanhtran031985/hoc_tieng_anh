"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được thư viện: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function AdminMediaError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được thư viện hình và âm thanh" code="MED-503" onRetry={reset} />
    </AdultCard>
  );
}
