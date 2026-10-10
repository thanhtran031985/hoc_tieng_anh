import { Mascot, Skeleton } from "@/components/ui";
import styles from "@/features/outside-hours/outside-hours.module.css";

// Đang tải màn Chưa đến giờ học: rồng ngoài vườn hiện ngay, lịch tuần là khung xương.
export default function OutsideHoursLoading() {
  return (
    <div className={styles.screen} aria-busy="true">
      <span className={styles.hill} aria-hidden="true" />
      <main className={styles.day}>
        <div className={styles.play}>
          <Mascot expr="vui" outfit={{ hat: "sunhat", top: "tee" }} className={styles.dragon} />
        </div>
        <section className={styles.msg}>
          <h1 className={styles.title}>Chưa đến giờ học!</h1>
          <p className={styles.text}>Bông đang xem lịch học…</p>
          <Skeleton width="calc(var(--space-16) * 5)" height="var(--space-10)" radius="pill" />
          <div className={styles.wk} aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => (
              <Skeleton key={i} width="100%" height="calc(var(--space-12) + var(--space-3))" radius="md" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
