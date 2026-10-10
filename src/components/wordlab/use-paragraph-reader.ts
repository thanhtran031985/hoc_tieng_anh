"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { READ_WORD_MS, WORDLAB } from "@/lib/rules/constants";
import { litIndexAt, wordWeights } from "@/lib/rules/lesson-story";
import { splitSentence } from "@/lib/rules/sentence-words";
import { playPronunciation, stopPronunciation, type SpeechAccent } from "@/lib/speech";

type Options = {
  /** Các câu tiếng Anh của đoạn, theo thứ tự. */
  sentences: readonly string[];
  /** Tệp mp3 đọc cả đoạn (nếu có): đọc cả đoạn thì chữ sáng theo thời gian của tệp; câu lẻ và đọc tiếp giữa chừng dùng giọng trình duyệt. */
  audioUrl?: string | null;
  accent?: SpeechAccent;
  /** Gọi khi đọc xong cả đoạn từ đầu đến cuối. */
  onDone?: () => void;
};

/** Tỉ lệ phát lại của tệp mp3 khi bật "Đọc chậm" (giọng chậm chia giọng thường). */
const SLOW_PLAYBACK = WORDLAB.readRateSlow / WORDLAB.readRate;

/**
 * Đọc cả đoạn có chữ sáng (ReadAloudParagraph): đọc/tạm dừng/đọc tiếp, đọc chậm, đọc riêng từng câu. Chữ sáng đếm từ đầu đoạn
 * (chỉ chữ có chữ cái, cùng cách đếm với `ClickableWords`). Giọng trình duyệt không báo mốc từng chữ nên chữ sáng chạy theo giờ
 * (420 ms mỗi chữ, 640 ms khi chậm); có tệp mp3 thì sáng theo tỉ lệ độ dài chữ.
 */
export function useParagraphReader({ sentences, audioUrl = null, accent, onDone }: Options) {
  const [lit, setLit] = useState<number | null>(null);
  const [reading, setReading] = useState(false);
  /** Câu đang được đọc (để tô nền câu); null khi không đọc. */
  const [sentence, setSentence] = useState<number | null>(null);
  /** Đã tạm dừng giữa chừng: nút hiện "Đọc tiếp". */
  const [paused, setPaused] = useState(false);

  const model = useMemo(() => {
    const tokens = sentences.map((s) => splitSentence(s).filter((t) => t.word !== "").map((t) => `${t.core}${t.punct}`));
    const starts: number[] = [];
    let total = 0;
    for (const t of tokens) {
      starts.push(total);
      total += t.length;
    }
    return { tokens: tokens.flat(), starts, total, weights: wordWeights(sentences.join(" ")) };
  }, [sentences]);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  /** Chữ sẽ đọc tiếp khi bấm "Đọc tiếp". */
  const resumeAt = useRef(0);
  /** Chữ cuối (không tính) của lượt đọc bằng giọng trình duyệt đang chạy. */
  const rangeEnd = useRef(0);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  const sentenceOf = useCallback(
    (word: number) => {
      let index = 0;
      model.starts.forEach((start, i) => {
        if (word >= start) index = i;
      });
      return index;
    },
    [model.starts],
  );

  const halt = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    if (audio.current) {
      audio.current.onended = audio.current.onerror = audio.current.ontimeupdate = null;
      audio.current.pause();
      audio.current = null;
    }
    stopPronunciation();
  }, []);

  const idle = useCallback(() => {
    setLit(null);
    setSentence(null);
    setReading(false);
  }, []);

  /** Đọc các chữ [from, to) bằng giọng trình duyệt, chữ sáng chạy theo giờ. */
  const timedRun = useCallback(
    (from: number, to: number, slow: boolean) => {
      halt();
      if (to <= from) return;
      rangeEnd.current = to;
      setPaused(false);
      setReading(true);
      let i = from;
      setLit(from);
      setSentence(sentenceOf(from));
      playPronunciation(model.tokens.slice(from, to).join(" "), { accent, rate: slow ? WORDLAB.readRateSlow : WORDLAB.readRate, audioUrl: null });
      timer.current = setInterval(
        () => {
          i += 1;
          if (i >= to) {
            halt();
            idle();
            resumeAt.current = 0;
            if (from === 0 && to === model.total) doneRef.current?.();
            return;
          }
          resumeAt.current = i;
          setLit(i);
          setSentence(sentenceOf(i));
        },
        slow ? READ_WORD_MS.slow : READ_WORD_MS.normal,
      );
    },
    [accent, halt, idle, model.tokens, model.total, sentenceOf],
  );

  const audioRun = useCallback(
    (slow: boolean) => {
      if (!audioUrl) return false;
      halt();
      setPaused(false);
      const el = new Audio(audioUrl);
      el.playbackRate = slow ? SLOW_PLAYBACK : 1;
      audio.current = el;
      setReading(true);
      el.ontimeupdate = () => {
        if (el.duration > 0) {
          const index = litIndexAt(el.currentTime / el.duration, model.weights);
          setLit(index);
          setSentence(index === null ? null : sentenceOf(index));
          if (index !== null) resumeAt.current = index;
        }
      };
      el.onended = () => {
        audio.current = null;
        idle();
        resumeAt.current = 0;
        doneRef.current?.();
      };
      // Tệp lỗi hoặc bị chặn tự phát: rơi về giọng trình duyệt, bé không thấy lỗi.
      const fallback = () => {
        if (audio.current !== el) return;
        audio.current = null;
        timedRun(0, model.total, slow);
      };
      el.onerror = fallback;
      el.play().catch(fallback);
      return true;
    },
    [audioUrl, halt, idle, model.total, model.weights, sentenceOf, timedRun],
  );

  const pause = useCallback(() => {
    if (audio.current) audio.current.pause();
    else halt();
    setReading(false);
    setPaused(true);
  }, [halt]);

  /** Đọc cả đoạn / tạm dừng / đọc tiếp (phím P). */
  const toggle = useCallback(
    (slow: boolean) => {
      if (reading) return pause();
      if (audio.current) {
        setPaused(false);
        setReading(true);
        audio.current.playbackRate = slow ? SLOW_PLAYBACK : 1;
        void audio.current.play();
        return;
      }
      const from = resumeAt.current > 0 && resumeAt.current < model.total ? resumeAt.current : 0;
      if (from === 0 && audioRun(slow)) return;
      timedRun(from, model.total, slow);
    },
    [audioRun, model.total, pause, reading, timedRun],
  );

  /** Nghe riêng câu `index`. */
  const readSentence = useCallback(
    (index: number, slow: boolean) => {
      resumeAt.current = 0;
      timedRun(model.starts[index] ?? 0, index + 1 < model.starts.length ? model.starts[index + 1] : model.total, slow);
    },
    [model.starts, model.total, timedRun],
  );

  /** Bật/tắt "Đọc chậm" khi đang đọc: tiếp tục từ chữ hiện tại với tốc độ mới. */
  const changeSpeed = useCallback(
    (slow: boolean) => {
      if (audio.current) audio.current.playbackRate = slow ? SLOW_PLAYBACK : 1;
      else if (reading) timedRun(Math.max(0, (lit ?? 0) - 1), rangeEnd.current, slow);
    },
    [lit, reading, timedRun],
  );

  const stop = useCallback(() => {
    halt();
    idle();
    setPaused(false);
    resumeAt.current = 0;
  }, [halt, idle]);

  // Rời trang thì ngừng đọc.
  useEffect(() => stop, [stop]);

  return { lit, sentence, reading, paused, toggle, readSentence, changeSpeed, stop };
}
