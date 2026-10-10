"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được kỹ năng: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function ParentSkillsError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được kỹ năng của con" code="PRG-503" onRetry={retry} />
    </AdultCard>
  );
}
