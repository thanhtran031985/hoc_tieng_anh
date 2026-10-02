"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { IconName } from "@/components/ui";
import { cn } from "@/lib/cn";
import { AdultButton, type AdultButtonVariant } from "./AdultButton";
import styles from "./adult.module.css";

export type AdultDialogAction = {
  label: string;
  variant?: AdultButtonVariant;
  icon?: IconName;
  /** Chạy khi bấm. Trả về `false` (hoặc Promise<false>) để giữ hộp thoại mở (vd báo lỗi ô nhập ngay trong hộp). */
  onClick?: () => boolean | void | Promise<boolean | void>;
};

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  /** Nút bên phải; nút cuối là hành động chính (Enter trong ô nhập sẽ bấm nút này). */
  actions: AdultDialogAction[];
  wide?: boolean;
};

const FOCUSABLE = "input:not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), [href]";

/**
 * Hộp thoại khu người lớn (không linh vật): mở thì focus vào ô/nút đầu tiên, Tab vòng trong hộp, Esc hoặc bấm nền để đóng và trả focus.
 * Hành động không hoàn tác dùng `variant: "danger"`.
 */
export function AdultDialog({ open, onClose, title, children, actions, wide }: Props) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);
  const latest = useRef(onClose);
  useEffect(() => {
    latest.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const items = () => Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
    const timer = window.setTimeout(() => items()[0]?.focus({ preventScroll: true }), 30);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        latest.current();
      } else if (event.key === "Tab") {
        const list = items();
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (event.shiftKey && (document.activeElement === first || !dialog!.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !dialog!.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      } else if (event.key === "Enter" && event.target instanceof HTMLElement && ["INPUT", "SELECT"].includes(event.target.tagName) && dialog!.contains(event.target)) {
        event.preventDefault();
        confirmRef.current?.click();
      }
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown, true);
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open]);

  async function run(action: AdultDialogAction) {
    if (busy) return;
    setBusy(true);
    try {
      const result = await action.onClick?.();
      if (result !== false) onClose();
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;
  return (
    <div
      className={cn(styles.overlay, styles.overlayOn)}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div ref={ref} className={cn(styles.dialog, wide && styles.dialogWide)} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 className={styles.h2} id={titleId}>
          {title}
        </h2>
        {children && <div className={cn(styles.body, styles.dialogBody)}>{children}</div>}
        <div className={styles.dialogActs}>
          {actions.map((action, index) => {
            const last = index === actions.length - 1;
            return (
              <AdultButton
                key={action.label}
                ref={last ? confirmRef : undefined}
                label={action.label}
                icon={action.icon}
                variant={action.variant ?? (last ? "primary" : "secondary")}
                disabled={busy}
                onClick={() => void run(action)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
