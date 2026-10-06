import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { WORD_PICTURES, type PictureName } from "./pictures";
import styles from "./WordPicture.module.css";

type SvgProps = Omit<ComponentProps<"svg">, "children" | "role">;

export type WordPictureProps = SvgProps & {
  /** Từ tiếng Anh có hình. Từ có trong pictures.ts (hình mẫu của thiết kế) vẽ nội tuyến; từ khác dùng `src`. */
  word: string;
  /** Đường dẫn tệp SVG của hình (cột `words.image`, vd /media/pictures/cat.svg). Không có hình thì hiện khung trống để giữ bố cục. */
  src?: string | null;
  /** Cỡ (px), khung vuông 120×120. */
  size?: number;
  /** aria-label, mặc định là chính từ đó. */
  label?: string;
};

/** Hình minh họa từ vựng: nét viền dragon-line, khối màu phẳng, không chữ trong hình. Từ hiện kèm hình luôn có nút loa bên trái. */
export function WordPicture({ word, src, size = 120, label, className, ...rest }: WordPictureProps) {
  const inline = WORD_PICTURES[word as PictureName];
  if (!inline && src) {
    // Hình SVG tĩnh trong public/media (không cần tối ưu hóa của next/image).
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={cn(styles.pic, className)} src={src} width={size} height={size} alt={label ?? word} />;
  }
  return (
    <svg
      className={cn(styles.pic, className)}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={label ?? word}
      {...rest}
      // Nội dung là hằng số trong pictures.ts, không có dữ liệu người dùng.
      dangerouslySetInnerHTML={{ __html: inline ?? "" }}
    />
  );
}
