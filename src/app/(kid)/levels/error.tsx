"use client";

import { useRouter } from "next/navigation";
import { DataState, Topbar } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

// Lỗi tải tiến độ: lời nhẹ nhàng; nút quay lại vẫn còn để bé không bị kẹt.
export default function LevelsError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const router = useRouter();
  return (
    <div className={kid.seaScreen}>
      <Topbar onBack={() => router.push("/home")} backLabel="Về trang chủ" />
      <main className={kid.main}>
        <DataState kind="error" size={220} title="Bông chưa vẽ được bản đồ" text="Mạng đang chậm. Bé bấm Thử lại nhé!" onRetry={retry} />
      </main>
    </div>
  );
}
