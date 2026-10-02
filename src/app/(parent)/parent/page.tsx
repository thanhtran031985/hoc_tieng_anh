import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";
import { LogoutButton } from "@/features/auth/LogoutButton";
import styles from "@/features/parent/parent.module.css";
import { requireParentGate } from "@/server/parent-gate";

export const metadata: Metadata = { title: "Khu vực bố mẹ — Học cùng Bông" };

// Giữ chỗ: task 11 dựng trang tổng quan của bố mẹ.
export default async function ParentPage() {
  const user = await requireParentGate();
  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Khu vực của bố mẹ</h1>
      <p className={styles.lead}>Xin chào {user.name}. Trang tổng quan học tập sẽ có ở task 11.</p>
      <div className={styles.row}>
        <ButtonLink href="/profiles" variant="secondary" size="m" label="Về chọn hồ sơ" />
        <LogoutButton />
      </div>
    </main>
  );
}
