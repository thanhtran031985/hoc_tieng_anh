import type { ComponentProps } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui";
import styles from "./adult.module.css";

export type AdultButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "dangerOutline";

type Common = {
  label: string;
  variant?: AdultButtonVariant;
  /** l = 44 (cổng vào, nút lưu lớn) · m = 36 · s = 30. */
  size?: "l" | "m" | "s";
  icon?: IconName;
  /** Nhãn phím tắt hiển thị trong nút (nút phải thật sự phản hồi phím đó). */
  shortcut?: string;
  block?: boolean;
  loading?: boolean;
};

const classes = (variant: AdultButtonVariant, size: Common["size"], block?: boolean, extra?: string) =>
  cn(
    styles.btn,
    variant === "secondary" && styles.btnSecondary,
    variant === "ghost" && styles.btnGhost,
    variant === "danger" && styles.btnDanger,
    variant === "dangerOutline" && styles.btnDangerO,
    size === "l" && styles.btnL,
    size === "s" && styles.btnS,
    block && styles.btnBlock,
    extra,
  );

function Inner({ label, icon, shortcut, loading }: Pick<Common, "label" | "icon" | "shortcut" | "loading">) {
  return (
    <>
      {loading ? <span className={styles.spin} aria-hidden="true" /> : icon && <Icon name={icon} size={18} />}
      <span>{label}</span>
      {shortcut && <kbd className={styles.btnKey}>{shortcut}</kbd>}
    </>
  );
}

export type AdultButtonProps = Common & Omit<ComponentProps<"button">, "children">;

/** Nút khu người lớn: chính / phụ / chữ / hành động không hoàn tác (cam nâu, luôn qua hộp thoại xác nhận). */
export function AdultButton({ label, variant = "primary", size = "m", icon, shortcut, block, loading, className, type = "button", disabled, ...rest }: AdultButtonProps) {
  return (
    <button type={type} className={classes(variant, size, block, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      <Inner label={loading ? "Đang xử lý…" : label} icon={icon} shortcut={shortcut} loading={loading} />
    </button>
  );
}

export type AdultButtonLinkProps = Common & Omit<ComponentProps<typeof Link>, "children">;

export function AdultButtonLink({ label, variant = "primary", size = "m", icon, shortcut, block, loading, className, ...rest }: AdultButtonLinkProps) {
  return (
    <Link className={classes(variant, size, block, className)} {...rest}>
      <Inner label={label} icon={icon} shortcut={shortcut} loading={loading} />
    </Link>
  );
}

/** Nút vuông chỉ có biểu tượng (đóng, xóa, mắt…); luôn có `label` cho trình đọc màn hình. */
export function AdultIconButton({ icon, label, className, type = "button", ...rest }: { icon: IconName; label: string } & Omit<ComponentProps<"button">, "children" | "aria-label">) {
  return (
    <button type={type} className={cn(styles.iconBtn, className)} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={16} />
    </button>
  );
}
