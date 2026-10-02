"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonLink, DataState, Topbar } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

// Lỗi tải bài xếp lớp: lời nhẹ nhàng; vẫn cho bắt đầu học để bé không bị kẹt.
export default function PlacementError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  return (
    <div className={kid.screen}>
      <Topbar onBack={() => router.push("/profiles")} backLabel="Về chọn hồ sơ" title="Chào bạn mới!" />
      <main className={kid.main}>
        <DataState kind="error" size={220} title="Chưa tải được câu hỏi" text="Bấm Thử lại nhé. Hoặc bắt đầu theo lớp cũng được." action={
            <>
              <Button size="l" icon="replay" label="Thử lại" onClick={reset} data-retry="" />
              <ButtonLink href="/home" variant="secondary" size="l" label="Bắt đầu theo lớp" />
            </>
          }
        />
      </main>
    </div>
  );
}
