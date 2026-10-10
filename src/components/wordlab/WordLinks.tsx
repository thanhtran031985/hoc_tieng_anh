"use client";

import { Icon, KeyHint, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";
import { WORDLAB } from "@/lib/rules/constants";
import styles from "./WordLinks.module.css";

export type WordLinksProps = {
  /** Nhãn các bậc của đường dẫn, từ bậc đầu tới bậc đang xem (tối đa `WORDLAB.linksMaxDepth`). */
  crumbs: readonly string[];
  onBack: () => void;
  /** Bấm một bậc trước để quay về đó. */
  onCrumb: (index: number) => void;
  /** Bậc có viền sáng (hướng dẫn). */
  glowCrumb?: number | null;
  /** Bên phải dải: nút đi tiếp theo ngữ cảnh (`WordLinkButton`) hoặc dòng gợi ý. */
  children?: React.ReactNode;
  className?: string;
};

/**
 * Dải liên kết và đường dẫn (WordLinks): “Quay lại” (Backspace), đường dẫn bấm được (bird › họ -ir › Ghép chữ › shirt, tối đa 4 bậc),
 * và nút đi tiếp theo ngữ cảnh ở bên phải.
 */
export function WordLinks({ crumbs, onBack, onCrumb, glowCrumb = null, children, className }: WordLinksProps) {
  return (
    <nav className={cn(styles.links, className)} aria-label="Liên kết qua lại">
      <button type="button" className={styles.back} aria-keyshortcuts="Backspace" disabled={crumbs.length < 2} onClick={onBack}>
        <Icon name="back" size={20} />
        <span>Quay lại</span>
        <KeyHint>⌫</KeyHint>
      </button>
      <ol className={styles.crumbs} aria-label={`Đường dẫn (tối đa ${WORDLAB.linksMaxDepth} bậc)`}>
        {crumbs.map((label, i) => (
          <li key={i}>
            {i === crumbs.length - 1 ? (
              <span className={cn(styles.crumb, styles.now)} aria-current="location">
                {label}
              </span>
            ) : (
              <button type="button" className={cn(styles.crumb, glowCrumb === i && styles.glow)} onClick={() => onCrumb(i)}>
                {label}
              </button>
            )}
          </li>
        ))}
      </ol>
      <div className={styles.go}>{children}</div>
    </nav>
  );
}

export type WordLinkButtonProps = {
  label: string;
  icon: IconName;
  onClick: () => void;
  /** Hết bậc (đường dẫn đã đủ 4): nút khóa. */
  disabled?: boolean;
  glow?: boolean;
};

/** Nút đi tiếp ở dải liên kết: “Họ vần của bird: -ir ›”. */
export function WordLinkButton({ label, icon, onClick, disabled, glow }: WordLinkButtonProps) {
  return (
    <button type="button" className={cn(styles.linkBtn, glow && styles.glow)} disabled={disabled} onClick={onClick}>
      <Icon name={icon} size={20} />
      <span>{label}</span>
      <Icon name="next" size={18} />
    </button>
  );
}

/** Dòng nhắc nhỏ ở dải liên kết. */
export function WordLinksTip({ icon = "bulb", children }: { icon?: IconName; children: React.ReactNode }) {
  return (
    <span className={styles.tip}>
      <Icon name={icon} size={18} />
      {children}
    </span>
  );
}
