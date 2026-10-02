import { ButtonLink, Card, Icon, Mascot, WordPicture } from "@/components/ui";
import type { HomeData } from "@/server/home";
import { RetryButton } from "./RetryButton";
import styles from "./home.module.css";

/** Thẻ "Nhiệm vụ hôm nay": Ôn tập (từ đến hạn) và Bài tiếp theo. `data` là null khi không tải được: lỗi chỉ khoanh trong thẻ này. */
export function MissionCard({ data }: { data: HomeData | null }) {
  if (!data) {
    return (
      <Card className={styles.mis} role="region" aria-labelledby="missions-title">
        <h2 id="missions-title" className={styles.misTitle}>
          Nhiệm vụ hôm nay
        </h2>
        <div className={styles.misState} role="alert">
          <Mascot expr="dongvien" className={styles.misStateMascot} />
          <h3 className={styles.misStateTitle}>Chưa tải được nhiệm vụ</h3>
          <p className={styles.note}>Bé vẫn vào Bản đồ để học được nhé.</p>
          <RetryButton />
        </div>
      </Card>
    );
  }

  const { review, next, levelNumber, levelComplete, levelHasContent, missions, hasStarted } = data;
  const isNewLearner = !hasStarted && review.dueCount === 0;
  // Chỉ hiện dòng Ôn tập khi có từ đến hạn hoặc hôm nay bé đã ôn (để thấy đã xong); không có gì để ôn thì ẩn.
  const showReview = !isNewLearner && (review.dueCount > 0 || review.doneToday);

  return (
    <Card className={styles.mis} role="region" aria-labelledby="missions-title">
      <h2 id="missions-title" className={styles.misTitle}>
        Nhiệm vụ hôm nay
        {!isNewLearner && missions.total > 0 && (
          <span className={styles.count}>
            {missions.done}/{missions.total}
          </span>
        )}
      </h2>

      {showReview && (
        <div className={styles.task}>
          <div className={`${styles.taskIcon} ${styles.reviewIcon}`}>
            <Icon name="replay" size={40} />
          </div>
          <div>
            <div className={styles.taskTitle}>Ôn tập</div>
            <div className={styles.taskSub}>
              {review.pictures.length > 0 && (
                <span className={styles.minis}>
                  {review.pictures.map((p) => (
                    <WordPicture key={p.word} word={p.word} src={p.image} className={styles.mini} />
                  ))}
                </span>
              )}
              <span className={styles.muted}>{review.dueCount > 0 ? `${review.dueCount} từ cần ôn` : "Hôm nay ôn xong rồi"}</span>
            </div>
          </div>
          {review.dueCount > 0 && (
            <div className={styles.act}>
              <ButtonLink href="/review" variant="secondary" size="m" label="Ôn ngay" />
            </div>
          )}
        </div>
      )}

      {next ? (
        <div className={styles.task} data-level={levelNumber}>
          <div className={styles.taskIcon}>
            {next.picture ? <WordPicture word={next.picture.word} src={next.picture.image} className={styles.taskPic} /> : <Icon name="map" size={40} />}
          </div>
          <div>
            <div className={styles.taskTitle}>{isNewLearner ? "Bài đầu tiên!" : "Bài tiếp theo"}</div>
            <div className={styles.taskSub}>
              <span>
                <b className={styles.en}>{next.unitTitle}</b>
                {next.kind === "lesson" ? ` · Bài ${next.ordinal}` : " · Trận trùm"} · {next.unitTitleVi}
              </span>
            </div>
          </div>
          <div className={styles.act}>
            {!isNewLearner && next.kind === "lesson" && (
              <span className={styles.caption}>
                {next.unitDone}/{next.unitTotal} chặng
              </span>
            )}
            <ButtonLink
              href={`/lesson/${next.lessonId}`}
              variant="level"
              size="m"
              label={isNewLearner ? "Bắt đầu" : next.kind === "unit_test" ? "Đấu trùm" : "Học tiếp"}
              shortcut="Enter"
            />
          </div>
        </div>
      ) : (
        <div className={styles.task} data-level={levelNumber}>
          <div className={styles.taskIcon}>
            <Icon name={levelHasContent ? "crown" : "map"} size={40} />
          </div>
          <div>
            <div className={styles.taskTitle}>{levelComplete ? "Bé đã xong cấp này!" : `Cấp ${levelNumber} sắp có`}</div>
            <div className={styles.taskSub}>
              <span>{levelComplete ? "Bài thi lên cấp sắp có." : "Các bài học đang được biên soạn."}</span>
            </div>
          </div>
          <div className={styles.act}>
            <ButtonLink href="/levels" variant="level" size="m" label="Xem các cấp" shortcut="Enter" />
          </div>
        </div>
      )}

      {isNewLearner && next && <p className={styles.note}>Chưa có từ nào cần ôn. Học xong bài đầu, Bông sẽ nhắc bé ôn đúng lúc.</p>}
    </Card>
  );
}
