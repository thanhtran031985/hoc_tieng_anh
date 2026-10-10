"use client";

import { useRouter } from "next/navigation";
import { DataState, Topbar } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

// Lỗi tải Ghép chữ đầu: lời nhẹ nhàng; nút quay lại vẫn còn để bé không bị kẹt.
export default function BuildError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const router = useRouter();
  return (
    <div className={kid.screen}>
      <Topbar onBack={() => router.push("/notebook")} backLabel="Về Sổ từ" />
      <main className={kid.main}>
        <DataState kind="error" size={220} title="Chưa mở được Ghép chữ đầu" text="Mình thử lại nhé, hoặc quay về Sổ từ." onRetry={retry} />
      </main>
    </div>
  );
}
