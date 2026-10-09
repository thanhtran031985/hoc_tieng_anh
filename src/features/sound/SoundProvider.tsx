"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { SoundSettings } from "@/lib/schemas";
import { configureSound, shutdownSound } from "@/lib/sound";
import { saveSoundSettingsAction } from "./actions";

/** Chờ bé ngừng kéo thanh âm lượng rồi mới lưu một lần. */
const SAVE_DELAY_MS = 400;

type SoundContextValue = {
  sound: SoundSettings;
  /** Đã có tệp nhạc nền chưa; chưa có thì công tắc Nhạc nền mờ đi. */
  musicAvailable: boolean;
  /** Đổi một phần cài đặt: áp dụng ngay, lưu lên server sau một lúc ngắn. */
  setSound: (patch: Partial<SoundSettings>) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

/** Cài đặt âm thanh của hồ sơ đang học. Dùng trong màn có `SoundProvider` bao ngoài. */
export function useSound(): SoundContextValue {
  const value = useContext(SoundContext);
  if (!value) throw new Error("useSound phải nằm trong SoundProvider");
  return value;
}

/**
 * Giữ cài đặt âm thanh của bé trong lúc học (nhạc nền, hiệu ứng, âm lượng). Giá trị đầu lấy từ `learners.settings` do server truyền xuống,
 * nên mọi máy bé dùng đều giống nhau; đổi thì lưu lại bằng server action (chỉ ghi hồ sơ đang chọn của tài khoản đang đăng nhập).
 */
export function SoundProvider({ initial, musicSrc, children }: { initial: SoundSettings; /** Đường dẫn tệp nhạc nền, null nếu chưa có. */ musicSrc: string | null; children: React.ReactNode }) {
  const [sound, setState] = useState(initial);
  const latest = useRef(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    void saveSoundSettingsAction(latest.current);
  }, []);

  const setSound = useCallback(
    (patch: Partial<SoundSettings>) => {
      latest.current = { ...latest.current, ...patch };
      setState(latest.current);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, SAVE_DELAY_MS);
    },
    [flush],
  );

  // Áp dụng cho bộ phát: hiệu ứng theo `soundOn`, nhạc nền theo `musicOn` (chỉ khi có tệp), cùng một âm lượng.
  useEffect(() => {
    configureSound({ sfxOn: sound.soundOn, musicOn: sound.musicOn, volume: sound.volume, musicSrc });
  }, [sound, musicSrc]);
  useEffect(() => shutdownSound, []);

  // Rời màn khi còn thay đổi chưa lưu thì lưu ngay.
  useEffect(
    () => () => {
      if (timer.current) flush();
    },
    [flush],
  );

  const musicAvailable = musicSrc !== null;
  const value = useMemo(() => ({ sound, musicAvailable, setSound }), [sound, musicAvailable, setSound]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
