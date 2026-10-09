"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { REC_MAX_MS, micProblem, pickRecorderMime, recordingExt, type MicProblem } from "@/lib/rules/recording";

export type RecorderState = "idle" | "starting" | "recording" | MicProblem;
export type Recorded = { blob: Blob; ms: number; mime: string; ext: ReturnType<typeof recordingExt> };

/** Máy có thể ghi âm không: có `MediaRecorder` và `getUserMedia`. Chưa biết có micro thật hay không (chỉ biết khi xin quyền). */
export function canRecord(): boolean {
  return typeof window !== "undefined" && typeof MediaRecorder !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
}

/** Máy có cổng thu âm không (liệt kê thiết bị; không cần quyền). Không liệt kê được thì coi là có, để xin quyền thử. */
export async function hasMicrophone(): Promise<boolean> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.length === 0 || devices.some((d) => d.kind === "audioinput");
  } catch {
    return true;
  }
}

/**
 * Ghi âm bằng MediaRecorder, tối đa `REC_MAX_MS` (10 giây) rồi tự dừng. `onFinish` được gọi đúng một lần mỗi lần ghi, khi đã có tệp.
 * Trạng thái: idle → starting (chờ bé cho phép micro) → recording → idle; hoặc denied (chặn micro), nomic (không có micro), error.
 */
export function useRecorder(onFinish: (recorded: Recorded) => void) {
  const [state, setState] = useState<RecorderState>("idle");
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finish = useRef(onFinish);
  useEffect(() => {
    finish.current = onFinish;
  });

  const release = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
  }, []);

  const stop = useCallback(() => {
    if (recorder.current && recorder.current.state !== "inactive") recorder.current.stop();
  }, []);

  const start = useCallback(async () => {
    if (state === "starting" || state === "recording") return;
    if (!canRecord()) return setState("nomic");
    setState("starting");
    let media: MediaStream;
    try {
      media = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      return setState(micProblem(error));
    }
    const mime = pickRecorderMime((m) => MediaRecorder.isTypeSupported(m));
    if (!mime) {
      media.getTracks().forEach((t) => t.stop());
      return setState("nomic");
    }
    stream.current = media;
    const chunks: Blob[] = [];
    const rec = new MediaRecorder(media, { mimeType: mime });
    recorder.current = rec;
    const startedAt = performance.now();
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    rec.onstop = () => {
      const ms = Math.round(performance.now() - startedAt);
      release();
      recorder.current = null;
      setState("idle");
      if (chunks.length > 0) finish.current({ blob: new Blob(chunks, { type: mime }), ms: Math.min(ms, REC_MAX_MS), mime, ext: recordingExt(mime) });
    };
    rec.onerror = () => {
      release();
      recorder.current = null;
      setState("error");
    };
    rec.start();
    setState("recording");
    timer.current = setTimeout(stop, REC_MAX_MS);
  }, [state, release, stop]);

  // Rời màn thì thả micro, không gọi onFinish.
  useEffect(
    () => () => {
      if (recorder.current) {
        recorder.current.onstop = null;
        if (recorder.current.state !== "inactive") recorder.current.stop();
      }
      release();
    },
    [release],
  );

  return { state, start, stop, reset: () => setState("idle"), toggle: () => (state === "recording" ? stop() : void start()) };
}
