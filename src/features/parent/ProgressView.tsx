"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdultButton, AdultCard, AdultDialog, AdultEmpty, AdultGrid, Status, adultStyles, useToast } from "@/components/adult";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { UnlockTarget } from "@/lib/schemas";
import type { ProgressData, ProgressLesson, ProgressLevel, ProgressState, ProgressUnit } from "@/server/parent-progress";
import { unlockTargetsAction } from "./progress-actions";
import styles from "./progress.module.css";

type Filter = "all" | ProgressState;

const FILTERS: readonly (readonly [Filter, string])[] = [
  ["all", "Trạng thái: tất cả"],
  ["locked", "Khóa"],
  ["current", "Đang học"],
  ["done", "Đã xong"],
  ["manual", "Mở thủ công"],
];

const key = (t: UnlockTarget) => `${t.type}:${t.id}`;
const norm = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase();

function StateChip({ state }: { state: ProgressState }) {
  if (state === "done") return <Status kind="live" label="Đã xong" />;
  if (state === "current") return <Status kind="info" label="Đang học" />;
  if (state === "manual")
    return (
      <span className={cn(adultStyles.status, styles.manual)}>
        <Icon name="key" size={14} />
        Mở thủ công
      </span>
    );
  return <Status kind="off" label="Khóa" />;
}

function Stars({ value }: { value: number }) {
  return (
    <span className={styles.stars} role="img" aria-label={`${value} sao`}>
      {[0, 1, 2].map((i) => (
        <Icon key={i} name={i < value ? "star" : "starEmpty"} size={15} />
      ))}
    </span>
  );
}

type Item = { target: UnlockTarget; label: string };

/**
 * Tiến độ của con và mở khóa thủ công (Adult17): cây Cấp → Chủ đề → Bài với trạng thái Đã xong (số sao), Đang học, Khóa, Mở thủ công;
 * tìm theo tên, lọc theo trạng thái; ô chọn + “Mở khóa” / “Mở cả chủ đề” / “Mở cả cấp” → hộp xác nhận; chọn nhiều → “Mở khóa N mục”;
 * lịch sử mở khóa ở cột phải.
 */
