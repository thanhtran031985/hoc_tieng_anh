"use client";

import { useRouter } from "next/navigation";
import { DataState, Topbar } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

// Lỗi tạo bản in: lời nhẹ nhàng; nút quay lại Sổ từ vẫn còn để bé không bị kẹt.
export default function PrintError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const router = useRouter();
  return (
    <div className={kid.screen}>
      <Topbar onBack={() => router.push("/notebook")} backLabel="Về Sổ từ" />
      <main className={kid.main}>
        <DataState kind="error" size={220} title="Chưa tạo được bản in" text="Mạng chập chờn một chút. Mình thử lại nhé!" onRetry={retry} />
      </main>
    </div>
  );
}
