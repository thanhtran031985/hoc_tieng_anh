"use client";

import { useState } from "react";
import {
  AdultButton,
  AdultButtonLink,
  AdultCard,
  AdultDialog,
  AdultDrawer,
  AdultEmpty,
  AdultIconButton,
  AdultInput,
  AdultSegmented,
  AdultSelect,
  AdultSortable,
  type SortableApi,
  AdultTable,
  Status,
  adultStyles,
  useToast,
  type AdultColumn,
} from "@/components/adult";
import { ADMIN_NAV } from "@/components/adult/nav";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { missingLessons } from "@/lib/rules/admin-tree";
import { addLessonSchema, addUnitSchema, updateLessonSchema, updateLevelSchema, updateStageSchema, updateUnitSchema } from "@/lib/schemas/admin-tree";
import type { TargetWordRow, TreeData, TreeLesson, TreeLevel, TreeStage, TreeUnit } from "@/server/admin/tree";
import { addLessonAction, addUnitAction, deleteNodeAction, getTargetWordsAction, reorderAction, updateLessonAction, updateLevelAction, updateStageAction, updateUnitAction, type TreeActionResult } from "./tree-actions";
import styles from "./tree.module.css";

type Kind = "stage" | "level" | "unit" | "lesson";
type Sel = { kind: Kind; id: number } | null;
type Errors = Record<string, string>;

const nf = (n: number) => n.toLocaleString("vi-VN");
const keyOf = (kind: Kind, id: number) => `${kind}:${id}`;
const builderHref = ADMIN_NAV.find((item) => item.key === "builder" && item.ready)?.href;

/** Lỗi theo ô từ kết quả kiểm Zod ở client (cùng schema với server). */
function issuesToErrors(issues: readonly { path: readonly PropertyKey[]; message: string }[]): Errors {
  const errors: Errors = {};
  for (const issue of issues) {
    const field = typeof issue.path[0] === "string" ? issue.path[0] : "form";
    errors[field] ??= issue.message;
  }
  return errors;
}

function resultToErrors(result: Extract<TreeActionResult, { ok: false }>): Errors {
  return { [result.field ?? "form"]: result.message };
}

const countText = {
  stage: (s: TreeStage) => `${s.levels.length} cấp`,
  level: (l: TreeLevel) => `${l.units.length} chủ đề · ${l.units.reduce((sum, u) => sum + u.lessons.length, 0)} bài`,
  unit: (u: TreeUnit) => (u.status === "planned" ? `${u.targetWords} từ mục tiêu · chưa có bài` : `${u.lessons.length} bài`),
  lesson: (l: TreeLesson) => `${l.steps} bước · ${l.minutes} phút`,
};

