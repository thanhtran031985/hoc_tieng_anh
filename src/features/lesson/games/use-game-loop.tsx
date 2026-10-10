"use client";

import { useEffect, useRef } from "react";

/** Chạy `onFrame(dtMs)` mỗi khung hình khi `active`; dừng hẳn (không dồn thời gian) khi tạm dừng. `dt` tối đa 50 ms để chuyển động không nhảy cóc. */
export function useGameLoop(active: boolean, onFrame: (dtMs: number) => void) {
  const latest = useRef(onFrame);
  useEffect(() => {
    latest.current = onFrame;
  });
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = 0;
    const frame = (ts: number) => {
      const dt = last ? Math.min(50, ts - last) : 0;
      last = ts;
      latest.current(dt);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

/** Nhịp của trò chơi đặt trong hàm con của `GameFrame` (nơi mới biết `running`). */
export function GameLoop({ active, onFrame }: { active: boolean; onFrame: (dtMs: number) => void }) {
  useGameLoop(active, onFrame);
  return null;
}

/** Khi trò chơi bắt đầu chạy (hoặc chơi tiếp sau tạm dừng) thì đưa focus vào phần tử cho trước. */
export function FocusWhenRunning({ running, target }: { running: boolean; target: React.RefObject<HTMLElement | null> }) {
  useEffect(() => {
    if (running) target.current?.focus({ preventScroll: true });
  }, [running, target]);
  return null;
}
