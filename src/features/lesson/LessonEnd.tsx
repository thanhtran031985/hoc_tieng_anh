"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BossArt } from "@/components/lesson";
import { GiftBox, RewardPopup, Sticker } from "@/components/rewards";
import { Button, ButtonLink, Icon, Mascot, Skeleton, SpeakerButton, WordPicture } from "@/components/ui";
import type { Boss } from "@/lib/rules/bosses";
import boss from "./boss/boss.module.css";
import { cn } from "@/lib/cn";
import type { PlayWord } from "@/lib/rules/lesson-play";
import { useHotkeys } from "@/lib/use-hotkeys";
import type { LessonCompletion, OpenedReward } from "@/lib/schemas";
import { openRewardAction } from "@/features/rewards/actions";
import { EarnedBadgePopups } from "@/features/rewards/EarnedBadgePopups";
import styles from "./lesson-end.module.css";

export type SaveState = { status: "idle" } | { status: "ok"; completion: LessonCompletion } | { status: "error"; message: string };

type Props = {
  learnerName: string;
  unitTitleVi: string;
  lessonTitle: string;
  bossLesson: boolean;
  /** Trùm của trận vừa đấu (khi `bossLesson`): hiện trùm làm bạn với bé. */
  bossInfo?: Pick<Boss, "name" | "accessory" | "fur"> | null;
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
export function LessonEnd({ learnerName, unitTitleVi, lessonTitle, bossLesson, bossInfo = null, preview, words, mapHref, save, onRetry, onReplay }: Props) {
  const saving = save.status === "idle";
  const failed = save.status === "error";
  const result = save.status === "ok" ? save.completion : preview;
  const nextHref = save.status === "ok" && save.completion.nextLessonId !== null ? `/lesson/${save.completion.nextLessonId}` : null;
  const primaryHref = nextHref ?? mapHref;

  const router = useRouter();
  // Quà sticker bất ngờ (Screen40): hộp quà cạnh Bông; mở bằng Enter hoặc bấm hộp; xu thưởng cộng khi mở. Huy hiệu thành tích hiện hộp nhận quà trước.
  const gift = save.status === "ok" ? (save.completion.gift ?? null) : null;
  const earned = save.status === "ok" ? (save.completion.badges ?? []) : [];
  const [opened, setOpened] = useState<OpenedReward | null>(null);
  const [popup, setPopup] = useState(false);
  const [giftBusy, setGiftBusy] = useState(false);
  const [giftError, setGiftError] = useState<string | null>(null);
  const [badgesDone, setBadgesDone] = useState(false);
  const badgesBlocking = earned.length > 0 && !badgesDone;
  const giftWaiting = gift !== null && opened === null;

  async function openGift() {
    if (!gift || opened || giftBusy || badgesBlocking) return;
    setGiftBusy(true);
    setGiftError(null);
    try {
      const res = await openRewardAction({ id: gift.id });
      if (res.ok) {
        setOpened(res.reward);
        setPopup(true);
      } else setGiftError(res.message);
    } catch {
      setGiftError("Mất kết nối. Bé thử mở lại nhé, quà vẫn được giữ!");
    }
    setGiftBusy(false);
  }

  // Enter: mở quà nếu còn quà chưa mở, đi tiếp khi đã lưu xong, hoặc Thử lại khi lưu lỗi (nút chính ghi nhãn Enter).
  useHotkeys({ Enter: () => (failed ? onRetry() : giftWaiting ? void openGift() : router.push(primaryHref)) }, { enabled: !saving && !popup && !badgesBlocking });

  const coinsShown = result.coins + (opened?.coins ?? 0);
  const reward = result.xp > 0 ? { value: `+${result.xp}`, label: "XP" } : { value: `+${coinsShown}`, label: "xu" };
  return (
    <div className={styles.end}>
      <div className={styles.confetti} aria-hidden="true">
        {Array.from({ length: 26 }, (_, i) => (
          <i key={i} style={{ "--x": `${(i * 37) % 100}%`, "--d": `${(i % 7) * 0.35}s`, "--c": (i % 6) + 1 } as React.CSSProperties} />
        ))}
      </div>

      <div className={styles.hero}>
        {bossLesson && bossInfo ? (
          <div className={boss.pair}>
            <BossArt boss={bossInfo} mood="friend" size={220} />
            <Mascot expr={failed ? "dongvien" : saving ? "suynghi" : "chucmung"} size={190} />
            {gift && <GiftSlot gift={gift} opened={opened} busy={giftBusy || badgesBlocking} onOpen={() => void openGift()} />}
          </div>
        ) : gift ? (
          <div className={styles.duo}>
            <Mascot expr="chucmung" size={230} />
            <GiftSlot gift={gift} opened={opened} busy={giftBusy || badgesBlocking} onOpen={() => void openGift()} />
          </div>
        ) : (
          <Mascot expr={failed ? "dongvien" : saving ? "suynghi" : "chucmung"} size={280} />
        )}
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
              {bossInfo ? (
                <>
                  <b>{bossInfo.name}</b> cười toe: “Cậu thắng rồi! Từ nay mình là bạn nhé!”
                </>
              ) : (
                <>
                  Bé đã đấu xong trận trùm <b>{unitTitleVi}</b>
                </>
              )}
            </>
          ) : (
            <>
              Bé đã học xong <b>{unitTitleVi}</b> · {lessonTitle}
            </>
          )}
        </p>
        {giftError && (
          <p className={styles.giftError} role="alert">
            {giftError}
          </p>
        )}
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

        {!saving && result.badge && (
          <div className={boss.badge} role="status">
            <Icon name="medal" size={32} />
            <span>
              {result.badge.isNew ? "Huy hiệu mới: " : "Huy hiệu của bé: "}
              <b>{result.badge.name}</b>
            </span>
          </div>
        )}

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
          ) : giftWaiting ? (
            <Button variant="primary" size="l" icon="gift" data-end-next="" label={giftBusy ? "Đang mở…" : "Mở quà"} shortcut="Enter" disabled={giftBusy || badgesBlocking} onClick={() => void openGift()} />
          ) : (
            <ButtonLink href={primaryHref} data-end-next="" variant="primary" size="l" label={nextHref ? "Bài tiếp theo" : "Về bản đồ"} shortcut="Enter" aria-disabled={saving || undefined} onClick={(event) => saving && event.preventDefault()} />
          )}
        </div>
      </section>

      <EarnedBadgePopups badges={earned} onDone={() => setBadgesDone(true)} />
      {gift && (
        <RewardPopup
          open={popup}
          kind="sticker"
          word={gift.key}
          src={gift.image}
          en={gift.en}
          vi={gift.vi}
          coins={opened?.coins ?? gift.coins}
          skipGift
          onAdd={() => {
            setPopup(false);
            window.setTimeout(() => document.querySelector<HTMLElement>("[data-end-next]")?.focus({ preventScroll: true }), 0);
          }}
        />
      )}
    </div>
  );
}

/** Hộp quà bất ngờ cạnh Bông (lắc nhẹ); mở rồi thì sticker nằm lại với tên, loa và album đã dán. */
function GiftSlot({ gift, opened, busy, onOpen }: { gift: NonNullable<LessonCompletion["gift"]>; opened: OpenedReward | null; busy: boolean; onOpen: () => void }) {
  if (opened) {
    return (
      <div className={styles.got}>
        <Sticker word={gift.key} src={gift.image} size={110} tilt={-5} label={`Sticker ${gift.en}, ${gift.vi}`} />
        <span className={styles.gotName}>
          <SpeakerButton word={gift.en} size="s" />
          <b lang="en">{gift.en}</b>
        </span>
        <span className={styles.gotAlbum}>Đã dán vào album {opened.albumVi || gift.albumVi}</span>
      </div>
    );
  }
  return (
    <div className={styles.surprise}>
      <span className={styles.tag}>
        <Icon name="gift" size={18} />
        Quà bất ngờ!
      </span>
      <button type="button" className={styles.giftBtn} aria-label="Mở hộp quà bất ngờ (Enter)" disabled={busy} onClick={onOpen}>
        <GiftBox size={150} />
      </button>
    </div>
  );
}
