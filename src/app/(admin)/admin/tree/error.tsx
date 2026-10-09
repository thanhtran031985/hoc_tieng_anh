"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được cấu trúc: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function AdminTreeError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được cấu trúc lộ trình" code="TRE-500" onRetry={retry} />
    </AdultCard>
  );
}
