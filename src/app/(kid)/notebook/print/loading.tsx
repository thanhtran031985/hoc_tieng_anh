import { Skeleton } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";
import styles from "@/features/notebook/print.module.css";

// Đang chuẩn bị bản in: khung trang A4 với các dòng là khung xương.
export default function PrintLoading() {
  return (
    <div className={`${kid.screen} ${styles.screen}`} aria-busy="true">
      <main className={styles.pv}>
        <div className={styles.tool}>
          <span className={styles.toolText}>Đang chuẩn bị bản in…</span>
        </div>
        <div className={styles.pages}>
          <article className={styles.page} aria-hidden="true">
            <Skeleton width="60%" height="3em" radius="pill" />
            <div style={{ display: "grid", gap: "1.2em", marginTop: "2em" }}>
              {Array.from({ length: 8 }, (_, i) => (
                <Skeleton key={i} width="100%" height="4.6em" radius="md" />
              ))}
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