/** Cây lộ trình (Adult09): Chặng → Cấp → Chủ đề → Bài học; mở/thu nhánh, kéo thả đổi thứ tự, sửa ở khung phải. */
export function TreeView({ data }: { data: TreeData }) {
  const toast = useToast();
  const [sel, setSel] = useState<Sel>(null);
  const [open, setOpen] = useState<Record<string, boolean>>(() => Object.fromEntries(data.stages.map((s) => [keyOf("stage", s.id), true])));
  const [pending, setPending] = useState<Record<string, number[]>>({});
  /** Từ mục tiêu theo chủ đề khung: chưa có khóa = chưa tải, undefined = đang tải, null = lỗi. */
  const [targets, setTargets] = useState<Record<number, TargetWordRow[] | null | undefined>>({});
  const [drawer, setDrawer] = useState<number | null>(null);
  const [add, setAdd] = useState<{ kind: "unit" | "lesson"; parentId: number } | null>(null);

  // Dữ liệu mới từ server (sau khi lưu) thì bỏ thứ tự tạm đang chờ.
  const [seen, setSeen] = useState(data);
  if (seen !== data) {
    setSeen(data);
    setPending({});
  }

  const levels = data.stages.flatMap((s) => s.levels);
  const units = levels.flatMap((l) => l.units.map((u) => ({ unit: u, level: l })));
  const lessonCount = units.reduce((sum, { unit }) => sum + unit.lessons.length, 0);
  const plannedCount = units.filter(({ unit }) => unit.status === "planned").length;

  const isOpen = (kind: Kind, id: number) => Boolean(open[keyOf(kind, id)]);
  const toggle = (kind: Kind, id: number) => setOpen((o) => ({ ...o, [keyOf(kind, id)]: !o[keyOf(kind, id)] }));
  const setAll = (value: boolean) => {
    const next: Record<string, boolean> = {};
    for (const s of data.stages) next[keyOf("stage", s.id)] = true;
    if (value) {
      for (const l of levels) next[keyOf("level", l.id)] = true;
      for (const { unit } of units) next[keyOf("unit", unit.id)] = true;
    }
    setOpen(next);
  };

  function loadTargets(unitId: number) {
    if (unitId in targets) return;
    setTargets((t) => ({ ...t, [unitId]: undefined }));
    void getTargetWordsAction({ unitId }).then((rows) => setTargets((t) => ({ ...t, [unitId]: rows })));
  }

  function select(kind: Kind, id: number) {
    setSel({ kind, id });
    if (kind === "unit" && units.find((x) => x.unit.id === id)?.unit.status === "planned") loadTargets(id);
  }

  /** Sắp xếp một nhóm: đổi ngay trên màn hình rồi lưu; lưu hỏng thì trả về thứ tự cũ. */
  async function commitOrder(kind: "unit" | "lesson", parentId: number, ids: number[]) {
    const key = keyOf(kind, parentId);
    setPending((p) => ({ ...p, [key]: ids }));
    const result = await reorderAction({ kind, parentId, ids });
    if (!result.ok) {
      toast(result.message);
      setPending((p) => Object.fromEntries(Object.entries(p).filter(([k]) => k !== key)));
    }
  }

  const ordered = <T extends { id: number }>(items: T[], kind: "unit" | "lesson", parentId: number): T[] => {
    const order = pending[keyOf(kind, parentId)];
    if (!order || order.length !== items.length) return items;
    const byId = new Map(items.map((i) => [i.id, i]));
    return order.every((id) => byId.has(id)) ? order.map((id) => byId.get(id)!) : items;
  };

  const found = (() => {
    if (!sel) return null;
    if (sel.kind === "stage") return data.stages.find((s) => s.id === sel.id) ? { kind: "stage" as const, node: data.stages.find((s) => s.id === sel.id)! } : null;
    if (sel.kind === "level") return levels.find((l) => l.id === sel.id) ? { kind: "level" as const, node: levels.find((l) => l.id === sel.id)! } : null;
    if (sel.kind === "unit") {
      const hit = units.find((x) => x.unit.id === sel.id);
      return hit ? { kind: "unit" as const, node: hit.unit, level: hit.level } : null;
    }
    for (const { unit } of units) {
      const lesson = unit.lessons.find((l) => l.id === sel.id);
      if (lesson) return { kind: "lesson" as const, node: lesson, unit };
    }
    return null;
  })();

  if (data.stages.length === 0) {
    return (
      <AdultCard>
        <AdultEmpty title="Chưa có lộ trình" text="Chặng và cấp được tạo khi nạp dữ liệu mẫu (npx prisma db seed). Sau đó chủ đề và bài học thêm ở đây." />
      </AdultCard>
    );
  }

  const unitRow = (api: SortableApi, unit: TreeUnit) => {
    const none = unit.status === "planned";
    const hasKids = unit.lessons.length > 0;
    const on = sel?.kind === "unit" && sel.id === unit.id;
    const missing = !none ? missingLessons(unit.lessons.length) : 0;
    return (
      <li key={unit.id} className={styles.node} {...api.itemProps(String(unit.id))}>
        <div className={cn(styles.row, on && styles.rowOn)}>
          <button type="button" className={styles.grip} {...api.gripProps(String(unit.id))}>
            <Icon name="grip" size={16} />
          </button>
          {hasKids ? (
            <button type="button" className={styles.toggle} aria-expanded={isOpen("unit", unit.id)} aria-label={`${isOpen("unit", unit.id) ? "Thu gọn" : "Mở"} ${unit.title}`} onClick={() => toggle("unit", unit.id)}>
              <Icon name="next" size={14} />
            </button>
          ) : (
            <span className={styles.spacer} />
          )}
          <button type="button" className={cn(styles.name, none && styles.nameNone)} aria-current={on ? "true" : undefined} onClick={() => select("unit", unit.id)}>
            <Icon name="book" size={14} />
            <span className={styles.title} lang="en">
              {unit.title}
            </span>
            <span className={styles.count}>{countText.unit(unit)}</span>
          </button>
          {missing > 0 && (
            <span className={styles.miss}>
              <Icon name="warn" size={13} />
              thiếu {missing} bài
            </span>
          )}
          {none ? <Status kind="none" label="Chưa có bài" /> : <Status kind={unit.status === "published" ? "live" : "draft"} label={unit.status === "published" ? "Đã xuất bản" : "Nháp"} />}
          <AdultIconButton className={styles.add} icon="plus" label={`Thêm bài học vào ${unit.title}`} onClick={() => setAdd({ kind: "lesson", parentId: unit.id })} />
        </div>
        {hasKids && isOpen("unit", unit.id) && (
          <AdultSortable
            ids={ordered(unit.lessons, "lesson", unit.id).map((l) => String(l.id))}
            labelOf={(id) => `bài ${unit.lessons.find((l) => String(l.id) === id)?.title ?? ""}`}
            onReorder={(ids) => void commitOrder("lesson", unit.id, ids.map(Number))}
          >
            {(lessonApi) =>
              ordered(unit.lessons, "lesson", unit.id).map((lesson) => {
                const lessonOn = sel?.kind === "lesson" && sel.id === lesson.id;
                return (
                  <li key={lesson.id} className={styles.node} {...lessonApi.itemProps(String(lesson.id))}>
                    <div className={cn(styles.row, lessonOn && styles.rowOn)}>
                      <button type="button" className={styles.grip} {...lessonApi.gripProps(String(lesson.id))}>
                        <Icon name="grip" size={16} />
                      </button>
                      <span className={styles.spacer} />
                      <button type="button" className={styles.name} aria-current={lessonOn ? "true" : undefined} onClick={() => select("lesson", lesson.id)}>
                        <Icon name="cards" size={14} />
                        <span className={styles.title}>{lesson.title}</span>
                        <span className={styles.count}>{countText.lesson(lesson)}</span>
                      </button>
                      <Status kind={lesson.status === "published" ? "live" : "draft"} label={lesson.status === "published" ? "Đã xuất bản" : "Nháp"} />
                    </div>
                  </li>
                );
              })
            }
          </AdultSortable>
        )}
      </li>
    );
  };

  const levelNode = (level: TreeLevel) => {
    const on = sel?.kind === "level" && sel.id === level.id;
    return (
      <li key={level.id} className={styles.node} data-level={level.number}>
        <div className={cn(styles.row, on && styles.rowOn)}>
          <span className={styles.spacer} />
          <button type="button" className={styles.toggle} aria-expanded={isOpen("level", level.id)} aria-label={`${isOpen("level", level.id) ? "Thu gọn" : "Mở"} cấp ${level.number}`} onClick={() => toggle("level", level.id)}>
            <Icon name="next" size={14} />
          </button>
          <button type="button" className={cn(styles.name, styles.nameLevel)} aria-current={on ? "true" : undefined} onClick={() => select("level", level.id)}>
            <i className={styles.dot} aria-hidden="true" />
            <span className={styles.title}>
              Cấp {level.number} · {level.name}
            </span>
            <span className={styles.count}>{countText.level(level)}</span>
          </button>
          <AdultIconButton className={styles.add} icon="plus" label={`Thêm chủ đề vào cấp ${level.number}`} onClick={() => setAdd({ kind: "unit", parentId: level.id })} />
        </div>
        {isOpen("level", level.id) &&
          (level.units.length === 0 ? (
            <ul>
              <li className={cn(adultStyles.small, adultStyles.muted)}>Cấp này chưa có chủ đề nào.</li>
            </ul>
          ) : (
            <AdultSortable
              ids={ordered(level.units, "unit", level.id).map((u) => String(u.id))}
              labelOf={(id) => `chủ đề ${level.units.find((u) => String(u.id) === id)?.title ?? ""}`}
              onReorder={(ids) => void commitOrder("unit", level.id, ids.map(Number))}
            >
              {(api) => ordered(level.units, "unit", level.id).map((unit) => unitRow(api, unit))}
            </AdultSortable>
          ))}
      </li>
    );
  };

  const drawerUnit = drawer === null ? null : units.find((x) => x.unit.id === drawer);

  return (
    <div className={styles.layout}>
      <AdultCard aria-labelledby="tree-title">
        <div className={styles.head}>
          <h2 className={cn(adultStyles.h2, styles.headTitle)} id="tree-title">
            Lộ trình học
          </h2>
          <AdultButton label="Mở hết" variant="ghost" size="s" onClick={() => setAll(true)} />
          <AdultButton label="Thu gọn" variant="ghost" size="s" onClick={() => setAll(false)} />
        </div>
        <p className={cn(styles.help, adultStyles.small, adultStyles.muted)}>
          {data.stages.length} chặng · {levels.length} cấp · {nf(units.length)} chủ đề ({nf(plannedCount)} chưa có bài) · {nf(lessonCount)} bài. Kéo tay nắm (6 chấm) để đổi thứ tự trong cùng nhóm; bàn phím: Tab tới tay nắm rồi ↑ / ↓.
        </p>
        <div className={cn(styles.legend, adultStyles.small, adultStyles.muted)}>
          <span>Trạng thái:</span>
          <Status kind="live" label="Đã xuất bản" />
          <Status kind="draft" label="Nháp" />
          <Status kind="none" label="Chưa có bài" />
        </div>
        <ul className={styles.tree}>
          {data.stages.map((stage) => {
            const on = sel?.kind === "stage" && sel.id === stage.id;
            return (
              <li key={stage.id} className={styles.node}>
                <div className={cn(styles.row, on && styles.rowOn)}>
                  <button type="button" className={styles.toggle} aria-expanded={isOpen("stage", stage.id)} aria-label={`${isOpen("stage", stage.id) ? "Thu gọn" : "Mở"} ${stage.name}`} onClick={() => toggle("stage", stage.id)}>
                    <Icon name="next" size={14} />
                  </button>
                  <button type="button" className={cn(styles.name, styles.nameStage)} aria-current={on ? "true" : undefined} onClick={() => select("stage", stage.id)}>
                    <span className={styles.title}>{stage.name}</span>
                    <span className={styles.count}>{countText.stage(stage)}</span>
                  </button>
                </div>
                {isOpen("stage", stage.id) && <ul>{stage.levels.map(levelNode)}</ul>}
              </li>
            );
          })}
        </ul>
      </AdultCard>

      {found?.kind === "unit" && found.node.status === "planned" ? (
        <PlannedPanel key={found.node.id} unit={found.node} level={found.level} rows={targets[found.node.id]} onOpen={() => setDrawer(found.node.id)} />
      ) : found ? (
        <EditorPanel
          key={`${found.kind}-${found.node.id}`}
          found={found}
          levels={levels}
          onDeleted={() => setSel(found.kind === "lesson" ? { kind: "unit", id: found.unit.id } : found.kind === "unit" ? { kind: "level", id: found.level.id } : null)}
        />
      ) : (
        <AdultCard className={styles.editor}>
          <AdultEmpty title="Chọn một mục để sửa" text="Bấm vào tên chặng, cấp, chủ đề hoặc bài học ở cây bên trái." />
        </AdultCard>
      )}

      {drawerUnit && <TargetDrawer unit={drawerUnit.unit} level={drawerUnit.level} rows={targets[drawerUnit.unit.id]} onClose={() => setDrawer(null)} />}

      {add && (
        <AddDialog
          key={`${add.kind}-${add.parentId}`}
          kind={add.kind}
          parentId={add.parentId}
          parentName={add.kind === "unit" ? `Cấp ${levels.find((l) => l.id === add.parentId)?.number ?? ""}` : (units.find((x) => x.unit.id === add.parentId)?.unit.title ?? "")}
          onClose={() => setAdd(null)}
          onAdded={(id) => {
            if (add.kind === "unit") {
              setOpen((o) => ({ ...o, [keyOf("level", add.parentId)]: true }));
              setSel({ kind: "unit", id });
            } else {
              setOpen((o) => ({ ...o, [keyOf("unit", add.parentId)]: true }));
              setSel({ kind: "lesson", id });
            }
            toast("Đã thêm (nháp).");
          }}
        />
      )}
    </div>
  );
}

