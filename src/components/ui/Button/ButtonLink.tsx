import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/icon-paths";
import type { ButtonSize, ButtonVariant } from "./Button";
import styles from "./Button.module.css";

export type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  block?: boolean;
};

/** Liên kết trông như nút kẹo dẻo (dùng khi bấm để chuyển trang, không phải để gửi biểu mẫu). */
export function ButtonLink({ label, variant = "primary", size = "m", icon, block, className, ...rest }: ButtonLinkProps) {
  return (
    <Link className={cn(styles.btn, styles[variant], styles[size], block && styles.block, className)} {...rest}>
      {icon && <Icon name={icon} size={size === "l" ? 28 : 22} />}
      <span>{label}</span>
    </Link>
  );
}
