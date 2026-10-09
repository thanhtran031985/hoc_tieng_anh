"use client";

import { useRouter } from "next/navigation";
import { DataState, Topbar } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

// Lỗi tải tiến độ đảo: lời nhẹ nhàng; nút quay lại vẫn còn để bé không bị kẹt.
export default function IslandMapError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const router = useRouter();
  return (
    <div className={kid.seaScreen}>
      <Topbar onBack={() => router.push("/levels")} backLabel="Về tổng quan 10 cấp" />
      <main className={kid.main}>
        <DataState kind="error" size={220} title="Bông lạc đường mất rồi" text="Không tải được bản đồ đảo. Mình thử lại nhé!" onRetry={retry} />
      </main>
    </div>
  );
}
