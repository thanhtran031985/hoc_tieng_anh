"use client";

import { useRouter } from "next/navigation";
import { DataState, Topbar } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

// Lỗi tải màn Chưa đến giờ học: lời nhẹ nhàng, nút Thử lại; bé có thể quay về chọn hồ sơ.
export default function OutsideHoursError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const router = useRouter();
  return (
    <div className={kid.screen}>
      <Topbar onBack={() => router.push("/profiles")} backLabel="Về chọn hồ sơ" />
      <main className={kid.main}>
        <DataState kind="error" size={220} title="Bông chưa xem được lịch học" text="Mình thử lại nhé!" onRetry={retry} />
      </main>
    </div>
  );
}
