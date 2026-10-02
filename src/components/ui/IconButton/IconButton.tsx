import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/icon-paths";
import styles from "./IconButton.module.css";

export type IconButtonProps = Omit<ComponentProps<"button">, "children" | "aria-label"> & {
  icon: IconName;
  /** Bắt buộc: nút chỉ có icon nên cần nhãn đọc được (vd "Quay lại", "Đóng"). */
  label: string;
  /** Cỡ icon (px), mặc định 26 trên thanh trên cùng. */
  iconSize?: number;
};

/** Nút icon tròn (quay lại, đóng…). */
export function IconButton({ icon, label, iconSize = 26, className, type = "button", ...rest }: IconButtonProps) {
  return (
    <button type={type} className={cn(styles.iconbtn, className)} aria-label={label} {...rest}>
      <Icon name={icon} size={iconSize} />
    </button>
  );
}
