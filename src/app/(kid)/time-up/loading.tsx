import { Mascot, Skeleton } from "@/components/ui";
import styles from "@/features/time-up/time-up.module.css";

// Đang tải màn Hết giờ học: rồng ngủ hiện ngay, tóm tắt hôm nay là khung xương trên nền đêm.
export default function TimeUpLoading() {
  return (
    <div className={styles.screen} aria-busy="true">
      <div className={styles.night}>
        <div className={styles.bed}>
          <Mascot expr="ngu" className={styles.dragon} />
          <div className={styles.cloudbed} />
        </div>
        <div className={styles.msg}>
          <h1 className={styles.title}>Hết giờ học rồi!</h1>
          <p className={styles.text}>Bông đang ghi lại buổi học hôm nay…</p>
          <div className={styles.sum} aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className={styles.sk} width="calc(var(--space-16) * 2)" height="var(--space-12)" radius="pill" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
