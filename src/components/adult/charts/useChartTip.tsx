"use client";

import { useCallback, useRef, useState } from "react";
import styles from "./charts.module.css";

type Tip = { text: string; left: number; top: number } | null;

/**
 * Tooltip dùng chung cho biểu đồ: hiện khi rê chuột hoặc Tab vào một cột/điểm, ẩn khi rời đi.
 * `handlers(text)` gắn vào phần tử; `anchor` là phần tử đặt tooltip phía trên (mặc định chính phần tử).
 */
export function useChartTip() {
  const box = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip>(null);

  const show = useCallback((el: HTMLElement, text: string, anchor?: HTMLElement | null) => {
    const root = box.current?.getBoundingClientRect();
    if (!root) return;
    const r = el.getBoundingClientRect();
    const top = (anchor ?? el).getBoundingClientRect().top;
    setTip({ text, left: r.left + r.width / 2 - root.left, top: top - root.top });
  }, []);

  const handlers = (text: string, anchorSelector?: string) => ({
    tabIndex: 0,
    "aria-label": text,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => show(e.currentTarget, text, anchorSelector ? e.currentTarget.querySelector<HTMLElement>(anchorSelector) : null),
    onFocus: (e: React.FocusEvent<HTMLElement>) => show(e.currentTarget, text, anchorSelector ? e.currentTarget.querySelector<HTMLElement>(anchorSelector) : null),
    onMouseLeave: () => setTip(null),
    onBlur: () => setTip(null),
  });

  const element = (
    <div className={styles.tip} role="tooltip" hidden={tip === null} style={tip ? { left: tip.left, top: tip.top } : undefined}>
      {tip?.text}
    </div>
  );

  return { box, handlers, element };
}
