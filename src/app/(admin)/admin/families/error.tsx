"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được danh sách họ vần: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function AdminFamiliesError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được họ vần" code="FAM-500" onRetry={retry} />
    </AdultCard>
  );
}