type Found =
  | { kind: "stage"; node: TreeStage }
  | { kind: "level"; node: TreeLevel }
  | { kind: "unit"; node: TreeUnit; level: TreeLevel }
  | { kind: "lesson"; node: TreeLesson; unit: TreeUnit };

const STATUS_OPTIONS = [
  ["draft", "Nháp"],
  ["published", "Đã xuất bản"],
] as const;

const KIND_LABEL: Record<Kind, string> = { stage: "Chặng", level: "Cấp", unit: "Chủ đề", lesson: "Bài học" };

/** Khung sửa chặng / cấp / chủ đề / bài học; chủ đề và bài có nút xóa và chọn Nháp / Đã xuất bản. */
function EditorPanel({ found, levels, onDeleted }: { found: Found; levels: TreeLevel[]; onDeleted: () => void }) {
  const toast = useToast();
  const node = found.node;
  const initialName = found.kind === "unit" || found.kind === "lesson" ? found.node.title : found.node.name;

  const [name, setName] = useState(initialName);
  const [titleVi, setTitleVi] = useState(found.kind === "unit" ? found.node.titleVi : "");
  const [source, setSource] = useState(found.kind === "unit" ? (found.node.source ?? "") : "");
  const [levelId, setLevelId] = useState(found.kind === "unit" ? found.level.id : 0);
  const [minutes, setMinutes] = useState(found.kind === "lesson" ? String(found.node.minutes) : "");
  const [status, setStatus] = useState<"draft" | "published">(found.kind === "unit" || found.kind === "lesson" ? (found.node.status === "published" ? "published" : "draft") : "draft");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const clear = (field: string) => setErrors((e) => ({ ...e, [field]: "" }));

  async function save() {
    let parsed: { success: true; data: unknown } | { success: false; error: { issues: readonly { path: readonly PropertyKey[]; message: string }[] } };
    let run: (input: never) => Promise<TreeActionResult>;
    if (found.kind === "stage") {
      parsed = updateStageSchema.safeParse({ id: node.id, name });
      run = updateStageAction;
    } else if (found.kind === "level") {
      parsed = updateLevelSchema.safeParse({ id: node.id, name });
      run = updateLevelAction;
    } else if (found.kind === "unit") {
      parsed = updateUnitSchema.safeParse({ id: node.id, title: name, titleVi, source: source.trim() || null, levelId, status });
      run = updateUnitAction;
    } else {
      parsed = updateLessonSchema.safeParse({ id: node.id, title: name, minutes: /^\d+$/.test(minutes.trim()) ? Number(minutes) : Number.NaN, status });
      run = updateLessonAction;
    }
    if (!parsed.success) {
      setErrors(issuesToErrors(parsed.error.issues));
      return;
    }
    setBusy(true);
    const result = await run(parsed.data as never);
    setBusy(false);
    if (!result.ok) {
      setErrors(resultToErrors(result));
      return;
    }
    setErrors({});
    toast(`Đã lưu “${name.trim()}”.`);
  }

  async function remove() {
    if (found.kind !== "unit" && found.kind !== "lesson") return true;
    const result = await deleteNodeAction({ kind: found.kind, id: node.id });
    if (!result.ok) {
      setErrors(resultToErrors(result));
      return true;
    }
    toast("Đã xóa.");
    onDeleted();
    return true;
  }

  const lessonCountInfo = found.kind === "unit" ? `${found.node.lessons.length} bài học bên trong` : null;

  return (
    <AdultCard className={styles.editor} aria-labelledby="editor-title">
      <div className={styles.editorHead}>
        <span className={cn(adultStyles.small, adultStyles.muted)}>{KIND_LABEL[found.kind]}</span>
        <h2 className={cn(adultStyles.h2, styles.editorTitle)} id="editor-title">
          {initialName}
        </h2>
        {(found.kind === "unit" || found.kind === "lesson") && <AdultIconButton icon="trash" label={`Xóa ${initialName}`} onClick={() => setConfirmDelete(true)} />}
      </div>

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <AdultInput
          label={found.kind === "stage" ? "Tên chặng" : found.kind === "level" ? "Tên cấp" : found.kind === "unit" ? "Tên chủ đề (tiếng Anh)" : "Tên bài"}
          required
          value={name}
          lang={found.kind === "unit" ? "en" : undefined}
          error={errors.name || errors.title}
          onChange={(e) => (setName(e.target.value), clear("name"), clear("title"))}
        />

        {found.kind === "level" && (
          <div className={cn(styles.readonly, adultStyles.small)} data-level={found.node.number}>
            <span className={styles.swatch}>
              <i aria-hidden="true" />
              <span>Màu cấp: token level-{found.node.number} (cố định)</span>
            </span>
          </div>
        )}

        {found.kind === "unit" && (
          <>
            <AdultInput label="Tên tiếng Việt" required value={titleVi} error={errors.titleVi} onChange={(e) => (setTitleVi(e.target.value), clear("titleVi"))} />
            <div className={styles.formRow}>
              <AdultSelect label="Thuộc cấp" value={levelId} error={errors.levelId} onChange={(e) => (setLevelId(Number(e.target.value)), clear("levelId"))} options={levels.map((l) => [l.id, `Cấp ${l.number} · ${l.name}`] as const)} />
              <AdultInput label="Nguồn từ mục tiêu" value={source} error={errors.source} placeholder="Ví dụ: Cambridge Starters" onChange={(e) => (setSource(e.target.value), clear("source"))} />
            </div>
          </>
        )}

        {found.kind === "lesson" && (
          <>
            <AdultInput
              label="Thời lượng"
              required
              inputMode="numeric"
              value={minutes}
              error={errors.minutes}
              suffix={<span className={cn(adultStyles.small, adultStyles.muted)}>phút</span>}
              onChange={(e) => (setMinutes(e.target.value), clear("minutes"))}
            />
            <div className={cn(styles.readonly, adultStyles.small)}>
              <span>
                {found.node.steps} bước · {found.node.words} từ · {found.node.questions} câu hỏi
              </span>
              {builderHref && <AdultButtonLink href={builderHref} label="Mở trong Soạn bài học →" variant="ghost" size="s" />}
            </div>
          </>
        )}

        {(found.kind === "unit" || found.kind === "lesson") && (
          <AdultSegmented
            label="Trạng thái"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(value) => (setStatus(value), clear("status"))}
          />
        )}
        {errors.status && (
          <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
            <Icon name="warn" size={14} />
            <span>{errors.status}</span>
          </p>
        )}
        {errors.form && (
          <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
            <Icon name="warn" size={14} />
            <span>{errors.form}</span>
          </p>
        )}

        <div className={styles.actions}>
          <AdultButton type="submit" label="Lưu" icon="check" loading={busy} />
        </div>
      </form>

      {found.kind === "unit" && found.node.status === "draft" && <p className={cn(styles.foot, adultStyles.small, adultStyles.muted)}>Chủ đề nháp ẩn toàn bộ bài học bên trong với học sinh.</p>}

      <AdultDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={`Xóa “${initialName}”?`}
        actions={[{ label: "Hủy" }, { label: "Xóa", variant: "danger", icon: "trash", onClick: remove }]}
      >
        {lessonCountInfo ? `Chủ đề này và ${lessonCountInfo} sẽ bị xóa hẳn. ` : "Bài học này sẽ bị xóa hẳn. "}
        Nếu đã có học sinh học mục này thì hệ thống sẽ không cho xóa; khi đó hãy chuyển về Nháp.
      </AdultDialog>
    </AdultCard>
  );
}

