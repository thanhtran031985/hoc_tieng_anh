"use client";

import { useRouter } from "next/navigation";
import { DataState, Topbar } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

// Lỗi tạo bản in Khám phá từ: lời nhẹ nhàng, có nút thử lại và quay về.
export default function ExplorerPrintError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const router = useRouter();
  return (
    <div className={kid.screen}>
      <Topbar onBack={() => router.back()} backLabel="Quay lại" />
      <main className={kid.main}>
        <DataState kind="error" size={220} title="Chưa tạo được bản in" text="Mạng chập chờn một chút. Mình thử lại nhé!" onRetry={retry} />
      </main>
    </div>
  );
}
