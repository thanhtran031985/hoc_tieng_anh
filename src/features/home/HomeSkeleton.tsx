import { Card, Mascot, Skeleton } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";
import styles from "./home.module.css";

/** Thanh trên cùng ở dạng khung xương (dùng khi chưa biết bé nào): ảnh, tên, ba chip thống kê. */
export function TopbarSkeleton() {
  return (
    <div className={styles.skTop} aria-hidden="true">
      <div className={styles.skRow}>
        <Skeleton width="var(--space-12)" height="var(--space-12)" radius="round" />
        <div className={styles.skLines}>
          <Skeleton width="calc(var(--space-16) * 1.5)" height="var(--space-4)" radius="pill" />
          <Skeleton width="calc(var(--space-16) * 2)" height="var(--space-3)" radius="pill" />
        </div>
      </div>
      <div className={styles.skRow}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} width="calc(var(--space-16) * 1.5)" height="var(--space-10)" radius="pill" />
        ))}
      </div>
    </div>
  );
}

/** Đang tải trang chủ: giữ đúng bố cục (thẻ nhiệm vụ, rồng, thẻ cấp, 4 nút) để khỏi nhảy khi dữ liệu về. */
export function HomeSkeleton() {
  return (
    <div className={kid.screen} aria-busy="true">
      <TopbarSkeleton />
      <div className={kid.body}>
        <div className={styles.hm}>
          <Card className={styles.mis} aria-hidden="true">
            <Skeleton width="calc(var(--space-16) * 3.5)" height="var(--space-8)" radius="pill" />
            {[0, 1].map((i) => (
              <div key={i} className={styles.skTask}>
                <Skeleton width="var(--size-task-icon)" height="var(--size-task-icon)" radius="md" />
                <div className={styles.skLines}>
                  <Skeleton width="calc(var(--space-16) * 2.2)" height="var(--space-6)" radius="pill" />
                  <Skeleton width="calc(var(--space-16) * 2.8)" height="var(--space-4)" radius="pill" />
                </div>
                <div className={styles.act}>
                  <Skeleton width="calc(var(--space-16) * 2.2)" height="var(--size-btn-m)" radius="md" />
                </div>
              </div>
            ))}
          </Card>
          <div className={styles.mid}>
            <Mascot expr="suynghi" className={styles.mascot} />
          </div>
          <Card className={styles.lvcard} aria-hidden="true">
            <Skeleton width="calc(var(--space-16) * 2.5)" height="var(--space-6)" radius="pill" />
            <Skeleton width="100%" height="min(var(--size-isle-h), 17vh)" radius="lg" />
            <Skeleton width="100%" height="var(--space-5)" radius="pill" />
            <Skeleton width="100%" height="var(--space-8)" radius="pill" />
          </Card>
        </div>
        <nav className={styles.nav} aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={styles.tile}>
              <Skeleton width="min(var(--size-nav-icon), 10vh)" height="min(var(--size-nav-icon), 10vh)" radius="round" />
              <div className={styles.skLines}>
                <Skeleton width="calc(var(--space-16) * 1.6)" height="var(--space-6)" radius="pill" />
                <Skeleton width="calc(var(--space-16) * 1.2)" height="var(--space-3)" radius="pill" />
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
