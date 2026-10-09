"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent } from "react";
import { Icon, IconButton } from "@/components/ui";
import type { SoundSettings } from "@/lib/schemas";
import styles from "./LessonTools.module.css";

/** Bước chỉnh âm lượng khi bấm ← →. */
const VOLUME_STEP = 10;

export type LessonToolsProps = {
  /** Đang ở chế độ học tập trung. */
  focus: boolean;
  onToggleFocus: () => void;
  sound: SoundSettings;
  onSoundChange: (patch: Partial<SoundSettings>) => void;
  /** false khi chưa có tệp nhạc nền: công tắc Nhạc nền mờ đi kèm chú thích. */
  musicAvailable?: boolean;
};

/** Nhãn "Đang học tập trung · Esc để thoát" hiện trên đầu khung bài khi bật chế độ này. */
export function FocusBadge() {
  return (
    <span className={styles.badge} role="status">
      <Icon name="expand" size={16} />
      Đang học tập trung · Esc để thoát
    </span>
  );
}

function Switch({ id, label, sub, checked, disabled, onChange }: { id: string; label: string; sub: string; checked: boolean; disabled?: boolean; onChange: (on: boolean) => void }) {
  return (
    <div className={styles.row} data-disabled={disabled ? "true" : undefined}>
      <span>
        <b id={`${id}-l`}>{label}</b>
        <small>{sub}</small>
      </span>
      <button type="button" role="switch" className={styles.switch} id={id} aria-checked={checked} aria-labelledby={`${id}-l`} disabled={disabled} onClick={() => onChange(!checked)}>
        <i />
      </button>
    </div>
  );
}

/**
 * Hai nút tròn trên đầu khung bài học (Bong.LessonTools): Học tập trung (F) và Âm thanh.
 * Bảng âm thanh mở dưới nút loa: công tắc Nhạc nền, Hiệu ứng và thanh kéo Âm lượng (← → mỗi 10%). Giọng đọc tiếng Anh luôn bật.
 * Esc hoặc Tab ra ngoài thì đóng bảng. Phím trong bảng không lọt ra phím tắt của bài học.
 */
export function LessonTools({ focus, onToggleFocus, sound, onSoundChange, musicAvailable = true }: LessonToolsProps) {
  const [open, setOpen] = useState(false);
  const soundBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const sfxOn = sound.soundOn;
  const musicOn = sound.musicOn && musicAvailable;

  // Mở bảng thì đưa focus vào công tắc đầu tiên dùng được.
  useEffect(() => {
    if (open) panel.current?.querySelector<HTMLElement>("button:not(:disabled), input")?.focus({ preventScroll: true });
  }, [open]);

  function close(back: boolean) {
    setOpen(false);
    if (back) soundBtn.current?.focus({ preventScroll: true });
  }

  function onPanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // Mọi phím trong bảng chỉ dành cho bảng, không chạy phím tắt của bài học (Space, Enter, ←, →, Esc…).
    event.stopPropagation();
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    }
  }

  function onPanelBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (next instanceof Node && (panel.current?.contains(next) || soundBtn.current?.contains(next))) return;
    setOpen(false);
  }

  return (
    <div className={styles.tools} role="group" aria-label="Công cụ bài học" data-hotkey-skip>
      <IconButton
        className={styles.btn}
        icon={focus ? "shrink" : "expand"}
        iconSize={24}
        label={focus ? "Thoát học tập trung (Esc)" : "Học tập trung, toàn màn hình (F)"}
        title={focus ? "Thoát học tập trung (Esc)" : "Học tập trung (F)"}
        aria-pressed={focus}
        aria-keyshortcuts="F"
        onClick={onToggleFocus}
        data-focusmode
      />
      <IconButton
        ref={soundBtn}
        className={styles.btn}
        icon={musicOn || sfxOn ? "volume" : "mute"}
        iconSize={24}
        label="Âm thanh"
        title="Âm thanh"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? close(false) : setOpen(true))}
        data-soundbtn
      />
      {open && (
        <div ref={panel} className={styles.panel} role="dialog" aria-label="Âm thanh" onKeyDown={onPanelKeyDown} onBlur={onPanelBlur} data-sndpanel>
          <h2 className={styles.title}>Âm thanh</h2>
          <Switch
            id={`${id}-music`}
            label="Nhạc nền"
            sub={musicAvailable ? "Nhạc nhẹ khi học" : "Chưa có nhạc nền"}
            checked={musicOn}
            disabled={!musicAvailable}
            onChange={(on) => onSoundChange({ musicOn: on })}
          />
          <Switch id={`${id}-sfx`} label="Hiệu ứng" sub="Tiếng đúng, sai, sao bay" checked={sfxOn} onChange={(on) => onSoundChange({ soundOn: on })} />
          <div>
            <label className={styles.volLabel} htmlFor={`${id}-vol`}>
              <b>Âm lượng</b>
              <output htmlFor={`${id}-vol`}>{sound.volume}%</output>
            </label>
            <input
              id={`${id}-vol`}
              type="range"
              className={styles.range}
              min={0}
              max={100}
              step={VOLUME_STEP}
              value={sound.volume}
              style={{ "--v": `${sound.volume}%` } as CSSProperties}
              onChange={(event) => onSoundChange({ volume: Number(event.target.value) })}
            />
          </div>
          <p className={styles.note}>Giọng đọc tiếng Anh luôn bật để cậu nghe từ.</p>
        </div>
      )}
    </div>
  );
}
