"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdultButton, AdultButtonLink, AdultCard, AdultDrawer, AdultEmpty, AdultIconButton, AdultInput, AdultSelect, AdultTable, AdultTextarea, adultStyles, useToast, type AdultColumn } from "@/components/adult";
import { Icon, LevelChip, SpeakerButton, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import { familyFilterState, familyRefLabel, splitFamilyChips, type WordFamilyRef } from "@/lib/rules/admin-vocab";
import { TTS_UI_BATCH_SIZE, hasFullAudio } from "@/lib/rules/tts";
import { PARTS_OF_SPEECH } from "@/lib/schemas/content";
import { PART_OF_SPEECH_LABEL, saveWordSchema } from "@/lib/schemas/admin-vocab";
import type { VocabData, VocabRow } from "@/server/admin/vocab";
import { AudioBatchStatus } from "./AudioBatchStatus";
import { ExplorerDrawer } from "./ExplorerDrawer";
import { FamilyDrawer } from "./FamilyDrawer";
import { useAudioBatch } from "./useAudioBatch";
import { saveWordAction } from "./vocab-actions";
import styles from "./vocab.module.css";

type Row = VocabRow & { posLabel: string; topicText: string; hasImage: boolean; hasAudio: boolean; explorerState: "published" | "draft" | "none"; familyCount: number; familyState: "has" | "none" };
type Errors = Record<string, string>;

const nf = (n: number) => n.toLocaleString("vi-VN");
const fileName = (path: string) => path.split("/").pop() ?? path;
const posLabel = (pos: string) => PART_OF_SPEECH_LABEL[pos as keyof typeof PART_OF_SPEECH_LABEL] ?? pos;

/** Chip một họ vần của từ (task 30): bấm để mở họ đó. Bẫy có chữ “Bẫy”, họ Nháp nét đứt và mờ hơn (như cột Khám phá). */
function FamilyChip({ word, family, onOpen }: { word: string; family: WordFamilyRef; onOpen: (familyId: number) => void }) {
  return (
    <button
      type="button"
      className={cn(styles.fam, family.sameSound ? styles.famSame : styles.famTrap, family.status === "draft" && styles.famDraft)}
      aria-label={`Mở họ vần ${familyRefLabel(family)} của từ ${word}`}
      title={`Họ vần -${family.pattern} ${family.soundIpa} · ${family.sameSound ? "cùng âm" : "bẫy chính tả (khác âm)"} · ${family.status === "published" ? "đã xuất bản" : "nháp"}`}
      onClick={() => onOpen(family.familyId)}
    >
      <span lang="en">-{family.pattern}</span>
      {!family.sameSound && <small>Bẫy</small>}
    </button>
  );
}

/** Ngân hàng từ vựng (Adult10): bảng có tìm, lọc theo cấp / chủ đề / thiếu hình–âm, sắp xếp, phân trang; sửa và thêm từ trong ngăn kéo. */
export function VocabView({ data }: { data: VocabData }) {
  // `editing`: null là đóng, "new" là thêm từ, số là id từ đang sửa.
  const [editing, setEditing] = useState<number | "new" | null>(null);
  // `exploring`: id từ đang soạn Khám phá (ngăn kéo rộng riêng).
  const [exploring, setExploring] = useState<number | null>(null);
  // `familyOpen`: id họ vần đang mở (ngăn kéo Họ vần của task 26); `familyVersion` mở lại ngăn kéo với dữ liệu mới sau khi lưu.
  const [familyOpen, setFamilyOpen] = useState<number | null>(null);
  const [familyVersion, setFamilyVersion] = useState(0);
  const levelName = new Map(data.levels.map((l) => [l.number, l.name]));
  const router = useRouter();
  const batch = useAudioBatch(() => router.refresh());
  const canMake = data.mp3Enabled && data.ttsAvailable;
  const why = !data.ttsAvailable ? "Máy chủ này chưa có công cụ tạo giọng đọc" : !data.mp3Enabled ? "Bật “Giọng mp3” ở Hình ảnh & âm thanh để tạo giọng đọc" : undefined;

  const rows: Row[] = data.rows.map((r) => ({ ...r, posLabel: posLabel(r.pos), topicText: r.topics.join(", "), hasImage: Boolean(r.image), hasAudio: hasFullAudio(r), explorerState: r.explorer?.status ?? "none", familyCount: r.families.length, familyState: familyFilterState(r.families) }));
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
    {
      key: "explorerState",
      label: "Khám phá",
      sort: true,
      render: (r) =>
        r.explorer ? (
          <span className={cn(styles.exp, r.explorer.status === "published" ? styles.expOn : styles.expDraft)} title={r.explorer.status === "published" ? "Đã xuất bản" : "Nháp (chưa tới bé)"}>
            <Icon name="branch" size={14} />
            {r.explorer.count} nhánh · {r.explorer.status === "published" ? "Đã xuất bản" : "Nháp"}
          </span>
        ) : (
          <span className={cn(adultStyles.small, adultStyles.muted)}>Chưa có</span>
        ),
    },
    {
      key: "familyCount",
      label: "Họ vần",
      sort: true,
      render: (r) => {
        if (r.families.length === 0) return <span className={cn(adultStyles.small, adultStyles.muted)}>Chưa có</span>;
        const { shown, more } = splitFamilyChips(r.families);
        return (
          <span className={styles.fams}>
            {shown.map((f) => (
              <FamilyChip key={f.familyId} word={r.word} family={f} onOpen={setFamilyOpen} />
            ))}
            {more > 0 && (
              <span className={styles.famMore} title={r.families.slice(shown.length).map((f) => `-${f.pattern}`).join(", ")}>
                +{more}
              </span>
            )}
          </span>
        );
      },
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
      <AudioBatchStatus state={batch.state} onStop={batch.stop} />
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
            key: "explorer",
            label: "Khám phá",
            options: [
              ["published", "Đã xuất bản"],
              ["draft", "Nháp"],
              ["none", "Chưa có"],
            ],
            match: (r, v) => r.explorerState === v,
          },
          {
            key: "family",
            label: "Họ vần",
            options: [
              ["has", "Đã thuộc họ vần"],
              ["none", "Chưa có"],
            ],
            match: (r, v) => r.familyState === v,
          },
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
        toolbarRight={(visible) => {
          const todo = visible.filter((r) => !r.hasAudio).map((r) => r.id);
          return (
            <AdultButton
              label={todo.length > 0 ? `Tạo giọng đọc cho ${nf(todo.length)} từ đang lọc` : "Các từ đang lọc đã đủ giọng đọc"}
              icon="speaker"
              variant="secondary"
              disabled={!canMake || batch.busy || todo.length === 0}
              title={why ?? `Mỗi lượt ${TTS_UI_BATCH_SIZE} từ, có thể dừng giữa chừng`}
              onClick={() => void batch.start(todo)}
            />
          );
        }}
        onRowClick={(r) => setEditing(r.id)}
        actions={(r) => (
          <span className={styles.acts}>
            <AdultIconButton icon="branch" label={`Sửa Khám phá của từ ${r.word}`} onClick={() => setExploring(r.id)} />
            <AdultIconButton icon="pen" label={`Sửa từ ${r.word}`} onClick={() => setEditing(r.id)} />
          </span>
        )}
      />
      {editing !== null && <WordDrawer key={editing} data={data} row={current} onClose={() => setEditing(null)} onExplore={(id) => (setEditing(null), setExploring(id))} onOpenFamily={(familyId) => (setEditing(null), setFamilyOpen(familyId))} />}
      {exploring !== null && <ExplorerDrawer key={`x${exploring}`} wordId={exploring} onClose={() => setExploring(null)} />}
      {familyOpen !== null && (
        <FamilyDrawer
          key={`f${familyOpen}-${familyVersion}`}
          familyId={familyOpen}
          onClose={() => setFamilyOpen(null)}
          onSaved={(id) => {
            router.refresh();
            setFamilyOpen(id);
            setFamilyVersion((v) => v + 1);
          }}
        />
      )}
    </div>
  );
}

