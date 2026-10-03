"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdultButton, AdultButtonLink, AdultCard, AdultCardHead, AdultDialog, AdultError, AdultIconButton, AdultInput, AdultSegmented, AdultSkeleton, AdultTable, AdultToggle, Status, adultStyles, useToast, type AdultColumn } from "@/components/adult";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { firstRowByWord, parseLevel, type ImportErrors } from "@/lib/rules/admin-excel";
import { DEFAULT_PER_LESSON, SHEET_TOPIC, TOPIC_COLUMNS, TOPIC_WORD_COLUMNS, groupBySizes, planLessonSizes, topicWordWarnings, validateTopic, validateTopicWordRow, type TopicInfo, type TopicWordRow, type TopicWordWarnings } from "@/lib/rules/admin-excel-topic";
import type { ImportTopicResult, ParsedTopic } from "@/server/admin/excel-topic";
import { importTopicAction } from "./excel-actions";
import { readExcelFile } from "./ExcelImport";
import { Cell, DownloadLink, FileDrop, FileRow, Pill, RowErrors, Stepper, nf, sizeText } from "./excel-parts";
import styles from "./excel.module.css";

type Ok = Extract<ParsedTopic, { ok: true }>;
type Done = Extract<ImportTopicResult, { ok: true }>;
type Phase = { name: "pick" } | { name: "reading"; file: string } | { name: "error"; message: string } | { name: "preview"; file: { name: string; size: number }; parsed: Ok } | { name: "done"; result: Done };
type RowView = TopicWordRow & Record<string, unknown> & { errs: ImportErrors; bad: boolean; warn: TopicWordWarnings; flagged: boolean };

const STEPS = ["Tải tệp mẫu", "Chọn tệp", "Xem trước và sửa lỗi", "Nhập (lưu dạng Nháp)"] as const;
const PER_OPTIONS = [5, 6, 7, 8] as const;

