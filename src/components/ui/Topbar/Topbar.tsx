import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Avatar, type AvatarHair } from "../Avatar/Avatar";
import type { IconName } from "../Icon/icon-paths";
import { IconButton } from "../IconButton/IconButton";
import { LevelChip } from "../LevelChip/LevelChip";
import { StatChip } from "../StatChip/StatChip";
import styles from "./Topbar.module.css";

export type TopbarLearner = {
  name: string;
  level: number;
  /** Tên cấp từ database (vd "Hạt giống"). */
  levelName: string;
  hair?: AvatarHair;
};

export type TopbarProps = Omit<ComponentProps<"header">, "title"> & {
  /** Có `onBack` thì hiện nút quay lại bên trái. */
  onBack?: () => void;
  backLabel?: string;
  backIcon?: IconName;
  /** Ảnh + tên + nhãn cấp của bé (bên trái). */
  learner?: TopbarLearner;
  title?: React.ReactNode;
  /** Thống kê bên phải theo thứ tự Sao · Xu · Chuỗi ngày; bỏ trống số nào thì không hiện chip đó. */
  stars?: number;
  coins?: number;
  streak?: number;
  /** Nội dung thêm đặt trước các chip (vd nút cài đặt). */
  right?: React.ReactNode;
};

/** Thanh trên cùng (cao `size-topbar`): trái là quay lại, ảnh và tên bé; phải là Sao · Xu · Chuỗi ngày. */
export function Topbar({
  onBack,
  backLabel = "Quay lại",
  backIcon = "back",
  learner,
  title,
  stars,
  coins,
  streak,
  right,
  className,
  ...rest
}: TopbarProps) {
  return (
    <header className={cn(styles.topbar, className)} {...rest}>
      <div className={styles.side}>
        {onBack && <IconButton icon={backIcon} label={backLabel} onClick={onBack} />}
        {learner && (
          <div className={styles.me}>
            <Avatar name={learner.name} level={learner.level} hair={learner.hair} size={48} />
            <div>
              <div className={styles.name}>{learner.name}</div>
              <div className={styles.level}>
                <LevelChip level={learner.level} name={learner.levelName} plain />
              </div>
            </div>
          </div>
        )}
        {title && <div className={styles.title}>{title}</div>}
      </div>
      <div className={styles.side}>
        {right}
        {stars != null && <StatChip kind="stars" value={stars} label="sao" />}
        {coins != null && <StatChip kind="coins" value={coins} label="xu" />}
        {streak != null && <StatChip kind="streak" value={streak} label="ngày học liên tiếp" />}
      </div>
    </header>
  );
}
