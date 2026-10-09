"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STORY_WORD_MS, litIndexAt, wordWeights } from "@/lib/rules/lesson-story";
import { playPronunciation, stopPronunciation } from "@/lib/speech";

const READ_RATE = 0.8;

/**
 * Đọc to một đoạn và báo chữ nào đang sáng (đếm từ đầu đoạn). Có tệp mp3 thì chữ sáng theo thời gian thật của tệp (chia theo độ dài chữ,
 * vì giọng đọc không trả mốc từng chữ); không có tệp hoặc tệp lỗi thì đọc bằng giọng trình duyệt và sáng mỗi chữ 420 ms như bản thiết kế.
 */
export function useStoryReader() {
  const [lit, setLit] = useState<number | null>(null);
  const [reading, setReading] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    if (audio.current) {
      audio.current.onended = audio.current.onerror = audio.current.ontimeupdate = null;
      audio.current.pause();
      audio.current = null;
    }
    stopPronunciation();
    setLit(null);
    setReading(false);
  }, []);

  const read = useCallback(
    (text: string, audioUrl: string | null) => {
      stop();
      const weights = wordWeights(text);
      if (weights.length === 0) return;
      setReading(true);

      function timed() {
        let i = 0;
        setLit(0);
        playPronunciation(text, { rate: READ_RATE, audioUrl: null, onEnd: () => undefined });
        timer.current = setInterval(() => {
          i += 1;
          if (i >= weights.length) {
            if (timer.current) clearInterval(timer.current);
            timer.current = null;
            setLit(null);
            setReading(false);
          } else setLit(i);
        }, STORY_WORD_MS);
      }

      if (!audioUrl) return timed();
      const el = new Audio(audioUrl);
      audio.current = el;
      el.ontimeupdate = () => {
        if (el.duration > 0) setLit(litIndexAt(el.currentTime / el.duration, weights));
      };
      el.onended = () => {
        audio.current = null;
        setLit(null);
        setReading(false);
      };
      // Tệp lỗi hoặc bị chặn tự phát: rơi về giọng trình duyệt, bé không thấy lỗi.
      const fallback = () => {
        if (audio.current !== el) return;
        audio.current = null;
        timed();
      };
      el.onerror = fallback;
      el.play().catch(fallback);
    },
    [stop],
  );

  // Rời trang thì ngừng đọc.
  useEffect(() => stop, [stop]);

  return { lit, reading, read, stop };
}
