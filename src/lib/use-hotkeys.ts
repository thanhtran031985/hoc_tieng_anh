"use client";

import { useEffect, useRef } from "react";

/** Tên phím dùng trong bản đồ phím: "1".."4", "a".."d", "Enter", "Space", "ArrowLeft", "ArrowRight", "Escape". */
export type HotkeyMap = Record<string, (event: KeyboardEvent) => void>;

export type UseHotkeysOptions = {
  /** Tắt tạm (vd khi hộp thoại đang mở). Mặc định bật. */
  enabled?: boolean;
};

function normalize(event: KeyboardEvent): string {
  if (event.key === " ") return "Space";
  return event.key.length === 1 ? event.key.toLowerCase() : event.key;
}

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

// Enter/Space trên nút (hoặc liên kết) đã tự kích hoạt nút đó; xử lý thêm sẽ gọi hai lần.
function activatesNatively(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.closest('button, a[href], summary, [role="button"]') !== null;
}

/**
 * Phím tắt dùng chung cho bài học: 1–4 (hoặc A–D), Enter, Space, ←/→, Esc.
 * Không chạy khi đang gõ trong ô nhập, khi giữ Ctrl/Alt/Meta, hoặc khi phím lặp.
 */
export function useHotkeys(map: HotkeyMap, { enabled = true }: UseHotkeysOptions = {}) {
  const handlers = useRef(map);
  useEffect(() => {
    handlers.current = map;
  });

  useEffect(() => {
    if (!enabled) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
      if (isTyping(event.target)) return;
      const name = normalize(event);
      const handler = handlers.current[name];
      if (!handler) return;
      if ((name === "Enter" || name === "Space") && activatesNatively(event.target)) return;
      event.preventDefault();
      handler(event);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
}
