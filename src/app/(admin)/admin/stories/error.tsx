"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được danh sách truyện: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function AdminStoriesError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được truyện tranh" code="STY-500" onRetry={retry} />
    </AdultCard>
  );
}
