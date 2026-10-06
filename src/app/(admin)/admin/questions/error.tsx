"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được ngân hàng câu hỏi: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function AdminQuestionsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được ngân hàng câu hỏi" code="QST-500" onRetry={reset} />
    </AdultCard>
  );
}
