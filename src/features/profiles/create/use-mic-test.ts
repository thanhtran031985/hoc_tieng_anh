"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Kiểm tra micro: xin quyền, đo mức âm lượng bằng AnalyserNode, báo "nghe thấy rồi" khi có tiếng.
// Không ghi âm và không gửi âm thanh đi đâu: chỉ đọc mức âm lượng rồi tắt micro.

export type MicStatus = "idle" | "listening" | "heard" | "unavailable";

const HEARD_LEVEL = 0.12; // mức âm lượng coi là có tiếng (0–1)
const HEARD_COUNT = 8; // số khung hình có tiếng cần có trong khoảng HEARD_WINDOW_MS (tiếng nói ngắt quãng vẫn tính)
const HEARD_WINDOW_MS = 2500;

export function useMicTest() {
  const [status, setStatus] = useState<MicStatus>("idle");
  const [level, setLevel] = useState(0);
  const cleanupRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setLevel(0);
  }, []);

  const start = useCallback(async () => {
    stop();
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unavailable");
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setStatus("unavailable");
      return;
    }
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    context.createMediaStreamSource(stream).connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    let frame = 0;
    const loudAt: number[] = [];
    let stopped = false;

    const tick = () => {
      if (stopped) return;
      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (const value of samples) sum += ((value - 128) / 128) ** 2;
      const rms = Math.min(1, Math.sqrt(sum / samples.length) * 4);
      setLevel(rms);
      const now = performance.now();
      if (rms >= HEARD_LEVEL) loudAt.push(now);
      while (loudAt.length > 0 && now - loudAt[0] > HEARD_WINDOW_MS) loudAt.shift();
      if (loudAt.length >= HEARD_COUNT) {
        setStatus("heard");
        cleanupRef.current?.();
        cleanupRef.current = null;
        setLevel(0);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    cleanupRef.current = () => {
      stopped = true;
      cancelAnimationFrame(frame);
      stream.getTracks().forEach((track) => track.stop());
      void context.close();
    };
    setStatus("listening");
    frame = requestAnimationFrame(tick);
  }, [stop]);

  const reset = useCallback(() => {
    stop();
    setStatus("idle");
  }, [stop]);

  // Rời màn thì tắt micro.
  useEffect(() => () => cleanupRef.current?.(), []);

  return { status, level, start, stop, reset };
}
