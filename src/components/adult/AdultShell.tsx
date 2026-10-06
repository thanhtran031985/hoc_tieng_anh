"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Avatar, Icon, type AvatarHair } from "@/components/ui";
import { cn } from "@/lib/cn";
import { AdultButton } from "./AdultButton";
import { AdultDialog } from "./AdultDialog";
import { ADMIN_NAV, PARENT_NAV } from "./nav";
import styles from "./adult.module.css";

export type ShellKid = { id: number; name: string; grade: number | null; level: number; hair: AvatarHair };

type Props = {
  area: "parent" | "admin";
  /** Khóa của mục menu đang mở (xem nav.ts). */
  active: string;
  title: string;
  crumb?: string;
  /** Các con để chọn ở thanh trên (khu bố mẹ); bỏ trống thì không hiện bộ chọn. */
  kids?: { list: ShellKid[]; selectedId: number };
  /** Nút phụ ở thanh trên (trước nút "Về màn chọn hồ sơ"). */
  actions?: React.ReactNode;
  user: { name: string; isAdmin: boolean };
  /** Khóa cổng bố mẹ rồi về màn chọn hồ sơ (server action). */
  onLock: () => Promise<void>;
  /** Nút Đăng xuất (client component của tài khoản). */
  logout: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Khung khu người lớn: menu trái tối (chuyển Bố mẹ / Quản trị), thanh trên có tiêu đề, bộ chọn con và nút "Về màn chọn hồ sơ"
 * (hỏi xác nhận vì khu người lớn sẽ khóa lại), vùng nội dung rộng tối đa `adm-content-max`.
 */
export function AdultShell({ area, active, title, crumb, kids, actions, user, onLock, logout, children }: Props) {
  const nav = area === "parent" ? PARENT_NAV : ADMIN_NAV;
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <div className={styles.app}>
      <aside className={styles.side} aria-label="Menu khu người lớn">
        <div className={styles.brand}>
          <b>Học cùng Bông</b>
          <span>{area === "parent" ? "Khu bố mẹ" : "Quản trị nội dung"}</span>
        </div>
        <div className={styles.area} role="group" aria-label="Khu vực">
          <Link href="/parent" aria-current={area === "parent" ? "page" : undefined}>
            Bố mẹ
          </Link>
          {user.isAdmin ? (
            <Link href="/admin" aria-current={area === "admin" ? "page" : undefined}>
              Quản trị
            </Link>
          ) : (
            <span className={styles.areaOff} aria-disabled="true">
              Quản trị
            </span>
          )}
        </div>
        <nav className={styles.nav} aria-label={area === "parent" ? "Khu bố mẹ" : "Quản trị"}>
          {nav.map((item) =>
            item.ready ? (
              <Link key={item.key} href={item.href} className={cn(styles.navItem, item.key === active && styles.navOn)} aria-current={item.key === active ? "page" : undefined}>
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            ) : (
              <span key={item.key} className={cn(styles.navItem, styles.navOff)} aria-disabled="true">
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
                <span className={styles.navTag}>Sắp có</span>
              </span>
            ),
          )}
        </nav>
        <div className={styles.who}>
          <span className={styles.whoAv} aria-hidden="true">
            {user.name.trim().charAt(0).toUpperCase() || "B"}
          </span>
          <span className={styles.whoText}>
            <b>{user.name}</b>
            <br />
            <span>Tài khoản gia đình</span>
          </span>
          {logout}
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.top}>
          <div className={styles.topL}>
            {crumb && <span className={cn(styles.small, styles.muted)}>{crumb}</span>}
            <h1 className={styles.h1}>{title}</h1>
          </div>
          <div className={styles.topR}>
            {kids && kids.list.length > 0 && <KidSwitcher kids={kids.list} selectedId={kids.selectedId} />}
            {actions}
            <AdultButton label="Về màn chọn hồ sơ" variant="secondary" icon="users" onClick={() => setConfirmOpen(true)} data-profiles="" />
          </div>
        </header>
        <main className={styles.body2}>
          <div className={styles.wrap}>{children}</div>
        </main>
      </div>

      <AdultDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Về màn chọn hồ sơ?"
        actions={[{ label: "Ở lại" }, { label: "Về màn chọn hồ sơ", variant: "primary", onClick: () => onLock() }]}
      >
        Khu người lớn sẽ được khóa lại. Lần sau vào cần nhập lại mật khẩu hoặc mã PIN.
      </AdultDialog>
    </div>
  );
}

/** Bộ chọn con ở thanh trên: đổi con bằng `?kid=<id>` trong địa chỉ; ← → để chọn. */
function KidSwitcher({ kids, selectedId }: { kids: ShellKid[]; selectedId: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const pick = (index: number) => {
    router.push(`${pathname}?kid=${kids[index].id}`);
    refs.current[index]?.focus();
  };
  return (
    <div className={styles.kids} role="radiogroup" aria-label="Chọn con">
      {kids.map((kid, index) => {
        const on = kid.id === selectedId;
        return (
          <button
            key={kid.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            className={cn(styles.kid, on && styles.kidOn)}
            onClick={() => pick(index)}
            onKeyDown={(event) => {
              const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
              if (step === 0) return;
              event.preventDefault();
              pick((index + step + kids.length) % kids.length);
            }}
          >
            <Avatar name={kid.name} level={kid.level} hair={kid.hair} size={28} />
            <span>
              <b>{kid.name}</b>
              {kid.grade ? ` · Lớp ${kid.grade}` : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}
