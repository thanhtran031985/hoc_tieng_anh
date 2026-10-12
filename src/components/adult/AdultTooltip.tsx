"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import styles from "./adult-tooltip.module.css";

const emptySubscribe = () => () => {};

export type AdultTooltipProps = {
  /** Nội dung giải thích hiển thị trong tooltip. */
  content: React.ReactNode;
  /** Nếu có children, tooltip sẽ bọc quanh children. Nếu không, hiển thị nút icon "info" nhỏ. */
  children?: React.ReactNode;
  /** Vị trí ưu tiên: tự động ("auto", mặc định), "top" hoặc "bottom". */
  position?: "auto" | "top" | "bottom";
  /** Căn lề hỗ trợ (nếu có) */
  align?: "left" | "center" | "right";
  className?: string;
};

/**
 * Tooltip giải thích nghiệp vụ và chỉ số trong khu người lớn (Bố mẹ / Quản trị).
 * Sử dụng React Portal để hiển thị trực tiếp lên document.body với z-index cao nhất,
 * không bao giờ bị các vùng overflow: auto / hidden hoặc thanh tìm kiếm che khuất.
 */
export function AdultTooltip({
  content,
  children,
  position = "auto",
  className,
}: AdultTooltipProps) {
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placeBelow: boolean;
    arrowOffset: number;
  }>({
    top: 0,
    left: 0,
    placeBelow: false,
    arrowOffset: 0,
  });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    // Nếu position là "bottom" hoặc trigger nằm gần mép trên viewport (< 140px), hiển thị bên dưới
    const placeBelow = position === "bottom" ? true : position === "top" ? false : rect.top < 140;
    const top = placeBelow ? rect.bottom + 8 : rect.top - 8;

    const triggerCenter = rect.left + rect.width / 2;
    const padding = 16;
    const tooltipWidth = tipRef.current?.offsetWidth || 240;
    const halfWidth = tooltipWidth / 2;
    const minCenter = halfWidth + padding;
    const maxCenter = (typeof window !== "undefined" ? window.innerWidth : 1200) - halfWidth - padding;
    const left = Math.max(minCenter, Math.min(maxCenter, triggerCenter));
    const arrowOffset = triggerCenter - left;

    setCoords({ top, left, placeBelow, arrowOffset });
  }, [position]);

  const show = () => {
    updatePosition();
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [visible, updatePosition]);

  return (
    <span
      ref={triggerRef}
      className={cn(styles.root, className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children ? (
        children
      ) : (
        <button
          type="button"
          className={styles.trigger}
          aria-describedby={visible ? id : undefined}
          aria-label={typeof content === "string" ? `Chú thích: ${content}` : "Xem chú thích"}
        >
          <Icon name="info" size={14} />
        </button>
      )}
      {mounted &&
        visible &&
        createPortal(
          <div
            id={id}
            ref={tipRef}
            role="tooltip"
            className={styles.portalTip}
            data-below={coords.placeBelow}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              ["--arrow-offset" as string]: `${coords.arrowOffset}px`,
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </span>
  );
}
