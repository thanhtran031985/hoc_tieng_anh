"use client";

import { AdultCard, AdultError } from "@/components/adult";

// Không tải được danh mục phần thưởng: lời nhẹ nhàng, nút Thử lại và mã lỗi nhỏ.
export default function AdminRewardsError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <AdultCard>
      <AdultError title="Chưa tải được danh mục phần thưởng" code="RWD-500" onRetry={retry} />
    </AdultCard>
  );
}
