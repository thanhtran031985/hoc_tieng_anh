import { Skeleton } from "@/components/ui";
import examStyles from "@/features/exam/exam.module.css";
import styles from "@/features/lesson/lesson.module.css";

// Đang tải bài thi: thanh đầu, thẻ thông tin và rồng là khung xương; chân bài tắt.
export default function ExamLoading() {
  return (
    <div className={styles.screen} aria-busy="true">
      <header className={styles.head}>
        <Skeleton width="var(--size-btn-s)" height="var(--size-btn-s)" radius="round" />
        <Skeleton width="auto" height="var(--size-test-dot)" radius="pill" style={{ flex: 1, minWidth: 0 }} />
        <Skeleton width="var(--size-count-min)" height="var(--space-5)" radius="pill" />
      </header>
      <main className={styles.main}>
        <div className={examStyles.intro}>
          <Skeleton width="calc(var(--size-lesson-stage) * 0.3)" height="calc(var(--size-lesson-stage) * 0.4)" radius="xl" />
          <div className={examStyles.card}>
            <Skeleton width="50%" height="var(--space-8)" radius="pill" />
            <Skeleton width="60%" height="var(--space-12)" radius="pill" />
            <div className={examStyles.facts}>
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} width="100%" height="var(--size-tile-h)" radius="lg" />
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className={styles.foot}>
        <div className={styles.footIn} />
      </footer>
    </div>
  );
}
