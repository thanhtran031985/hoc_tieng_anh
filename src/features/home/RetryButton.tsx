"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

/** Nút "Thử lại" cho khối lỗi trong trang: tải lại dữ liệu của trang hiện tại. */
export function RetryButton() {
  const router = useRouter();
  return <Button size="m" icon="replay" label="Thử lại" onClick={() => router.refresh()} data-retry="" />;
}
