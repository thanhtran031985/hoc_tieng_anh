"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được trang: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function AdminExcelError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được trang nhập và xuất Excel" code="XLS-503" onRetry={reset} />
    </AdultCard>
  );
}
