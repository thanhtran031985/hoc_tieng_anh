"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được cài đặt: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function ParentSettingsError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được cài đặt" code="SET-500" onRetry={retry} />
    </AdultCard>
  );
}
