"use client";

import { useRouter } from "next/navigation";
import { DataState, Topbar } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

// Lỗi tải Ôn tập: lời nhẹ nhàng; nút quay lại vẫn còn để bé không bị kẹt.
export default function ReviewError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const router = useRouter();
  return (
    <div className={kid.screen}>
      <Topbar onBack={() => router.push("/home")} backLabel="Về trang chủ" />
      <main className={kid.main}>
        <DataState kind="error" size={220} title="Chưa tải được từ cần ôn" text="Mạng chập chờn một chút. Không phải lỗi của bé đâu!" onRetry={retry} />
      </main>
    </div>
  );
}
