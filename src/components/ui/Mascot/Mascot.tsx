import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { DRAGON_PARTS, type Expr } from "./dragon-parts";
import styles from "./Mascot.module.css";

export type { Expr };
export type MascotColor = "ngoc" | "dao" | "nang" | "tim";

const EXPR_LABEL: Record<Expr, string> = {
  chao: "chào",
  vui: "vui mừng",
  dongvien: "động viên",
  suynghi: "suy nghĩ",
  ngu: "đang ngủ",
  chucmung: "chúc mừng",
  tiec: "hơi tiếc",
  xaydung: "đang xây dựng",
};

export type MascotProps = Omit<ComponentProps<"svg">, "children" | "role"> & {
  /** chao: chào · vui: đúng · dongvien: chưa đúng/lỗi · suynghi: tải/trống/gợi ý · ngu: hết giờ · chucmung: kết thúc bài · tiec: hộp thoại dừng bài · xaydung: màn "Sắp có" */
  expr: Expr;
  /** Cỡ (px): 280–340 ở màn chào/chúc mừng, 120–220 ở trạng thái trống/lỗi, 76–112 trong dải phản hồi. */
  size?: number;
  /** Màu rồng. Bỏ trống thì theo `data-dragon` của vùng chứa, rồi tới màu ngọc mặc định. */
  color?: MascotColor;
};

/** Rồng Bông, linh vật đồng hành. Không bao giờ buồn bã hay chê: khi sai luôn dùng `dongvien`. Chuyển động tắt khi bật giảm chuyển động. */
export function Mascot({ expr, size = 200, color, className, ...rest }: MascotProps) {
  return (
    <svg
      className={cn(styles.dragon, styles[expr], className)}
      width={size}
      height={size}
      viewBox="0 -10 200 210"
      role="img"
      aria-label={`Rồng Bông ${EXPR_LABEL[expr]}`}
      data-dragon={color}
      {...rest}
      // Nội dung là hằng số trong dragon-parts.ts, không có dữ liệu người dùng.
      dangerouslySetInnerHTML={{ __html: DRAGON_PARTS[expr] }}
    />
  );
}
