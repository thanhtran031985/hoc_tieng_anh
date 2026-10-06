import { MASTERY_NAMES } from "@/lib/rules/review-box";
import styles from "./notebook.module.css";

/** Mức thuộc: 5 chấm (đầy tới mức hiện tại) kèm tên mức, nên không chỉ dựa vào màu. */
export function MasteryPips({ level }: { level: number }) {
  return (
    <div className={styles.pips} role="img" aria-label={`Mức ${level} trên 5: ${MASTERY_NAMES[level - 1]}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= level ? styles.pipOn : undefined} />
      ))}
      <b>{MASTERY_NAMES[level - 1]}</b>
    </div>
  );
}
