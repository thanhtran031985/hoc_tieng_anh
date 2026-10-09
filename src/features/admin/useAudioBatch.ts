"use client";

import { useRef, useState } from "react";
import { chunk, TTS_UI_BATCH_SIZE } from "@/lib/rules/tts";
import type { AudioItemResult } from "@/lib/schemas";
import { generateAudioAction } from "./audio-actions";

export type AudioBatchState = {
  /** idle: chưa chạy · run: đang tạo · stopping: đã bấm Dừng, chờ lượt hiện tại xong · done: xong hoặc đã dừng. */
  phase: "idle" | "run" | "stopping" | "done";
  total: number;
  done: number;
  made: number;
  skipped: number;
  /** Các mục lỗi (một mục lỗi không làm hỏng cả lượt). */
  errors: AudioItemResult[];
  /** Lỗi chung làm dừng cả lượt (chưa bật công tắc, máy chủ chưa có công cụ…). */
  message: string | null;
  stopped: boolean;
};

const IDLE: AudioBatchState = { phase: "idle", total: 0, done: 0, made: 0, skipped: 0, errors: [], message: null, stopped: false };

/**
 * Tạo giọng đọc theo từng lượt nhỏ (`TTS_UI_BATCH_SIZE` từ mỗi lần gọi), có tiến trình và nút Dừng.
 * Bấm Dừng thì lượt đang chạy làm nốt rồi dừng; chạy lại thì bỏ qua mục đã có tệp (trừ khi `force`).
 */
export function useAudioBatch(onFinish?: () => void) {
  const [state, setState] = useState<AudioBatchState>(IDLE);
  const stopRef = useRef(false);
  const runningRef = useRef(false);

  async function start(ids: readonly number[], force = false): Promise<void> {
    if (runningRef.current || ids.length === 0) return;
    runningRef.current = true;
    stopRef.current = false;
    let next: AudioBatchState = { ...IDLE, phase: "run", total: ids.length };
    setState(next);
    for (const group of chunk(ids, TTS_UI_BATCH_SIZE)) {
      if (stopRef.current) break;
      const result = await generateAudioAction({ wordIds: group, force });
      if (!result.ok) {
        next = { ...next, message: result.message };
        break;
      }
      next = {
        ...next,
        done: next.done + group.length,
        made: next.made + result.items.filter((i) => i.status === "made").length,
        skipped: next.skipped + result.items.filter((i) => i.status === "skipped").length,
        errors: [...next.errors, ...result.items.filter((i) => i.status === "error")],
      };
      setState({ ...next, phase: stopRef.current ? "stopping" : "run" });
    }
    next = { ...next, phase: "done", stopped: stopRef.current && next.done < next.total };
    setState(next);
    runningRef.current = false;
    onFinish?.();
  }

  function stop(): void {
    if (!runningRef.current) return;
    stopRef.current = true;
    setState((s) => (s.phase === "run" ? { ...s, phase: "stopping" } : s));
  }

  return { state, start, stop, reset: () => setState(IDLE), busy: state.phase === "run" || state.phase === "stopping" };
}
