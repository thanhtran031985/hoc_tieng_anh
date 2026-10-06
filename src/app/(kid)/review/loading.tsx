import { Mascot, Skeleton } from "@/components/ui";
import { TopbarSkeleton } from "@/features/home/HomeSkeleton";
import kid from "@/features/kid/kid.module.css";
import styles from "@/features/review/review.module.css";

// Đang tải Ôn tập hôm nay: rồng đang xem, 5 hộp là khung xương, nút bắt đầu chưa bấm được.
export default function ReviewLoading() {
  return (
    <div className={kid.screen} aria-busy="true">
      <TopbarSkeleton />
      <main className={styles.rv}>
        <div className={styles.top}>
          <Mascot expr="suynghi" className={styles.dragon} />
          <div className={styles.intro}>
            <h1 className={styles.title}>…</h1>
            <p className={styles.sub}>Bông đang xem hôm nay cần ôn từ nào…</p>
          </div>
        </div>
        <div className={styles.skBoxes} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width="100%" height="var(--size-box-sk)" radius="lg" />
          ))}
        </div>
      </main>
    </div>
  );
}
