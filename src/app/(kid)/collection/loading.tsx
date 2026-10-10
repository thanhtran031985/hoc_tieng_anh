import { Skeleton } from "@/components/ui";
import styles from "@/features/collection/collection.module.css";
import { TopbarSkeleton } from "@/features/home/HomeSkeleton";
import kid from "@/features/kid/kid.module.css";

// Đang tải Bộ sưu tập: tiêu đề, tổng “··” và khung album là khung xương.
export default function CollectionLoading() {
  return (
    <div className={kid.screen} aria-busy="true">
      <TopbarSkeleton />
      <main className={styles.cw}>
        <div className={styles.ch}>
          <h1 className={styles.title}>Bộ sưu tập</h1>
          <Skeleton width="calc(var(--space-16) * 3)" height="var(--space-12)" radius="pill" />
          <div className={styles.total}>
            <b>··</b>
          </div>
        </div>
        <div className={styles.book}>
          <div className={styles.idx}>
            <Skeleton width="40%" height="var(--space-6)" radius="pill" />
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} width="100%" height="calc(var(--space-16) + var(--space-3))" radius="lg" />
            ))}
          </div>
          <section className={styles.page}>
            <div className={styles.band}>
              <Skeleton width="calc(var(--space-16) * 3)" height="var(--space-8)" radius="pill" />
            </div>
            <div className={styles.grid}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={styles.cell}>
                  <Skeleton width="calc(var(--space-16) * 2)" height="calc(var(--space-16) * 2)" radius="xl" />
                  <Skeleton width="calc(var(--space-16) * 2)" height="var(--space-5)" radius="pill" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
