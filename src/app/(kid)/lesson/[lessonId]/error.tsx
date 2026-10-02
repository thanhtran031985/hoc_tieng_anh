"use client";

import { useRouter } from "next/navigation";
import { DataState, Topbar } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

// Lỗi tải bài: lời nhẹ nhàng; nút quay lại vẫn còn để bé không bị kẹt (tiến độ dở đã giữ trên máy).
export default function LessonError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  return (
    <div className={kid.screen}>
      <Topbar onBack={() => router.push("/map")} backLabel="Về bản đồ" />
      <main className={kid.main}>
        <DataState kind="error" size={220} title="Bài học chưa mở được" text="Mạng đang chậm. Không phải lỗi của bé đâu, mình thử lại nhé!" onRetry={reset} />
      </main>
    </div>
  );
}
