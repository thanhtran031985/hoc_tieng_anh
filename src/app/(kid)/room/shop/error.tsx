"use client";

import { useRouter } from "next/navigation";
import { DataState, Topbar } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

// Lỗi tải Cửa hàng: lời nhẹ nhàng; nút quay lại vẫn còn để bé không bị kẹt (xu của bé vẫn nguyên).
export default function ShopError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const router = useRouter();
  return (
    <div className={kid.screen}>
      <Topbar onBack={() => router.push("/home")} backLabel="Về trang chủ" />
      <main className={kid.main}>
        <DataState kind="error" size={220} title="Cửa hàng chưa mở cửa" text="Xu của bé vẫn còn nguyên. Mình thử lại nhé!" onRetry={retry} />
      </main>
    </div>
  );
}