/** Nhập chủ đề mới bằng tệp Excel 2 trang (Adult14): Chủ đề + Từ vựng; khớp chủ đề khung, báo lỗi từng dòng, cảnh báo "Từ đã có" / "Chưa có hình" không chặn nhập, tự tạo bài học Nháp. */
export function ExcelTopic() {
  const [phase, setPhase] = useState<Phase>({ name: "pick" });

  async function choose(file: File) {
    setPhase({ name: "reading", file: file.name });
    const result = await readExcelFile("/admin/excel/parse", file, { kind: "topic" });
    if (!result.ok) return setPhase({ name: "error", message: result.message });
    setPhase({ name: "preview", file: { name: file.name, size: file.size }, parsed: result.data as Ok });
  }
  const reset = () => setPhase({ name: "pick" });
  const current = phase.name === "pick" || phase.name === "error" ? 1 : phase.name === "done" ? 3 : 2;

  return (
    <div className={styles.page}>
      <Stepper labels={STEPS} current={current} />
      {phase.name === "preview" ? (
        <Preview key={phase.file.name + phase.file.size} file={phase.file} parsed={phase.parsed} onReplace={choose} onClose={reset} onDone={(result) => setPhase({ name: "done", result })} />
      ) : phase.name === "done" ? (
        <AdultCard aria-labelledby="done-title">
          <AdultCardHead id="done-title" title={`Đã nhập chủ đề “${phase.result.unitTitle}”`} sub={`Cấp ${phase.result.level}${phase.result.attached ? " · gắn vào chủ đề khung" : " · chủ đề mới"} · trạng thái Nháp`} />
          <p className={adultStyles.body}>
            {nf(phase.result.created)} từ mới, {nf(phase.result.reused)} từ đã có được dùng lại, {nf(phase.result.lessons)} bài học tạo mới. Học sinh chưa thấy cho tới khi bạn xuất bản.
          </p>
          <div className={styles.savebar}>
            <AdultButton label="Nhập chủ đề khác" variant="ghost" onClick={reset} />
            <AdultButtonLink label="Soạn bài học" icon="cards" variant="secondary" href="/admin/builder" />
            <AdultButtonLink label="Mở cấu trúc lộ trình" icon="tree" href="/admin/tree" />
          </div>
        </AdultCard>
      ) : (
        <>
          {phase.name !== "reading" && (
            <AdultCard aria-labelledby="tpl-title">
              <AdultCardHead id="tpl-title" title="1. Tải tệp mẫu “Chủ đề mới”" sub="Một tệp là một chủ đề. Bố mẹ điền được, không cần biết soạn bài." right={<DownloadLink href="/admin/excel/template?kind=topic" label="Tải tệp mẫu (.xlsx)" />} />
              <div className={styles.tpl}>
                <div className={styles.tplItem}>
                  <span className={styles.xIc}>
                    <Icon name="sheet" size={20} />
                  </span>
                  <span className={styles.grow}>
                    <b className={adultStyles.h3}>Trang 1 · {SHEET_TOPIC}</b>
                    <br />
                    <span className={cn(adultStyles.small, adultStyles.muted)}>1 dòng: {TOPIC_COLUMNS.map((c) => c.header).join(" · ")}</span>
                  </span>
                </div>
                <div className={styles.tplItem}>
                  <span className={styles.xIc}>
                    <Icon name="sheet" size={20} />
                  </span>
                  <span className={styles.grow}>
                    <b className={adultStyles.h3}>Trang 2 · Từ vựng</b>
                    <br />
                    <span className={cn(adultStyles.small, adultStyles.muted)}>{TOPIC_WORD_COLUMNS.map((c) => c.header).join(" · ")}</span>
                  </span>
                </div>
              </div>
            </AdultCard>
          )}
          <AdultCard aria-labelledby="pick-title">
            <AdultCardHead id="pick-title" title="2. Chọn tệp" />
            {phase.name === "reading" ? (
              <div role="status" aria-live="polite">
                <p className={adultStyles.body}>Đang đọc {phase.file} (2 trang)…</p>
                <AdultSkeleton height="calc(var(--space-16) * 3)" />
              </div>
            ) : phase.name === "error" ? (
              <AdultError title="Không đọc được tệp chủ đề" text={phase.message} code="XLS-422" onRetry={reset} />
            ) : (
              <FileDrop title="Kéo thả tệp .xlsx của chủ đề vào đây" hint="Cần đủ 2 trang “Chủ đề” và “Từ vựng” · tối đa 200 từ" onFile={(f) => void choose(f)} />
            )}
          </AdultCard>
        </>
      )}
    </div>
  );
}

