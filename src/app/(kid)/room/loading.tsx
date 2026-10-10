import { Skeleton } from "@/components/ui";
import { TopbarSkeleton } from "@/features/home/HomeSkeleton";
import kid from "@/features/kid/kid.module.css";
import styles from "@/features/room/room.module.css";

// Đang tải Phòng của tớ: khung xương của phòng.
export default function RoomLoading() {
  return (
    <div className={kid.screen} aria-busy="true">
      <TopbarSkeleton />
      <main className={styles.room}>
        <div className={styles.bar}>
          <h1 className={styles.title}>Phòng của tớ</h1>
          <Skeleton width="calc(var(--space-16) * 4)" height="var(--space-12)" radius="pill" />
        </div>
        <div className={styles.wrap}>
          <Skeleton width="100%" height="100%" radius="xl" />
        </div>
      </main>
    </div>
  );
}
