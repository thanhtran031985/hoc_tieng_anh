"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AdultButton, AdultCard, AdultDialog, AdultEmpty, AdultInput, AdultTable, Kpi, adultStyles, useToast, type AdultColumn } from "@/components/adult";
import { Icon, SpeakerButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import { PHONICS_KIND_LABEL, PHONICS_UPLOAD, checkPhonicsUpload, formatSeconds, phonicsStats, splitExample, type PhonicsKind } from "@/lib/rules/phonics";
import { TTS_UI_BATCH_SIZE } from "@/lib/rules/tts";
import type { PhonicsData, PhonicsRow } from "@/server/admin/phonics";
import { AudioBatchStatus } from "./AudioBatchStatus";
import { generatePhonicsAction, importPhonicsSampleAction } from "./phonics-actions";
import { useAudioBatch, type AudioBatchRunner } from "./useAudioBatch";
import styles from "./phonics.module.css";

type Row = PhonicsRow & { order: number; has: "yes" | "no"; exampleText: string; file: string };

const nf = (n: number) => n.toLocaleString("vi-VN");
const fileOf = (path: string) => path.split("/").pop() ?? path;

// Tạo âm thanh trả về kết quả theo âm (`grapheme`); thanh tiến trình dùng chung với màn từ vựng đọc nhãn ở trường `word`.
const runPhonics: AudioBatchRunner = async (ids, force) => {
  const result = await generatePhonicsAction({ ids, force });
  return result.ok ? { ok: true, items: result.items.map((i) => ({ id: i.id, word: i.grapheme, status: i.status, message: i.message })) } : result;
};

type UploadResponse = { ok: boolean; field?: string; message?: string };

/** Âm phonics (Adult20): bảng 36 âm với phiên âm, 2 từ ví dụ, tệp âm thanh; tải lên, tạo âm thanh tự động, lọc âm còn thiếu. */
export function PhonicsView({ data }: { data: PhonicsData }) {
  const router = useRouter();
  const toast = useToast();
  const batch = useAudioBatch(() => router.refresh(), runPhonics);
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [uploading, setUploading] = useState<Row | null>(null);
  const [importing, setImporting] = useState(false);
  const canMake = data.mp3Enabled && data.ttsAvailable;
  const why = !data.ttsAvailable ? "Máy chủ này chưa có công cụ tạo giọng đọc" : !data.mp3Enabled ? "Bật “Giọng mp3” ở Hình ảnh & âm thanh để tạo âm thanh" : undefined;

  const rows: Row[] = data.rows.map((r, i) => ({
    ...r,
    order: i,
    has: r.audio ? "yes" : "no",
    exampleText: r.examples.map((e) => e.word).join(" "),
    file: r.audio ? fileOf(r.audio) : "",
  }));
  const stats = phonicsStats(data.rows.map((r) => ({ grapheme: r.grapheme, kind: r.kind, hasAudio: Boolean(r.audio), audioAuto: r.audioAuto })));
  const missingIds = rows.filter((r) => r.has === "no").map((r) => r.id);

  async function importSample() {
    setImporting(true);
    const result = await importPhonicsSampleAction();
    setImporting(false);
    if (!result.ok) return toast(result.message);
    toast("Đã nhập bộ 36 âm mẫu.");
    router.refresh();
  }

  if (data.rows.length === 0) {
    return (
      <AdultCard>
        <AdultEmpty
          title="Chưa có âm phonics nào"
          text="Nhập bộ 26 chữ đơn và các âm ghép mẫu để bắt đầu soạn bài Ghép âm."
          action={<AdultButton label="Nhập bộ âm mẫu" icon="plus" loading={importing} onClick={() => void importSample()} />}
        />
      </AdultCard>
    );
  }

  const columns: readonly AdultColumn<Row>[] = [
    {
      key: "order",
      label: "Âm",
      sort: true,
      render: (r) => (
        <span className={styles.gl}>
          <b lang="en">{r.grapheme}</b>
          <span>{r.ipa}</span>
        </span>
      ),
    },
    { key: "kind", label: "Loại", sort: true, render: (r) => PHONICS_KIND_LABEL[r.kind] },
    {
      key: "exampleText",
      label: "Ví dụ từ",
      render: (r) => (
        <span className={styles.ex}>
          {r.examples.map((e) => {
            const { before, part, after } = splitExample(e);
            return (
              <span className={styles.w} key={e.word}>
                <SpeakerButton word={e.word} size="s" label={`Nghe: ${e.word}`} />
                <span lang="en">
                  {before}
                  <b>{part}</b>
                  {after}
                </span>
              </span>
            );
          })}
        </span>
      ),
    },
    {
      key: "has",
      label: "Âm thanh",
      sort: true,
      render: (r) =>
        r.audio ? (
          <span className={styles.au}>
            <SpeakerButton word={r.grapheme} audioUrl={r.audio} size="s" label={`Nghe âm ${r.grapheme}`} />
            {r.file}
            {r.audioMs ? ` · ${formatSeconds(r.audioMs)}` : ""}
            {r.audioAuto ? " · tự động" : ""}
          </span>
        ) : (
          <span className={styles.miss}>
            <i aria-hidden="true" />
            Thiếu âm thanh
          </span>
        ),
    },
  ];

  const shown = onlyMissing ? rows.filter((r) => r.has === "no") : rows;

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <p className={cn(adultStyles.body, adultStyles.muted, styles.sub)}>Dùng cho bài Ghép âm và Đập chuột chữ cái.</p>
        <AdultButton
          label={onlyMissing ? "Hiện tất cả các âm" : "Lọc âm còn thiếu"}
          icon="warn"
          variant="secondary"
          aria-pressed={onlyMissing}
          disabled={!onlyMissing && stats.missing.length === 0}
          onClick={() => setOnlyMissing((v) => !v)}
        />
      </div>

      <div className={styles.kpis}>
        <Kpi label="Tổng số âm" value={nf(stats.total)} icon="music" sub={`${stats.singles} chữ đơn · ${stats.digraphs} âm ghép`} />
        <Kpi label="Đã có âm thanh" value={nf(stats.withAudio)} icon="okcircle" sub={`trong đó ${nf(stats.auto)} tạo tự động`} />
        <Kpi label="Còn thiếu" value={nf(stats.missing.length)} icon="warn" sub={stats.missing.length ? stats.missing.join(", ") : "Đủ cả rồi"} />
        <AdultCard className={cn(styles.bulk, !canMake && styles.off)} aria-labelledby="ph-bulk-title">
          <b className={adultStyles.h3} id="ph-bulk-title">
            Bài Ghép âm cần âm thanh của từng ô.
          </b>
          <span className={cn(adultStyles.small, adultStyles.muted)}>{why ?? `Âm thiếu thì ô đó không phát được tiếng khi bé bấm. Mỗi lượt ${TTS_UI_BATCH_SIZE} âm, có thể dừng giữa chừng.`}</span>
          <AdultButton
            label={missingIds.length > 0 ? `Tạo âm thanh cho ${nf(missingIds.length)} âm còn thiếu` : "Đã đủ âm thanh"}
            icon="wand"
            disabled={!canMake || batch.busy || missingIds.length === 0}
            title={why}
            onClick={() => void batch.start(missingIds)}
          />
        </AdultCard>
      </div>
      <AudioBatchStatus state={batch.state} onStop={batch.stop} unit="âm" />

      <AdultTable
        caption="Âm phonics"
        columns={columns}
        rows={shown}
        rowKey={(r) => r.id}
        searchKeys={["grapheme", "ipa", "exampleText"]}
        searchPlaceholder="Tìm âm, ví dụ “sh” hoặc /ʃ/…"
        pageSize={8}
        filters={[
          { key: "kind", label: "Loại", options: (Object.keys(PHONICS_KIND_LABEL) as PhonicsKind[]).map((k) => [k, PHONICS_KIND_LABEL[k]] as const) },
          {
            key: "has",
            label: "Âm thanh",
            options: [
              ["no", "Còn thiếu âm thanh"],
              ["yes", "Đã có âm thanh"],
            ],
          },
        ]}
        actions={(r) => (
          <span className={styles.btns}>
            <AdultButton label="Tải lên" icon="upload" variant="ghost" size="s" aria-label={`Tải âm thanh lên cho âm ${r.grapheme}`} onClick={() => setUploading(r)} />
            <AdultButton
              label={r.has === "yes" ? "Tạo lại" : "Tạo âm thanh"}
              icon="wand"
              variant={r.has === "yes" ? "ghost" : "secondary"}
              size="s"
              aria-label={`${r.has === "yes" ? "Tạo lại" : "Tạo"} âm thanh cho âm ${r.grapheme}`}
              disabled={!canMake || batch.busy}
              title={why}
              onClick={() => void batch.start([r.id], r.has === "yes")}
            />
          </span>
        )}
      />

      {uploading && (
        <UploadDialog
          key={uploading.id}
          row={uploading}
          onClose={() => setUploading(null)}
          onDone={() => {
            toast(`Đã tải âm thanh cho “${uploading.grapheme}”.`);
            setUploading(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

/** Hộp thoại tải tệp ghi âm cho một âm: kiểm ngay trên trình duyệt (cùng luật với máy chủ), lỗi hiện dưới ô chọn tệp. */
function UploadDialog({ row, onClose, onDone }: { row: Row; onClose: () => void; onDone: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);

  async function submit(): Promise<boolean> {
    const file = input.current?.files?.[0];
    if (!file) {
      setError("Chọn một tệp .mp3 hoặc .wav.");
      input.current?.focus();
      return false;
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const check = checkPhonicsUpload(file.name, bytes);
    if (!check.ok) {
      setError(check.message);
      return false;
    }
    const body = new FormData();
    body.append("file", file);
    body.append("id", String(row.id));
    let result: UploadResponse;
    try {
      const response = await fetch("/admin/phonics/upload", { method: "POST", body });
      result = (await response.json()) as UploadResponse;
    } catch {
      result = { ok: false, message: "Không kết nối được máy chủ. Thử lại nhé." };
    }
    if (!result.ok) {
      setError(result.message ?? "Chưa lưu được tệp. Thử lại nhé.");
      return false;
    }
    onDone();
    return true;
  }

  return (
    <AdultDialog
      open
      onClose={onClose}
      title={`Tải âm thanh cho âm “${row.grapheme}” ${row.ipa}`}
      actions={[{ label: "Huỷ", variant: "secondary" }, { label: "Tải lên", variant: "primary", icon: "upload", onClick: submit }]}
    >
      <div className={styles.up}>
        <div
          className={styles.drop}
          data-over={over ? "" : undefined}
          onDragOver={(e) => (e.preventDefault(), setOver(true))}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            if (input.current && e.dataTransfer.files.length > 0) {
              input.current.files = e.dataTransfer.files;
              setError("");
            }
          }}
        >
          <Icon name="upload" size={22} />
          <br />
          Kéo tệp vào đây hoặc chọn tệp bên dưới
        </div>
        <AdultInput
          ref={input}
          label="Tệp âm thanh"
          type="file"
          accept="audio/mpeg,audio/wav,.mp3,.wav"
          hint={`.mp3 hoặc .wav, tối đa ${PHONICS_UPLOAD.maxBytes / 1024 / 1024} MB, dài 0,3–2 giây. Chỉ đọc âm, không đọc tên chữ cái.`}
          error={error}
          onChange={() => setError("")}
        />
      </div>
    </AdultDialog>
  );
}
