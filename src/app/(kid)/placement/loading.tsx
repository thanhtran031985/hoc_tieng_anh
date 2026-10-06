import { Bubble, Card, Mascot, Skeleton } from "@/components/ui";
import { TopbarSkeleton } from "@/features/home/HomeSkeleton";
import kid from "@/features/kid/kid.module.css";
import styles from "@/features/placement/placement.module.css";

// Đang tải bài xếp lớp: lời chào hiện ngay, thẻ bên phải là khung xương.
export default function PlacementLoading() {
  return (
    <div className={kid.screen} aria-busy="true">
      <TopbarSkeleton />
      <main className={styles.pl}>
        <div className={styles.hero}>
          <Bubble className={styles.bubble}>Bông đang chuẩn bị mấy câu đố vui…</Bubble>
          <Mascot expr="suynghi" />
        </div>
        <Card className={styles.card} aria-hidden="true">
          <Skeleton width="calc(var(--space-16) * 4)" height="var(--space-10)" radius="pill" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={styles.sideBySide}>
              <Skeleton width="var(--size-fact-icon)" height="var(--size-fact-icon)" radius="md" />
              <Skeleton width="70%" height="var(--space-5)" radius="pill" />
            </div>
          ))}
          <Skeleton width="100%" height="var(--space-16)" radius="lg" />
          <Skeleton width="100%" height="var(--space-12)" radius="lg" />
        </Card>
      </main>
    </div>
  );
}
