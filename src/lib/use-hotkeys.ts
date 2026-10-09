"use client";

import { useEffect, useRef } from "react";

/** Tên phím dùng trong bản đồ phím: "1".."4", "a".."d", "h", "Enter", "Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Escape". */
export type HotkeyMap = Record<string, (event: KeyboardEvent) => void>;

export type UseHotkeysOptions = {
  /** Tắt tạm (vd khi hộp thoại đang mở). Mặc định bật. */
  enabled?: boolean;
  /**
   * Chạy Enter/Space cả khi focus đang ở trên một nút (và chặn hành vi mặc định của nút). Dùng ở màn học, nơi bé vừa bấm một thẻ đáp án
   * rồi nhấn Space để nghe lại hoặc Enter để kiểm tra. Vùng có `data-hotkey-skip` (vd nút thoát) và hộp thoại vẫn tự xử lý phím của nó.
   */
  captureNative?: boolean;
  /**
   * Bắt phím ở pha capture để chạy trước các phím tắt của màn bao ngoài (vd màn con nhận Esc để bỏ nhấc từ trước khi trình học mở
   * hộp thoại thoát). Handler đã xử lý thì chặn mặc định, nên phím tắt bao ngoài tự bỏ qua.
   */
  capture?: boolean;
  /**
   * Tên phím vẫn chạy khi bé đang gõ trong ô nhập (mặc định mọi phím đều tắt khi đang gõ). Dùng ở các bài gõ chữ cho phím không gõ ra chữ
   * (Enter, "?" để xin gợi ý). Phím có tiền tố "Ctrl+" (vd "Ctrl+Space" nghe lại câu) luôn chạy kể cả khi đang gõ.
   */
  inInputs?: readonly string[];
};

const NONE: readonly string[] = [];

function normalize(event: KeyboardEvent): string {
  const name = event.key === " " ? "Space" : event.key.length === 1 ? event.key.toLowerCase() : event.key;
  return event.ctrlKey ? `Ctrl+${name}` : name;
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
export function useHotkeys(map: HotkeyMap, { enabled = true, captureNative = false, capture = false, inInputs = NONE }: UseHotkeysOptions = {}) {
  const handlers = useRef(map);
  useEffect(() => {
    handlers.current = map;
  });

  useEffect(() => {
    if (!enabled) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || event.altKey || event.metaKey) return;
      const name = normalize(event);
      const ctrl = name.startsWith("Ctrl+");
      if (isTyping(event.target) && !ctrl && !inInputs.includes(name)) return;
      const handler = handlers.current[name];
      if (!handler) return;
      if ((name === "Enter" || name === "Space") && activatesNatively(event.target)) {
        const skip = event.target instanceof HTMLElement && event.target.closest("[data-hotkey-skip], [role=\"dialog\"]") !== null;
        if (!captureNative || skip) return;
      }
      event.preventDefault();
      handler(event);
    }
    window.addEventListener("keydown", onKeyDown, capture);
    return () => window.removeEventListener("keydown", onKeyDown, capture);
  }, [enabled, captureNative, capture, inInputs]);
}
