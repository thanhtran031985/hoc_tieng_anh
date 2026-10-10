import { Skeleton } from "@/components/ui";
import styles from "@/features/word-family/family.module.css";

// Đang tải Ghép chữ đầu: khung xương của đầu màn và các thẻ.
export default function BuildLoading() {
  return (
    <div className={styles.screen} aria-busy="true">
      <header className={styles.top}>
        <Skeleton width="var(--space-12)" height="var(--space-12)" radius="pill" />
        <div className={styles.ttl}>
          <Skeleton width="calc(var(--space-16) * 3)" height="var(--space-8)" radius="pill" />
        </div>
      </header>
      <main className={styles.mainFree}>
        <Skeleton width="100%" height="100%" radius="xl" />
      </main>
    </div>
  );
}
