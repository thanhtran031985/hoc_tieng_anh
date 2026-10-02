"use client";

import { useState } from "react";
import { Button, KeyHint } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";

const KEYS = ["1", "2", "3", "4", "a", "b", "c", "d", "Enter", "Space", "ArrowLeft", "ArrowRight", "Escape"];

export function HotkeysDemo() {
  // Chỉ bật khi muốn thử, để không tranh phím Enter/Esc với hộp thoại và dải phản hồi ở mục trên.
  const [enabled, setEnabled] = useState(false);
  const [last, setLast] = useState("(chưa bấm phím nào)");
  const [checked, setChecked] = useState(0);

  useHotkeys(
    {
      ...Object.fromEntries(KEYS.map((k) => [k, () => setLast(k)])),
      Enter: () => {
        setLast("Enter");
        setChecked((n) => n + 1);
      },
    },
    { enabled },
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button
          id="toggle-hotkeys"
          variant="secondary"
          label={enabled ? "Tắt thử phím tắt" : "Bật thử phím tắt"}
          onClick={() => setEnabled((v) => !v)}
        />
        <span className="font-body text-body text-ink-soft">{enabled ? "Đang bật" : "Đang tắt"}</span>
      </div>
      <div className="flex items-center gap-4">
        <Button label="Kiểm tra" size="l" shortcut="Enter" onClick={() => setChecked((n) => n + 1)} />
        <span className="font-body text-body">
          Số lần Kiểm tra: <strong data-testid="checked">{checked}</strong>
        </span>
      </div>
      <p className="font-body text-body">
        Phím vừa bấm: <KeyHint data-testid="last">{last}</KeyHint>
      </p>
      <label className="flex items-center gap-3 font-body text-label">
        Ô nhập thử (gõ ở đây không kích hoạt phím tắt):
        <input className="h-btn-m rounded-md border-(length:--border-thin) border-line-strong bg-surface px-4 font-body text-body" />
      </label>
    </div>
  );
}
