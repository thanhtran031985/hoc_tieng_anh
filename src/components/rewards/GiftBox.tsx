import { cn } from "@/lib/cn";
import styles from "./rewards.module.css";

export type GiftBoxProps = {
  /** Nắp bật ra và có tia sáng (bước 2 của hộp quà). */
  open?: boolean;
  size?: number;
  className?: string;
};

const LINE = 'stroke="var(--dragon-line)" stroke-width="3.5" stroke-linejoin="round"';

// Nét vẽ chép từ designs/components/bundle.js (rgift). Màu lấy từ token --gift-*.
const LID_CLOSED = `<g class="${styles.lid}"><rect x="14" y="34" width="92" height="22" rx="5" fill="var(--gift-box)" ${LINE}/><rect x="52" y="34" width="16" height="22" fill="var(--gift-ribbon)" ${LINE}/><path d="M60 34 C46 14 30 18 34 28 C38 36 52 34 60 34 C68 34 82 36 86 28 C90 18 74 14 60 34 Z" fill="var(--gift-ribbon)" ${LINE}/></g>`;
const LID_OPEN = LID_CLOSED.replace(`<g class="${styles.lid}">`, `<g class="${styles.lid}" transform="translate(-6 -46) rotate(-18 60 44)">`);
const RAYS = `<g class="${styles.rays}" fill="var(--gift-glow)"><path d="M60 50 L30 -20 L50 -20 Z"/><path d="M60 50 L90 -20 L70 -20 Z"/><path d="M60 50 L-6 6 L2 -8 Z"/><path d="M60 50 L126 6 L118 -8 Z"/></g>`;
const BODY = `<rect x="20" y="54" width="80" height="58" rx="6" fill="var(--gift-box)" ${LINE}/><rect x="20" y="54" width="80" height="12" fill="var(--gift-box-shade)" ${LINE}/><rect x="52" y="54" width="16" height="58" fill="var(--gift-ribbon)" ${LINE}/>`;

/** Hộp quà (Bong.R gift): đóng hoặc mở nắp kèm tia sáng. Chỉ trang trí, nút bao ngoài lo nhãn đọc màn hình. */
export function GiftBox({ open = false, size = 160, className }: GiftBoxProps) {
  return (
    <svg
      className={cn(styles.gift, className)}
      width={size}
      height={size}
      viewBox="0 -20 120 140"
      aria-hidden="true"
      style={{ overflow: "visible" }}
      // Nội dung là hằng số của file này, không có dữ liệu người dùng.
      dangerouslySetInnerHTML={{ __html: (open ? RAYS : "") + BODY + (open ? LID_OPEN : LID_CLOSED) }}
    />
  );
}
