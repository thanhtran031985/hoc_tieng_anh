"use client";

import { Button, ButtonLink } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import styles from "./print.module.css";

/**
 * Thanh công cụ của trang in (ẩn khi in): quay lại Sổ từ và nút In. Nút In và Ctrl+P đều mở hộp thoại in của trình duyệt.
 * Ctrl+P của trình duyệt vốn đã in; gọi `window.print()` ở đây để bảo đảm cả khi tiêu điểm đang ở nút.
 */
export function PrintToolbar({ summary, backHref, canPrint }: { summary: string; backHref: string; canPrint: boolean }) {
  const print = () => window.print();
  useHotkeys({ "Ctrl+p": (event) => (canPrint ? (event.preventDefault(), print()) : undefined) }, { enabled: canPrint, inInputs: ["Ctrl+p"] });
  return (
    <div className={styles.tool}>
      <span className={styles.toolText}>{summary}</span>
      <ButtonLink href={backHref} variant="secondary" size="m" icon="back" label="Quay lại Sổ từ" />
      <Button label="In" icon="print" size="m" shortcut="Ctrl P" disabled={!canPrint} onClick={print} />
    </div>
  );
}
