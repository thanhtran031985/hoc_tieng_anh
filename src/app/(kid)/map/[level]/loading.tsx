import { Skeleton } from "@/components/ui";
import { TopbarSkeleton } from "@/features/home/HomeSkeleton";
import { IslandArt } from "@/features/island-map/IslandArt";
import { ZONE_SLOTS, toPercent, zoneNodePositions } from "@/features/island-map/island-layout";
import styles from "@/features/island-map/island-map.module.css";
import kid from "@/features/kid/kid.module.css";

// Đang tải: hình đảo hiện ngay, các chặng và trùm là khung xương.
export default function IslandMapLoading() {
  return (
    <div className={kid.seaScreen} aria-busy="true">
      <TopbarSkeleton />
      <main className={kid.main}>
        <div className={styles.imw}>
          <div className={styles.imap}>
            <IslandArt zoneCount={4} skeleton />
            {ZONE_SLOTS.flatMap((slot, z) => [...zoneNodePositions(slot, 5), slot.boss].map((p, i) => (
              <Skeleton key={`${z}-${i}`} className={styles.skNode} width="100%" height="auto" radius="round" style={toPercent(p)} />
            )))}
          </div>
        </div>
      </main>
    </div>
  );
}
