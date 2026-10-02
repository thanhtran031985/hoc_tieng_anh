"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useHotkeys } from "@/lib/use-hotkeys";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { Mascot } from "../Mascot/Mascot";
import styles from "./FeedbackBar.module.css";

export type FeedbackBarProps = {
  /** Hiện hoặc ẩn dải (trượt lên/xuống). */
  open: boolean;
  /** ok: đúng (xanh lá, rồng vui mừng) · retry: chưa đúng (cam nhẹ, rồng động viên). Không trừ điểm, không âm thanh gắt. */
  type: "ok" | "retry";
  /** Tiêu đề ≤ 5 từ. */
  title: string;
  /** Dòng phụ: thường là nút loa + từ + phiên âm + nghĩa. */
  detail?: React.ReactNode;
  /** Nhãn nút, mặc định "Tiếp tục" (đúng) hoặc "Thử lại" (chưa đúng). */
  action?: string;
  /** Bấm nút hoặc phím Enter. Cha đặt `open` về false khi cần. */
  onAction?: () => void;
  secondary?: { label: string; onClick?: () => void };
};

/** Dải phản hồi trượt lên từ đáy màn sau khi bé bấm Kiểm tra; rồng Bông thò đầu lên mép trái. Enter = bấm nút chính. */
export function FeedbackBar({ open, type, title, detail, action, onAction, secondary }: FeedbackBarProps) {
  const ok = type === "ok";
  const actionRef = useRef<HTMLButtonElement>(null);

  // Mở ra thì đưa focus vào nút chính để Enter bấm được ngay.
  useEffect(() => {
    if (open) actionRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Enter khi focus không ở trên nút (nút tự kích hoạt Enter).
  useHotkeys({ Enter: () => onAction?.() }, { enabled: open });

  return (
    <div
      className={cn(styles.bar, ok ? styles.ok : styles.retry)}
      data-open={open ? "true" : undefined}
      role="status"
      aria-live="polite"
      inert={!open}
    >
      <div className={styles.inner}>
        <div className={styles.mascot}>
          <Mascot expr={ok ? "vui" : "dongvien"} size={112} />
        </div>
        <div className={styles.text}>
          <div className={styles.title}>
            <Icon name={ok ? "check" : "replay"} size={30} />
            <span>{title}</span>
          </div>
          {detail && <div className={styles.detail}>{detail}</div>}
        </div>
        <div className={styles.actions}>
          {secondary && <Button variant="ghost" size="l" label={secondary.label} onClick={secondary.onClick} />}
          <Button
            ref={actionRef}
            variant={ok ? "success" : "retry"}
            size="l"
            label={action ?? (ok ? "Tiếp tục" : "Thử lại")}
            shortcut="Enter"
            onClick={onAction}
          />
        </div>
      </div>
    </div>
  );
}
