import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";
import { LogoutButton } from "@/features/auth/LogoutButton";
import styles from "@/features/parent/parent.module.css";
import { requireRole } from "@/server/session";

export const metadata: Metadata = { title: "Quản trị — Học cùng Bông" };

// Giữ chỗ: task 12 dựng quản trị nội dung. Chỉ role admin vào được (người khác thấy trang không tồn tại).
export default async function AdminPage() {
  const user = await requireRole("admin");
  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Quản trị nội dung</h1>
      <p className={styles.lead}>Xin chào {user.name}. Công cụ quản trị nội dung sẽ có ở task 12.</p>
      <div className={styles.row}>
        <ButtonLink href="/profiles" variant="secondary" size="m" label="Về chọn hồ sơ" />
        <LogoutButton />
      </div>
    </main>
  );
}
