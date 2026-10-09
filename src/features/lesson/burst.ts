// Sao bay từ đáp án đúng vào thanh tiến độ (Bong.burst của thiết kế). Chỉ trang trí: tắt khi bật giảm chuyển động.

import { playSfx } from "@/lib/sound";

const STAR = "★";

/** Bắn `count` ngôi sao từ giữa `from` bay vào thanh tiến độ (phần tử `[role=progressbar] > span`). */
export function burstStars(from: Element | null, count = 8): void {
  playSfx("correct");
  if (typeof window === "undefined" || !from || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = document.querySelector('[role="progressbar"] > span');
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const start = { x: a.left + a.width / 2, y: a.top + a.height / 2 };
  const end = { x: b.right, y: b.top + b.height / 2 };

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText = "position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:var(--z-burst)";
  document.body.appendChild(layer);

  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.textContent = STAR;
    star.style.cssText = `position:absolute;left:${start.x}px;top:${start.y}px;color:var(--star);font-size:var(--text-title);line-height:1`;
    layer.appendChild(star);
    const angle = (Math.PI * 2 * i) / count;
    const spread = { x: Math.cos(angle) * 70, y: Math.sin(angle) * 70 };
    star.animate(
      [
        { transform: "translate(-50%,-50%) scale(0.3)", opacity: 0 },
        { transform: `translate(calc(-50% + ${spread.x}px), calc(-50% + ${spread.y}px)) scale(1)`, opacity: 1, offset: 0.35 },
        { transform: `translate(calc(-50% + ${end.x - start.x}px), calc(-50% + ${end.y - start.y}px)) scale(0.5)`, opacity: 0.9 },
      ],
      { duration: 900, delay: i * 25, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" },
    );
  }
  window.setTimeout(() => layer.remove(), 900 + count * 25 + 100);
}
