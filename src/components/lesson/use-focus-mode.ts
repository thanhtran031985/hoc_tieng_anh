"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Học tập trung (phím F): ẩn mọi thứ ngoài bài và đưa trình duyệt vào toàn màn hình (Fullscreen API).
 * Esc thoát chế độ này trước; nếu trình duyệt tự thoát toàn màn hình (Esc, F11) thì chế độ cũng tắt theo.
 * Không vào được toàn màn hình (trình duyệt từ chối) thì vẫn có giao diện học tập trung, chỉ không phóng to cửa sổ.
 */
export function useFocusMode() {
  const [focus, setFocusState] = useState(false);
  const focusRef = useRef(false);

  const setFocus = useCallback((on: boolean) => {
    focusRef.current = on;
    setFocusState(on);
    try {
      if (on) void document.documentElement.requestFullscreen?.()?.catch(() => {});
      else if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    } catch {
      // Trình duyệt không hỗ trợ toàn màn hình: bỏ qua.
    }
  }, []);

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement && focusRef.current) {
        focusRef.current = false;
        setFocusState(false);
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      // Rời bài thì trả cửa sổ về bình thường.
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    };
  }, []);

  const toggle = useCallback(() => setFocus(!focusRef.current), [setFocus]);
  return { focus, setFocus, toggle };
}
