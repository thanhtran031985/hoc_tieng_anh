"use client";

import { useMemo, useState } from "react";
import { AdultButton, AdultCard, AdultDrawer, AdultEmpty, AdultIconButton, AdultInput, AdultSegmented, AdultSelect, AdultTable, AdultTextarea, Status, adultStyles, useToast, type AdultColumn } from "@/components/adult";
import { Icon, LevelChip, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  MAX_CHOICES,
  MAX_EXPLANATION,
  MAX_PAIRS,
  QUESTION_TYPE_INFO,
  buildPreviewStep,
  buildQuestionData,
  emptyQuestionForm,
  explanationRequired,
  type BankWord,
  type QuestionForm,
} from "@/lib/rules/admin-questions";
import type { PlayStep } from "@/lib/rules/lesson-play";
import { SKILL_LABEL, saveQuestionSchema } from "@/lib/schemas/admin-questions";
import { QUESTION_TYPES, SKILLS, type QuestionType } from "@/lib/schemas/question";
import type { QuestionRow, QuestionsData } from "@/server/admin/questions";
import { QuestionPreview } from "./QuestionPreview";
import { saveQuestionAction } from "./question-actions";
import styles from "./questions.module.css";

type Row = QuestionRow & { typeLabel: string; skillLabel: string; hasExplanation: boolean };
type Errors = Record<string, string>;

const key = (word: string) => word.trim().replace(/\s+/g, " ").toLowerCase();
const isType = (value: string): value is QuestionType => (QUESTION_TYPES as readonly string[]).includes(value);

