"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonLink, Icon, Mascot, Skeleton, SpeakerButton, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { PlayWord } from "@/lib/rules/lesson-play";
import { useHotkeys } from "@/lib/use-hotkeys";
import type { LessonCompletion } from "@/lib/schemas";
import styles from "./lesson-end.module.css";

export type SaveState = { status: "idle" } | { status: "ok"; completion: LessonCompletion } | { status: "error"; message: string };

type Props = {
  learnerName: string;
  unitTitleVi: string;
  lessonTitle: string;
  bossLesson: boolean;
  /** Số liệu tính ngay trên máy (cùng hàm với server) để hiện sao khi chưa lưu xong hoặc lưu lỗi. */
  preview: LessonCompletion;
  words: PlayWord[];
  mapHref: string;
  save: SaveState;
  onRetry: () => void;
  onReplay: () => void;
};

function title(stars: number, name: string, boss: boolean): string {
  if (boss) return `Thắng trùm rồi, ${name} ơi!`;
  if (stars === 3) return `Giỏi quá, ${name} ơi!`;
  if (stars === 2) return `Làm tốt lắm, ${name} ơi!`;
  return `Bé hoàn thành rồi, ${name} ơi!`;
}

/** Màn kết thúc bài (Screen12): sao hiện lần lượt, xu/XP, số câu đúng, thời gian, danh sách từ vừa học, nút đi tiếp. */
export function LessonEnd({ learnerName, unitTitleVi, lessonTitle, bossLesson, preview, words, mapHref, save, onRetry, onReplay }: Props) {
  const saving = save.status === "idle";
  const failed = save.status === "error";
  const result = save.status === "ok" ? save.completion : preview;
  const nextHref = save.status === "ok" && save.completion.nextLessonId !== null ? `/lesson/${save.completion.nextLessonId}` : null;
  const primaryHref = nextHref ?? mapHref;

  const router = useRouter();
  // Enter: đi tiếp khi đã lưu xong, hoặc Thử lại khi lưu lỗi (nút chính ghi nhãn Enter).
  useHotkeys({ Enter: () => (failed ? onRetry() : router.push(primaryHref)) }, { enabled: !saving });

  const reward = result.xp > 0 ? { value: `+${result.xp}`, label: "XP" } : { value: `+${result.coins}`, label: "xu" };
  return (
    <div className={styles.end}>
      <div className={styles.confetti} aria-hidden="true">
        {Array.from({ length: 26 }, (_, i) => (
          <i key={i} style={{ "--x": `${(i * 37) % 100}%`, "--d": `${(i % 7) * 0.35}s`, "--c": (i % 6) + 1 } as React.CSSProperties} />
        ))}
      </div>

      <div className={styles.hero}>
        <Mascot expr={failed ? "dongvien" : saving ? "suynghi" : "chucmung"} size={280} />
        <div className={styles.bigStars} role="img" aria-label={`${result.stars} trên 3 sao`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={cn(styles.bigStar, n === 2 && styles.bigStarMid)} style={{ "--n": n - 1 } as React.CSSProperties}>
              <Icon name={n <= result.stars ? "star" : "starEmpty"} />
            </span>
          ))}
        </div>
        <h1 className={styles.title}>{saving ? "Xong bài rồi!" : title(result.stars, learnerName, bossLesson)}</h1>
        <p className={styles.sub}>
          {saving ? (
            "Bông đang ghi lại kết quả…"
          ) : bossLesson ? (
            <>
              Bé đã đấu xong trận trùm <b>{unitTitleVi}</b>
            </>
          ) : (
            <>
              Bé đã học xong <b>{unitTitleVi}</b> · {lessonTitle}
            </>
          )}
        </p>
      </div>

      <section className={styles.card} aria-label="Kết quả bài học">
        {failed && (
          <div className={styles.note} role="alert">
            <Icon name="wifi" size={28} />
            <div>
              <b>Chưa lưu được kết quả</b>
              <span>Đừng lo, sao và xu của bé vẫn được giữ trên máy.</span>
            </div>
          </div>
        )}
        <div className={styles.tiles}>
          {saving ? (
            [0, 1, 2].map((i) => <Skeleton key={i} width="100%" height="var(--size-tile-h)" radius="lg" />)
          ) : (
            <>
              <div className={cn(styles.tile, styles.tileCoin)}>
                <Icon name="coin" size={36} />
                <b>{reward.value}</b>
                <span>{reward.label}</span>
              </div>
              <div className={styles.tile}>
                <span className={styles.ok}>
                  <Icon name="check" size={32} />
                </span>
                <b>
                  {result.correct}/{result.total}
                </b>
                <span>câu đúng</span>
              </div>
              <div className={styles.tile}>
                <span className={styles.time}>
                  <Icon name="clock" size={32} />
                </span>
                <b>{result.minutes} phút</b>
                <span>thời gian</span>
              </div>
            </>
          )}
        </div>

        {words.length > 0 && (
          <div className={styles.wordsBox}>
            <h2 className={styles.wordsTitle}>
              Từ vừa học <span>({words.length})</span>
            </h2>
            <ul className={styles.words}>
              {words.map((w) => (
                <li key={w.id} className={styles.wordRow}>
                  <WordPicture word={w.word} src={w.image} size={44} label="" aria-hidden="true" />
                  <SpeakerButton word={w.word} size="s" />
                  <span className={styles.en} lang="en">
                    {w.word}
                  </span>
                  <span className={styles.vi}>{w.meaningVi}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.acts}>
          {result.stars < 3 && !saving && <Button variant="ghost" size="l" icon="replay" label="Làm lại để được 3 sao" onClick={onReplay} />}
          <ButtonLink href={mapHref} variant="secondary" size="l" icon="map" label="Về bản đồ" />
          {failed ? (
            <Button variant="primary" size="l" icon="replay" label="Thử lại" shortcut="Enter" onClick={onRetry} />
          ) : (
            <ButtonLink href={primaryHref} variant="primary" size="l" label={nextHref ? "Bài tiếp theo" : "Về bản đồ"} shortcut="Enter" aria-disabled={saving || undefined} onClick={(event) => saving && event.preventDefault()} />
          )}
        </div>
      </section>
    </div>
  );
}
