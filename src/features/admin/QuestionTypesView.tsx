"use client";

import { useMemo, useState } from "react";
import { AdultButton, AdultCard, AdultDrawer, AdultEmpty, AdultIconButton, AdultInput, AdultSegmented, AdultSelect, AdultTable, AdultTextarea, AdultToggle, Status, adultStyles, useToast, type AdultColumn } from "@/components/adult";
import { Icon, LevelChip, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  EXTRA_TYPE_INFO,
  MAX_CARDS,
  MAX_DISTRACTORS,
  buildExtraData,
  buildExtraPreviewStep,
  emptyExtraForm,
  mergeTiles,
  splitIntoTiles,
  type ExtraContext,
  type ExtraField,
  type ExtraForm,
} from "@/lib/rules/admin-question-types";
import type { BankWord } from "@/lib/rules/admin-questions";
import type { PlayStep } from "@/lib/rules/lesson-play";
import { phonicsSay } from "@/lib/rules/phonics";
import { saveExtraQuestionSchema } from "@/lib/schemas/admin-question-types";
import { EXTRA_QUESTION_TYPES, type ExtraQuestionType } from "@/lib/schemas/question-extra";
import { playPronunciation } from "@/lib/speech";
import type { ExtraQuestionRow, ExtraQuestionsData } from "@/server/admin/question-types";
import { saveExtraQuestionAction } from "./question-type-actions";
import { QuestionPreview } from "./QuestionPreview";
import styles from "./question-types.module.css";

type Row = ExtraQuestionRow & { typeLabel: string };
type Errors = Partial<Record<ExtraField | "form" | "levelId", string>>;

const key = (text: string) => text.trim().replace(/\s+/g, " ").toLowerCase();
const isType = (value: string): value is ExtraQuestionType => (EXTRA_QUESTION_TYPES as readonly string[]).includes(value);

