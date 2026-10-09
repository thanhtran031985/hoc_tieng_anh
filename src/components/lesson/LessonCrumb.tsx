import { Avatar, Icon, type AvatarHair } from "@/components/ui";
import styles from "./LessonCrumb.module.css";

export type LessonCrumbProps = {
  /** Tên đảo (cấp), vd "Lá xanh". */
  island: string;
  /** Tên chủ đề, vd "Nhà của em". */
  unit: string;
  /** Tên bài, vd "Bài 3 · My home". */
  lesson: string;
  learner: { name: string; level: number; hair: AvatarHair };
  /** Phút đã học hôm nay và giới hạn bố mẹ đặt (null là không giới hạn); chưa biết thì bỏ trống. */
  minutes?: { used: number; limit: number | null } | null;
};

/** Thanh đường dẫn trên khung bài học (Screen46): Đảo › Chủ đề › Bài, bé và số phút học hôm nay. Ẩn khi học tập trung. */
export function LessonCrumb({ island, unit, lesson, learner, minutes }: LessonCrumbProps) {
  return (
    <nav className={styles.crumb} aria-label="Đường dẫn">
      <Icon name="map" size={18} />
      <span>Đảo {island}</span>
      <span aria-hidden="true">›</span>
      <span>{unit}</span>
      <span aria-hidden="true">›</span>
      <b aria-current="page">{lesson}</b>
      <span className={styles.sp} />
      <span className={styles.me}>
        <Avatar name={learner.name} level={learner.level} hair={learner.hair} size={28} />
        {learner.name}
        {minutes ? ` · ${minutes.limit === null ? minutes.used : `${minutes.used}/${minutes.limit}`} phút hôm nay` : ""}
      </span>
    </nav>
  );
}