function Preview({ file, parsed, onReplace, onClose, onDone }: { file: { name: string; size: number }; parsed: Ok; onReplace: (file: File) => void; onClose: () => void; onDone: (result: Done) => void }) {
  const router = useRouter();
  const toast = useToast();
  const { context } = parsed;
  const [topic, setTopic] = useState<TopicInfo>(parsed.topic);
  const [rows, setRows] = useState<TopicWordRow[]>(parsed.rows);
  const [touched, setTouched] = useState<ReadonlySet<string>>(new Set());
  const [auto, setAuto] = useState(true);
  const [per, setPer] = useState<number>(DEFAULT_PER_LESSON);
  const [confirm, setConfirm] = useState(false);
  const [saveError, setSaveError] = useState("");

  const bank = useMemo(() => new Map(Object.entries(context.bank)), [context.bank]);
  const pictures = useMemo(() => new Set(context.pictures), [context.pictures]);
  const checked = useMemo(() => validateTopic(topic, context.units), [topic, context.units]);
  const view = useMemo<RowView[]>(() => {
    const first = firstRowByWord(rows);
    return rows.map((r) => {
      const errs = validateTopicWordRow(r, first);
      const warn = topicWordWarnings(r.word, bank, pictures);
      return { ...r, errs, bad: Object.keys(errs).length > 0, warn, flagged: Boolean(warn.exists || warn.noImage) };
    });
  }, [rows, bank, pictures]);

  const bad = view.filter((r) => r.bad).length;
  const existing = view.filter((r) => r.warn.exists).length;
  const noImage = view.filter((r) => r.warn.noImage).length;
  const valid = view.filter((r) => !r.bad);
  const topicErrors = Object.keys(checked.errors).length;
  const levelNumber = parseLevel(topic.level);
  const sizes = useMemo(() => planLessonSizes(valid.length, per), [valid.length, per]);
  const plan = useMemo(() => groupBySizes(valid.map((r) => r.word.trim()), sizes), [valid, sizes]);
  const canImport = bad === 0 && topicErrors === 0 && rows.length > 0;
  const match = checked.match;

  const touch = (key: string) => setTouched((t) => (t.has(key) ? t : new Set(t).add(key)));
  const edit = (n: number, key: keyof TopicWordRow, value: string) => (touch(`${n}:${key}`), setRows((rs) => rs.map((r) => (r.n === n ? { ...r, [key]: value } : r))));
  const editing = (n: number, key: string) => touched.has(`${n}:${key}`);
  const removeRow = (n: number) => (setRows((rs) => rs.filter((r) => r.n !== n)), toast(`Đã xóa dòng ${n}.`));

  async function save() {
    setSaveError("");
    const result = await importTopicAction({ topic, rows, autoLessons: auto, perLesson: per });
    if (!result.ok) {
      setSaveError(result.message);
      return false;
    }
    toast(`Đã nhập “${result.unitTitle}”: ${nf(result.created + result.reused)} từ${result.lessons ? `, ${nf(result.lessons)} bài` : ""} (Nháp).`);
    router.refresh();
    onDone(result);
  }

  const columns: readonly AdultColumn<RowView>[] = [
    { key: "n", label: "Dòng", sort: true, align: "right", width: "var(--space-16)" },
    { key: "word", label: "Từ", sort: true, render: (r) => <Cell label={`Từ, dòng ${r.n}`} lang="en" value={r.word} error={r.errs.word} editing={editing(r.n, "word")} onChange={(v) => edit(r.n, "word", v)} display={<b lang="en">{r.word}</b>} /> },
    { key: "ipa", label: "Phiên âm", render: (r) => <Cell label={`Phiên âm, dòng ${r.n}`} lang="en" value={r.ipa} error={r.errs.ipa} editing={editing(r.n, "ipa")} onChange={(v) => edit(r.n, "ipa", v)} display={<span className={styles.nowrap} lang="en">{r.ipa}</span>} /> },
    { key: "pos", label: "Loại từ", render: (r) => <Cell label={`Loại từ, dòng ${r.n}`} value={r.pos} error={r.errs.pos} editing={editing(r.n, "pos")} onChange={(v) => edit(r.n, "pos", v)} size="narrow" /> },
    { key: "meaning", label: "Nghĩa", sort: true, render: (r) => <Cell label={`Nghĩa, dòng ${r.n}`} value={r.meaning} error={r.errs.meaning} editing={editing(r.n, "meaning")} onChange={(v) => edit(r.n, "meaning", v)} /> },
    {
      key: "exampleEn",
      label: "Câu ví dụ (EN / VI)",
      render: (r) => (
        <>
          <Cell label={`Câu ví dụ, dòng ${r.n}`} lang="en" value={r.exampleEn} error={r.errs.exampleEn} editing={editing(r.n, "exampleEn")} onChange={(v) => edit(r.n, "exampleEn", v)} size="wide" display={<span className={styles.clip} lang="en" title={r.exampleEn}>{r.exampleEn}</span>} />
          {r.exampleVi && <span className={cn(styles.clip, adultStyles.small, adultStyles.muted)}>{r.exampleVi}</span>}
        </>
      ),
    },
    {
      key: "errs",
      label: "Kiểm tra",
      render: (r) => (
        <div className={styles.check}>
          {r.bad ? <RowErrors errors={r.errs} /> : <Status kind="ok" label="Hợp lệ" />}
          {r.flagged && (
            <span className={styles.warn}>
              {r.warn.exists && <Status kind="info" label={`Từ đã có · ${r.warn.exists}`} />}
              {r.warn.noImage && <Status kind="draft" label="Chưa có hình" />}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <FileRow name={file.name} detail={`${sizeText(file.size)} · 2 trang: ${SHEET_TOPIC} (1 dòng) · Từ vựng (${nf(parsed.rows.length)} dòng)`} onReplace={onReplace} onClear={onClose} />
      <AdultCard aria-labelledby="prev-title">
        <div className={styles.head}>
          <div>
            <h2 className={adultStyles.h2} id="prev-title">
              3. Xem trước và sửa lỗi
            </h2>
            <span className={cn(adultStyles.small, adultStyles.muted)}>Ô viền cam sửa ngay trong bảng. Nhãn “Từ đã có” và “Chưa có hình” chỉ là cảnh báo, không chặn nhập.</span>
          </div>
          <div className={styles.sum} aria-live="polite">
            <Pill>{nf(rows.length)} dòng</Pill>
            <Pill tone="ok">{nf(rows.length - bad)} hợp lệ</Pill>
            {bad > 0 && <Pill tone="bad">{nf(bad)} dòng lỗi</Pill>}
            <Pill tone="info">{nf(view.filter((r) => r.flagged).length)} dòng có cảnh báo</Pill>
          </div>
        </div>

        <div className={styles.tcard} data-level={levelNumber ?? undefined}>
          <span className={styles.lvn} aria-hidden="true">
            {levelNumber ?? "?"}
          </span>
          <div className={styles.grow}>
            <span className={cn(adultStyles.label, adultStyles.muted)}>TRANG 1 · CHỦ ĐỀ</span>
            <h3 className={adultStyles.h2} lang="en">
              {topic.nameEn.trim() || "—"}
            </h3>
            <span className={cn(adultStyles.body, adultStyles.muted)}>
              {topic.nameVi.trim() || "—"} · Cấp {levelNumber ?? "?"}
            </span>
          </div>
          <div className={styles.tmatch}>
            {match?.kind === "planned" && <Status kind="ok" label="Khớp khung chương trình" />}
            {match?.kind === "new" && <Status kind="info" label="Chủ đề mới" />}
            {match?.kind === "exists" && <Status kind="warn" label="Chủ đề đã có bài" />}
            <span className={cn(adultStyles.small, adultStyles.muted)}>
              {match?.kind === "planned" ? `Chủ đề “Chưa có bài” · ${nf(match.unit.targetCount)} từ mục tiêu · tệp có ${nf(rows.length)} từ` : `Tệp có ${nf(rows.length)} từ`}
            </span>
          </div>
        </div>
        {topicErrors > 0 && (
          <div className={styles.topicEdit}>
            <AdultInput label="Cấp (level)" value={topic.level} error={checked.errors.level} onChange={(e) => setTopic((t) => ({ ...t, level: e.target.value }))} />
            <AdultInput label="Tên tiếng Anh (name_en)" lang="en" value={topic.nameEn} error={checked.errors.nameEn} onChange={(e) => setTopic((t) => ({ ...t, nameEn: e.target.value }))} />
            <AdultInput label="Tên tiếng Việt (name_vi)" value={topic.nameVi} error={checked.errors.nameVi} onChange={(e) => setTopic((t) => ({ ...t, nameVi: e.target.value }))} />
          </div>
        )}

        <div className={styles.tableGap}>
          <AdultTable
            caption="Các dòng trang Từ vựng"
            columns={columns}
            rows={view}
            rowKey={(r) => r.n}
            searchKeys={["word", "meaning"]}
            searchPlaceholder="Tìm trong trang Từ vựng…"
            pageSize={10}
            filters={[
              {
                key: "check",
                label: "Dòng",
                options: [
                  ["bad", "Có lỗi"],
                  ["warn", "Có cảnh báo"],
                  ["ok", "Hợp lệ, không cảnh báo"],
                ],
                match: (r, v) => (v === "bad" ? r.bad : v === "warn" ? !r.bad && r.flagged : !r.bad && !r.flagged),
              },
            ]}
            actions={(r) => <AdultIconButton icon="trash" label={`Xóa dòng ${r.n}`} onClick={() => removeRow(r.n)} />}
          />
        </div>
      </AdultCard>

      <AdultCard aria-labelledby="plan-title">
        <h2 className={cn(adultStyles.h2, "sr-only")} id="plan-title">
          Tự tạo bài học
        </h2>
        <AdultToggle label="Tự tạo bài học" sub="Chia các từ hợp lệ thành bài nhỏ, mỗi bài gồm thẻ từ + Nghe và chọn hình + Chọn từ đúng cho hình" checked={auto} onChange={setAuto} />
        {auto ? (
          <>
            <div className={styles.perrow}>
              <AdultSegmented label="Số từ mỗi bài" value={String(per)} onChange={(v) => setPer(Number(v))} options={PER_OPTIONS.map((n) => [String(n), `${n} từ`] as const)} />
              <span className={cn(adultStyles.small, adultStyles.muted)}>Mỗi bài 5–8 từ để bé không bị quá tải.</span>
            </div>
            {plan.length === 0 ? (
              <p className={cn(adultStyles.small, adultStyles.muted)}>Chưa có từ hợp lệ nào nên chưa có bài.</p>
            ) : (
              <ol className={styles.plan} aria-live="polite">
                {plan.map((words, i) => (
                  <li key={i}>
                    <span className={styles.pn}>{i + 1}</span>
                    <div>
                      <b className={adultStyles.h3}>Bài {i + 1}</b>
                      <div className={styles.pw}>
                        {words.map((w) => (
                          <span key={w} lang="en">
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className={cn(adultStyles.small, adultStyles.muted)}>{words.length} từ</span>
                    <Status kind="draft" label="Nháp" />
                  </li>
                ))}
              </ol>
            )}
            {bad > 0 && <p className={cn(adultStyles.small, adultStyles.muted)}>Dòng lỗi chưa được tính. Sửa xong, danh sách bài tự cập nhật. Nếu đủ hình, hệ thống thêm một “Trận trùm” ôn cả chủ đề.</p>}
          </>
        ) : (
          <p className={cn(adultStyles.small, adultStyles.muted)}>Chỉ thêm từ vào ngân hàng và gắn vào chủ đề; tự soạn bài sau trong <b>Soạn bài học</b>.</p>
        )}
        <div className={styles.savebar}>
          <span className={cn(adultStyles.small, adultStyles.muted)} aria-live="polite">
            {canImport ? `Sẵn sàng: ${nf(rows.length)} từ${auto ? `, ${nf(plan.length)} bài học` : ""}, tất cả ở trạng thái Nháp.` : topicErrors ? "Sửa thông tin chủ đề để nhập." : bad ? `Còn ${nf(bad)} dòng lỗi — sửa hoặc xóa để nhập.` : "Không còn từ nào để nhập."}
          </span>
          <AdultButton label="Hủy" variant="ghost" onClick={onClose} />
          <AdultButton label="Nhập" icon="upload" size="l" disabled={!canImport} onClick={() => setConfirm(true)} />
        </div>
      </AdultCard>

      <AdultDialog open={confirm} onClose={() => setConfirm(false)} title={`Nhập chủ đề “${topic.nameEn.trim()}”?`} actions={[{ label: "Hủy" }, { label: "Nhập", icon: "upload", onClick: save }]}>
        <p>
          Thêm vào <b>Cấp {levelNumber}</b> {match?.kind === "planned" ? "(gắn vào chủ đề khung có sẵn)" : "(chủ đề mới)"}: {nf(rows.length)} từ{auto ? ` và ${nf(plan.length)} bài học (tối đa ${per} từ/bài)` : ""}. Tất cả ở trạng thái <b>Nháp</b>: học sinh chưa thấy cho tới khi bạn xuất bản.
        </p>
        <p>
          {nf(existing)} từ đã có sẽ được dùng lại, không tạo bản trùng. {nf(noImage)} từ chưa có hình sẽ hiện trong cảnh báo của Bảng điều khiển.
        </p>
        {saveError && (
          <p className={adultStyles.err} role="alert">
            {saveError}
          </p>
        )}
      </AdultDialog>
    </>
  );
}
