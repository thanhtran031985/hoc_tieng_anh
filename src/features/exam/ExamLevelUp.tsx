"use client";

import { useRouter } from "next/navigation";
import { TestDots } from "@/components/lesson";
import { Button, Icon, LevelChip, Mascot, type MascotColor } from "@/components/ui";
import { LessonFoot, LessonFrame, LessonMain } from "@/features/lesson/LessonFrame";
import endStyles from "@/features/lesson/lesson-end.module.css";
import { stageForLevel } from "@/lib/rules/mascot-stage";
import type { ExamResult } from "@/lib/schemas";
import { playPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { cn } from "@/lib/cn";
import styles from "./exam.module.css";

type Props = {
  result: ExamResult;
  learnerName: string;
  mascot: MascotColor;
  /** Tên 5 đảo Tiểu học cho chuỗi đảo (cấp 1–5). */
  islands: { number: number; name: string }[];
};

/**
 * Đạt bài thi lên cấp (Screen36): chúc mừng, rồng Bông lớn lên (dáng cấp cũ → dáng cấp mới, giữ màu bé chọn), chuỗi 5 đảo với đảo mới sáng,
 * thưởng +50 sao, +100 xu và huy hiệu “Qua đảo …”. Enter (hoặc nút) đến đảo mới. Không có màn thua.
 */
export function ExamLevelUp({ result, learnerName, mascot, islands }: Props) {
  const router = useRouter();
  const { level, next, levelUp } = result;
  const target = next ?? level;
  const goHref = `/map/${target.number}`;
  useHotkeys({ Enter: () => router.push(goHref), Space: () => playPronunciation("Level up! Welcome to the next island!") });

  const toClass = styles[`to${Math.min(5, Math.max(2, target.number))}` as "to2"];
  return (
    <LessonFrame
      level={target.number}
      mascot={mascot}
      value={result.total}
      max={result.total}
      onExit={() => router.push(goHref)}
      head={<TestDots value={result.total} max={result.total} />}
      className={cn(styles.bg, toClass)}
    >
      <div className={endStyles.confetti} aria-hidden="true">
        {Array.from({ length: 26 }, (_, i) => (
          <i key={i} style={{ "--x": `${(i * 37) % 100}%`, "--d": `${(i % 7) * 0.35}s` } as React.CSSProperties} />
        ))}
      </div>
      <LessonMain>
        <div className={cn(styles.result, styles.levelUp)}>
          <section className={styles.grow} aria-label="Rồng Bông lớn lên">
            <h2 className={styles.title}>Bông lớn lên rồi!</h2>
            <div className={styles.ba}>
              <div className={cn(styles.st, styles.stBefore)}>
                <Mascot expr="vui" size={130} stage={stageForLevel(level.number)} />
                <LevelChip level={level.number} name={level.name} />
              </div>
              <span className={styles.arrow} aria-hidden="true">
                <Icon name="next" size={30} />
              </span>
              <div className={cn(styles.st, styles.stAfter)}>
                <Mascot expr="chucmung" size={220} stage={stageForLevel(target.number)} />
                <LevelChip level={target.number} name={target.name} />
              </div>
            </div>
          </section>
          <div className={styles.rt}>
            <h1 className={styles.display}>Lên cấp rồi, {learnerName} ơi!</h1>
            <span className={styles.score}>
              <Icon name="check" size={22} />
              {result.score}/{result.total} câu đúng · {result.percent}%
            </span>
            <div className={styles.isl}>
              <p className={styles.islT}>
                <Icon name="map" size={20} />
                Bản đồ: đảo {target.name} vừa mở
              </p>
              <ol className={styles.chain}>
                {islands.map((island) => {
                  const state = island.number < target.number ? "done" : island.number === target.number ? "new" : "lock";
                  return (
                    <li
                      key={island.number}
                      className={cn(styles.il, state === "done" && styles.ilDone, state === "new" && styles.ilNew, state === "lock" && styles.ilLock)}
                      style={{ "--c": `var(--level-${island.number})`, "--c-soft": `var(--level-${island.number}-soft)`, "--c-ink": `var(--level-${island.number}-ink)`, "--on-c": `var(--on-level-${island.number})` } as React.CSSProperties}
                    >
                      <i aria-hidden="true">
                        <Icon name={state === "done" ? "check" : state === "lock" ? "lock" : "island"} size={state === "new" ? 34 : state === "lock" ? 22 : 26} />
                      </i>
                      <span>{island.name}</span>
                      {state === "new" && <em>Mới mở!</em>}
                      <span className="sr-only">{state === "done" ? "đã qua" : state === "new" ? "mới mở" : "còn khóa"}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className={styles.rew}>
              <div>
                <Icon name="star" size={40} />
                <span>
                  <b>+{levelUp?.stars ?? 0}</b>sao
                </span>
              </div>
              <div>
                <Icon name="coin" size={40} />
                <span>
                  <b>+{levelUp?.coins ?? 0}</b>xu
                </span>
              </div>
              <div>
                <span className={styles.medal}>
                  <Icon name="medal" size={26} />
                </span>
                <span>
                  <b className={styles.small}>Huy hiệu</b>
                  {levelUp?.badge?.name ?? `Qua đảo ${level.name}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </LessonMain>
      <LessonFoot
        left={<Button variant="ghost" size="l" icon="speaker" label="Nghe lời chúc" shortcut="Space" onClick={() => playPronunciation("Level up! Welcome to the next island!")} />}
        right={<Button size="l" icon="next" label="Đến đảo mới" shortcut="Enter" onClick={() => router.push(goHref)} />}
      />
    </LessonFrame>
  );
}