/** Ngăn kéo thêm / sửa một từ. Hình chỉ xem ở đây (gán hình ở Thư viện hình ảnh); giọng đọc mp3 tạo được ngay ở đây khi công tắc “Giọng mp3” bật. */
function WordDrawer({ data, row, onClose, onExplore, onOpenFamily }: { data: VocabData; row: VocabRow | undefined; onClose: () => void; onExplore?: (id: number) => void; onOpenFamily?: (familyId: number) => void }) {
  const toast = useToast();
  const router = useRouter();
  const batch = useAudioBatch(() => router.refresh());
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
  const canMake = data.mp3Enabled && data.ttsAvailable;
  const why = !data.ttsAvailable ? "Máy chủ này chưa có công cụ tạo giọng đọc" : !data.mp3Enabled ? "Bật “Giọng mp3” ở Hình ảnh & âm thanh để tạo giọng đọc" : undefined;
  // Giọng đọc tạo từ chữ đã lưu: chữ đang sửa khác chữ đã lưu thì phải lưu trước.
  const textChanged = Boolean(row) && (word.trim() !== row?.word || exampleEn.trim() !== row?.exampleEn);
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
            <span className={cn(adultStyles.small, adultStyles.muted)}>
              {row?.audio || row?.exampleAudio
                ? `Tệp từ: ${row.audio ? fileName(row.audio) : "chưa có"} · Tệp câu ví dụ: ${row.exampleAudio ? fileName(row.exampleAudio) : "chưa có"}`
                : "Chưa có tệp âm thanh: bé nghe bằng giọng có sẵn của trình duyệt."}
            </span>
            <span className={styles.audioBtns}>
              {row?.audio && <SpeakerButton word={row.word} audioUrl={row.audio} size="s" label={`Nghe tệp của từ ${row.word}`} />}
              {row?.exampleAudio && row.exampleEn && <SpeakerButton word={row.exampleEn} audioUrl={row.exampleAudio} size="s" label={`Nghe tệp câu ví dụ của ${row.word}`} />}
              <AdultButton
                label="Tạo giọng đọc tự động"
                icon="speaker"
                variant="secondary"
                size="s"
                disabled={!row || !canMake || batch.busy || textChanged}
                title={!row ? "Lưu từ trước rồi mới tạo giọng đọc" : textChanged ? "Lưu thay đổi chữ trước khi tạo giọng đọc" : why}
                onClick={() => row && void batch.start([row.id], hasFullAudio(row))}
              />
            </span>
          </div>
          <AudioBatchStatus state={batch.state} onStop={batch.stop} />
        </section>

        {row && onExplore && (
          <section className={styles.section} aria-label="Khám phá từ">
            <h3 className={adultStyles.h3}>Khám phá từ</h3>
            <div className={styles.audio}>
              <span className={cn(adultStyles.small, adultStyles.muted)}>{row.explorer ? `${row.explorer.count} nhánh · ${row.explorer.status === "published" ? "đã xuất bản" : "nháp"}` : "Từ này chưa có Khám phá (4–6 câu hỏi quanh từ)."}</span>
              <AdultButton label="Sửa Khám phá" icon="branch" variant="secondary" size="s" onClick={() => onExplore(row.id)} />
            </div>
          </section>
        )}

        {row && onOpenFamily && (
          <section className={styles.section} aria-label="Họ vần của từ">
            <h3 className={adultStyles.h3}>Họ vần</h3>
            {row.families.length === 0 ? (
              <p className={cn(adultStyles.small, adultStyles.muted)}>Từ này chưa thuộc họ vần nào. Thêm từ vào họ ở màn Họ vần.</p>
            ) : (
              <ul className={styles.famList}>
                {row.families.map((f) => (
                  <li key={f.familyId}>
                    <FamilyChip word={row.word} family={f} onOpen={onOpenFamily} />
                    <span className={cn(adultStyles.small, adultStyles.muted)}>
                      <span lang="en">{f.soundIpa}</span> · {f.sameSound ? "cùng âm" : "bẫy chính tả"} · {f.status === "published" ? "đã xuất bản" : "nháp"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

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
