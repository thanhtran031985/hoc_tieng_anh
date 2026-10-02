import type { Metadata } from "next";
import { ButtonLink, Mascot } from "@/components/ui";
import { LogoutButton } from "@/features/auth/LogoutButton";
import { requireActiveLearner } from "@/server/active-learner";

export const metadata: Metadata = { title: "Trang chủ — Học cùng Bông" };

// Giữ chỗ: task 06 dựng trang chủ thật. Đã chọn hồ sơ mới vào được (requireActiveLearner).
export default async function HomePage() {
  const learner = await requireActiveLearner();
  return (
    <main className="mx-auto flex max-w-content flex-col items-center gap-6 p-12 text-center">
      <Mascot expr="chao" size={220} />
      <h1 className="font-display text-display-l">Chào {learner.name}!</h1>
      <p className="font-body text-body-l text-ink-soft">Trang chủ của bé sẽ có ở task 06.</p>
      <div className="flex items-center gap-4">
        <ButtonLink href="/profiles" variant="secondary" size="m" label="Đổi bé" />
        <LogoutButton />
      </div>
    </main>
  );
}
