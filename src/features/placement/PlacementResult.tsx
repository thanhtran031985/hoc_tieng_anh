"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Card, DataState, Icon, Mascot, Skeleton, Topbar, type TopbarLearner } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";
import { cn } from "@/lib/cn";
import { placementComment } from "@/lib/rules/placement";
import type { PlacementResult as Result } from "@/lib/schemas";
import { useHotkeys } from "@/lib/use-hotkeys";
import type { PlacementLevel } from "@/server/placement";
import styles from "./placement.module.css";

export type PlacementSave = { status: "idle" } | { status: "ok"; result: Result } | { status: "error"; message: string };

type Props = {
  learner: TopbarLearner;
  learnerName: string;
  grade: number;
  gradeLevel: PlacementLevel;
  levels: PlacementLevel[];
  /** Cấp đề xuất tính ngay trên máy (cùng hàm với server), để hiện khi chưa lưu xong hoặc lưu lỗi. */
  suggested: number;
  save: PlacementSave;
  /** Bé dừng giữa chừng nên chưa đủ câu để đề xuất. */
  early: boolean;
  answered: number;
  durationMs: number;
  busy: boolean;
  error: string | null;
  onRetry: () => void;
  onContinue: () => void;
  onStart: (level: number) => void;
};

function duration(ms: number): string {
  const total = Math.max(1, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m} phút ${s} giây` : `${s} giây`;
}

function LevelBox({ level, label }: { level: PlacementLevel; label: string }) {
  return (
    <div className={styles.lvbox} data-level={level.number}>
      <span className={styles.lvN}>{level.number}</span>
      <div>
        <small>{label}</small>
        <span className={styles.lvName}>{level.label}</span>
      </div>
    </div>
  );
}

/**
 * Màn kết quả bài xếp lớp (Screen17): cấp đề xuất, nhận xét ngắn, chủ đề vững/sẽ học. Không hiện điểm hay số câu đúng.
 * "Chọn cấp khác" mở các đảo Tiểu học đã có nội dung (← → để chọn).
 */
export function PlacementResult({ learner, learnerName, grade, gradeLevel, levels, suggested, save, early, answered, durationMs, busy, error, onRetry, onContinue, onStart }: Props) {
  const [choosing, setChoosing] = useState(false);
  const [picked, setPicked] = useState(suggested);
  const pickRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const suggestedLevel = levels.find((l) => l.number === suggested) ?? gradeLevel;
  const shown = levels.find((l) => l.number === picked) ?? suggestedLevel;
  const saving = save.status === "idle" && !early;
  const failed = save.status === "error";
  const ready = save.status === "ok";

  useEffect(() => {
    if (choosing) pickRefs.current.find((b) => b?.getAttribute("aria-checked") === "true")?.focus();
  }, [choosing]);

  useHotkeys(
    { Enter: () => (early ? onContinue() : failed ? onRetry() : onStart(choosing ? picked : suggested)) },
    { enabled: !saving && !busy },
  );

  function movePick(index: number, step: number) {
    const next = Math.max(0, Math.min(levels.length - 1, index + step));
    setPicked(levels[next].number);
    pickRefs.current[next]?.focus();
  }

  const topics = ready ? save.result.topics : [];
  const comment = ready
    ? placementComment(
        learnerName,
        topics.filter((t) => t.ok).map((t) => t.title),
        topics.filter((t) => !t.ok).map((t) => t.title),
        suggestedLevel.label,
      )
    : "";

  return (
    <div className={kid.screen} data-level={shown.number}>
      <Topbar learner={learner} title="Bài xếp lớp" right={<span className={styles.caption}>{learnerName} · Lớp {grade}</span>} />
      <main className={styles.pr}>
        <section className={styles.hero}>
          <Mascot expr={early ? "suynghi" : failed ? "dongvien" : saving ? "suynghi" : "chucmung"} />
          <h1 className={styles.resTitle}>{early ? `Mới được ${answered} câu thôi` : saving ? "Xong 12 câu rồi!" : `${learnerName} làm xong rồi!`}</h1>
          <p className={styles.resSub}>
            {early
              ? `Bông chưa đủ thông tin để chọn đảo cho ${learnerName}.`
              : saving
                ? `Bông đang xem ${learnerName} hợp với đảo nào…`
                : `${answered} câu · ${duration(durationMs)}`}
          </p>
        </section>

        <Card className={styles.res}>
          {early ? (
            <DataState
              kind="empty"
              size={120}
              title="Chưa có cấp đề xuất"
              text={`Làm nốt ${Math.max(0, 12 - answered)} câu nữa, hoặc bắt đầu theo lớp ${grade} nhé.`}
              action={
                <>
                  <Button size="l" icon="next" label="Làm tiếp bài xếp lớp" shortcut="Enter" disabled={busy} onClick={onContinue} />
                  <Button variant="secondary" size="l" label="Bắt đầu theo lớp" disabled={busy} onClick={() => onStart(gradeLevel.number)} />
                </>
              }
            />
          ) : saving ? (
            <>
              <Skeleton width="100%" height="var(--size-lvbox-n)" radius="lg" />
              <Skeleton width="100%" height="var(--space-5)" radius="pill" />
              <Skeleton width="80%" height="var(--space-5)" radius="pill" />
            </>
          ) : failed ? (
            <>
              <LevelBox level={suggestedLevel} label="Cấp Bông đề xuất" />
              <DataState
                kind="error"
                size={100}
                title="Chưa lưu được kết quả"
                text="Mạng chập chờn. Kết quả vẫn được giữ trên máy, không phải làm lại đâu!"
                action={
                  <>
                    <Button size="l" icon="replay" label="Thử lại" shortcut="Enter" disabled={busy} onClick={onRetry} />
                    <Button variant="secondary" size="l" label={`Bắt đầu ở Cấp ${suggestedLevel.number}`} disabled={busy} onClick={() => onStart(suggestedLevel.number)} />
                  </>
                }
              />
            </>
          ) : choosing ? (
            <>
              <LevelBox level={shown} label={picked === suggested ? "Cấp Bông đề xuất" : "Cấp bé chọn"} />
              <div>
                <p className={styles.pickLabel}>Chọn đảo bắt đầu</p>
                <div className={styles.pick} style={{ "--cols": levels.length } as React.CSSProperties} role="radiogroup" aria-label="Chọn cấp">
                  {levels.map((l, i) => (
                    <button
                      key={l.number}
                      ref={(el) => {
                        pickRefs.current[i] = el;
                      }}
                      type="button"
                      role="radio"
                      data-level={l.number}
                      aria-checked={picked === l.number}
                      tabIndex={picked === l.number ? 0 : -1}
                      onClick={() => setPicked(l.number)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          // Enter trên nút chọn cấp = Bắt đầu học ở cấp đang chọn (nút chính ghi nhãn Enter).
                          event.preventDefault();
                          if (!busy) onStart(picked);
                        } else if (event.key === "ArrowRight") {
                          event.preventDefault();
                          movePick(i, 1);
                        } else if (event.key === "ArrowLeft") {
                          event.preventDefault();
                          movePick(i, -1);
                        }
                      }}
                    >
                      {l.number === suggested && <span className={styles.rec}>Bông đề xuất</span>}
                      <b>{l.number}</b>
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>
              <p className={styles.note}>
                {picked > suggested
                  ? "Cấp này có thể hơi khó. Nếu bé thấy mệt, bố mẹ đổi lại cấp được nhé."
                  : picked < suggested
                    ? "Ôn lại từ đầu cũng tốt! Bé sẽ qua đảo này rất nhanh."
                    : `Đảo ${suggestedLevel.name} vừa sức ${learnerName} nhất.`}
              </p>
              <div className={styles.actsRow}>
                <Button
                  variant="secondary"
                  size="l"
                  label="Quay lại"
                  onClick={() => {
                    setChoosing(false);
                    setPicked(suggested);
                  }}
                />
                <Button size="l" icon="next" label="Bắt đầu học" shortcut="Enter" disabled={busy} onClick={() => onStart(picked)} />
              </div>
            </>
          ) : (
            <>
              <LevelBox level={suggestedLevel} label="Cấp Bông đề xuất" />
              <p className={styles.comment}>{comment}</p>
              {topics.length > 0 && (
                <div className={styles.chips}>
                  {topics.map((t) => (
                    <span key={t.title} className={cn(styles.chip, t.ok ? styles.chipOk : styles.chipNew)}>
                      <Icon name={t.ok ? "check" : "book"} size={20} />
                      {t.title}
                      {t.ok ? "" : " · sẽ học"}
                    </span>
                  ))}
                </div>
              )}
              <div className={styles.actsRow}>
                <Button variant="secondary" size="l" label="Chọn cấp khác" disabled={busy} onClick={() => setChoosing(true)} />
                <Button size="l" icon="next" label="Bắt đầu học" shortcut="Enter" disabled={busy} onClick={() => onStart(suggested)} />
              </div>
            </>
          )}
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </Card>
      </main>
    </div>
  );
}
