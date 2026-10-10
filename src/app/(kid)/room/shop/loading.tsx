import { Skeleton } from "@/components/ui";
import { TopbarSkeleton } from "@/features/home/HomeSkeleton";
import kid from "@/features/kid/kid.module.css";
import styles from "@/features/shop/shop.module.css";

// Đang tải Cửa hàng: tiêu đề, tab và các thẻ món là khung xương.
export default function ShopLoading() {
  return (
    <div className={kid.screen} aria-busy="true">
      <TopbarSkeleton />
      <main className={styles.shop}>
        <div className={styles.bar}>
          <h1 className={styles.title}>Cửa hàng</h1>
          <Skeleton width="calc(var(--space-16) * 4)" height="var(--space-12)" radius="pill" />
        </div>
        <div className={styles.wrap}>
          <div className={styles.grid}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={styles.card}>
                <Skeleton width="calc(var(--space-16) * 1.5)" height="calc(var(--space-16) * 1.5)" radius="lg" />
                <Skeleton width="70%" height="var(--space-6)" radius="pill" />
                <Skeleton width="50%" height="var(--space-4)" radius="pill" />
                <Skeleton width="60%" height="var(--space-10)" radius="pill" />
              </div>
            ))}
          </div>
          <aside className={styles.side}>
            <Skeleton width="calc(var(--space-16) * 2.5)" height="calc(var(--space-16) * 2.5)" radius="round" />
            <Skeleton width="100%" height="calc(var(--space-16) * 1.25)" radius="lg" />
          </aside>
        </div>
      </main>
    </div>
  );
}
