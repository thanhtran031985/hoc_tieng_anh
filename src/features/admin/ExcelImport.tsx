"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdultButton, AdultCard, AdultCardHead, AdultDialog, AdultError, AdultIconButton, AdultSegmented, AdultSkeleton, AdultTable, Status, adultStyles, useToast, type AdultColumn } from "@/components/adult";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { VOCAB_COLUMNS, QUESTION_COLUMNS, firstRowByWord, validateQuestionRow, validateVocabRow, type ImportErrors, type QuestionImportRow, type VocabImportRow } from "@/lib/rules/admin-excel";
import { wordKey } from "@/lib/rules/admin-vocab";
import type { BankWord } from "@/lib/rules/admin-questions";
import type { ParsedImport } from "@/server/admin/excel";
import { importQuestionsAction, importVocabAction } from "./excel-actions";
import { Cell, DownloadLink, FileDrop, FileRow, Pill, RowErrors, Stepper, nf, sizeText } from "./excel-parts";
import styles from "./excel.module.css";

type Kind = "vocab" | "questions";
type Ok = Extract<ParsedImport, { ok: true }>;
type Phase = { name: "pick" } | { name: "reading"; file: string } | { name: "error"; file: string; message: string } | { name: "preview"; file: { name: string; size: number }; parsed: Ok };

const LABEL: Record<Kind, string> = { vocab: "từ vựng", questions: "câu hỏi" };
const STEPS = ["Tải tệp mẫu", "Chọn tệp", "Xem trước và sửa lỗi", "Lưu vào ngân hàng"] as const;

/** Gửi tệp lên route handler để đọc và kiểm ở server (chưa lưu gì). */
export async function readExcelFile(url: string, file: File, fields: Record<string, string>): Promise<{ ok: true; data: unknown } | { ok: false; message: string }> {
  const body = new FormData();
  body.append("file", file);
  for (const [key, value] of Object.entries(fields)) body.append(key, value);
  try {
    const response = await fetch(url, { method: "POST", body });
    const data = (await response.json()) as { ok?: boolean; message?: string };
    return data.ok ? { ok: true, data } : { ok: false, message: data.message ?? "Chưa đọc được tệp." };
  } catch {
    return { ok: false, message: "Không kết nối được máy chủ. Thử lại nhé." };
  }
}

type VocabView = VocabImportRow & Record<string, unknown> & { errs: ImportErrors; bad: boolean };
type QuestionView = QuestionImportRow & Record<string, unknown> & { errs: ImportErrors; bad: boolean };

/** Nhập từ vựng hoặc câu hỏi bằng Excel (Adult14): tải tệp mẫu → chọn tệp → xem trước báo lỗi từng dòng, sửa trong ô → lưu (chỉ bật khi hết lỗi). */
export function ExcelImport() {
  const [kind, setKind] = useState<Kind>("vocab");
  const [phase, setPhase] = useState<Phase>({ name: "pick" });

  async function choose(file: File) {
    setPhase({ name: "reading", file: file.name });
    const result = await readExcelFile("/admin/excel/parse", file, { kind });
    if (!result.ok) return setPhase({ name: "error", file: file.name, message: result.message });
    const parsed = result.data as Ok;
    setPhase({ name: "preview", file: { name: file.name, size: file.size }, parsed });
  }

  const reset = () => setPhase({ name: "pick" });
  const current = phase.name === "preview" ? 2 : phase.name === "reading" ? 2 : 1;

  return (
    <div className={styles.page}>
      <Stepper labels={STEPS} current={current} />
      {phase.name === "preview" ? (
        <Preview key={phase.file.name + phase.file.size} file={phase.file} parsed={phase.parsed} onReplace={choose} onClose={reset} />
      ) : (
        <>
          {phase.name === "pick" && (
            <AdultCard aria-labelledby="tpl-title">
              <AdultCardHead id="tpl-title" title="1. Tải tệp mẫu" sub="Giữ nguyên dòng tiêu đề; mỗi dòng là một từ hoặc một câu hỏi" />
              <div className={styles.tpl}>
                <div className={styles.tplItem}>
                  <span className={styles.xIc}>
                    <Icon name="sheet" size={20} />
                  </span>
                  <span className={styles.grow}>
                    <b className={adultStyles.h3}>Mẫu từ vựng</b>
                    <br />
                    <span className={cn(adultStyles.small, adultStyles.muted)}>{VOCAB_COLUMNS.map((c) => c.header).join(" · ")}</span>
                  </span>
                  <DownloadLink href="/admin/excel/template?kind=vocab" label="Tải .xlsx" />
                </div>
                <div className={styles.tplItem}>
                  <span className={styles.xIc}>
                    <Icon name="sheet" size={20} />
                  </span>
                  <span className={styles.grow}>
                    <b className={adultStyles.h3}>Mẫu câu hỏi</b>
                    <br />
                    <span className={cn(adultStyles.small, adultStyles.muted)}>{QUESTION_COLUMNS.map((c) => c.header).join(" · ")}</span>
                  </span>
                  <DownloadLink href="/admin/excel/template?kind=questions" label="Tải .xlsx" />
                </div>
              </div>
            </AdultCard>
          )}
          <AdultCard aria-labelledby="pick-title">
            <AdultCardHead
              id="pick-title"
              title="2. Chọn tệp"
              right={
                <AdultSegmented
                  label="Loại dữ liệu"
                  value={kind}
                  onChange={(v) => (setKind(v), reset())}
                  options={[
                    ["vocab", "Từ vựng"],
                    ["questions", "Câu hỏi"],
                  ]}
                />
              }
            />
            {phase.name === "reading" ? (
              <div role="status" aria-live="polite">
                <p className={adultStyles.body}>Đang đọc {phase.file}…</p>
                <AdultSkeleton height="calc(var(--space-16) * 3)" />
              </div>
            ) : phase.name === "error" ? (
              <AdultError title="Không đọc được tệp" text={phase.message} code="XLS-422" onRetry={reset} />
            ) : (
              <FileDrop title={`Kéo thả tệp .xlsx ${LABEL[kind]} vào đây`} onFile={(f) => void choose(f)} />
            )}
          </AdultCard>
        </>
      )}
    </div>
  );
}

