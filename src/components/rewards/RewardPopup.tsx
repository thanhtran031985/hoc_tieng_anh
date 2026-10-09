"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, Icon, Mascot, SpeakerButton, type IconName } from "@/components/ui";
import { COINS } from "@/lib/rules/constants";
import { playSfx } from "@/lib/sound";
import { playPronunciation, stopPronunciation } from "@/lib/speech";
import { GiftBox } from "./GiftBox";
import { Medal } from "./Medal";
import { Sticker } from "./Sticker";
import styles from "./rewards.module.css";

/** Tốc độ đọc tên phần thưởng, chậm hơn một chút cho bé nghe rõ. */
const NAME_RATE = 0.85;
/** Tiếng xu vang lên sau tiếng mở quà một chút (ms). */
const COIN_DELAY_MS = 700;

type Common = {
  open: boolean;
  /** Tên tiếng Anh (được đọc tự động một lần khi mở quà). */
  en: string;
  /** Nghĩa tiếng Việt. */
  vi: string;
  /** Số xu thưởng; bỏ trống thì theo hằng số (sticker 10, huy hiệu 50). */
  coins?: number;
  /** Bỏ bước hộp quà, mở thẳng phần thưởng (huy hiệu nhận ngay khi đạt điều kiện). */
  skipGift?: boolean;
  /** "Cho vào bộ sưu tập" (Enter hoặc Esc). Cha đặt `open` về false. */
  onAdd: () => void;
};

export type RewardPopupProps = Common &
  (
    | { kind: "sticker"; /** Từ khóa hình của sticker. */ word: string; src?: string | null }
    | { kind: "badge"; icon: IconName; /** Cấp 1–10 để lấy màu huy hiệu. */ level?: number; /** Điều kiện đã đạt, vd "Học 3 ngày liên tiếp". */ cond?: string }
  );

/**
 * Hộp thoại nhận phần thưởng mới (RewardPopup), 2 bước: hộp quà lắc nhẹ → sticker hoặc huy hiệu.
 * Bước 1: bấm hộp, nút "Mở quà", Enter hoặc Esc đều mở (để bé không bỏ lỡ quà). Bước 2: tên tiếng Anh + loa (tự đọc 1 lần),
 * nghĩa, số xu; "Cho vào bộ sưu tập" (Enter, Esc). Chuyển động tắt khi bật giảm chuyển động. Xu chỉ dùng trong trò chơi.
 */
export function RewardPopup(props: RewardPopupProps) {
  const { open, en, vi, skipGift = false, onAdd } = props;
  const isBadge = props.kind === "badge";
  const coins = props.coins ?? (isBadge ? COINS.badge : COINS.stickerLesson);

  // Mỗi lần mở lại thì bắt đầu từ hộp quà (chỉnh trạng thái ngay lúc vẽ, theo cách React khuyên dùng).
  const [opened, setOpened] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setOpened(false);
  }
  const revealed = opened || skipGift;
  const host = useRef<HTMLDivElement>(null);

  // Tên phần thưởng tự đọc đúng một lần khi quà được mở; rời đi thì ngừng đọc.
  useEffect(() => {
    if (!open || !revealed) return;
    // Mở quà: tiếng "pop" rồi tiếng xu; hiệu ứng theo cài đặt âm thanh của bé, giọng đọc luôn chạy.
    playSfx("gift");
    const coinTimer = window.setTimeout(() => playSfx("coin"), COIN_DELAY_MS);
    playPronunciation(en, { rate: NAME_RATE });
    // Đưa focus vào nút chính của bước mới (nút của bước trước đã biến mất).
    host.current?.querySelector<HTMLElement>("[data-dialog-action='0']")?.focus({ preventScroll: true });
    return () => {
      window.clearTimeout(coinTimer);
      stopPronunciation();
    };
  }, [open, revealed, en]);

  const reveal = () => setOpened(true);

  if (!revealed) {
    return (
      <div ref={host} style={{ display: "contents" }}>
        <Dialog
          open={open}
          onClose={reveal}
          size="reward"
          closeOnBackdrop={false}
          art={
            <span className={styles.top}>
              <button type="button" className={styles.giftbtn} aria-label="Mở hộp quà" onClick={reveal}>
                <GiftBox size={150} />
              </button>
            </span>
          }
          title={isBadge ? "Cậu nhận được một huy hiệu!" : "Cậu nhận được một món quà!"}
          body="Bấm vào hộp quà hoặc nhấn Enter để mở."
          actions={[{ label: "Mở quà", variant: "primary", shortcut: "Enter", icon: "gift", onClick: reveal, keepOpen: true }]}
        />
      </div>
    );
  }

  return (
    <div ref={host} style={{ display: "contents" }}>
      <Dialog
        open={open}
        onClose={onAdd}
        size="reward"
        closeOnBackdrop={false}
        art={
          <span className={styles.top}>
            <span className={styles.glow} aria-hidden="true" />
            {props.kind === "badge" ? (
              <Medal icon={props.icon} level={props.level ?? 3} size={150} />
            ) : (
              <span className={styles.stickerBig}>
                <Sticker word={props.word} src={props.src} label={`Sticker ${en}, ${vi}`} />
              </span>
            )}
            <Mascot expr="chucmung" size={110} />
          </span>
        }
        title={isBadge ? "Huy hiệu mới!" : "Sticker mới!"}
        body={
          <>
            <span className={styles.name}>
              <b lang="en">{en}</b>
              <SpeakerButton word={en} size="s" rate={NAME_RATE} />
            </span>
            <p className={styles.meaning}>
              {vi}
              {props.kind === "badge" && props.cond ? ` · ${props.cond}` : ""}
            </p>
            <span className={styles.coin}>
              <Icon name="coin" size={26} />
              <b>+{coins}</b> xu thưởng
            </span>
          </>
        }
        actions={[{ label: "Cho vào bộ sưu tập", variant: "primary", shortcut: "Enter", icon: "gem", onClick: onAdd, keepOpen: true }]}
      />
    </div>
  );
}
