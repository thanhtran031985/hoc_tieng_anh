"use client";

import { useRouter } from "next/navigation";
import { DataState, Topbar } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

// Lỗi tải Sổ từ: lời nhẹ nhàng; nút quay lại vẫn còn để bé không bị kẹt.
export default function NotebookError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const router = useRouter();
  return (
    <div className={kid.screen}>
      <Topbar onBack={() => router.push("/home")} backLabel="Về trang chủ" />
      <main className={kid.main}>
        <DataState kind="error" size={220} title="Sổ từ chưa mở được" text="Mạng đang chập chờn. Mình thử lại nhé!" onRetry={retry} />
      </main>
    </div>
  );
}