function Preview({ file, parsed, onReplace, onClose }: { file: { name: string; size: number }; parsed: Ok; onReplace: (file: File) => void; onClose: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const [vocab, setVocab] = useState<VocabImportRow[]>(parsed.kind === "vocab" ? parsed.rows : []);
  const [questions, setQuestions] = useState<QuestionImportRow[]>(parsed.kind === "questions" ? parsed.rows : []);
  const [touched, setTouched] = useState<ReadonlySet<string>>(new Set());
  const [confirm, setConfirm] = useState(false);
  const [saveError, setSaveError] = useState("");

  const vocabCtx = useMemo(() => (parsed.kind === "vocab" ? { bank: new Map(Object.entries(parsed.context.bank)), topicsByLevel: parsed.context.topicsByLevel } : null), [parsed]);
  const questionBank = useMemo(() => (parsed.kind === "questions" ? new Map<string, BankWord>(parsed.context.words.map((w) => [wordKey(w.word), w])) : null), [parsed]);

  const vocabRows = useMemo<VocabView[]>(() => {
    if (!vocabCtx) return [];
    const first = firstRowByWord(vocab);
    return vocab.map((r) => {
      const errs = validateVocabRow(r, vocabCtx, first);
      return { ...r, errs, bad: Object.keys(errs).length > 0 };
    });
  }, [vocab, vocabCtx]);
  const questionRows = useMemo<QuestionView[]>(() => {
    if (!questionBank) return [];
    return questions.map((r) => {
      const errs = validateQuestionRow(r, { bank: questionBank });
      return { ...r, errs, bad: Object.keys(errs).length > 0 };
    });
  }, [questions, questionBank]);

  const rows = parsed.kind === "vocab" ? vocabRows : questionRows;
  const bad = rows.filter((r) => r.bad).length;
  const total = rows.length;
  const noun = LABEL[parsed.kind];

  const touch = (key: string) => setTouched((t) => (t.has(key) ? t : new Set(t).add(key)));
  const editVocab = (n: number, key: keyof VocabImportRow, value: string) => (touch(`${n}:${key}`), setVocab((rs) => rs.map((r) => (r.n === n ? { ...r, [key]: value } : r))));
  const editQuestion = (n: number, patch: Partial<QuestionImportRow>, key: string) => (touch(`${n}:${key}`), setQuestion(n, patch));
  const setQuestion = (n: number, patch: Partial<QuestionImportRow>) => setQuestions((rs) => rs.map((r) => (r.n === n ? { ...r, ...patch } : r)));
  const removeRow = (n: number) => {
    if (parsed.kind === "vocab") setVocab((rs) => rs.filter((r) => r.n !== n));
    else setQuestions((rs) => rs.filter((r) => r.n !== n));
    toast(`Đã xóa dòng ${n}.`);
  };

  async function save() {
    setSaveError("");
    const result = parsed.kind === "vocab" ? await importVocabAction(vocab) : await importQuestionsAction(questions);
    if (!result.ok) {
      setSaveError(result.message);
      return false;
    }
    toast(`Đã thêm ${nf(result.count ?? total)} ${noun} vào ngân hàng.`);
    router.refresh();
    onClose();
  }

  const editing = (n: number, key: string) => touched.has(`${n}:${key}`);
  const check = (r: { errs: ImportErrors; bad: boolean }) => (r.bad ? <RowErrors errors={r.errs} /> : <Status kind="ok" label="Hợp lệ" />);

  const vocabColumns: readonly AdultColumn<VocabView>[] = [
    { key: "n", label: "Dòng", sort: true, align: "right", width: "var(--space-16)" },
    { key: "word", label: "Từ", sort: true, render: (r) => <Cell label={`Từ, dòng ${r.n}`} lang="en" value={r.word} error={r.errs.word} editing={editing(r.n, "word")} onChange={(v) => editVocab(r.n, "word", v)} display={<b lang="en">{r.word}</b>} /> },
    { key: "ipa", label: "IPA", render: (r) => <Cell label={`Phiên âm, dòng ${r.n}`} lang="en" value={r.ipa} error={r.errs.ipa} editing={editing(r.n, "ipa")} onChange={(v) => editVocab(r.n, "ipa", v)} display={<span className={styles.nowrap} lang="en">{r.ipa}</span>} /> },
    { key: "pos", label: "Loại từ", render: (r) => <Cell label={`Loại từ, dòng ${r.n}`} value={r.pos} error={r.errs.pos} editing={editing(r.n, "pos")} onChange={(v) => editVocab(r.n, "pos", v)} size="narrow" /> },
    { key: "meaning", label: "Nghĩa", sort: true, render: (r) => <Cell label={`Nghĩa, dòng ${r.n}`} value={r.meaning} error={r.errs.meaning} editing={editing(r.n, "meaning")} onChange={(v) => editVocab(r.n, "meaning", v)} /> },
    {
      key: "exampleEn",
      label: "Câu ví dụ",
      render: (r) => (
        <Cell label={`Câu ví dụ, dòng ${r.n}`} lang="en" value={r.exampleEn} error={r.errs.exampleEn} editing={editing(r.n, "exampleEn")} onChange={(v) => editVocab(r.n, "exampleEn", v)} size="wide" display={<span className={styles.clip} lang="en" title={r.exampleEn}>{r.exampleEn}</span>} />
      ),
    },
    { key: "level", label: "Cấp", sort: true, render: (r) => <Cell label={`Cấp, dòng ${r.n}`} value={r.level} error={r.errs.level} editing={editing(r.n, "level")} onChange={(v) => editVocab(r.n, "level", v)} size="narrow" /> },
    { key: "topic", label: "Chủ đề", render: (r) => <Cell label={`Chủ đề, dòng ${r.n}`} lang="en" value={r.topic} error={r.errs.topic} editing={editing(r.n, "topic")} onChange={(v) => editVocab(r.n, "topic", v)} display={<span lang="en">{r.topic || "—"}</span>} /> },
    { key: "errs", label: "Kiểm tra", render: (r) => <div className={styles.check}>{check(r)}</div> },
  ];

  const questionColumns: readonly AdultColumn<QuestionView>[] = [
    { key: "n", label: "Dòng", sort: true, align: "right", width: "var(--space-16)" },
    { key: "type", label: "Dạng", render: (r) => <Cell label={`Dạng, dòng ${r.n}`} value={r.type} error={r.errs.type} editing={editing(r.n, "type")} onChange={(v) => editQuestion(r.n, { type: v }, "type")} size="wide" /> },
    {
      key: "options",
      label: "Lựa chọn",
      render: (r) =>
        r.errs.options || editing(r.n, "options") ? (
          <div className={styles.opts}>
            {r.options.map((o, i) => (
              <input
                key={i}
                className={cn(adultStyles.input, styles.cell)}
                aria-label={`Lựa chọn ${i + 1}, dòng ${r.n}`}
                aria-invalid={r.errs.options ? true : undefined}
                lang="en"
                value={o}
                onChange={(e) => editQuestion(r.n, { options: r.options.map((x, j) => (j === i ? e.target.value : x)) }, "options")}
              />
            ))}
          </div>
        ) : (
          <span className={styles.clip} lang="en" title={r.options.filter(Boolean).join(" · ")}>
            {r.options.filter(Boolean).join(" · ")}
          </span>
        ),
    },
    { key: "answer", label: "Từ đúng", render: (r) => <Cell label={`Từ đúng, dòng ${r.n}`} lang="en" value={r.answer} error={r.errs.answer} editing={editing(r.n, "answer")} onChange={(v) => editQuestion(r.n, { answer: v }, "answer")} display={<b lang="en">{r.answer || "—"}</b>} /> },
    { key: "level", label: "Cấp", sort: true, render: (r) => <Cell label={`Cấp, dòng ${r.n}`} value={r.level} error={r.errs.level} editing={editing(r.n, "level")} onChange={(v) => editQuestion(r.n, { level: v }, "level")} size="narrow" /> },
    {
      key: "skill",
      label: "Thông tin",
      render: (r) =>
        r.errs.skill || r.errs.difficulty || r.errs.status || r.errs.explanation || editing(r.n, "info") ? (
          <div className={styles.check}>
            <Cell label={`Kỹ năng, dòng ${r.n}`} value={r.skill} error={r.errs.skill} editing onChange={(v) => editQuestion(r.n, { skill: v }, "info")} />
            <Cell label={`Độ khó, dòng ${r.n}`} value={r.difficulty} error={r.errs.difficulty} editing onChange={(v) => editQuestion(r.n, { difficulty: v }, "info")} size="narrow" />
            <Cell label={`Trạng thái, dòng ${r.n}`} value={r.status} error={r.errs.status} editing onChange={(v) => editQuestion(r.n, { status: v }, "info")} />
            <Cell label={`Giải thích, dòng ${r.n}`} value={r.explanation} error={r.errs.explanation} editing onChange={(v) => editQuestion(r.n, { explanation: v }, "info")} size="wide" />
          </div>
        ) : (
          <span className={cn(adultStyles.small, adultStyles.muted)}>
            {r.skill || "vocabulary"} · độ khó {r.difficulty || "1"} · {r.status || "draft"}
          </span>
        ),
    },
    { key: "errs", label: "Kiểm tra", render: (r) => <div className={styles.check}>{check(r)}</div> },
  ];

  const filters = [{ key: "check", label: "Dòng", options: [["bad", "Chỉ dòng lỗi"], ["ok", "Chỉ dòng hợp lệ"]] as const, match: (r: { bad: boolean }, v: string) => (v === "bad" ? r.bad : !r.bad) }];
  const actions = (r: { n: number }) => <AdultIconButton icon="trash" label={`Xóa dòng ${r.n}`} onClick={() => removeRow(r.n)} />;

  return (
    <>
      <FileRow name={file.name} detail={`${sizeText(file.size)} · trang “${parsed.sheet}” · ${nf(total)} dòng dữ liệu`} onReplace={onReplace} onClear={onClose} />
      <AdultCard aria-labelledby="prev-title">
        <div className={styles.head}>
          <div>
            <h2 className={adultStyles.h2} id="prev-title">
              3. Xem trước và sửa lỗi
            </h2>
            <span className={cn(adultStyles.small, adultStyles.muted)}>Sửa ngay trong ô viền cam, hoặc xóa dòng không cần.</span>
          </div>
          <div className={styles.sum} aria-live="polite">
            <Pill>{nf(total)} dòng</Pill>
            <Pill tone="ok">{nf(total - bad)} hợp lệ</Pill>
            {bad > 0 && <Pill tone="bad">{nf(bad)} dòng lỗi</Pill>}
          </div>
        </div>
        {parsed.kind === "vocab" ? (
          <AdultTable caption="Các dòng từ vựng trong tệp" columns={vocabColumns} rows={vocabRows} rowKey={(r) => r.n} searchKeys={["word", "meaning"]} searchPlaceholder="Tìm trong tệp…" pageSize={10} filters={filters} actions={actions} />
        ) : (
          <AdultTable caption="Các dòng câu hỏi trong tệp" columns={questionColumns} rows={questionRows} rowKey={(r) => r.n} searchKeys={["type", "answer"]} searchPlaceholder="Tìm trong tệp…" pageSize={10} filters={filters} actions={actions} />
        )}
        <div className={styles.savebar}>
          <span className={cn(adultStyles.small, adultStyles.muted)} aria-live="polite">
            {total === 0 ? "Không còn dòng nào để lưu." : bad ? `Còn ${nf(bad)} dòng lỗi — sửa hết để lưu.` : `Tất cả ${nf(total)} dòng hợp lệ.`}
          </span>
          <AdultButton label="Hủy nhập" variant="ghost" onClick={onClose} />
          <AdultButton label={`Lưu ${nf(total)} ${noun} vào ngân hàng`} icon="check" size="l" disabled={bad > 0 || total === 0} onClick={() => setConfirm(true)} />
        </div>
      </AdultCard>

      <AdultDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title={`Lưu ${nf(total)} ${noun} vào ngân hàng?`}
        actions={[{ label: "Hủy" }, { label: `Lưu ${nf(total)} ${noun}`, icon: "check", onClick: save }]}
      >
        {parsed.kind === "vocab" ? (
          <p>Từ được thêm vào ngân hàng ngay (cấp và chủ đề theo từng dòng). Từ chưa nằm trong bài nào cho đến khi bạn thêm ở Soạn bài học; từ chưa có hình sẽ hiện trong cảnh báo của Bảng điều khiển.</p>
        ) : (
          <p>Câu hỏi được thêm vào Ngân hàng câu hỏi với trạng thái ghi ở từng dòng (mặc định Nháp).</p>
        )}
        {saveError && (
          <p className={adultStyles.err} role="alert">
            {saveError}
          </p>
        )}
      </AdultDialog>
    </>
  );
}