/** Câu hỏi dạng mới (Adult18): ghép âm, sắp xếp câu, nghe và gõ, điền từ. Bảng có tìm, lọc, phân trang; "Thêm nhanh" theo dạng; ngăn kéo soạn; "Xem như học sinh". */
export function QuestionTypesView({ data }: { data: ExtraQuestionsData }) {
  // `editing`: null là đóng, { type } là thêm câu mới của dạng đó, { id } là sửa.
  const [editing, setEditing] = useState<{ type: ExtraQuestionType } | { id: number } | null>(null);
  const rows: Row[] = data.rows.map((r) => ({ ...r, typeLabel: EXTRA_TYPE_INFO[r.type as ExtraQuestionType]?.label ?? r.type }));
  const levelName = new Map(data.levels.map((l) => [l.number, l.name]));
  const current = editing && "id" in editing ? data.rows.find((r) => r.id === editing.id) : undefined;
  const newType = editing && "type" in editing ? editing.type : undefined;
  const drawer = editing !== null && (
    <QuestionTypeDrawer key={editing && "id" in editing ? editing.id : `new-${newType}`} data={data} row={current} startType={newType} onClose={() => setEditing(null)} />
  );

  const quick = (
    <section className={styles.quick} aria-label="Thêm nhanh theo dạng">
      <h2 className={cn(adultStyles.h3, styles.quickTitle)}>Thêm nhanh theo dạng</h2>
      <div className={styles.tiles}>
        {EXTRA_QUESTION_TYPES.map((t) => (
          <button key={t} type="button" className={styles.tile} onClick={() => setEditing({ type: t })} aria-label={`Thêm câu hỏi ${EXTRA_TYPE_INFO[t].label}`}>
            <span className={styles.tileIcon}>
              <Icon name={EXTRA_TYPE_INFO[t].icon} size={22} />
            </span>
            <b>{EXTRA_TYPE_INFO[t].label}</b>
            <span>{EXTRA_TYPE_INFO[t].hint}</span>
          </button>
        ))}
      </div>
    </section>
  );

  const columns: readonly AdultColumn<Row>[] = [
    { key: "summary", label: "Câu hỏi", sort: true, render: (r) => <span className={styles.text} lang="en" title={r.summary}>{r.summary}</span> },
    { key: "typeLabel", label: "Dạng", sort: true },
    { key: "level", label: "Cấp", sort: true, render: (r) => <LevelChip level={r.level} name={levelName.get(r.level) ?? ""} /> },
    { key: "status", label: "Trạng thái", sort: true, render: (r) => (r.status === "published" ? <Status kind="live" label="Đã xuất bản" /> : <Status kind="draft" label="Nháp" />) },
  ];

  if (rows.length === 0) {
    return (
      <div className={styles.page}>
        {quick}
        <AdultCard>
          <AdultEmpty
            title="Chưa có câu hỏi dạng mới"
            text="Thêm câu ghép âm, sắp xếp câu, nghe và gõ hoặc điền từ rồi gắn vào bài học ở màn Soạn bài học."
            action={<AdultButton label="Thêm câu hỏi" icon="plus" onClick={() => setEditing({ type: "phonics" })} />}
          />
        </AdultCard>
        {drawer}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <p className={cn(styles.sum, adultStyles.body, adultStyles.muted)}>{rows.length.toLocaleString("vi-VN")} câu hỏi dạng mới</p>
        <AdultButton label="Thêm câu hỏi" icon="plus" onClick={() => setEditing({ type: "phonics" })} />
      </div>
      {quick}
      <AdultTable
        caption="Câu hỏi dạng mới"
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        searchKeys={["summary"]}
        searchPlaceholder="Tìm câu hỏi dạng mới…"
        pageSize={8}
        filters={[
          { key: "type", label: "Dạng", options: EXTRA_QUESTION_TYPES.map((t) => [t, EXTRA_TYPE_INFO[t].label] as const) },
          { key: "level", label: "Cấp", options: data.levels.map((l) => [String(l.number), `Cấp ${l.number} · ${l.name}`] as const), match: (r, v) => String(r.level) === v },
        ]}
        onRowClick={(r) => setEditing({ id: r.id })}
        actions={(r) => <AdultIconButton icon="pen" label={`Sửa câu hỏi: ${r.summary}`} onClick={() => setEditing({ id: r.id })} />}
      />
      {drawer}
    </div>
  );
}

function QuestionTypeDrawer({ data, row, startType, onClose }: { data: ExtraQuestionsData; row: ExtraQuestionRow | undefined; startType: ExtraQuestionType | undefined; onClose: () => void }) {
  const toast = useToast();
  const [type, setType] = useState<ExtraQuestionType>(row && isType(row.type) ? row.type : (startType ?? "phonics"));
  const [levelId, setLevelId] = useState(row?.levelId ?? data.levels[0]?.id ?? 0);
  const [status, setStatus] = useState<"draft" | "published">(row?.status ?? "draft");
  const [form, setForm] = useState<ExtraForm>(row?.form ?? emptyExtraForm());
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<{ step: PlayStep; level: number } | null>(null);

  const ctx = useMemo<ExtraContext>(
    () => ({
      bank: new Map<string, BankWord>(data.words.map((w) => [key(w.word), w])),
      sounds: new Map(data.sounds.map((s) => [s.grapheme, { ipa: s.ipa, audio: s.audio }])),
    }),
    [data.words, data.sounds],
  );
  const level = data.levels.find((l) => l.id === levelId);
  const patch = (next: Partial<ExtraForm>, ...clear: (ExtraField | "form")[]) => {
    setForm((f) => ({ ...f, ...next }));
    if (clear.length) setErrors((e) => ({ ...e, ...Object.fromEntries(clear.map((f) => [f, ""])) }));
  };

  /** Báo lỗi của một ô khi bé... khi người soạn rời ô: chỉ hiện lỗi thuộc ô đó, và xóa lỗi cũ nếu đã đúng. */
  function checkField(field: ExtraField) {
    const built = buildExtraData(type, form, ctx);
    setErrors((e) => ({ ...e, [field]: !built.ok && built.field === field ? built.message : "" }));
  }

  function validate() {
    const next: Errors = {};
    const built = buildExtraData(type, form, ctx);
    if (!built.ok) next[built.field] = built.message;
    const parsed = saveExtraQuestionSchema.safeParse({ id: row?.id, type, levelId, status, ...form });
    if (!parsed.success) for (const issue of parsed.error.issues) next[(typeof issue.path[0] === "string" ? issue.path[0] : "form") as ExtraField | "form"] ??= issue.message;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Đưa focus vào ô lỗi đầu tiên để dùng được hoàn toàn bằng bàn phím.
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"] input, [data-invalid="true"] button')?.focus());
      return null;
    }
    return parsed.success ? parsed.data : null;
  }

  async function save() {
    const payload = validate();
    if (!payload) return;
    setBusy(true);
    const result = await saveExtraQuestionAction(payload);
    setBusy(false);
    if (!result.ok) {
      setErrors({ [result.field ?? "form"]: result.message });
      return;
    }
    toast(row ? "Đã lưu câu hỏi." : "Đã thêm câu hỏi.");
    onClose();
  }

  function openPreview() {
    const built = buildExtraData(type, form, ctx);
    if (!built.ok) {
      setErrors({ [built.field]: built.message });
      return;
    }
    const step = buildExtraPreviewStep(type, form, ctx);
    if (step && level) setPreview({ step, level: level.number });
  }

  const pictureWord = form.picture.trim() ? ctx.bank.get(key(form.picture)) : undefined;
  const pictureField = (
    <div className={styles.pictureRow}>
      <span className={styles.thumb}>{pictureWord?.image ? <WordPicture word={pictureWord.word} src={pictureWord.image} size={56} /> : <Icon name="image" size={20} />}</span>
      <AdultInput
        label="Hình minh họa (tùy chọn)"
        lang="en"
        list="extra-words"
        value={form.picture}
        hint="Chọn một từ đã có hình trong ngân hàng từ vựng."
        error={errors.picture}
        onChange={(e) => patch({ picture: e.target.value }, "picture")}
        onBlur={() => checkField("picture")}
      />
    </div>
  );

  return (
    <AdultDrawer
      open
      wide
      onClose={onClose}
      title={row ? "Sửa câu hỏi dạng mới" : "Thêm câu hỏi dạng mới"}
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
          <span className={adultStyles.h3} id="qt-type-l">
            Dạng câu hỏi
          </span>
          <div className={styles.types} role="radiogroup" aria-labelledby="qt-type-l">
            {EXTRA_QUESTION_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={type === t}
                disabled={row !== undefined && row.type !== t}
                className={cn(styles.type, type === t && styles.typeOn)}
                onClick={() => (setType(t), setErrors({}))}
              >
                <b>
                  {EXTRA_TYPE_INFO[t].code} · {EXTRA_TYPE_INFO[t].label}
                </b>
                <span>{EXTRA_TYPE_INFO[t].hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.meta}>
          <AdultSelect label="Cấp" value={levelId} onChange={(e) => setLevelId(Number(e.target.value))} options={data.levels.map((l) => [l.id, `Cấp ${l.number} · ${l.name}`] as const)} error={errors.levelId} />
          <AdultSegmented
            label="Trạng thái"
            value={status}
            onChange={setStatus}
            options={[
              ["draft", "Nháp"],
              ["published", "Đã xuất bản"],
            ]}
          />
        </div>

        <datalist id="extra-words">
          {data.words.map((w) => (
            <option key={w.id} value={w.word} />
          ))}
        </datalist>

        {type === "phonics" && (
          <>
            <div className={styles.inline}>
              <AdultInput label="Từ" lang="en" value={form.text} error={errors.text} hint="Chữ ghép một âm (sh, ch, th, ee, oo) để chung một ô." onChange={(e) => patch({ text: e.target.value, tiles: [] }, "text", "tiles")} onBlur={() => checkField("text")} />
              <AdultButton
                label="Tách thành ô âm"
                icon="wand"
                variant="secondary"
                onClick={() => {
                  if (!form.text.trim()) return setErrors((e) => ({ ...e, text: "Nhập từ cần ghép." }));
                  patch({ tiles: splitIntoTiles(form.text, ctx.sounds) }, "text", "tiles");
                }}
              />
            </div>
            <fieldset className={cn(styles.group, errors.tiles && styles.groupError)} aria-describedby="qt-tiles-e" data-invalid={errors.tiles ? "true" : undefined}>
              <legend className={adultStyles.h3}>Ô âm · chọn âm thanh cho từng ô</legend>
              {form.tiles.length === 0 ? (
                <p className={cn(adultStyles.hint, adultStyles.small)}>Nhập từ rồi bấm “Tách thành ô âm”.</p>
              ) : (
                <div className={styles.tileList}>
                  {form.tiles.map((tile, i) => {
                    const info = tile.sound ? ctx.sounds.get(tile.sound) : undefined;
                    return (
                      <div key={`${i}-${tile.t}`} className={styles.pht}>
                        <AdultInput
                          label={`Ô ${i + 1}`}
                          lang="en"
                          value={tile.t}
                          maxLength={4}
                          onChange={(e) => patch({ tiles: form.tiles.map((t, j) => (j === i ? { ...t, t: e.target.value } : t)) }, "tiles")}
                        />
                        <AdultSelect
                          label="Âm thanh"
                          value={tile.sound}
                          onChange={(e) => patch({ tiles: form.tiles.map((t, j) => (j === i ? { ...t, sound: e.target.value } : t)) }, "tiles")}
                          options={[["", "—"], ...data.sounds.map((s) => [s.grapheme, `${s.ipa ?? ""} ${s.grapheme}`.trim()] as const)]}
                        />
                        <div className={styles.phtBtns}>
                          <AdultIconButton
                            icon="speaker"
                            label={`Nghe âm của ô ${i + 1}`}
                            disabled={!tile.sound}
                            onClick={() => playPronunciation(phonicsSay(tile.sound), { audioUrl: info?.audio ?? null, rate: 0.7 })}
                          />
                          {i < form.tiles.length - 1 && <AdultButton label="Gộp" variant="ghost" size="s" onClick={() => patch({ tiles: mergeTiles(form.tiles, i, ctx.sounds) }, "tiles")} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <GroupError id="qt-tiles-e" message={errors.tiles} />
            </fieldset>
            {pictureField}
          </>
        )}

        {type === "sentence_order" && (
          <>
            <AdultInput
              label="Câu gốc"
              lang="en"
              value={form.text}
              error={errors.text}
              hint="Hệ thống tự tách mỗi từ thành một thẻ; dấu câu đi kèm từ cuối."
              onChange={(e) => patch({ text: e.target.value }, "text")}
              onBlur={() => checkField("text")}
            />
            {form.text.trim() && (
              <div className={styles.cardsPreview} aria-label="Thẻ học sinh sẽ thấy">
                <span className={cn(adultStyles.small, adultStyles.muted)}>Thẻ học sinh sẽ thấy (đã xáo trộn)</span>
                <div className={styles.chips} lang="en">
                  {form.text.trim().split(/\s+/).map((w, i) => (
                    <span key={i} className={styles.chip}>
                      {w}
                    </span>
                  ))}
                  {form.distractors
                    .split(",")
                    .map((d) => d.trim())
                    .filter(Boolean)
                    .map((d, i) => (
                      <span key={`d${i}`} className={cn(styles.chip, styles.chipNoise)}>
                        {d} · nhiễu
                      </span>
                    ))}
                </div>
              </div>
            )}
            <AdultInput
              label="Từ nhiễu (tùy chọn)"
              lang="en"
              value={form.distractors}
              error={errors.distractors}
              hint={`Cách nhau bằng dấu phẩy, tối đa ${MAX_DISTRACTORS} từ. Cấp 1–2 không nên dùng từ nhiễu.`}
              onChange={(e) => patch({ distractors: e.target.value }, "distractors")}
              onBlur={() => checkField("distractors")}
            />
            <AdultTextarea
              label="Cách sắp xếp khác cũng đúng (tùy chọn)"
              lang="en"
              rows={2}
              value={form.alternatives}
              hint="Mỗi dòng một câu dùng đúng các từ trên, khác thứ tự. Ví dụ: Every day I walk. và I walk every day."
              error={errors.alternatives}
              onChange={(e) => patch({ alternatives: e.target.value }, "alternatives")}
              onBlur={() => checkField("alternatives")}
            />
            {pictureField}
          </>
        )}

        {type === "dictation" && (
          <>
            <AdultInput
              label="Nội dung được đọc"
              lang="en"
              value={form.text}
              error={errors.text}
              hint="Từ ngắn: học sinh gõ mỗi chữ một ô. Câu: gõ một dòng."
              onChange={(e) => patch({ text: e.target.value }, "text")}
              onBlur={() => checkField("text")}
            />
            <AdultTextarea
              label="Các đáp án chấp nhận"
              lang="en"
              rows={3}
              value={form.accepted}
              hint="Mỗi dòng một đáp án. Ví dụ: I am fine. và I'm fine."
              error={errors.accepted}
              onChange={(e) => patch({ accepted: e.target.value }, "accepted")}
              onBlur={() => checkField("accepted")}
            />
            <AdultToggle label="Không phân biệt chữ hoa / thường" checked={form.ignoreCase} onChange={(v) => patch({ ignoreCase: v }, "accepted")} />
            <AdultToggle label="Bỏ qua dấu câu cuối câu" checked={form.ignoreEndPunct} onChange={(v) => patch({ ignoreEndPunct: v }, "accepted")} />
          </>
        )}

        {type === "fill_blank" && (
          <>
            <AdultInput
              label="Câu có ô trống"
              lang="en"
              value={form.text}
              error={errors.text}
              hint="Đánh dấu chỗ trống bằng ___ (ba gạch dưới), chỉ một ô trống."
              onChange={(e) => patch({ text: e.target.value }, "text")}
              onBlur={() => checkField("text")}
            />
            <fieldset className={cn(styles.group, errors.cards && styles.groupError)} aria-describedby="qt-cards-e" data-invalid={errors.cards ? "true" : undefined}>
              <legend className={adultStyles.h3}>Thẻ từ (3–{MAX_CARDS}) · chọn thẻ đúng</legend>
              <div className={styles.cardRows}>
                {form.cards.map((value, i) => (
                  <div key={i} className={cn(styles.cardRow, form.correct === i && styles.cardOk)}>
                    <b className={styles.cardNo}>{i + 1}</b>
                    <AdultInput
                      label={`Thẻ ${i + 1}${i === MAX_CARDS - 1 ? " (tùy chọn)" : ""}`}
                      lang="en"
                      value={value}
                      onChange={(e) => patch({ cards: form.cards.map((c, j) => (j === i ? e.target.value : c)) }, "cards")}
                    />
                    <label className={styles.radio}>
                      <input type="radio" name="qt-correct" checked={form.correct === i} onChange={() => patch({ correct: i }, "cards")} />
                      Đáp án đúng
                    </label>
                  </div>
                ))}
              </div>
              <GroupError id="qt-cards-e" message={errors.cards} />
            </fieldset>
            {pictureField}
          </>
        )}

        {(errors.form || errors.levelId) && <GroupError id="qt-form-e" message={errors.form || errors.levelId} />}
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
