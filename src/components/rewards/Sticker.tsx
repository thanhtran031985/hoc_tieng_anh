import type { CSSProperties } from "react";
import { WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import styles from "./rewards.module.css";

export type StickerProps = {
  /** Từ tiếng Anh của hình (khóa hình vẽ). */
  word: string;
  /** Tệp SVG của hình khi hình không có sẵn trong bộ hình mẫu. */
  src?: string | null;
  /** false = ô còn trống trong album (bóng mờ, viền đứt). */
  owned?: boolean;
  /** Nhãn "Mới" ở góc. */
  isNew?: boolean;
  /** Độ nghiêng (độ) khi đã có. */
  tilt?: number;
  /** Cỡ ô sticker (px). Bỏ trống thì theo token `size-sticker`. */
  size?: number;
  /** Nhãn đọc màn hình, vd "Sticker cat, con mèo". Bỏ trống thì là "Sticker <word>" (hoặc "Sticker chưa có"). */
  label?: string;
  /** Có thì sticker là nút bấm (album); không có thì là hình tĩnh (hộp nhận quà). */
  onClick?: () => void;
  className?: string;
};

/** Sticker cắt bế (Bong.R.sticker): hình từ vựng trong khung trắng bo tròn có bóng, nghiêng nhẹ. */
export function Sticker({ word, src, owned = true, isNew = false, tilt = 0, size, label, onClick, className }: StickerProps) {
  const style = {
    ...(size ? { "--size-sticker": `${size}px` } : null),
    "--tilt": `${tilt}deg`,
  } as CSSProperties;
  const text = owned ? (label ?? `Sticker ${word}${isNew ? ", mới" : ""}`) : "Sticker chưa có";
  const classes = cn(styles.stk, owned ? styles.owned : styles.empty, isNew && styles.fresh, className);
  const inner = (
    <>
      <span className={styles.art}>
        <WordPicture word={word} src={src} aria-hidden="true" />
      </span>
      {isNew && <span className={styles.new}>Mới</span>}
    </>
  );
  return onClick ? (
    <button type="button" className={classes} style={style} aria-label={text} onClick={onClick}>
      {inner}
    </button>
  ) : (
    <span className={classes} style={style} role="img" aria-label={text}>
      {inner}
    </span>
  );
}
