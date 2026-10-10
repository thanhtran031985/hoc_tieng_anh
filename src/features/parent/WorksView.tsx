"use client";

import { useRef, useState } from "react";
import { AdultButton, AdultCard, AdultCardHead, AdultDialog, AdultEmpty, AdultGrid, AdultSegmented, Status, adultStyles, useToast } from "@/components/adult";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { APP_TIME_ZONE } from "@/lib/rules/dates";
import { clockOfDay, formatClock, groupRecordingsByDay } from "@/lib/rules/recording";
import type { RecordingRow } from "@/server/recordings";
import { deleteRecordingAction } from "./works-actions";
import styles from "./works.module.css";

type Filter = "all" | "again";
type Speed = "1" | "0.75";

function Stars({ n }: { n: number }) {
  return (
    <span className={styles.stars} role="img" aria-label={`${n} trên 3 sao`}>
      {[1, 2, 3].map((i) => (
        <Icon key={i} name={i <= n ? "star" : "starEmpty"} size={16} />
      ))}
    </span>
  );
}

const whenFormat = new Intl.DateTimeFormat("vi-VN", { timeZone: APP_TIME_ZONE, day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

/** Bài viết & ghi âm của con (Adult05), phần ghi âm: nghe lại giọng con, xem điểm Bông chấm, xóa. Phần bài viết để “Sắp có” (GĐ3). */
export function WorksView({ kidName, recordings, now }: { kidName: string; recordings: RecordingRow[]; now: string }) {
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const [pickedId, setPickedId] = useState<number | null>(null);
  const [removing, setRemoving] = useState<RecordingRow | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const again = recordings.filter((r) => r.stars === 1).length;
  const shown = filter === "again" ? recordings.filter((r) => r.stars === 1) : recordings;
  const groups = groupRecordingsByDay(shown, new Date(now));
  const current = shown.find((r) => r.id === pickedId) ?? shown[0] ?? null;

  if (recordings.length === 0) {
    return (
      <AdultCard>
        <AdultEmpty title="Chưa có bản ghi âm nào" text={`Khi ${kidName} luyện nói trong bài học, giọng của bé sẽ được lưu ở đây để bố mẹ nghe lại.`} expr="chao" />
      </AdultCard>
    );
  }

  async function remove() {
    if (!removing) return false;
    const result = await deleteRecordingAction({ id: removing.id });
    if (!result.ok) {
      setDeleteError(result.message);
      return false;
    }
    setDeleteError("");
    setPickedId(null);
    toast("Đã xóa bản ghi âm.");
    return true;
  }

  return (
    <>
      <AdultGrid>
        <AdultCard span={4} aria-labelledby="works-list">
          <AdultCardHead id="works-list" title="Ghi âm của con" sub={`${kidName} · giữ 3 bản gần nhất mỗi câu`} right={<span className={adultStyles.small}>{recordings.length} bản</span>} />
          <AdultSegmented
            label="Lọc bản ghi"
            labelHidden
            value={filter}
            onChange={(v) => (setFilter(v), setPickedId(null))}
            options={[["all", "Tất cả"], ["again", `Cần luyện thêm${again > 0 ? ` (${again})` : ""}`]]}
          />
          {shown.length === 0 ? (
            <AdultEmpty title="Không có bản nào cần luyện thêm" text="Bé nói tốt cả rồi. Giỏi quá!" expr="vui" />
          ) : (
            <ul className={styles.list}>
              {groups.map((g) => (
                <li key={g.key} aria-label={g.label}>
                  <h3 className={cn(adultStyles.label, styles.day)}>{g.label.toUpperCase()}</h3>
                  <ul className={styles.list}>
                    {g.items.map((r) => (
                      <li key={r.id}>
                        <button type="button" className={styles.item} aria-pressed={r.id === current?.id} onClick={() => setPickedId(r.id)}>
                          <span className={styles.ic}>
                            <Icon name="mic" size={18} />
                          </span>
                          <span className={cn(adultStyles.h3, styles.sentence)} lang="en">
                            {r.sentence}
                          </span>
                          <span className={cn(adultStyles.small, adultStyles.muted, styles.meta)}>
                            {clockOfDay(new Date(r.createdAt))} · {formatClock(r.durationMs)}
                            <Stars n={r.stars} />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </AdultCard>

        <div className={styles.cols}>
          {current && (
            <AdultCard aria-label="Chi tiết bản ghi âm">
              <div className={styles.detail}>
                <div className={styles.head}>
                  <div>
                    <span className={cn(adultStyles.label, adultStyles.muted)}>LUYỆN NÓI</span>
                    <h2 className={adultStyles.h2} lang="en">
                      {current.sentence}
                    </h2>
                    <span className={cn(adultStyles.small, adultStyles.muted)}>
                      {whenFormat.format(new Date(current.createdAt))} · {formatClock(current.durationMs)}
                    </span>
                  </div>
                  <Status kind={current.stars === 3 ? "ok" : current.stars === 2 ? "info" : "draft"} label={current.scored ? `Bông chấm ${current.stars}/3 sao` : "Chưa chấm (tính hoàn thành)"} />
                </div>
                <Player key={current.id} row={current} />
                <div className={styles.heard}>
                  {current.scored ? (
                    <p className={adultStyles.body} style={{ margin: 0 }}>
                      <b>Bông nghe được:</b>{" "}
                      {current.transcript ? <span lang="en">“{current.transcript}”</span> : <span className={adultStyles.muted}>chưa nghe rõ chữ nào — bé có thể nói lại to hơn.</span>}
                    </p>
                  ) : (
                    <p className={cn(adultStyles.body, adultStyles.muted)} style={{ margin: 0 }}>
                      Bản này chỉ ghi âm, Bông không chấm (công tắc “Chấm phát âm” đang tắt hoặc trình duyệt không hỗ trợ).
                    </p>
                  )}
                </div>
                <div className={styles.actions}>
                  <AdultButton label="Xóa bản ghi" icon="trash" variant="dangerOutline" onClick={() => (setDeleteError(""), setRemoving(current))} />
                </div>
              </div>
            </AdultCard>
          )}
          <AdultCard aria-label="Bài viết của con">
            <div className={styles.soon}>
              <Icon name="pen" size={20} />
              <div>
                <b className={adultStyles.h3}>Bài viết của con</b> <Status kind="off" label="Sắp có" />
                <p className={cn(adultStyles.small, adultStyles.muted)} style={{ margin: 0 }}>
                  Bố mẹ sẽ đọc, chấm theo tiêu chí và gửi nhận xét cho con ở bản sau.
                </p>
              </div>
            </div>
          </AdultCard>
        </div>
      </AdultGrid>

      <AdultDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title="Xóa bản ghi âm này?"
        actions={[{ label: "Giữ lại", variant: "secondary" }, { label: "Xóa bản ghi", variant: "danger", icon: "trash", onClick: remove }]}
      >
        {removing && (
          <p style={{ margin: 0 }}>
            Bản ghi “<span lang="en">{removing.sentence}</span>” của {kidName} sẽ bị xóa khỏi máy chủ, không khôi phục được.
            {deleteError && (
              <span className={styles.err} role="alert">
                {" "}
                {deleteError}
              </span>
            )}
          </p>
        )}
      </AdultDialog>
    </>
  );
}

const BARS = 48;
const heights = (seed: number) => Array.from({ length: BARS }, (_, i) => 20 + Math.round(70 * Math.abs(Math.sin(i * 0.7 + seed) * Math.cos(i * 0.23))));
const SEEK_STEP_S = 2;

/** Trình phát: sóng âm bấm để tua, ←/→ tua 2 giây, tốc độ 1× / 0,75×. Thời lượng lấy theo `durationMs` vì tệp webm ghi trực tiếp không có sẵn độ dài. */
function Player({ row }: { row: RecordingRow }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [speed, setSpeed] = useState<Speed>("1");
  const [failed, setFailed] = useState(false);
  const total = Math.max(1, row.durationMs / 1000);
  const bars = heights(row.id);

  function seek(to: number) {
    const next = Math.max(0, Math.min(total, to));
    setPos(next);
    if (audio.current) audio.current.currentTime = next;
  }
  function toggle() {
    const el = audio.current;
    if (!el) return;
    if (playing) el.pause();
    else {
      if (pos >= total - 0.05) seek(0);
      el.playbackRate = Number(speed);
      void el.play().catch(() => setFailed(true));
    }
  }

  return (
    <div>
      <div className={styles.player}>
        <audio
          ref={audio}
          src={`/recordings/${row.id}`}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => (setPlaying(false), setPos(0))}
          onTimeUpdate={(e) => setPos(Math.min(total, e.currentTarget.currentTime))}
          onError={() => setFailed(true)}
        />
        <button type="button" className={styles.pbtn} onClick={toggle} aria-label={playing ? "Tạm dừng" : "Phát bản ghi"}>
          <Icon name={playing ? "pause" : "play"} size={22} />
        </button>
        <div
          className={styles.wave}
          role="slider"
          tabIndex={0}
          aria-label="Vị trí phát"
          aria-valuemin={0}
          aria-valuemax={Math.round(total)}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={formatClock(pos * 1000)}
          onClick={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            seek(((e.clientX - box.left) / box.width) * total);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              seek(pos + (e.key === "ArrowRight" ? SEEK_STEP_S : -SEEK_STEP_S));
            }
          }}
        >
          {bars.map((h, i) => (
            <i key={i} className={i / BARS < pos / total ? "on" : undefined} style={{ height: `${h}%` }} />
          ))}
        </div>
        <span className={styles.tm}>
          {formatClock(pos * 1000)} / {formatClock(row.durationMs)}
        </span>
        <AdultSegmented
          label="Tốc độ phát"
          labelHidden
          value={speed}
          onChange={(v) => {
            setSpeed(v);
            if (audio.current) audio.current.playbackRate = Number(v);
          }}
          options={[["1", "1×"], ["0.75", "0,75×"]]}
        />
      </div>
      {failed && (
        <p className={cn(adultStyles.small, styles.err)} role="alert">
          Chưa phát được bản ghi này. Bố mẹ thử tải lại trang nhé.
        </p>
      )}
    </div>
  );
}
