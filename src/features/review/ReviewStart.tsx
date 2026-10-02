"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonLink, Card, Mascot, type MascotColor } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";
import { KidTopbar, type KidTopbarProps } from "@/features/kid/KidTopbar";
import { useHotkeys } from "@/lib/use-hotkeys";
import type { ReviewOverview } from "@/server/review";
import { MemoryBox } from "./MemoryBox";
import styles from "./review.module.css";

type Props = {
  topbar: KidTopbarProps;
  learnerName: string;
  mascot: MascotColor;
  overview: ReviewOverview;
  onStart: () => void;
};

/** Màn bắt đầu Ôn tập hôm nay (Screen19): số từ đến hạn, 5 hộp ghi nhớ, nút "Bắt đầu ôn". Hết từ đến hạn thì chúc mừng và gợi ý học bài mới. */
export function ReviewStart({ topbar, learnerName, mascot, overview, onStart }: Props) {
  const router = useRouter();
  const empty = overview.sessionCount === 0;
  useHotkeys({ Enter: () => (empty ? router.push(`/map/${overview.levelNumber}`) : onStart()) });

  return (
    <div className={kid.screen} data-level={overview.levelNumber} data-dragon={mascot}>
      <KidTopbar {...topbar} backHref="/home" backLabel="Về trang chủ" />
      <main className={styles.rv}>
        <div className={styles.top}>
          <Mascot expr={empty ? "vui" : "chao"} className={styles.dragon} />
          <div className={styles.intro}>
            <h1 className={styles.title}>Ôn tập hôm nay</h1>
            <p className={styles.sub}>
              {empty
                ? `${learnerName} đã ôn hết từ đến hạn. Ngày mai Bông sẽ chọn từ để ôn nhé!`
                : `Bông chọn ${overview.sessionCount} từ ${learnerName} sắp quên. Ôn một chút là nhớ lâu ngay!`}
            </p>
          </div>
          <Card className={styles.dueCard}>
            <span className={styles.dueNum}>{overview.sessionCount}</span>
            <div className={styles.dueText}>
              <b>từ đến hạn ôn</b>
              <span>{empty ? "Hôm nay xong rồi!" : `khoảng ${Math.max(1, Math.round(overview.sessionCount / 2))} phút`}</span>
            </div>
          </Card>
        </div>

        <div className={styles.boxes} role="list" aria-label="5 hộp ghi nhớ">
          {overview.boxes.map((b) => (
            <MemoryBox key={b.box} {...b} />
          ))}
        </div>

        <div className={styles.foot}>
          <span className={styles.hint}>{empty ? "Muốn học thêm? Mở bài mới trên bản đồ." : "Lên hộp càng cao, từ càng ít phải ôn."}</span>
          {empty ? (
            <div className={styles.footActs}>
              <ButtonLink href="/home" variant="secondary" size="l" icon="house" label="Về trang chủ" />
              <ButtonLink href={`/map/${overview.levelNumber}`} size="l" icon="map" label="Học bài mới" shortcut="Enter" />
            </div>
          ) : (
            <Button size="l" icon="next" label="Bắt đầu ôn" shortcut="Enter" onClick={onStart} />
          )}
        </div>
      </main>
    </div>
  );
}
