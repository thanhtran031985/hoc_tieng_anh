"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { AdultShell, type ShellKid } from "@/components/adult";
import { pickKidId } from "./kid-select";

type Props = {
  user: { name: string; isAdmin: boolean };
  kids: ShellKid[];
  onLock: () => Promise<void>;
  logout: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Khung của khu bố mẹ, nằm ở layout nên giữ nguyên khi đổi trang và khi đang tải: mục menu, tiêu đề và con đang chọn
 * suy ra từ đường dẫn và `?kid=` (cùng luật chọn con với phía server).
 */
export function ParentFrame({ user, kids, onLock, logout, children }: Props) {
  const pathname = usePathname();
  const params = useSearchParams();
  const selectedId = pickKidId(kids, params.get("kid"));
  const kid = kids.find((k) => k.id === selectedId);
  const settings = pathname.startsWith("/parent/settings");
  const crumb = kid ? `${kid.name}${kid.grade ? ` · Lớp ${kid.grade}` : ""}` : "Tài khoản gia đình";

  return (
    <AdultShell
      area="parent"
      active={settings ? "settings" : "overview"}
      title={settings ? "Cài đặt" : kid ? `Tổng quan · ${kid.name}` : "Tổng quan"}
      crumb={settings ? "Thời gian học, giao diện, hồ sơ và bảo mật" : crumb}
      kids={kid ? { list: kids, selectedId: kid.id } : undefined}
      user={user}
      onLock={onLock}
      logout={logout}
    >
      {children}
    </AdultShell>
  );
}
