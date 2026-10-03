"use client";

import { usePathname } from "next/navigation";
import { AdultShell } from "@/components/adult";
import { ADMIN_NAV } from "@/components/adult/nav";

type Props = {
  user: { name: string; isAdmin: boolean };
  onLock: () => Promise<void>;
  logout: React.ReactNode;
  children: React.ReactNode;
};

/** Khung của khu quản trị, nằm ở layout nên giữ nguyên khi đổi trang và khi đang tải; mục menu đang mở suy ra từ đường dẫn. */
export function AdminFrame({ user, onLock, logout, children }: Props) {
  const pathname = usePathname();
  const current = ADMIN_NAV.find((item) => item.href !== "/admin" && (pathname === item.href || pathname.startsWith(`${item.href}/`))) ?? ADMIN_NAV[0];
  return (
    <AdultShell area="admin" active={current.key} title={current.key === "dash" ? "Bảng điều khiển nội dung" : current.key === "builder" ? "Soạn bài học" : current.label} crumb="Quản trị nội dung" user={user} onLock={onLock} logout={logout}>
      {children}
    </AdultShell>
  );
}
