import type { Metadata } from "next";
import { ButtonLink, DataState } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";

export const metadata: Metadata = { title: "Không tìm thấy — Học cùng Bông" };

// Trang không tồn tại (hoặc không được xem): lời nhẹ nhàng bằng tiếng Việt, có đường về trang chủ để không bị kẹt.
export default function NotFound() {
  return (
    <div className={kid.screen}>
      <main className={kid.body}>
        <DataState
          kind="empty"
          size={220}
          title="Bông tìm mãi mà không thấy trang này"
          text="Có thể đường dẫn đã đổi. Mình về trang chủ nhé!"
          action={<ButtonLink href="/home" size="l" label="Về trang chủ" />}
        />
      </main>
    </div>
  );
}
