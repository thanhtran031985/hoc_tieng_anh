"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/cn";
import { AdultIconButton } from "./AdultButton";
import styles from "./adult.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  /** Nút ở chân ngăn kéo (Lưu, Hủy…). */
  footer?: React.ReactNode;
  /** Ngăn kéo rộng cho biểu mẫu dài (câu hỏi). */
  wide?: boolean;
};

/** Ngăn kéo biểu mẫu bên phải: Esc hoặc bấm nền để đóng, focus vào ô đầu tiên và trả về nơi đã mở khi đóng. */
export function AdultDrawer({ open, onClose, title, children, footer, wide }: Props) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLElement>(null);
  const latest = useRef(onClose);
  useEffect(() => {
    latest.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const drawer = ref.current;
    if (!drawer) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const timer = window.setTimeout(() => (bodyRef.current?.querySelector<HTMLElement>("input:not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled)") ?? drawer.querySelector<HTMLElement>("button"))?.focus({ preventScroll: true }), 60);
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !document.querySelector('[role="dialog"][aria-modal="true"]:not([data-drawer])')) {
        event.preventDefault();
        event.stopPropagation();
        latest.current();
      }
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown, true);
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className={cn(styles.drawerWrap, styles.overlayOn)}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div ref={ref} data-drawer="" className={cn(styles.drawer, wide && styles.drawerWide)} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header>
          <h2 className={styles.h2} id={titleId}>
            {title}
          </h2>
          <AdultIconButton icon="close" label="Đóng" onClick={onClose} />
        </header>
        <main ref={bodyRef} className={styles.drawerBody}>
          {children}
        </main>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}
