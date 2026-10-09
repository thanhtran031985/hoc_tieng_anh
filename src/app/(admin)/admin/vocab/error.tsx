"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được ngân hàng từ: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function AdminVocabError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được ngân hàng từ vựng" code="VOC-500" onRetry={retry} />
    </AdultCard>
  );
}