function Difficulty({ value }: { value: number }) {
  return (
    <span className={styles.diff} role="img" aria-label={`Độ khó ${value} trên 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={cn(i <= value && styles.diffOn)} />
      ))}
    </span>
  );
}

/** Ngân hàng câu hỏi (Adult11), dạng 8.2–8.4 của giai đoạn 1: bảng có tìm, lọc, sắp xếp, phân trang; thêm / sửa trong ngăn kéo rộng; "Xem như học sinh". */
export function QuestionsView({ data }: { data: QuestionsData }) {
  // `editing`: null là đóng, "new" là thêm, số là id câu đang sửa.
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const rows: Row[] = data.rows.map((r) => ({
    ...r,
    typeLabel: QUESTION_TYPE_INFO[r.type as QuestionType]?.label ?? r.type,
    skillLabel: SKILL_LABEL[r.skill as keyof typeof SKILL_LABEL] ?? r.skill,
    hasExplanation: r.explanation !== "",
  }));
  const levelName = new Map(data.levels.map((l) => [l.number, l.name]));
  const current = typeof editing === "number" ? data.rows.find((r) => r.id === editing) : undefined;
  const addButton = <AdultButton label="Thêm câu hỏi" icon="plus" onClick={() => setEditing("new")} />;

  const columns: readonly AdultColumn<Row>[] = [
    { key: "summary", label: "Câu hỏi", sort: true, render: (r) => <span className={styles.text} lang="en" title={r.summary}>{r.summary}</span> },
    { key: "typeLabel", label: "Dạng", sort: true },
    { key: "level", label: "Cấp", sort: true, render: (r) => <LevelChip level={r.level} name={levelName.get(r.level) ?? ""} /> },
    { key: "skillLabel", label: "Kỹ năng", sort: true },
    { key: "difficulty", label: "Độ khó", sort: true, render: (r) => <Difficulty value={r.difficulty} /> },
    { key: "hasExplanation", label: "Giải thích", render: (r) => (r.hasExplanation ? <Status kind="ok" label="Có" /> : <Status kind="warn" label="Thiếu" />) },
    { key: "status", label: "Trạng thái", sort: true, render: (r) => (r.status === "published" ? <Status kind="live" label="Đã xuất bản" /> : <Status kind="draft" label="Nháp" />) },
  ];

  if (rows.length === 0) {
    return (
      <>
        <AdultCard>
          <AdultEmpty title="Chưa có câu hỏi nào" text="Thêm câu hỏi nghe và chọn hình, nối từ với hình hoặc chọn từ đúng cho hình từ các từ trong ngân hàng từ vựng." action={addButton} />
        </AdultCard>
        {editing !== null && <QuestionDrawer key="new" data={data} row={undefined} onClose={() => setEditing(null)} />}
      </>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <p className={cn(styles.sum, adultStyles.body, adultStyles.muted)}>
          {rows.length.toLocaleString("vi-VN")} câu hỏi · {rows.filter((r) => !r.hasExplanation).length.toLocaleString("vi-VN")} chưa có giải thích
        </p>
        <AdultButton label="Nhập Excel" icon="upload" variant="secondary" disabled title="Sắp có" />
        {addButton}
      </div>
      <AdultTable
        caption="Ngân hàng câu hỏi"
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        searchKeys={["summary"]}
        searchPlaceholder="Tìm nội dung câu hỏi…"
        pageSize={10}
        filters={[
          { key: "type", label: "Dạng", options: QUESTION_TYPES.map((t) => [t, QUESTION_TYPE_INFO[t].label] as const) },
          { key: "level", label: "Cấp", options: data.levels.map((l) => [String(l.number), `Cấp ${l.number} · ${l.name}`] as const), match: (r, v) => String(r.level) === v },
          { key: "skill", label: "Kỹ năng", options: SKILLS.map((s) => [s, SKILL_LABEL[s]] as const) },
          { key: "difficulty", label: "Độ khó", options: [1, 2, 3, 4, 5].map((n) => [String(n), `Độ khó ${n}`] as const), match: (r, v) => String(r.difficulty) === v },
          {
            key: "explanation",
            label: "Giải thích",
            options: [
              ["yes", "Có giải thích"],
              ["no", "Chưa có giải thích"],
            ],
            match: (r, v) => (v === "yes" ? r.hasExplanation : !r.hasExplanation),
          },
          {
            key: "status",
            label: "Trạng thái",
            options: [
              ["draft", "Nháp"],
              ["published", "Đã xuất bản"],
            ],
          },
        ]}
        onRowClick={(r) => setEditing(r.id)}
        actions={(r) => <AdultIconButton icon="pen" label={`Sửa câu hỏi: ${r.summary}`} onClick={() => setEditing(r.id)} />}
      />
      {editing !== null && <QuestionDrawer key={editing} data={data} row={current} onClose={() => setEditing(null)} />}
    </div>
  );
}

/** Ngăn kéo rộng thêm / sửa một câu hỏi; phần giữa đổi theo dạng. Lựa chọn là các từ trong ngân hàng từ vựng. */
function QuestionDrawer({ data, row, onClose }: { data: QuestionsData; row: QuestionRow | undefined; onClose: () => void }) {
  const toast = useToast();
  const [type, setType] = useState<QuestionType>(row && isType(row.type) ? row.type : "listen_choose_picture");
  const [levelId, setLevelId] = useState(row?.levelId ?? data.levels[0]?.id ?? 0);
  const [skill, setSkill] = useState<(typeof SKILLS)[number]>(row && (SKILLS as readonly string[]).includes(row.skill) ? (row.skill as (typeof SKILLS)[number]) : "vocabulary");
  const [difficulty, setDifficulty] = useState(String(row?.difficulty ?? 1));
  const [form, setForm] = useState<QuestionForm>(row?.form ?? emptyQuestionForm());
  const [explanation, setExplanation] = useState(row?.explanation ?? "");
  const [status, setStatus] = useState<"draft" | "published">(row?.status ?? "draft");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<{ step: PlayStep; level: number } | null>(null);

  const bank = useMemo(() => new Map<string, BankWord>(data.words.map((w) => [key(w.word), w])), [data.words]);
  const level = data.levels.find((l) => l.id === levelId);
  const clear = (...fields: string[]) => setErrors((e) => ({ ...e, ...Object.fromEntries(fields.map((f) => [f, ""])) }));
  const setChoice = (index: number, value: string) => setForm((f) => ({ ...f, choices: f.choices.map((c, i) => (i === index ? value : c)) }));
  const setPair = (index: number, value: string) => setForm((f) => ({ ...f, pairs: f.pairs.map((c, i) => (i === index ? value : c)) }));

  /** Kiểm toàn bộ biểu mẫu ở client (cùng luật với server); trả dữ liệu để gửi hoặc null kèm lỗi theo ô. */
  function validate() {
    const next: Errors = {};
    const built = buildQuestionData(type, form, bank);
    if (!built.ok) next[built.field] = built.message;
    if (level && explanationRequired(level.number) && !explanation.trim()) next.explanation = `Câu hỏi THCS (cấp ${level.number}) cần có giải thích để học sinh hiểu vì sao sai.`;
    const parsed = saveQuestionSchema.safeParse({ id: row?.id, type, levelId, skill, difficulty: Number(difficulty), explanation: explanation.trim() || null, status, choices: form.choices, correct: form.correct, pairs: form.pairs });
    if (!parsed.success) for (const issue of parsed.error.issues) next[typeof issue.path[0] === "string" ? issue.path[0] : "form"] ??= issue.message;
    setErrors(next);
    return Object.keys(next).length === 0 && parsed.success ? parsed.data : null;
  }

  async function save() {
    const payload = validate();
    if (!payload) return;
    setBusy(true);
    const result = await saveQuestionAction(payload);
    setBusy(false);
    if (!result.ok) {
      setErrors({ [result.field ?? "form"]: result.message });
      return;
    }
    toast(row ? "Đã lưu câu hỏi." : "Đã thêm câu hỏi.");
    onClose();
  }

  function openPreview() {
    const built = buildQuestionData(type, form, bank);
    if (!built.ok) {
      setErrors({ [built.field]: built.message });
      return;
    }
    const step = buildPreviewStep(type, form, bank);
    if (step && level) setPreview({ step, level: level.number });
  }

  const wordAt = (text: string) => bank.get(key(text));

  return (
    <AdultDrawer
      open
      wide
      onClose={onClose}
      title={row ? "Sửa câu hỏi" : "Thêm câu hỏi"}
      footer={
        <>
          <AdultButton label="Hủy" variant="ghost" onClick={onClose} />
          <span className={styles.spring} />
          <AdultButton label="Xem như học sinh" icon="eye" variant="secondary" onClick={openPreview} />
          <AdultButton label={row ? "Lưu thay đổi" : "Thêm câu hỏi"} icon="check" loading={busy} onClick={() => void save()} />
        </>
      }
    >
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <div className={adultStyles.field}>
          <span className={adultStyles.h3} id="q-type-l">
            Dạng câu hỏi
          </span>
          <div className={styles.types} role="radiogroup" aria-labelledby="q-type-l">
            {QUESTION_TYPES.map((t) => (
              <button key={t} type="button" role="radio" aria-checked={type === t} className={cn(styles.type, type === t && styles.typeOn)} onClick={() => (setType(t), setErrors({}))}>
                <b>
                  {QUESTION_TYPE_INFO[t].code} · {QUESTION_TYPE_INFO[t].label}
                </b>
                <span>{QUESTION_TYPE_INFO[t].hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.meta}>
          <AdultSelect label="Cấp" value={levelId} onChange={(e) => (setLevelId(Number(e.target.value)), clear("explanation"))} options={data.levels.map((l) => [l.id, `Cấp ${l.number} · ${l.name}`] as const)} />
          <AdultSelect label="Kỹ năng" value={skill} onChange={(e) => setSkill(e.target.value as (typeof SKILLS)[number])} options={SKILLS.map((s) => [s, SKILL_LABEL[s]] as const)} />
        </div>
        <AdultSegmented
          label="Độ khó"
          value={difficulty}
          onChange={setDifficulty}
          options={[
            ["1", "1 · Rất dễ"],
            ["2", "2"],
            ["3", "3 · Vừa"],
            ["4", "4"],
            ["5", "5 · Khó"],
          ]}
        />

        <datalist id="bank-words">
          {data.words.map((w) => (
            <option key={w.id} value={w.word} />
          ))}
        </datalist>

        {type === "match_pairs" ? (
          <fieldset className={cn(styles.group, errors.pairs && styles.groupError)} aria-describedby="q-pairs-e">
            <legend className={adultStyles.h3}>Các cặp từ – hình ({form.pairs.filter((p) => p.trim()).length}/{MAX_PAIRS})</legend>
            <div className={styles.pairs}>
              {form.pairs.map((value, i) => {
                const word = value.trim() ? wordAt(value) : undefined;
                return (
                  <div key={i} className={styles.pic}>
                    <span className={styles.thumb}>{word?.image ? <WordPicture word={word.word} src={word.image} size={56} /> : <Icon name="image" size={20} />}</span>
                    <AdultInput label={`Từ ${i + 1}`} lang="en" list="bank-words" value={value} onChange={(e) => (setPair(i, e.target.value), clear("pairs"))} />
                  </div>
                );
              })}
            </div>
            {form.pairs.length < MAX_PAIRS && <AdultButton label="Thêm cặp" icon="plus" variant="ghost" size="s" onClick={() => setForm((f) => ({ ...f, pairs: [...f.pairs, ""] }))} />}
            <p className={cn(adultStyles.hint, adultStyles.small)}>Chữ hiển thị lấy theo từ của hình (cần từ đã có hình). Thứ tự được xáo khi học sinh làm.</p>
            <GroupError id="q-pairs-e" message={errors.pairs} />
          </fieldset>
        ) : (
          <fieldset className={cn(styles.group, errors.choices && styles.groupError)} aria-describedby="q-choices-e">
            <legend className={adultStyles.h3}>
              {type === "listen_choose_picture" ? "Các hình lựa chọn · đánh dấu hình đúng (từ được đọc)" : "Các từ lựa chọn · đánh dấu từ đúng với hình"} ({form.choices.filter((c) => c.trim()).length}/{MAX_CHOICES})
            </legend>
            <div className={styles.choices}>
              {form.choices.map((value, i) => {
                const word = value.trim() ? wordAt(value) : undefined;
                return (
                  <div key={i} className={cn(styles.pic, form.correct === i && styles.picOk)}>
                    <span className={styles.thumb}>{word?.image ? <WordPicture word={word.word} src={word.image} size={56} /> : <Icon name="image" size={20} />}</span>
                    <AdultInput label={`Lựa chọn ${"ABCD"[i]}`} lang="en" list="bank-words" value={value} onChange={(e) => (setChoice(i, e.target.value), clear("choices"))} />
                    <label className={styles.radio}>
                      <input type="radio" name="q-correct" checked={form.correct === i} onChange={() => (setForm((f) => ({ ...f, correct: i })), clear("choices"))} />
                      {type === "listen_choose_picture" ? "Hình đúng" : "Từ đúng"}
                    </label>
                  </div>
                );
              })}
            </div>
            <p className={cn(adultStyles.hint, adultStyles.small)}>
              {type === "listen_choose_picture" ? "Học sinh nghe từ đúng rồi chọn hình; mọi lựa chọn cần từ đã có hình." : "Học sinh thấy hình của từ đúng rồi chọn chữ; từ đúng cần đã có hình."}
            </p>
            <GroupError id="q-choices-e" message={errors.choices} />
          </fieldset>
        )}

        <AdultTextarea
          label="Giải thích đáp án"
          rows={3}
          value={explanation}
          maxLength={MAX_EXPLANATION}
          hint={`Hiện khi học sinh trả lời chưa đúng. Bắt buộc với cấp 6–10 (THCS).`}
          error={errors.explanation}
          onChange={(e) => (setExplanation(e.target.value), clear("explanation"))}
        />
        <AdultSegmented
          label="Trạng thái"
          value={status}
          onChange={setStatus}
          options={[
            ["draft", "Nháp"],
            ["published", "Đã xuất bản"],
          ]}
        />
        {(errors.form || errors.levelId || errors.difficulty || errors.skill) && <GroupError id="q-form-e" message={errors.form || errors.levelId || errors.difficulty || errors.skill} />}
        <button type="submit" hidden />
      </form>
      {preview && <QuestionPreview step={preview.step} level={preview.level} onClose={() => setPreview(null)} />}
    </AdultDrawer>
  );
}

function GroupError({ id, message }: { id: string; message?: string }) {
  return (
    <p className={cn(adultStyles.err, adultStyles.small)} id={id} role="alert" hidden={!message}>
      <Icon name="warn" size={14} />
      <span>{message}</span>
    </p>
  );
}
