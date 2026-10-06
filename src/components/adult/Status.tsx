import { Icon, type IconName } from "@/components/ui";
import { cn } from "@/lib/cn";
import styles from "./adult.module.css";

export type StatusKind = "live" | "ok" | "warn" | "draft" | "info" | "off" | "none";

const ICONS: Record<StatusKind, IconName> = { live: "okcircle", ok: "okcircle", warn: "warn", draft: "pen", info: "info", off: "lock", none: "plusbox" };
const TONE: Record<StatusKind, string> = { live: styles.statusOk, ok: styles.statusOk, warn: styles.statusWarn, draft: styles.statusOff, off: styles.statusOff, info: styles.statusInfo, none: styles.statusNone };

/** Nhãn trạng thái: luôn có icon + chữ, không chỉ dựa vào màu. */
export function Status({ kind, label }: { kind: StatusKind; label: string }) {
  return (
    <span className={cn(styles.status, TONE[kind])}>
      <Icon name={ICONS[kind]} size={14} />
      {label}
    </span>
  );
}
