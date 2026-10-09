"use client";

import { Button, ButtonLink, DataState } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

// Lỗi bất ngờ khi tải trang chủ (vd không đọc được hồ sơ): lời nhẹ nhàng, không hiện mã lỗi cho bé.
export default function HomeError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className={kid.screen}>
      <main className={kid.body}>
        <DataState
          kind="error"
          size={220}
          title="Bông chưa mở được trang chủ"
          text="Không phải lỗi của bé đâu. Mình thử lại nhé!"
          action={
            <>
              <Button size="l" icon="replay" label="Thử lại" onClick={retry} data-retry="" />
              <ButtonLink href="/profiles" variant="secondary" size="l" label="Đổi bé" />
            </>
          }
        />
      </main>
    </div>
  );
}
