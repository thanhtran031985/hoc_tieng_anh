"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FocusBadge, LessonTools, TestDots, useFocusMode } from "@/components/lesson";
import { Button, Dialog, Icon, LevelChip, Mascot, type MascotColor } from "@/components/ui";
import { LessonFoot, LessonFrame, LessonMain } from "@/features/lesson/LessonFrame";
import { useSound } from "@/features/sound/SoundProvider";
import { playPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { stageForLevel } from "@/lib/rules/mascot-stage";
import type { ExamIntro as ExamIntroData } from "@/server/exam";
import styles from "./exam.module.css";

type Props = {
  intro: ExamIntroData;
  mascot: MascotColor;
  starting: boolean;
  /** Lỗi khi tải bài thi (hiện dưới thẻ, có thể bấm Bắt đầu lại). */
  error: string | null;
  onStart: () => void;
};

/** Giới thiệu bài thi lên cấp (Screen35): Bông thách, thẻ 4 ô thông tin, Bắt đầu (Enter) hoặc Để sau (hộp thoại hẹn lần sau). */
export function ExamIntro({ intro, mascot, starting, error, onStart }: Props) {
  const router = useRouter();
  const tools = useFocusMode();
  const { sound, setSound, musicAvailable } = useSound();
  const [laterOpen, setLaterOpen] = useState(false);
  const { level, next } = intro;
  const target = next ?? { number: level.number, name: level.name, place: "đảo" };
  const mapHref = `/map/${level.number}`;

  useHotkeys(
    { Enter: () => !starting && onStart(), Escape: () => (tools.focus ? tools.setFocus(false) : setLaterOpen(true)), f: tools.toggle },
    { enabled: !laterOpen },
  );

  const extra = (
    <>
      {tools.focus && <FocusBadge />}
      <LessonTools focus={tools.focus} onToggleFocus={tools.toggle} sound={sound} onSoundChange={setSound} musicAvailable={musicAvailable} />
    </>
  );

  return (
    <LessonFrame
      level={level.number}
      mascot={mascot}
      value={0}
      max={intro.questionCount}
      onExit={() => setLaterOpen(true)}
      focus={tools.focus}
      extra={extra}
      head={<TestDots value={0} max={intro.questionCount} />}
      className={`${styles.bg} ${styles[`to${target.number}` as "to2"]}`}
    >
      <LessonMain>
        <div className={styles.intro}>
          <div className={styles.bong}>
            <div className={styles.bubble}>Thử thách lên {target.place} {target.name}!</div>
            <Mascot expr="vui" size={220} stage={stageForLevel(level.number)} />
          </div>
          <div className={styles.card}>
            {next && (
              <div className={styles.route}>
                <LevelChip level={level.number} name={level.name} />
                <Icon name="next" size={20} />
                <LevelChip level={next.number} name={next.name} />
              </div>
            )}
            <h1 className={styles.display}>Bài thi lên cấp</h1>
            <ul className={styles.facts}>
              <li>
                <span className={styles.factIc}>
                  <Icon name="star" size={26} />
                </span>
                <div>
                  <b>{intro.questionCount} câu</b>
                  <span>Từ cả {intro.unitCount} vùng của cấp này</span>
                </div>
              </li>
              <li>
                <span className={styles.factIc}>
                  <Icon name="book" size={24} />
                </span>
                <div>
                  <b>Trộn dạng bài</b>
                  <span>Nghe chọn hình, điền từ, sắp xếp câu, nghe và gõ</span>
                </div>
              </li>
              <li>
                <span className={styles.factIc}>
                  <Icon name="clock" size={24} />
                </span>
                <div>
                  <b>Không đếm giờ</b>
                  <span>Bé làm từ từ, thoát giữa chừng cũng được</span>
                </div>
              </li>
              <li>
                <span className={styles.factIc}>
                  <Icon name="check" size={24} />
                </span>
                <div>
                  <b>Cần đúng {intro.passPercent}%</b>
                  <span>
                    Tức là {Math.ceil((intro.questionCount * intro.passPercent) / 100)}/{intro.questionCount} câu đúng ngay lần đầu
                  </span>
                </div>
              </li>
            </ul>
            <p className={styles.note}>
              <Icon name="replay" size={20} />
              {intro.lastScore ? `Lần trước bé được ${intro.lastScore.score}/${intro.lastScore.total} câu. Bé đã ôn rồi nên lần này sẽ tốt hơn!` : "Chưa đạt cũng không sao: Bông chỉ chủ đề cần ôn, rồi bé thi lại."}
            </p>
            {error && (
              <p className={styles.note} role="alert">
                <Icon name="wifi" size={20} />
                {error}
              </p>
            )}
          </div>
        </div>
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button variant="ghost" size="l" icon="speaker" label="Nghe Bông nói" onClick={() => playPronunciation("Level up challenge! Twenty questions. You can do it!")} />
            <Button variant="secondary" size="l" icon="back" label="Để sau" onClick={() => setLaterOpen(true)} />
          </>
        }
        right={<Button size="l" icon="next" label={starting ? "Đang chuẩn bị…" : "Bắt đầu"} shortcut="Enter" disabled={starting} onClick={onStart} />}
      />
      <Dialog
        open={laterOpen}
        onClose={() => setLaterOpen(false)}
        expr="chao"
        title="Hẹn bé lần sau nhé!"
        body="Cổng cuối đảo vẫn mở chờ bé. Lúc nào sẵn sàng thì bấm cổng để thi."
        actions={[
          { label: "Về bản đồ", variant: "primary", shortcut: "Enter", icon: "map", onClick: () => router.push(mapHref) },
          { label: "Thi luôn", variant: "secondary", onClick: onStart },
        ]}
      />
    </LessonFrame>
  );
}
