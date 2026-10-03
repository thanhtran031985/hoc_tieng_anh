"use client";

import { useState } from "react";
import { AdultButton, AdultButtonLink, AdultCard, AdultDrawer, AdultEmpty, AdultIconButton, AdultInput, AdultSelect, AdultTable, AdultTextarea, adultStyles, useToast, type AdultColumn } from "@/components/adult";
import { Icon, LevelChip, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import { PARTS_OF_SPEECH } from "@/lib/schemas/content";
import { PART_OF_SPEECH_LABEL, saveWordSchema } from "@/lib/schemas/admin-vocab";
import type { VocabData, VocabRow } from "@/server/admin/vocab";
import { saveWordAction } from "./vocab-actions";
import styles from "./vocab.module.css";

type Row = VocabRow & { posLabel: string; topicText: string; hasImage: boolean; hasAudio: boolean };
type Errors = Record<string, string>;

const nf = (n: number) => n.toLocaleString("vi-VN");
const posLabel = (pos: string) => PART_OF_SPEECH_LABEL[pos as keyof typeof PART_OF_SPEECH_LABEL] ?? pos;

/** Ngân hàng từ vựng (Adult10): bảng có tìm, lọc theo cấp / chủ đề / thiếu hình–âm, sắp xếp, phân trang; sửa và thêm từ trong ngăn kéo. */
export function VocabView({ data }: { data: VocabData }) {
  // `editing`: null là đóng, "new" là thêm từ, số là id từ đang sửa.
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const levelName = new Map(data.levels.map((l) => [l.number, l.name]));

  const rows: Row[] = data.rows.map((r) => ({ ...r, posLabel: posLabel(r.pos), topicText: r.topics.join(", "), hasImage: Boolean(r.image), hasAudio: Boolean(r.audio) }));
  const noImage = rows.filter((r) => !r.hasImage).length;
  const noAudio = rows.filter((r) => !r.hasAudio).length;
  const topicNames = [...new Set(rows.flatMap((r) => r.topics))].sort((a, b) => a.localeCompare(b));
  const current = typeof editing === "number" ? data.rows.find((r) => r.id === editing) : undefined;

  const columns: readonly AdultColumn<Row>[] = [
    {
      key: "word",
      label: "Từ",
      sort: true,
      render: (r) => (
        <span className={styles.word}>
          <span className={cn(styles.thumb, !r.hasImage && styles.thumbMiss)}>{r.hasImage ? <WordPicture word={r.word} src={r.image} size={30} /> : <Icon name="image" size={16} />}</span>
          <b lang="en">{r.word}</b>
        </span>
      ),
    },
    {
      key: "ipa",
      label: "Phiên âm",
      render: (r) => (
        <span className={styles.ipa} lang="en">
          {r.ipa}
        </span>
      ),
    },
    { key: "posLabel", label: "Loại từ", sort: true },
    { key: "meaning", label: "Nghĩa", sort: true },
    { key: "level", label: "Cấp", sort: true, render: (r) => <LevelChip level={r.level} name={levelName.get(r.level) ?? ""} /> },
    { key: "topicText", label: "Chủ đề", sort: true },
    {
      key: "hasImage",
      label: "Hình · Âm",
      render: (r) => (
        <span className={styles.has}>
          <span className={cn(!r.hasImage && styles.no)} title={r.hasImage ? "Có hình" : "Chưa có hình"} aria-label={r.hasImage ? "Có hình" : "Chưa có hình"} role="img">
            <Icon name="image" size={14} />
          </span>
          <span className={cn(!r.hasAudio && styles.no)} title={r.hasAudio ? "Có âm thanh" : "Chưa có âm thanh"} aria-label={r.hasAudio ? "Có âm thanh" : "Chưa có âm thanh"} role="img">
            <Icon name="music" size={14} />
          </span>
        </span>
      ),
    },
  ];

  const addButton = <AdultButton label="Thêm từ" icon="plus" onClick={() => setEditing("new")} />;

  if (rows.length === 0) {
    return (
      <>
        <AdultCard>
          <AdultEmpty
            title="Chưa có từ nào"
            text="Thêm từng từ ở đây; nhập nhiều từ một lúc bằng tệp Excel mẫu sẽ có ở bước sau."
            action={addButton}
          />
        </AdultCard>
        {editing !== null && <WordDrawer key="new" data={data} row={undefined} onClose={() => setEditing(null)} />}
      </>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <p className={cn(styles.sum, adultStyles.body, adultStyles.muted)}>
          {nf(rows.length)} từ · {nf(noImage)} chưa có hình · {nf(noAudio)} chưa có âm thanh
        </p>
        <AdultButtonLink label="Nhập Excel" icon="upload" variant="secondary" href="/admin/excel" />
        {addButton}
      </div>
      <AdultTable
        caption="Ngân hàng từ vựng"
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        searchKeys={["word", "meaning", "ipa"]}
        searchPlaceholder="Tìm từ, nghĩa hoặc phiên âm…"
        pageSize={10}
        filters={[
          { key: "level", label: "Cấp", options: data.levels.map((l) => [String(l.number), `Cấp ${l.number} · ${l.name}`] as const), match: (r, v) => String(r.level) === v },
          { key: "topic", label: "Chủ đề", options: topicNames.map((t) => [t, t] as const), match: (r, v) => r.topics.includes(v) },
          {
            key: "missing",
            label: "Thiếu",
            options: [
              ["image", "Chưa có hình"],
              ["audio", "Chưa có âm thanh"],
            ],
            match: (r, v) => (v === "image" ? !r.hasImage : !r.hasAudio),
          },
        ]}
        onRowClick={(r) => setEditing(r.id)}
        actions={(r) => <AdultIconButton icon="pen" label={`Sửa từ ${r.word}`} onClick={() => setEditing(r.id)} />}
      />
      {editing !== null && <WordDrawer key={editing} data={data} row={current} onClose={() => setEditing(null)} />}
    </div>
  );
}

/** Ngăn kéo thêm / sửa một từ. Hình và âm thanh chỉ xem ở đây; gán hình ở Thư viện hình ảnh, giọng đọc GĐ1 dùng giọng trình duyệt. */
function WordDrawer({ data, row, onClose }: { data: VocabData; row: VocabRow | undefined; onClose: () => void }) {
  const toast = useToast();
  const [word, setWord] = useState(row?.word ?? "");
  const [ipa, setIpa] = useState(row?.ipa ?? "");
  const [pos, setPos] = useState(row?.pos || "noun");
  const [meaning, setMeaning] = useState(row?.meaning ?? "");
  const [exampleEn, setExampleEn] = useState(row?.exampleEn ?? "");
  const [exampleVi, setExampleVi] = useState(row?.exampleVi ?? "");
  const [levelId, setLevelId] = useState(row?.levelId ?? data.levels[0]?.id ?? 0);
  const [topic, setTopic] = useState(row?.topics[0] ?? "");
  const [topicChanged, setTopicChanged] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const clear = (...fields: string[]) => setErrors((e) => ({ ...e, ...Object.fromEntries(fields.map((f) => [f, ""])) }));
  const levelOptions = data.topicsByLevel[levelId] ?? [];
  // Chủ đề hiện tại của từ có thể không nằm trong cây của cấp: vẫn hiện để không mất khi lưu.
  const topicOptions = topic && !levelOptions.includes(topic) ? [topic, ...levelOptions] : levelOptions;

  async function save() {
    const parsed = saveWordSchema.safeParse({
      id: row?.id,
      word,
      ipa,
      partOfSpeech: pos,
      meaningVi: meaning,
      exampleEn,
      exampleVi: exampleVi.trim() || null,
      levelId,
      topic: topicChanged ? topic || null : undefined,
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[typeof issue.path[0] === "string" ? issue.path[0] : "form"] ??= issue.message;
      setErrors(next);
      return;
    }
    setBusy(true);
    const result = await saveWordAction(parsed.data);
    setBusy(false);
    if (!result.ok) {
      setErrors({ [result.field ?? "form"]: result.message });
      return;
    }
    toast(`${row ? "Đã lưu" : "Đã thêm"} “${parsed.data.word}”.`);
    onClose();
  }

  return (
    <AdultDrawer
      open
      onClose={onClose}
      title={row ? `Sửa từ “${row.word}”` : "Thêm từ mới"}
      footer={
        <>
          <AdultButton label="Hủy" variant="ghost" onClick={onClose} />
          <AdultButton label={row ? "Lưu thay đổi" : "Thêm từ"} icon="check" loading={busy} onClick={() => void save()} />
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
        <div className={styles.grid}>
          <AdultInput label="Từ tiếng Anh" required lang="en" value={word} error={errors.word} onChange={(e) => (setWord(e.target.value), clear("word", "exampleEn"))} />
          <AdultInput label="Phiên âm IPA" required lang="en" placeholder="/ˈæp.əl/" value={ipa} error={errors.ipa} onChange={(e) => (setIpa(e.target.value), clear("ipa"))} />
          <AdultSelect label="Loại từ" value={pos} error={errors.partOfSpeech} onChange={(e) => setPos(e.target.value)} options={PARTS_OF_SPEECH.map((p) => [p, PART_OF_SPEECH_LABEL[p]] as const)} />
          <AdultInput label="Nghĩa tiếng Việt" required value={meaning} error={errors.meaningVi} onChange={(e) => (setMeaning(e.target.value), clear("meaningVi"))} />
        </div>
        <AdultTextarea
          label="Câu ví dụ (tiếng Anh)"
          required
          lang="en"
          rows={2}
          value={exampleEn}
          hint="Câu phải chứa từ đang soạn."
          error={errors.exampleEn}
          onChange={(e) => (setExampleEn(e.target.value), clear("exampleEn"))}
        />
        <AdultTextarea label="Dịch câu ví dụ" rows={2} value={exampleVi} error={errors.exampleVi} onChange={(e) => (setExampleVi(e.target.value), clear("exampleVi"))} />

        <section className={styles.section} aria-label="Hình ảnh">
          <h3 className={adultStyles.h3}>Hình ảnh</h3>
          <div className={styles.media}>
            <div className={cn(styles.imgbox, row?.image && styles.imgboxHas)}>
              {row?.image ? (
                <WordPicture word={row.word} src={row.image} size={100} />
              ) : (
                <>
                  <Icon name="image" size={24} />
                  <span>Chưa có hình</span>
                </>
              )}
            </div>
            <p className={cn(adultStyles.small, adultStyles.muted)}>Gán hoặc tải hình lên ở mục Hình ảnh &amp; âm thanh (sắp có).</p>
          </div>
        </section>

        <section className={styles.section} aria-label="Âm thanh">
          <h3 className={adultStyles.h3}>Âm thanh</h3>
          <div className={styles.audio}>
            <span className={cn(adultStyles.small, adultStyles.muted)}>{row?.audio ? `Tệp: ${row.audio}` : "Chưa có tệp âm thanh. Giai đoạn 1 đọc bằng giọng có sẵn của trình duyệt."}</span>
            <AdultButton label="Tạo giọng đọc tự động" icon="speaker" variant="secondary" size="s" disabled title="Sắp có" />
          </div>
        </section>

        <div className={cn(styles.grid, styles.section)}>
          <AdultSelect
            label="Cấp"
            value={levelId}
            onChange={(e) => {
              const next = Number(e.target.value);
              setLevelId(next);
              setTopic(data.topicsByLevel[next]?.[0] ?? "");
              setTopicChanged(true);
            }}
            options={data.levels.map((l) => [l.id, `Cấp ${l.number} · ${l.name}`] as const)}
          />
          <AdultSelect
            label="Chủ đề"
            value={topic}
            error={errors.topic}
            hint="Chủ đề theo cây lộ trình của cấp đã chọn."
            onChange={(e) => (setTopic(e.target.value), setTopicChanged(true), clear("topic"))}
            options={[["", "Không thuộc chủ đề"], ...topicOptions.map((t) => [t, t] as const)]}
          />
        </div>
        {errors.form && (
          <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
            <Icon name="warn" size={14} />
            <span>{errors.form}</span>
          </p>
        )}
        <button type="submit" hidden />
      </form>
    </AdultDrawer>
  );
}
