"use client";

import { useEffect, useRef, useState, type ComponentProps, type MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { playPronunciation, type SpeechAccent } from "@/lib/speech";
import { Icon } from "../Icon/Icon";
import styles from "./SpeakerButton.module.css";

export type SpeakerButtonSize = "l" | "m" | "s";

export type SpeakerButtonProps = Omit<ComponentProps<"button">, "children" | "aria-label"> & {
  /** Chuỗi tiếng Anh sẽ được đọc. */
  word: string;
  /** l = 112 (câu hỏi nghe, một lần mỗi màn) · m = 56 (thẻ từ) · s = 40 (cạnh từ, sổ từ, dải phản hồi) */
  size?: SpeakerButtonSize;
  /** aria-label, mặc định "Nghe: <word>". */
  label?: string;
  /** Tệp mp3 của từ (nếu có); không có thì dùng giọng đọc của trình duyệt. */
  audioUrl?: string | null;
  /** Giọng Mỹ hoặc Anh, theo cài đặt của hồ sơ. */
  accent?: SpeechAccent;
  /** Tốc độ đọc (giọng trình duyệt). */
  rate?: number;
};

const ICON_SIZE: Record<SpeakerButtonSize, number> = { l: 52, m: 28, s: 22 };

/** Nút loa tròn: bấm để nghe, khi đang phát có vòng sóng lan ra. Đặt bên trái từ tiếng Anh, cách `space-3`. */
export function SpeakerButton({
  word,
  size = "s",
  label,
  audioUrl,
  accent,
  rate,
  className,
  onClick,
  type = "button",
  ...rest
}: SpeakerButtonProps) {
  const [playing, setPlaying] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  // Rời khỏi màn thì ngừng đọc.
  useEffect(() => () => stopRef.current?.(), []);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    stopRef.current?.();
    setPlaying(true);
    stopRef.current = playPronunciation(word, { audioUrl, accent, rate, onEnd: () => setPlaying(false) });
  }

  return (
    <button
      type={type}
      className={cn(styles.speak, styles[size], className)}
      aria-label={label ?? `Nghe: ${word}`}
      data-playing={playing ? "true" : undefined}
      onClick={handleClick}
      {...rest}
    >
      <Icon name="speaker" size={ICON_SIZE[size]} />
    </button>
  );
}
