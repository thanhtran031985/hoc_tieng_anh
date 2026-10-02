"use client";

import { useEffect, useId, useRef, type MouseEvent } from "react";
import { Button, type ButtonVariant } from "../Button/Button";
import { Mascot, type Expr } from "../Mascot/Mascot";
import styles from "./Dialog.module.css";

export type DialogAction = {
  label: string;
  variant?: ButtonVariant;
  /** Nhãn phím hiển thị ("Enter", "Esc"). Nút có nhãn phím phản hồi đúng phím đó. */
  shortcut?: string;
  onClick?: () => void;
};

export type DialogProps = {
  open: boolean;
  /** Gọi khi hộp thoại đóng (bấm nút, Esc hoặc bấm ra ngoài). Cha đặt `open` về false. */
  onClose: () => void;
  title: string;
  body?: React.ReactNode;
  /** Biểu cảm rồng Bông nhô lên trên mép hộp. */
  expr?: Expr;
  /** 1–2 nút cỡ l. Nút an toàn/tiếp tục học đặt trước và là primary; nút rời đi là secondary. Không dùng nút Huỷ màu đỏ. */
  actions: DialogAction[];
};

const FOCUSABLE = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

const isEscape = (shortcut?: string) => shortcut === "Esc" || shortcut === "Escape";

/**
 * Hộp thoại giữa màn trên lớp phủ. Mở: focus vào nút đầu tiên; Tab vòng trong hộp; Esc đóng và trả focus về nơi đã mở.
 * Hộp luôn nằm trong cây DOM (ẩn bằng CSS khi đóng) để chuyển cảnh mượt; đặt trong vùng có `position: relative` thì phủ vùng đó,
 * không thì phủ cả cửa sổ.
 */
export function Dialog({ open, onClose, title, body, expr, actions }: DialogProps) {
  const titleId = useId();
  const bodyId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const latest = useRef({ actions, onClose });
  useEffect(() => {
    latest.current = { actions, onClose };
  });

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusables = () => Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
    focusables()[0]?.focus({ preventScroll: true });

    function run(action?: DialogAction) {
      action?.onClick?.();
      latest.current.onClose();
    }

    function onKeyDown(event: KeyboardEvent) {
      const { actions: current, onClose: close } = latest.current;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        const escAction = current.find((a) => isEscape(a.shortcut));
        if (escAction) run(escAction);
        else close();
        return;
      }
      if (event.key === "Tab") {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (!dialog!.contains(active)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      if (event.key === "Enter") {
        // Chặn phím tắt của màn phía sau; nút đang focus vẫn tự kích hoạt.
        event.stopPropagation();
        if (!dialog!.contains(document.activeElement)) {
          const enterAction = current.find((a) => a.shortcut === "Enter");
          if (enterAction) {
            event.preventDefault();
            run(enterAction);
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      previous?.focus({ preventScroll: true });
    };
  }, [open]);

  function onBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div className={styles.overlay} data-open={open ? "true" : undefined} inert={!open} onClick={onBackdropClick}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={body ? bodyId : undefined}
      >
        {expr && (
          <div className={styles.mascot}>
            <Mascot expr={expr} size={150} />
          </div>
        )}
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {body && (
          <div id={bodyId} className={styles.body}>
            {body}
          </div>
        )}
        <div className={styles.actions}>
          {actions.map((action, index) => (
            <Button
              key={action.label}
              size="l"
              variant={action.variant ?? "secondary"}
              label={action.label}
              shortcut={action.shortcut}
              onClick={() => {
                action.onClick?.();
                onClose();
              }}
              data-dialog-action={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
