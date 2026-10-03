"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { AdultButton, AdultCard, AdultEmpty, AdultInput, AdultSegmented, AdultSelect, AdultTable, Status, adultStyles, useToast, type AdultColumn } from "@/components/adult";
import { Icon, LevelChip, WordPicture } from "@/components/ui";
import { cn } from "@/lib/cn";
import { MEDIA_MAX_BYTES } from "@/lib/rules/admin-media";
import type { LibraryWord, MediaLibrary } from "@/server/admin/media";
import { assignImageAction } from "./media-actions";
import styles from "./media.module.css";

type Tab = "images" | "audio";
type Filter = "all" | "has" | "miss";
type Upload = { id: number; name: string; progress: number; state: "up" | "ok" | "err"; message: string };

const PAGE_SIZE = 24;
const MAX_MB = MEDIA_MAX_BYTES / 1024 / 1024;
const nf = (n: number) => n.toLocaleString("vi-VN");
const fileOf = (path: string) => path.split("/").pop() ?? path;
const kb = (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} KB`;

type UploadResponse = { ok: boolean; message?: string; assigned?: { word: string } | null; note?: string | null };

/** Tải một tệp lên route handler bằng XMLHttpRequest để có tiến độ. */
function sendFile(file: File, wordId: number | undefined, onProgress: (percent: number) => void): Promise<UploadResponse> {
  return new Promise((resolve) => {
    const body = new FormData();
    body.append("file", file);
    if (wordId !== undefined) body.append("wordId", String(wordId));
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/admin/media/upload");
    xhr.upload.onprogress = (event) => event.lengthComputable && onProgress(Math.round((event.loaded / event.total) * 100));
    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText) as UploadResponse);
      } catch {
        resolve({ ok: false, message: "Chưa lưu được tệp. Thử lại nhé." });
      }
    };
    xhr.onerror = () => resolve({ ok: false, message: "Không kết nối được máy chủ. Thử lại nhé." });
    xhr.send(body);
  });
}

/** Thư viện hình và âm thanh (Adult13): tải hình lên (chỉ nhận ảnh, tối đa 2 MB), tìm, lọc "Từ chưa có hình", gán hình cho từ; tab Âm thanh theo dõi từ chưa có tệp. */
export function MediaView({ data }: { data: MediaLibrary }) {
  const [tab, setTab] = useState<Tab>("images");
  const noImage = data.words.filter((w) => !w.image).length;
  const noAudio = data.words.length - data.audioCount;
  return (
    <div className={styles.page}>
      <AdultSegmented
        label="Loại tệp"
        labelHidden
        value={tab}
        onChange={setTab}
        options={[
          ["images", `Hình ảnh (${nf(data.imageCount)})`],
          ["audio", `Âm thanh (${nf(data.audioCount)})`],
        ]}
      />
      <p className={cn(adultStyles.body, adultStyles.muted, styles.sum)}>
        {nf(noImage)} từ chưa có hình · {nf(noAudio)} từ chưa có âm thanh
      </p>
      {tab === "images" ? <ImagesPanel data={data} noImage={noImage} /> : <AudioPanel data={data} noAudio={noAudio} />}
    </div>
  );
}

function ImagesPanel({ data, noImage }: { data: MediaLibrary; noImage: number }) {
  const router = useRouter();
  const toast = useToast();
  const picker = useRef<HTMLInputElement>(null);
  const target = useRef<number | undefined>(undefined);
  const [over, setOver] = useState(false);
  const [ups, setUps] = useState<Upload[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [assignWord, setAssignWord] = useState<Record<string, string>>({});
  const [assignError, setAssignError] = useState<Record<string, string>>({});

  const byWord = useMemo(() => new Map(data.words.map((w) => [w.word.toLowerCase(), w])), [data.words]);
  const list = data.words.filter((w) => (!query.trim() || w.word.toLowerCase().includes(query.trim().toLowerCase())) && (filter === "all" || (filter === "miss" ? !w.image : Boolean(w.image))));
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  async function upload(files: File[], wordId?: number) {
    if (files.length === 0) return;
    let done = 0;
    let failed = 0;
    const notes: string[] = [];
    for (const file of files) {
      const id = Date.now() + Math.random();
      setUps((u) => [{ id, name: file.name, progress: 0, state: "up", message: "Đang tải…" }, ...u]);
      const early = file.size > MEDIA_MAX_BYTES ? `“${file.name}” lớn hơn ${MAX_MB} MB.` : !file.type.startsWith("image/") ? `“${file.name}” không phải hình.` : "";
      const result = early ? { ok: false, message: early } : await sendFile(file, wordId, (p) => setUps((u) => u.map((x) => (x.id === id ? { ...x, progress: p } : x))));
      if (result.ok) {
        done += 1;
        const message = result.assigned ? `Đã gắn cho từ “${result.assigned.word}”.` : (result.note ?? "Vừa tải · chưa gắn từ nào.");
        if (result.note) notes.push(result.note);
        setUps((u) => u.map((x) => (x.id === id ? { ...x, progress: 100, state: "ok", message } : x)));
      } else {
        failed += 1;
        setUps((u) => u.map((x) => (x.id === id ? { ...x, state: "err", message: result.message ?? "Chưa tải được." } : x)));
      }
    }
    toast(failed ? `Đã tải ${done}/${files.length} hình, ${failed} tệp lỗi.` : `Đã tải ${done} hình.`);
    router.refresh();
  }

  function choose(wordId?: number) {
    target.current = wordId;
    picker.current?.click();
  }

  async function assign(path: string) {
    const wordText = (assignWord[path] ?? "").trim();
    const word = byWord.get(wordText.toLowerCase());
    if (!word) {
      setAssignError((e) => ({ ...e, [path]: wordText ? `“${wordText}” chưa có trong ngân hàng từ vựng.` : "Chọn từ cần gắn hình." }));
      return;
    }
    const result = await assignImageAction({ wordId: word.id, path });
    if (!result.ok) {
      setAssignError((e) => ({ ...e, [path]: result.message }));
      return;
    }
    toast(`Đã gắn hình cho “${word.word}”.`);
    router.refresh();
  }

  const card = (w: LibraryWord) =>
    w.image ? (
      <div key={w.id} className={styles.card}>
        <div className={styles.img}>
          <WordPicture word={w.word} src={w.image} size={76} />
        </div>
        <div className={styles.meta}>
          <b lang="en">{w.word}</b>
          <span className={cn(adultStyles.small, adultStyles.muted)}>
            {fileOf(w.image)} · dùng trong {nf(w.usedIn)} bài
          </span>
          <button type="button" className={cn(styles.link, adultStyles.small)} onClick={() => choose(w.id)}>
            Thay hình
          </button>
        </div>
      </div>
    ) : (
      <div key={w.id} className={cn(styles.card, styles.miss)}>
        <div className={styles.img}>
          <Icon name="image" size={24} />
          <span>Chưa có hình</span>
        </div>
        <div className={styles.meta}>
          <b lang="en">{w.word}</b>
          <button type="button" className={cn(styles.link, adultStyles.small)} onClick={() => choose(w.id)}>
            Tải hình cho từ này
          </button>
        </div>
      </div>
    );

  return (
    <AdultCard>
      <div
        className={cn(styles.drop, over && styles.dropOver)}
        onDragOver={(e) => (e.preventDefault(), setOver(true))}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void upload([...e.dataTransfer.files]);
        }}
      >
        <span className={styles.dropIc}>
          <Icon name="upload" size={22} />
        </span>
        <div className={styles.dropText}>
          <b className={adultStyles.h3}>Kéo thả hình vào đây</b>
          <br />
          <span className={cn(adultStyles.small, adultStyles.muted)}>PNG, JPEG, WebP, SVG · tối đa {MAX_MB} MB/tệp · tên tệp trùng tên từ chưa có hình sẽ tự gắn (ví dụ apple.svg)</span>
        </div>
        <AdultButton label="Chọn tệp" icon="upload" onClick={() => choose(undefined)} />
        <input
          ref={picker}
          type="file"
          multiple
          hidden
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={(e) => {
            const files = [...(e.target.files ?? [])];
            e.target.value = "";
            void upload(files, target.current);
          }}
        />
      </div>

      {ups.length > 0 && (
        <ul className={styles.ups} aria-live="polite" aria-label="Tệp đang tải lên">
          {ups.slice(0, 8).map((u) => (
            <li key={u.id}>
              <b className={adultStyles.small}>{u.name}</b>
              {u.state === "up" ? <progress className={styles.prog} value={u.progress} max={100} aria-label={`Tải ${u.name}`} /> : null}
              <span className={cn(adultStyles.small, u.state === "err" ? styles.err : adultStyles.muted)}>{u.message}</span>
            </li>
          ))}
        </ul>
      )}

      {data.unassigned.length > 0 && (
        <section className={styles.section} aria-label="Hình đã tải lên chưa gắn từ">
          <h3 className={adultStyles.h3}>Hình đã tải lên, chưa gắn cho từ nào ({data.unassigned.length})</h3>
          <div className={styles.grid}>
            {data.unassigned.map((m) => (
              <div key={m.path} className={styles.card}>
                <div className={styles.img}>
                  {/* Hình tải lên lấy qua route handler có kiểm tra đăng nhập, không qua next/image. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.path} alt="" width={76} height={76} />
                </div>
                <div className={styles.meta}>
                  <b>{fileOf(m.path)}</b>
                  <span className={cn(adultStyles.small, adultStyles.muted)}>{kb(m.size)}</span>
                  <AdultInput label="Gắn cho từ" lang="en" list="library-words" value={assignWord[m.path] ?? ""} error={assignError[m.path]} onChange={(e) => (setAssignWord((a) => ({ ...a, [m.path]: e.target.value })), setAssignError((a) => ({ ...a, [m.path]: "" })))} />
                  <AdultButton label="Gắn" icon="check" size="s" variant="secondary" onClick={() => void assign(m.path)} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <datalist id="library-words">
        {data.words.map((w) => (
          <option key={w.id} value={w.word} />
        ))}
      </datalist>

      <div className={styles.bar}>
        <div className={styles.search}>
          <Icon name="search" size={18} />
          <label className="sr-only" htmlFor="media-q">
            Tìm hình theo từ
          </label>
          <input id="media-q" className={adultStyles.input} placeholder="Tìm theo từ…" value={query} onChange={(e) => (setQuery(e.target.value), setPage(1))} />
        </div>
        <AdultSelect
          label="Lọc"
          className={styles.filter}
          value={filter}
          onChange={(e) => (setFilter(e.target.value as Filter), setPage(1))}
          options={[
            ["all", "Tất cả"],
            ["has", "Đã có hình"],
            ["miss", `Từ chưa có hình (${nf(noImage)})`],
          ]}
        />
      </div>

      {list.length === 0 ? (
        <AdultEmpty title="Không tìm thấy hình" text="Thử từ khóa khác hoặc đổi bộ lọc." action={<AdultButton label="Xóa bộ lọc" variant="secondary" onClick={() => (setQuery(""), setFilter("all"))} />} />
      ) : (
        <div className={styles.grid}>{shown.map(card)}</div>
      )}

      <div className={styles.foot}>
        <span className={cn(adultStyles.small, adultStyles.muted)} aria-live="polite">
          Hiển thị {list.length ? (current - 1) * PAGE_SIZE + 1 : 0}–{Math.min(list.length, current * PAGE_SIZE)} / {nf(list.length)} từ
        </span>
        <div className={styles.pager}>
          <AdultButton label="Trang trước" icon="back" variant="secondary" size="s" disabled={current <= 1} onClick={() => setPage(current - 1)} />
          <span className={adultStyles.small}>
            {current} / {pages}
          </span>
          <AdultButton label="Trang sau" icon="next" variant="secondary" size="s" disabled={current >= pages} onClick={() => setPage(current + 1)} />
        </div>
      </div>
    </AdultCard>
  );
}

type AudioRow = LibraryWord & { state: "yes" | "no"; file: string };

function AudioPanel({ data, noAudio }: { data: MediaLibrary; noAudio: number }) {
  const rows: AudioRow[] = data.words.map((w) => ({ ...w, state: w.audio ? "yes" : "no", file: w.audio ? fileOf(w.audio) : "—" }));
  const columns: readonly AdultColumn<AudioRow>[] = [
    {
      key: "word",
      label: "Từ",
      sort: true,
      render: (r) => (
        <span className={styles.word}>
          <Icon name="music" size={14} />
          <b lang="en">{r.word}</b>
        </span>
      ),
    },
    { key: "file", label: "Tệp", sort: true },
    { key: "level", label: "Cấp", sort: true, render: (r) => <LevelChip level={r.level} name="" plain /> },
    { key: "state", label: "Trạng thái", sort: true, render: (r) => (r.state === "yes" ? <Status kind="ok" label="Đã có" /> : <Status kind="warn" label="Chưa có" />) },
  ];
  return (
    <>
      <AdultCard className={styles.bulk} aria-labelledby="bulk-title">
        <div>
          <h2 className={adultStyles.h2} id="bulk-title">
            Tạo giọng đọc hàng loạt
          </h2>
          <span className={cn(adultStyles.small, adultStyles.muted)}>Sắp có ở giai đoạn 2. Giai đoạn 1 đọc từ và câu bằng giọng có sẵn của trình duyệt nên {nf(noAudio)} từ chưa có tệp âm thanh vẫn học bình thường.</span>
        </div>
        <AdultButton label={`Tạo cho ${nf(noAudio)} từ`} icon="speaker" disabled title="Sắp có" />
      </AdultCard>
      <AdultTable
        caption="Âm thanh của từ vựng"
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        searchKeys={["word", "file"]}
        searchPlaceholder="Tìm từ hoặc tên tệp…"
        pageSize={8}
        filters={[
          {
            key: "state",
            label: "Tình trạng",
            options: [
              ["yes", "Đã có âm thanh"],
              ["no", "Chưa có âm thanh"],
            ],
          },
          { key: "level", label: "Cấp", options: Array.from({ length: 10 }, (_, i) => [String(i + 1), `Cấp ${i + 1}`] as const), match: (r, v) => String(r.level) === v },
        ]}
        actions={() => <AdultButton label="Tạo" icon="speaker" variant="secondary" size="s" disabled title="Sắp có" />}
      />
    </>
  );
}
