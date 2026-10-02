import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { WORD_PICTURES, type PictureName } from "./pictures";
import styles from "./WordPicture.module.css";

export type WordPictureProps = Omit<ComponentProps<"svg">, "children" | "role"> & {
  /** Từ tiếng Anh có hình (khóa trong pictures.ts). Từ chưa có hình hiện khung trống để giữ bố cục. */
  word: string;
  /** Cỡ (px), khung vuông 120×120. */
  size?: number;
  /** aria-label, mặc định là chính từ đó. */
  label?: string;
};

/** Hình minh họa từ vựng: nét viền dragon-line, khối màu phẳng, không chữ trong hình. Từ hiện kèm hình luôn có nút loa bên trái. */
export function WordPicture({ word, size = 120, label, className, ...rest }: WordPictureProps) {
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
      dangerouslySetInnerHTML={{ __html: WORD_PICTURES[word as PictureName] ?? "" }}
    />
  );
}
