import { Skeleton } from "@/components/ui";
import { TopbarSkeleton } from "@/features/home/HomeSkeleton";
import kid from "@/features/kid/kid.module.css";
import styles from "@/features/notebook/notebook.module.css";

// Đang tải Sổ từ: tiêu đề "··" và lưới thẻ là khung xương, chip lọc chưa bấm được.
export default function NotebookLoading() {
  return (
    <div className={`${kid.screen} ${styles.screen}`} aria-busy="true">
      <TopbarSkeleton />
      <main className={styles.nb}>
        <div className={styles.head}>
          <h1 className={styles.title}>
            Sổ từ
          </h1>
        </div>
        <div className={styles.gw} aria-hidden="true">
          <div className={styles.wg12}>
            {Array.from({ length: 12 }, (_, i) => (
              <Skeleton key={i} className={styles.skCard} width="100%" height="100%" radius="lg" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
