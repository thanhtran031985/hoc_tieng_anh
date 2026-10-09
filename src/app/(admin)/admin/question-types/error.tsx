"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được câu hỏi dạng mới: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function AdminQuestionTypesError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được câu hỏi dạng mới" code="QBK-502" onRetry={retry} />
    </AdultCard>
  );
}
