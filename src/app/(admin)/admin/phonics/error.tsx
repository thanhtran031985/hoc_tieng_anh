"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được danh sách âm: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function AdminPhonicsError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được danh sách âm phonics" code="PHN-500" onRetry={retry} />
    </AdultCard>
  );
}
