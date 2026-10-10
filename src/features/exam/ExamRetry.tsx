"use client";

import { useRouter } from "next/navigation";
import { TestDots } from "@/components/lesson";
import { Button, Mascot, SpeakerButton, type MascotColor } from "@/components/ui";
import { LessonFoot, LessonFrame, LessonMain } from "@/features/lesson/LessonFrame";
import { cn } from "@/lib/cn";
import { stageForLevel } from "@/lib/rules/mascot-stage";
import type { ExamResult } from "@/lib/schemas";
import { playPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import styles from "./exam.module.css";

type Props = { result: ExamResult; mascot: MascotColor };

/**
 * Chưa đạt bài thi lên cấp (Screen37): Bông động viên (không có chữ “trượt”, không màu đỏ), số câu đúng trên thước 20 ô,
 * tối đa 3 chủ đề nên ôn kèm từ hay sai và nút “Ôn chủ đề này” (phím 1–3), “Thi lại sau” (Enter) về bản đồ. Ôn xong một chủ đề là thi lại được.
 */
export function ExamRetry({ result, mascot }: Props) {
  const router = useRouter();
  const { level, next } = result;
  const target = next ?? level;
  const mapHref = `/map/${level.number}`;
  const missing = Math.max(0, result.passScore - result.score);
  const say = "You did well! Let's practise and try again!";

  function review(index: number) {
    const lessonId = result.weak[index]?.reviewLessonId;
    if (lessonId) router.push(`/lesson/${lessonId}`);
  }
  const keys: Record<string, () => void> = { Enter: () => router.push(mapHref), Space: () => playPronunciation(say) };
  result.weak.forEach((_, i) => {
    keys[String(i + 1)] = () => review(i);
  });
  useHotkeys(keys);

  const toClass = styles[`to${Math.min(5, Math.max(2, target.number))}` as "to2"];
  return (
    <LessonFrame
      level={level.number}
      mascot={mascot}
      value={result.total}
      max={result.total}
      onExit={() => router.push(mapHref)}
      head={<TestDots value={result.total} max={result.total} />}
      className={cn(styles.bg, toClass)}
    >
      <LessonMain>
        <div className={cn(styles.result, styles.retry)}>
          <div className={styles.enc}>
            <div className={styles.bubble}>
              Bé làm tốt lắm rồi! Ôn thêm chút xíu là lên {next ? `đảo ${next.name}` : "cấp mới"} thôi!
            </div>
            <Mascot expr="dongvien" size={190} stage={stageForLevel(level.number)} />
            <div className={styles.res}>
              <div className={styles.resN}>
                <b>
                  {result.score}/{result.total}
                </b>
                <span>câu đúng</span>
              </div>
              <div className={styles.meter} style={{ "--cells": result.total } as React.CSSProperties} role="img" aria-label={`${result.score} câu đúng, cần ${result.passScore} câu`}>
                {Array.from({ length: result.total }, (_, i) => (
                  <i key={i} className={i < result.score ? styles.ok : i < result.passScore ? styles.need : undefined} />
                ))}
              </div>
              <span className={styles.goal}>
                Cần {result.passScore} câu ({Math.round((100 * result.passScore) / Math.max(1, result.total))}%) · còn thiếu <b>{missing} câu</b> nữa thôi
              </span>
            </div>
          </div>
          <div className={styles.topics}>
            <h1 className={styles.title}>Bông gợi ý ôn {result.weak.length} chủ đề này</h1>
            {result.weak.map((topic, i) => (
              <section key={topic.unitId} className={styles.topic} aria-label={`Chủ đề ${topic.titleVi}`}>
                <span className={styles.topicNo}>{i + 1}</span>
                <div className={styles.topicText}>
                  <b>
                    {topic.titleVi}{" "}
                    <small lang="en">
                      {topic.title} · đúng {topic.correct}/{topic.total} câu
                    </small>
                  </b>
                  {topic.words.length > 0 && (
                    <div className={styles.words}>
                      {topic.words.map((w) => (
                        <span key={w.word} className={styles.word}>
                          <SpeakerButton word={w.word} size="s" />
                          <span lang="en">{w.word}</span>
                          <small>{w.meaningVi}</small>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant={i === 0 ? "primary" : "secondary"} icon="book" label="Ôn chủ đề này" shortcut={String(i + 1)} disabled={topic.reviewLessonId === null} onClick={() => review(i)} />
              </section>
            ))}
          </div>
        </div>
      </LessonMain>
      <LessonFoot
        left={<Button variant="ghost" size="l" icon="speaker" label="Nghe Bông nói" shortcut="Space" onClick={() => playPronunciation(say)} />}
        right={<Button size="l" icon="map" label="Thi lại sau" shortcut="Enter" onClick={() => router.push(mapHref)} />}
      />
    </LessonFrame>
  );
}
