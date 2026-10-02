import { Mascot } from "@/components/ui";
import styles from "./profiles.module.css";

/** Thanh trên cùng của màn chọn hồ sơ: tên ứng dụng bên trái, các nút của bố mẹ bên phải. */
export function ProfilesTop({ children }: { children?: React.ReactNode }) {
  return (
    <div className={styles.top}>
      <div className={styles.brand}>
        <Mascot expr="vui" size={44} />
        Học cùng Bông
      </div>
      <div className={styles.actions}>{children}</div>
    </div>
  );
}
