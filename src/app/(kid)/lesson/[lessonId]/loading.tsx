import { Skeleton } from "@/components/ui";
import styles from "@/features/lesson/lesson.module.css";

// Đang tải bài: thanh đầu và vùng giữa là khung xương, chân bài tắt.
export default function LessonLoading() {
  return (
    <div className={styles.screen} aria-busy="true">
      <header className={styles.head}>
        <Skeleton width="var(--size-btn-s)" height="var(--size-btn-s)" radius="round" />
        <Skeleton width="100%" height="var(--size-progress)" radius="pill" />
        <Skeleton width="var(--size-count-min)" height="var(--space-5)" radius="pill" />
      </header>
      <main className={styles.main}>
        <Skeleton width="calc(var(--size-lesson-stage) * 0.4)" height="var(--space-8)" radius="pill" />
        <Skeleton width="var(--size-lesson-stage)" height="calc(var(--size-lesson-stage) * 0.4)" radius="xl" />
      </main>
      <footer className={styles.foot}>
        <div className={styles.footIn} />
      </footer>
    </div>
  );
}
