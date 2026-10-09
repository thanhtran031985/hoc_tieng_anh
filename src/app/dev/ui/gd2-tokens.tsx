"use client";

import { GD2_TOKEN_GROUPS } from "./gd2-token-names";

const isLength = (name: string) => name.startsWith("size-");
const isDuration = (name: string) => name.startsWith("duration-");

/** Giá trị đọc từ trang thật sau khi gắn vào DOM (ref callback, không dùng state). */
function TokenValue({ name }: { name: string }) {
  return (
    <span
      className="block truncate text-ink-soft"
      ref={(el) => {
        if (el) el.textContent = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
      }}
    />
  );
}

/** Token GĐ2 (Gd2/Gd3/Gd4Tokens): màu hiện ô màu, size và thời lượng hiện giá trị thật đọc từ trang. */
export function Gd2Tokens() {
  return (
    <div className="flex flex-col gap-8">
      {GD2_TOKEN_GROUPS.map((g) => (
        <div key={g.title}>
          <h3 className="font-display text-body-l">{g.title}</h3>
          <ul className="mt-3 grid grid-cols-4 gap-3">
            {g.names.map((n) => (
              <li key={n} className="flex items-center gap-3 rounded-sm bg-surface p-2 shadow-card" data-token={n}>
                {isLength(n) || isDuration(n) ? (
                  <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-surface-sunk font-body text-key text-ink-soft">
                    {isLength(n) ? "⇔" : "⏱"}
                  </span>
                ) : (
                  <span aria-hidden className="h-10 w-10 shrink-0 rounded-sm border-thin border-line" style={{ background: `var(--${n})` }} />
                )}
                <span className="min-w-0 font-body text-caption">
                  <span className="block truncate text-ink">{n}</span>
                  <TokenValue name={n} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