/** Khung phải của chủ đề khung "Chưa có bài": tóm tắt từ mục tiêu và các bước điền tiếp bằng Excel. */
function PlannedPanel({ unit, level, rows, onOpen }: { unit: TreeUnit; level: TreeLevel; rows: TargetWordRow[] | null | undefined; onOpen: () => void }) {
  const have = rows ? rows.filter((r) => r.inBank).length : null;
  return (
    <AdultCard className={styles.editor} aria-labelledby="editor-title">
      <div className={styles.editorHead}>
        <Status kind="none" label="Chưa có bài" />
        <h2 className={cn(adultStyles.h2, styles.editorTitle)} id="editor-title" lang="en">
          {unit.title}
        </h2>
      </div>
      <p className={cn(adultStyles.body, adultStyles.muted)} style={{ margin: "0 0 var(--space-3)" }}>
        {unit.titleVi} · Cấp {level.number} · {level.name}
        {unit.source ? ` · ${unit.source}` : ""}. Chủ đề có trong khung chương trình nhưng chưa có bài học nào.
      </p>
      <div className={styles.fwk}>
        {(
          [
            ["Từ mục tiêu", nf(unit.targetWords)],
            ["Đã có sẵn", have === null ? "…" : nf(have)],
            ["Cần thêm", have === null ? "…" : nf(unit.targetWords - have)],
          ] as const
        ).map(([label, value]) => (
          <div key={label}>
            <span className={cn(adultStyles.small, adultStyles.muted)}>{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </div>
      <ol className={cn(styles.steps, adultStyles.body)}>
        <li>Xuất danh sách từ mục tiêu ra Excel.</li>
        <li>Điền phiên âm, nghĩa, câu ví dụ (bố mẹ tự điền được).</li>
        <li>
          Nhập lại bằng <b>Nhập &amp; xuất Excel › Chủ đề mới</b> — bài học được tạo ở trạng thái Nháp.
        </li>
      </ol>
      <div className={styles.stack}>
        <AdultButton label="Xem danh sách từ mục tiêu" icon="book" variant="secondary" block onClick={onOpen} />
        <div className={styles.actions}>
          <AdultButton label="Xuất Excel để điền" icon="download" variant="secondary" disabled title="Sắp có" />
          <AdultButton label="Nhập Excel" icon="upload" disabled title="Sắp có" />
        </div>
      </div>
    </AdultCard>
  );
}

type TargetRow = TargetWordRow & { state: "has" | "no" };

/** Ngăn kéo bảng từ mục tiêu của chủ đề khung: tìm, lọc Đã có / Chưa có, sắp xếp, phân trang. */
function TargetDrawer({ unit, level, rows, onClose }: { unit: TreeUnit; level: TreeLevel; rows: TargetWordRow[] | null | undefined; onClose: () => void }) {
  const table: TargetRow[] = (rows ?? []).map((r) => ({ ...r, state: r.inBank ? "has" : "no" }));
  const columns: readonly AdultColumn<TargetRow>[] = [
    { key: "n", label: "#", sort: true, align: "right", width: "var(--space-12)" },
    {
      key: "word",
      label: "Từ mục tiêu",
      sort: true,
      render: (r) => (
        <b className={styles.en} lang="en">
          {r.word}
        </b>
      ),
    },
    { key: "state", label: "Trong ngân hàng", sort: true, render: (r) => (r.inBank ? <Status kind="ok" label={`Đã có · Cấp ${r.bankLevel}`} /> : <Status kind="none" label="Chưa có" />) },
  ];
  return (
    <AdultDrawer
      open
      wide
      onClose={onClose}
      title={`Từ mục tiêu · ${unit.title}`}
      footer={
        <>
          <AdultButton label="Xuất Excel để điền" icon="download" variant="secondary" disabled title="Sắp có" />
          <AdultButton label="Nhập Excel" icon="upload" disabled title="Sắp có" />
        </>
      }
    >
      <p className={cn(adultStyles.body, adultStyles.muted)} style={{ margin: "0 0 var(--space-3)" }}>
        {unit.titleVi} · Cấp {level.number} · {level.name} · {nf(unit.targetWords)} từ mục tiêu
      </p>
      {rows === undefined ? (
        <p className={cn(adultStyles.body, adultStyles.muted)} role="status">
          Đang tải danh sách từ…
        </p>
      ) : rows === null ? (
        <AdultEmpty title="Chưa tải được danh sách từ" text="Đóng ngăn kéo rồi mở lại để thử lại." />
      ) : rows.length === 0 ? (
        <AdultEmpty title="Chưa có danh sách từ mục tiêu" text={`Khung chương trình mới ghi số lượng (${unit.targetWords} từ). Xuất tệp mẫu trống để điền, hoặc nhập danh sách có sẵn.`} />
      ) : (
        <AdultTable
          caption={`Từ mục tiêu của ${unit.title}`}
          columns={columns}
          rows={table}
          rowKey={(r) => r.n}
          searchKeys={["word"]}
          searchPlaceholder="Tìm từ mục tiêu…"
          filters={[
            {
              key: "state",
              label: "Trạng thái",
              options: [
                ["has", "Đã có trong ngân hàng"],
                ["no", "Chưa có"],
              ],
            },
          ]}
          pageSize={10}
        />
      )}
    </AdultDrawer>
  );
}

/** Hộp thoại thêm chủ đề vào một cấp hoặc bài học vào một chủ đề; mục mới luôn ở trạng thái Nháp. */
function AddDialog({ kind, parentId, parentName, onClose, onAdded }: { kind: "unit" | "lesson"; parentId: number; parentName: string; onClose: () => void; onAdded: (id: number) => void }) {
  const [title, setTitle] = useState("");
  const [titleVi, setTitleVi] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  async function submit() {
    const parsed = kind === "unit" ? addUnitSchema.safeParse({ levelId: parentId, title, titleVi }) : addLessonSchema.safeParse({ unitId: parentId, title });
    if (!parsed.success) {
      setErrors(issuesToErrors(parsed.error.issues));
      return false;
    }
    const result = await (kind === "unit" ? addUnitAction(parsed.data) : addLessonAction(parsed.data));
    if (!result.ok) {
      setErrors(resultToErrors(result));
      return false;
    }
    onAdded(result.id ?? 0);
    return true;
  }

  return (
    <AdultDialog open onClose={onClose} title={kind === "unit" ? `Thêm chủ đề vào ${parentName}` : `Thêm bài học vào “${parentName}”`} actions={[{ label: "Hủy" }, { label: "Thêm", variant: "primary", icon: "plus", onClick: submit }]}>
      <div className={styles.form}>
        <AdultInput
          label={kind === "unit" ? "Tên chủ đề (tiếng Anh)" : "Tên bài học"}
          required
          value={title}
          lang={kind === "unit" ? "en" : undefined}
          placeholder={kind === "unit" ? "Ví dụ: Sports" : "Ví dụ: Bài 5 · Fruit salad"}
          error={errors.title || errors.form}
          onChange={(e) => (setTitle(e.target.value), setErrors((x) => ({ ...x, title: "", form: "" })))}
        />
        {kind === "unit" && <AdultInput label="Tên tiếng Việt" required value={titleVi} placeholder="Ví dụ: Thể thao" error={errors.titleVi} onChange={(e) => (setTitleVi(e.target.value), setErrors((x) => ({ ...x, titleVi: "" })))} />}
        <p className={cn(adultStyles.small, adultStyles.muted)} style={{ margin: 0 }}>
          Mục mới được tạo ở trạng thái <b>Nháp</b>.
        </p>
      </div>
    </AdultDialog>
  );
}
