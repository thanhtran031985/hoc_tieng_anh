"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được số liệu kho nội dung: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function AdminDashboardError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được số liệu kho nội dung" code="CMS-503" onRetry={retry} />
    </AdultCard>
  );
}
