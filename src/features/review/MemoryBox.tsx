import { Icon, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import { MASTERY_NAMES, intervalLabel } from "@/lib/rules/review-box";
import type { BoxSummary } from "@/server/review";
import styles from "./review.module.css";

/** Một trong 5 hộp ghi nhớ (Screen19): nắp, số hộp, số từ, tên mức, lịch ôn, vài hình mẫu và nhãn đến hạn. Hộp có từ đến hạn nhô lên. */
export function MemoryBox({ box, count, due, pictures, nextLabel }: BoxSummary) {
  const name = MASTERY_NAMES[box - 1];
  const label = `Hộp ${box}, ${name}, ${count} từ, ${due > 0 ? `${due} từ đến hạn hôm nay` : "chưa đến hạn"}`;
  return (
    <div className={cn(styles.box, due > 0 && styles.dueBox)} style={{ "--m": `var(--mastery-${box})`, "--ms": `var(--mastery-${box}-soft)` } as React.CSSProperties} role="listitem" aria-label={label}>
      <div className={styles.lid} aria-hidden="true" />
      <div className={styles.boxHead}>
        <span className={styles.boxNo}>Hộp {box}</span>
        <b className={styles.boxCount}>{count}</b>
      </div>
      <div className={styles.boxName}>{name}</div>
      <div className={styles.boxSched}>{intervalLabel(box)}</div>
      <div className={styles.boxPics} aria-hidden="true">
        {pictures.map((p) => (
          <span key={p.word} className={styles.boxPic}>
            <WordPicture word={p.word} src={p.image} size={36} label="" aria-hidden="true" />
          </span>
        ))}
      </div>
      {due > 0 ? (
        <span className={styles.boxTag}>
          <Icon name="flame" size={16} /> {due} từ đến hạn
        </span>
      ) : (
        <span className={cn(styles.boxTag, styles.boxRest)}>
          <Icon name="clock" size={16} /> {count === 0 ? "Chưa có từ" : (nextLabel ?? "Đã ôn xong")}
        </span>
      )}
    </div>
  );
}
