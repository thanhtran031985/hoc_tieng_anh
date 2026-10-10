"use client";

import { useRouter } from "next/navigation";
import { DataState, Topbar } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

// Lỗi tải Phòng của tớ: lời nhẹ nhàng; nút quay lại vẫn còn để bé không bị kẹt (đồ đạc của bé vẫn nguyên).
export default function RoomError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const router = useRouter();
  return (
    <div className={kid.screen}>
      <Topbar onBack={() => router.push("/home")} backLabel="Về trang chủ" />
      <main className={kid.main}>
        <DataState kind="error" size={220} title="Chưa mở được phòng" text="Đồ đạc của bé vẫn còn nguyên. Mình thử lại nhé!" onRetry={retry} />
      </main>
    </div>
  );
}
