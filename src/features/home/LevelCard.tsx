import { Card, Icon, LevelChip, ProgressBar } from "@/components/ui";
import { LevelArt } from "@/features/levels/LevelArt";
import type { HomeData } from "@/server/home";
import styles from "./home.module.css";

/** Nhãn vị trí của cấp trên con đường: cấp 1–5 là đảo, cấp 6–10 là thành phố. */
export function levelPlaceLabel(level: number): string {
  return level <= 5 ? `Đảo ${level}/5` : `Thành phố ${level - 5}/5`;
}

/** Thẻ cấp bên phải trang chủ: nhãn cấp, hòn đảo, số chặng đã qua, phút học hôm nay. */
export function LevelCard({ data }: { data: HomeData | null }) {
  if (!data) return null;
  const { levelNumber, levelName, levelProgress, studyToday } = data;
  return (
    <Card className={styles.lvcard} data-level={levelNumber} role="region" aria-label="Tiến độ cấp học">
      <div className={styles.lvhead}>
        <LevelChip level={levelNumber} name={levelName} />
        <span className={styles.caption}>{levelPlaceLabel(levelNumber)}</span>
      </div>
      <div className={styles.isle}>
        <LevelArt level={levelNumber} />
      </div>
      {levelProgress.total > 0 && (
        <div>
          <div className={styles.label}>
            <span>Chặng đã qua</span>
            <span>
              {levelProgress.done}/{levelProgress.total}
            </span>
          </div>
          <div className={styles.barRow}>
            <ProgressBar size="s" value={levelProgress.done} max={levelProgress.total} label="Chặng đã qua" />
          </div>
        </div>
      )}
      <div className={styles.goal}>
        <span className={styles.goalIcon}>
          <Icon name="clock" size={28} />
        </span>
        <div className={styles.goalText}>
          <div className={styles.label}>
            Hôm nay: {studyToday.minutes}/{studyToday.goalMinutes} phút
          </div>
          <ProgressBar className={styles.goalBar} size="s" value={studyToday.minutes} max={studyToday.goalMinutes} label="Phút học hôm nay" />
        </div>
      </div>
    </Card>
  );
}
