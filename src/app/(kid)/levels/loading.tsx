import { Skeleton } from "@/components/ui";
import { TopbarSkeleton } from "@/features/home/HomeSkeleton";
import kid from "@/features/kid/kid.module.css";
import { LEVEL_POINTS, stopPosition } from "@/features/levels/level-layout";
import { LevelsRoad } from "@/features/levels/LevelsRoad";
import styles from "@/features/levels/levels.module.css";

// Đang tải: con đường hiện trước, các điểm dừng là khung xương.
export default function LevelsLoading() {
  return (
    <div className={kid.seaScreen} aria-busy="true">
      <TopbarSkeleton />
      <main className={kid.main}>
        <div className={styles.lvw}>
          <div className={styles.lvmap}>
            <LevelsRoad />
            {LEVEL_POINTS.map((_, i) => (
              <Skeleton key={i} className={styles.skStop} width="13%" height="auto" radius="round" style={stopPosition(i + 1)} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
