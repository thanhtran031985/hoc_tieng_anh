import { Mascot, Skeleton } from "@/components/ui";
import { ProfilesTop } from "@/features/profiles/ProfilesTop";
import styles from "@/features/profiles/profiles.module.css";

// Đang tải: khung xương giữ đúng vị trí thẻ hồ sơ (không dùng vòng xoay toàn màn).
export default function ProfilesLoading() {
  return (
    <div className={styles.screen} aria-busy="true">
      <ProfilesTop />
      <main className={styles.main}>
        <div className={styles.head}>
          <Mascot expr="suynghi" className={styles.headMascot} />
          <Skeleton width="calc(var(--size-content-max) / 3)" height="var(--space-12)" radius="pill" />
        </div>
        <div className={styles.grid}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <Skeleton width="var(--size-avatar-card)" height="var(--size-avatar-card)" radius="round" />
              <Skeleton width="calc(var(--size-avatar-card) + var(--space-1))" height="var(--space-8)" radius="pill" />
              <Skeleton width="calc(var(--size-avatar-card) * 0.66)" height="var(--space-5)" radius="pill" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
