import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import type { Expr } from "./dragon-parts";
import { dragonMarkup, type Stage } from "./dragon-stages";
import styles from "./Mascot.module.css";

export type { Expr, Stage };
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
  /** Dáng lớn lên theo cấp 1–5 (1 Hạt giống … 5 Cây lớn). Bỏ trống hoặc 3 thì là dáng gốc. */
  stage?: Stage;
};

/** Rồng Bông, linh vật đồng hành. Không bao giờ buồn bã hay chê: khi sai luôn dùng `dongvien`. Chuyển động tắt khi bật giảm chuyển động. */
export function Mascot({ expr, size = 200, color, stage, className, ...rest }: MascotProps) {
  return (
    <svg
      className={cn(styles.dragon, styles[expr], className)}
      width={size}
      height={size}
      viewBox="0 -10 200 210"
      role="img"
      aria-label={`Rồng Bông ${EXPR_LABEL[expr]}${stage ? `, dáng cấp ${stage}` : ""}`}
      data-dragon={color}
      {...rest}
      // Nội dung ghép từ hằng số trong dragon-parts.ts và dragon-stages.ts, không có dữ liệu người dùng.
      dangerouslySetInnerHTML={{ __html: dragonMarkup(expr, stage) }}
    />
  );
}
