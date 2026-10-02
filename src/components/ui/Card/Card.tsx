import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import styles from "./Card.module.css";

export type CardProps = ComponentProps<"div"> & {
  /** default: mặt trắng nổi · soft: mặt kem phẳng cho nhóm phụ. */
  variant?: "default" | "soft";
  /** Thẻ bấm được: nhô lên khi rê chuột. Phần tử bấm (nút, liên kết) đặt bên trong hoặc bao ngoài. */
  interactive?: boolean;
};

/** Thẻ nội dung: mặt trắng bo `radius-lg`, nổi bằng `shadow-card`. Không chồng thẻ trong thẻ quá một lớp. */
export function Card({ variant = "default", interactive, className, ...rest }: CardProps) {
  return <div className={cn(styles.card, variant === "soft" && styles.soft, interactive && styles.hover, className)} {...rest} />;
}
