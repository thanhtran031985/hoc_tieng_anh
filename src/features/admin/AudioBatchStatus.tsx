"use client";

import { AdultButton, adultStyles } from "@/components/adult";
import { cn } from "@/lib/cn";
import type { AudioBatchState } from "./useAudioBatch";
import styles from "./audio.module.css";

const nf = (n: number) => n.toLocaleString("vi-VN");

/** Thanh tiến trình tạo giọng đọc hàng loạt: số mục đã xong, nút Dừng, kết quả và danh sách mục lỗi. */
export function AudioBatchStatus({ state, onStop, unit = "từ" }: { state: AudioBatchState; onStop: () => void; unit?: string }) {
  if (state.phase === "idle") return null;
  const busy = state.phase === "run" || state.phase === "stopping";
  const summary = `Đã xử lý ${nf(state.done)}/${nf(state.total)} ${unit} · tạo mới ${nf(state.made)} · đã có sẵn ${nf(state.skipped)} · lỗi ${nf(state.errors.length)}`;
  return (
    <div className={styles.status} role="status" aria-live="polite">
      <div className={styles.row}>
        <progress className={styles.prog} value={state.done} max={Math.max(1, state.total)} aria-label="Tiến trình tạo giọng đọc" />
        {busy && <AdultButton label={state.phase === "stopping" ? "Đang dừng…" : "Dừng"} icon="close" variant="secondary" size="s" disabled={state.phase === "stopping"} onClick={onStop} />}
      </div>
      <span className={cn(adultStyles.small, adultStyles.muted)}>
        {summary}
        {state.phase === "done" && (state.stopped ? " · Đã dừng. Bấm tạo lại để làm tiếp, mục đã có sẽ được bỏ qua." : state.message ? "" : " · Xong.")}
      </span>
      {state.message && (
        <p className={cn(adultStyles.small, styles.err)} role="alert">
          {state.message}
        </p>
      )}
      {state.errors.length > 0 && (
        <ul className={styles.errors} aria-label={`Các ${unit} chưa tạo được`}>
          {state.errors.map((e) => (
            <li key={e.id} className={adultStyles.small}>
              <b lang="en">{e.word}</b>: {e.message ?? "Chưa tạo được."}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