export function ProgressView({ data }: { data: ProgressData }) {
  const router = useRouter();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [picked, setPicked] = useState<Record<string, Item>>({});
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const first: Record<string, boolean> = {};
    for (const l of data.levels) if (l.number === data.kid.levelNumber) first[`level:${l.id}`] = true;
    return first;
  });
  const [confirm, setConfirm] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const q = norm(query.trim());
  const matches = (text: string, state: ProgressState | null) => (q === "" || norm(text).includes(q)) && (filter === "all" || state === filter);

  const lessonLabel = (u: ProgressUnit, l: ProgressLesson) => (l.kind === "unit_test" ? `Trận trùm · ${u.titleVi}` : `Bài ${l.ordinal} · ${u.titleVi}`);
  const lessonText = (u: ProgressUnit, l: ProgressLesson) => `${l.title} ${lessonLabel(u, l)}`;

  const view = useMemo(() => {
    // Một mục hiện khi bản thân khớp hoặc có mục con khớp (tìm kiếm tự mở nhánh).
    return data.levels.flatMap((level) => {
      const units = level.units.flatMap((unit) => {
        const lessons = unit.lessons.filter((l) => matches(lessonText(unit, l), l.state));
        const self = matches(`${unit.title} ${unit.titleVi}`, unit.state);
        if (!self && lessons.length === 0) return [];
        return [{ unit, lessons: self && q === "" && filter === "all" ? unit.lessons : lessons.length > 0 ? lessons : q === "" ? [] : unit.lessons }];
      });
      const self = matches(`Cấp ${level.number} ${level.name}`, level.state === "past" ? "done" : level.state === "current" ? "current" : level.state === "manual" ? "manual" : "locked");
      if (!self && units.length === 0) return [];
      return [{ level, units: units.length > 0 || !self ? units : level.units.map((unit) => ({ unit, lessons: unit.lessons })) }];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, q, filter]);

  const searching = q !== "" || filter !== "all";
  const isOpen = (id: string) => searching || open[id] === true;
  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));
  const flip = (item: Item) =>
    setPicked((p) => {
      const next = { ...p };
      if (next[key(item.target)]) delete next[key(item.target)];
      else next[key(item.target)] = item;
      return next;
    });
  const count = Object.keys(picked).length;

  const levelItem = (l: ProgressLevel): Item => ({ target: { type: "level", id: l.id }, label: `cả cấp ${l.number} · ${l.name}` });
  const unitItem = (u: ProgressUnit): Item => ({ target: { type: "unit", id: u.id }, label: `chủ đề “${u.titleVi}” (${u.lessons.filter((x) => x.state === "locked").length} bài đang khóa)` });
  const lessonItem = (u: ProgressUnit, l: ProgressLesson): Item => ({ target: { type: "lesson", id: l.id }, label: `“${lessonLabel(u, l)}”` });

  async function submit(): Promise<boolean> {
    if (!confirm) return false;
    setError(null);
    try {
      const result = await unlockTargetsAction({ learnerId: data.kid.id, targets: confirm.map((i) => i.target) });
      if (!result.ok) {
        setError(result.message);
        return false;
      }
      toast(`Đã mở khóa ${confirm.length} mục cho ${data.kid.name}.`);
      setPicked({});
      setConfirm(null);
      router.refresh();
      return true;
    } catch {
      setError("Mất kết nối. Bố mẹ kiểm tra mạng rồi thử lại nhé.");
      return false;
    }
  }

  const noContent = data.levels.every((l) => !l.hasContent);

  return (
    <div className={styles.page}>
      <AdultGrid>
        <AdultCard span={8} aria-labelledby="progress-title">
          <div className={styles.tbar}>
            <h2 className={adultStyles.h2} id="progress-title" style={{ margin: 0 }}>
              Lộ trình của {data.kid.name}
            </h2>
            <span className={styles.fill} />
            <div className={styles.search}>
              <Icon name="search" size={18} />
              <label className="sr-only" htmlFor="progress-q">
                Tìm bài hoặc chủ đề
              </label>
              <input id="progress-q" className={adultStyles.input} placeholder="Tìm bài, chủ đề…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <label className="sr-only" htmlFor="progress-f">
              Lọc trạng thái
            </label>
            <select id="progress-f" className={cn(adultStyles.input, styles.filter)} value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
              {FILTERS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {count > 0 && (
            <div className={styles.bulk} role="status">
              <Icon name="check" size={16} />
              <span className={styles.fill}>
                Đã chọn <b>{count}</b> mục đang khóa
              </span>
              <AdultButton label={`Mở khóa ${count} mục`} icon="key" size="s" onClick={() => setConfirm(Object.values(picked))} />
              <AdultButton label="Bỏ chọn" variant="ghost" size="s" onClick={() => setPicked({})} />
            </div>
          )}

          <div className={styles.tw}>
            {noContent ? (
              <AdultEmpty title="Chưa có bài học nào" text="Lộ trình hiện khi nội dung đã được xuất bản." />
            ) : view.length === 0 ? (
              <AdultEmpty title="Không có mục phù hợp" text="Thử từ khóa khác hoặc chọn “Trạng thái: tất cả”." />
            ) : (
              <ul className={styles.tree} aria-label="Cấp, chủ đề, bài">
                {view.map(({ level, units }) => {
                  const lid = `level:${level.id}`;
                  return (
                    <li key={lid}>
                      <div className={cn(styles.tn, level.state === "locked" && styles.isLocked)} data-type="level" data-level={level.number}>
                        {level.units.length > 0 ? (
                          <button type="button" className={styles.tg} aria-expanded={isOpen(lid)} aria-label={`${isOpen(lid) ? "Thu gọn" : "Mở"} cấp ${level.number}`} onClick={() => toggle(lid)}>
                            <Icon name="next" size={14} />
                          </button>
                        ) : (
                          <span className={styles.sp} />
                        )}
                        {level.canUnlock && <input type="checkbox" aria-label={`Chọn cấp ${level.number} · ${level.name} để mở khóa`} checked={!!picked[key({ type: "level", id: level.id })]} onChange={() => flip(levelItem(level))} />}
                        <span className={styles.nm}>
                          <i className={styles.dot} aria-hidden="true" />
                          <span>
                            Cấp {level.number} · {level.name}
                          </span>
                          <span className={styles.c}>· {level.units.length} chủ đề</span>
                        </span>
                        {level.state === "past" ? <Status kind="live" label="Đã qua" /> : <StateChip state={level.state === "current" ? "current" : level.state === "manual" ? "manual" : "locked"} />}
                        {level.canUnlock && <AdultButton label="Mở cả cấp" icon="key" variant="ghost" size="s" onClick={() => setConfirm([levelItem(level)])} />}
                      </div>
                      {isOpen(lid) && units.length > 0 && (
                        <ul>
                          {units.map(({ unit, lessons }) => {
                            const uid = `unit:${unit.id}`;
                            return (
                              <li key={uid}>
                                <div className={cn(styles.tn, unit.state === "locked" && styles.isLocked)} data-type="topic">
                                  <button type="button" className={styles.tg} aria-expanded={isOpen(uid)} aria-label={`${isOpen(uid) ? "Thu gọn" : "Mở"} ${unit.titleVi}`} onClick={() => toggle(uid)}>
                                    <Icon name="next" size={14} />
                                  </button>
                                  {unit.canUnlock && <input type="checkbox" aria-label={`Chọn chủ đề ${unit.titleVi} để mở khóa`} checked={!!picked[key({ type: "unit", id: unit.id })]} onChange={() => flip(unitItem(unit))} />}
                                  <span className={styles.nm}>
                                    {unit.state === "locked" && (
                                      <span className={styles.lk}>
                                        <Icon name="lock" size={14} />
                                      </span>
                                    )}
                                    <span>{unit.titleVi}</span>
                                    <span className={styles.c} lang="en">
                                      {unit.title}
                                    </span>
                                    <span className={styles.c}>
                                      · {unit.doneCount}/{unit.lessonCount} bài
                                    </span>
                                  </span>
                                  <StateChip state={unit.state} />
                                  {unit.canUnlock && <AdultButton label="Mở cả chủ đề" icon="key" variant="ghost" size="s" onClick={() => setConfirm([unitItem(unit)])} />}
                                </div>
                                {isOpen(uid) && lessons.length > 0 && (
                                  <ul>
                                    {lessons.map((l) => (
                                      <li key={l.id}>
                                        <div className={cn(styles.tn, l.state === "locked" && styles.isLocked)} data-type="lesson">
                                          <span className={styles.sp} />
                                          {l.state === "locked" && <input type="checkbox" aria-label={`Chọn ${lessonLabel(unit, l)} để mở khóa`} checked={!!picked[key({ type: "lesson", id: l.id })]} onChange={() => flip(lessonItem(unit, l))} />}
                                          <span className={styles.nm}>
                                            {l.state === "locked" && (
                                              <span className={styles.lk}>
                                                <Icon name="lock" size={14} />
                                              </span>
                                            )}
                                            <span>{l.kind === "unit_test" ? "Trận trùm" : `Bài ${l.ordinal}`}</span>
                                            {l.title !== `Bài ${l.ordinal}` && <span className={styles.c}>· {l.title}</span>}
                                          </span>
                                          {l.state === "done" && <Stars value={l.stars} />}
                                          <StateChip state={l.state} />
                                          {l.state === "locked" && <AdultButton label="Mở khóa" icon="key" variant="ghost" size="s" onClick={() => setConfirm([lessonItem(unit, l)])} />}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </AdultCard>

        <aside className={styles.side} aria-label="Tóm tắt và lịch sử">
          <AdultCard>
            <h2 className={adultStyles.h2} style={{ margin: 0 }}>
              {data.kid.name}
              {data.kid.grade ? ` · Lớp ${data.kid.grade}` : ""}
            </h2>
            <div className={styles.kp}>
              <div>
                <b>Cấp {data.kid.levelNumber}</b>
                <span>{data.kid.levelName}</span>
              </div>
              <div>
                <b>{data.totals.done}</b>
                <span>bài đã xong</span>
              </div>
              <div>
                <b>{data.totals.locked}</b>
                <span>bài đang khóa</span>
              </div>
            </div>
            <ul className={styles.lgd} aria-label="Chú thích">
              <li>
                <Status kind="live" label="Đã xong" />
                kèm số sao 1–3
              </li>
              <li>
                <Status kind="info" label="Đang học" />
                bài con đang làm được
              </li>
              <li>
                <Status kind="off" label="Khóa" />
                mở khi xong bài trước
              </li>
              <li>
                <StateChip state="manual" />
                bố mẹ tự mở
              </li>
            </ul>
            <p className={styles.note}>Mở thủ công giúp con học trước bài đã học ở trường. Con vẫn cần làm bài thi lên cấp để chuyển cấp chính thức.</p>
          </AdultCard>
          <AdultCard>
            <h2 className={adultStyles.h3} style={{ margin: "0 0 var(--space-2)" }}>
              Lịch sử mở khóa
            </h2>
            {data.history.length === 0 ? (
              <p className={cn(adultStyles.small, adultStyles.muted)} style={{ margin: 0 }}>
                Chưa mở khóa thủ công lần nào.
              </p>
            ) : (
              <ul className={styles.hist}>
                {data.history.map((h) => (
                  <li key={h.id}>
                    <time>{h.when}</time>
                    <span>
                      Mở thủ công {h.label}. <span className={cn(adultStyles.small, adultStyles.muted)}>({h.by})</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </AdultCard>
        </aside>
      </AdultGrid>

      <AdultDialog
        open={confirm !== null}
        onClose={() => {
          setConfirm(null);
          setError(null);
        }}
        title={`Mở khóa thủ công cho ${data.kid.name}?`}
        actions={[
          { label: "Hủy", variant: "secondary" },
          { label: "Mở khóa", variant: "primary", icon: "key", onClick: submit },
        ]}
      >
        <p style={{ margin: "0 0 var(--space-2)" }}>
          Sẽ mở: <b>{confirm?.map((i) => i.label).join(", ")}</b>.
        </p>
        <p className={cn(adultStyles.small, adultStyles.muted)} style={{ margin: 0 }}>
          Con vào học được ngay, không cần xong bài trước. Tiến độ và sao đã có được giữ nguyên.
        </p>
        {error && (
          <p className={cn(adultStyles.err, adultStyles.small)} role="alert" style={{ marginTop: "var(--space-2)" }}>
            {error}
          </p>
        )}
      </AdultDialog>
    </div>
  );
}
