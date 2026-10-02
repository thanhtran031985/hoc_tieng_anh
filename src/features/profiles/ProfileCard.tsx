import { Avatar, LevelChip, type AvatarHair } from "@/components/ui";
import { AVATARS } from "@/lib/schemas";
import { isThcsGrade, levelForGrade } from "@/lib/learner-rules";
import type { Learner } from "@/server/learners";
import { selectLearnerAction } from "./actions";
import styles from "./profiles.module.css";

const toHair = (value: string): AvatarHair => ((AVATARS as readonly string[]).includes(value) ? (value as AvatarHair) : "short");

/** Thẻ một bé: ảnh, tên, lớp, nhãn cấp. Bấm để chọn hồ sơ (biểu mẫu gửi server action; server kiểm quyền sở hữu). */
export function ProfileCard({ learner }: { learner: Learner }) {
  const level = learner.currentLevel?.number ?? levelForGrade(learner.schoolGrade ?? 1);
  const grade = learner.schoolGrade;
  return (
    <form action={selectLearnerAction}>
      <input type="hidden" name="learnerId" value={learner.id} />
      <button type="submit" className={styles.pf} data-level={level} aria-label={grade ? `${learner.name}, lớp ${grade}` : learner.name}>
        {isThcsGrade(grade) && <span className={styles.tag}>THCS</span>}
        <Avatar name={learner.name} level={level} hair={toHair(learner.avatar)} size={136} className={styles.avatar} />
        <span className={styles.name}>{learner.name}</span>
        {grade && <span className={styles.grade}>Lớp {grade}</span>}
        {learner.currentLevel && <LevelChip level={learner.currentLevel.number} name={learner.currentLevel.name} />}
      </button>
    </form>
  );
}
