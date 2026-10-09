"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdultButton, AdultCard, AdultDialog, AdultEmpty, AdultGrid, AdultIconButton, AdultInput, AdultSegmented, AdultSelect, AdultSortable, adultStyles, useToast } from "@/components/adult";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  STORY_MAX_PAGES,
  addNewWord,
  movePage,
  newPage,
  pageLabel,
  pagesPublishBlock,
  validatePage,
  type EditorPage,
} from "@/lib/rules/admin-story";
import type { PlayStep, StoryPlayPage } from "@/lib/rules/lesson-play";
import { saveStorySchema } from "@/lib/schemas/admin-story";
import { playPronunciation } from "@/lib/speech";
import type { StoryEditorData } from "@/server/admin/stories";
import { AudioBatchStatus } from "./AudioBatchStatus";
import { StepsPreview } from "./StepsPreview";
import { generateStoryAudioAction, saveStoryAction } from "./story-actions";
import styles from "./stories.module.css";
import { useAudioBatch } from "./useAudioBatch";

type Errors = Record<string, string>;
type Info = { title: string; titleVi: string; levelId: number; unitId: number | null; newWords: string[]; status: "draft" | "published" };

let counter = 0;
const nextKey = () => `n${++counter}`;
/** Tranh trang truyện là SVG/ảnh tĩnh từ thư viện: không cần tối ưu ảnh của Next. */
function Img({ src, alt }: { src: string; alt: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} />;
}

const fileName = (path: string | null) => (path ? (path.split("/").pop() ?? path) : "");

/** Soạn truyện tranh (Adult19): danh sách trang (kéo thả), sửa trang, thông tin truyện, xem trước bằng giao diện Tiểu học. */
export function StoryEditorView({ data }: { data: StoryEditorData }) {
  const toast = useToast();
  const [info, setInfo] = useState<Info>({ ...data.story });
  const [pages, setPages] = useState<EditorPage[]>(data.pages);
  const [sel, setSel] = useState<string | null>(data.pages[0]?.key ?? null);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [wordDraft, setWordDraft] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const [preview, setPreview] = useState<PlayStep | null>(null);
  const [uploading, setUploading] = useState<"audio" | "image" | null>(null);
  const audioInput = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const pagesRef = useRef(pages);
  const infoRef = useRef(info);
  useEffect(() => {
    pagesRef.current = pages;
    infoRef.current = info;
  });

  const index = Math.max(0, pages.findIndex((p) => p.key === sel));
  const current: EditorPage | undefined = pages[index];
  const level = data.levels.find((l) => l.id === info.levelId);
  const units = data.units.filter((u) => u.levelId === info.levelId);
  const clear = (...fields: string[]) => setErrors((e) => ({ ...e, ...Object.fromEntries(fields.map((f) => [f, ""])) }));
  const patchPage = (key: string, patch: Partial<EditorPage>) => setPages((list) => list.map((p) => (p.key === key ? { ...p, ...patch } : p)));

  // Tạo giọng đọc theo lượt (tối đa 5 trang), có tiến trình và nút Dừng; trang đã có tệp thì bỏ qua.
  const batch = useAudioBatch(
    () => undefined,
    (ids, force) => generateStoryAudioAction({ pageIds: ids, force }),
  );

  /** Kiểm toàn bộ truyện ở client (cùng luật với server); trả dữ liệu để gửi hoặc null kèm lỗi theo ô và đưa focus tới ô lỗi đầu. */
  function validate() {
    const next: Errors = {};
    if (!info.title.trim()) next.name = "Nhập tên truyện.";
    for (const [i, p] of pages.entries()) {
      const issue = validatePage(p);
      if (issue) {
        next.page = `${pageLabel(pages, i)}: ${issue.message}`;
        next.pageKey = p.key;
        next[issue.field] = issue.message;
        break;
      }
    }
    if (info.status === "published") {
      const block = pagesPublishBlock(pages);
      if (block) next.status = block;
    }
    const payload = {
      id: data.story.id,
      ...info,
      pages: pages.map((p) => ({ id: p.id, kind: p.kind, image: p.kind === "page" ? p.image : null, sentences: p.kind === "page" ? p.sentences : [], question: p.question })),
    };
    const parsed = saveStorySchema.safeParse(payload);
    if (!parsed.success) for (const issue of parsed.error.issues) next.form ??= issue.message;
    setErrors(next);
    if (next.pageKey && next.pageKey !== sel) setSel(next.pageKey);
    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return null;
    }
    return parsed.success ? parsed.data : null;
  }

  /** Lưu cả truyện. Trả về danh sách trang đã có mã (để tải âm thanh lên hoặc tạo giọng đọc ngay sau khi lưu) hoặc null nếu lỗi. */
  async function save(announce = true): Promise<EditorPage[] | null> {
    const payload = validate();
    if (!payload) return null;
    setBusy(true);
    const result = await saveStoryAction(payload);
    setBusy(false);
    if (!result.ok) {
      setErrors({ [result.field === "status" ? "status" : "form"]: result.message });
      return null;
    }
    const saved = pagesRef.current.map((p, i) => ({ ...p, id: result.pages[i]?.id ?? p.id, audio: result.pages[i]?.audio ?? null }));
    setPages(saved);
    if (announce) toast(`Đã lưu truyện “${info.title.trim()}” (${info.status === "published" ? "đã xuất bản" : "nháp"}).`);
    return saved;
  }

  function addPage(kind: EditorPage["kind"]) {
    const page = newPage(kind, nextKey());
    setPages((list) => {
      const at = Math.min(list.length, (current ? list.findIndex((p) => p.key === current.key) : list.length - 1) + 1);
      return [...list.slice(0, at), page, ...list.slice(at)];
    });
    setSel(page.key);
    requestAnimationFrame(() => document.getElementById(kind === "page" ? "e-s1" : "e-q")?.focus());
  }

  function removePage(key: string) {
    const at = pages.findIndex((p) => p.key === key);
    const left = pages.filter((p) => p.key !== key);
    setPages(left);
    if (sel === key) setSel(left[Math.max(0, at - 1)]?.key ?? null);
    toast(`Đã xóa ${pageLabel(pages, at).toLowerCase()}. Bấm Lưu truyện để ghi lại.`);
  }

  function reorderKeys(keys: string[]) {
    setPages((list) => keys.map((k) => list.find((p) => p.key === k)!).filter(Boolean));
  }

  function onPickKey(event: React.KeyboardEvent, i: number) {
    if (!event.altKey || (event.key !== "ArrowUp" && event.key !== "ArrowDown")) return;
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    setPages((list) => movePage(list, i, i + (event.key === "ArrowUp" ? -1 : 1)));
    setTimeout(() => target.isConnected && target.focus(), 0);
  }

  async function upload(kind: "audio" | "image", file: File) {
    if (!current) return;
    let pageId = current.id;
    const key = current.key;
    if (kind === "audio" && pageId === null) {
      const saved = await save(false);
      pageId = saved?.find((p) => p.key === key)?.id ?? null;
      if (pageId === null) return;
    }
    setUploading(kind);
    const form = new FormData();
    form.set("file", file);
    form.set("kind", kind);
    if (pageId !== null) form.set("pageId", String(pageId));
    try {
      const response = await fetch("/admin/stories/upload", { method: "POST", body: form });
      const result = (await response.json()) as { ok: boolean; message?: string; audio?: string; path?: string };
      if (!result.ok) {
        setErrors((e) => ({ ...e, [kind === "audio" ? "audio" : "image"]: result.message ?? "Chưa tải được tệp." }));
        return;
      }
      clear(kind === "audio" ? "audio" : "image");
      if (kind === "audio") patchPage(key, { audio: result.audio ?? null });
      else patchPage(key, { image: result.path ?? null });
      toast(kind === "audio" ? "Đã tải âm thanh lên." : "Đã tải tranh lên.");
    } catch {
      setErrors((e) => ({ ...e, [kind === "audio" ? "audio" : "image"]: "Mạng chập chờn. Thử lại nhé." }));
    } finally {
      setUploading(null);
    }
  }

  async function generate(only: EditorPage | undefined) {
    if (!only) return;
    const saved = await save(false);
    if (!saved) return;
    const ids = (only ? saved.filter((p) => p.key === only.key) : saved).flatMap((p) => (p.id === null || p.kind !== "page" ? [] : [p.id]));
    await batch.start(ids, only.audio === null ? false : true);
    // Lấy lại tệp vừa tạo: lưu lại truyện trả về đường dẫn mới nhất của mọi trang.
    const again = await saveStoryAction({ id: data.story.id, ...infoRef.current, pages: saved.map((p) => ({ id: p.id, kind: p.kind, image: p.kind === "page" ? p.image : null, sentences: p.kind === "page" ? p.sentences : [], question: p.question })) });
    if (again.ok) {
      setPages(saved.map((p, i) => ({ ...p, id: again.pages[i]?.id ?? p.id, audio: again.pages[i]?.audio ?? null })));
      clear("audio");
    }
  }

  function openPreview() {
    const payload = validate();
    if (!payload || !level) return;
    const storyPages: StoryPlayPage[] = pages.flatMap((p, i): StoryPlayPage[] =>
      p.kind === "page"
        ? [{ kind: "page", id: i + 1, image: p.image, sentences: p.sentences.map((s) => s.trim()).filter(Boolean), audio: p.audio }]
        : [{ kind: "question", id: i + 1, questionId: -(i + 1), text: p.question.text.trim(), choices: p.question.choices.map((text, n) => ({ id: "abc"[n], text: text.trim() })), correct: "abc"[p.question.correct ?? 0] }],
    );
    setPreview({
      id: "preview",
      kind: "story",
      storyId: data.story.id,
      title: info.title.trim(),
      titleVi: info.titleVi,
      levelNumber: level.number,
      pages: storyPages,
      newWords: info.newWords.map((word) => ({ word, meaningVi: data.glossary[word] ?? null })),
      glossary: data.glossary,
    });
  }

  function changeStatus(status: "draft" | "published") {
    if (status === "published") {
      const block = pagesPublishBlock(pages);
      if (block) {
        setErrors((e) => ({ ...e, status: block }));
        setInfo((i) => ({ ...i, status: "draft" }));
        return;
      }
    }
    clear("status");
    setInfo((i) => ({ ...i, status }));
  }

  function addWord() {
    const next = addNewWord(info.newWords, wordDraft);
    if (next) setInfo((i) => ({ ...i, newWords: next }));
    setWordDraft("");
  }

  const crumb = (
    <div className={styles.crumb}>
      <Link href="/admin/stories" className={styles.back}>
        <Icon name="back" size={16} />
        Tất cả truyện
      </Link>
      <span className={cn(adultStyles.small, adultStyles.muted)} lang="en">
        {info.title || "Truyện mới"}
      </span>
    </div>
  );

  const removingPage = pages.find((p) => p.key === removing);
  const silent = current?.kind === "page" && !current.audio;
  const pictureWord = current?.image ? data.pictures.find((p) => p.image === current.image)?.word : undefined;
  return (
    <div className={styles.page}>
      {crumb}
      <AdultGrid>
        <AdultCard span={3} aria-labelledby="pl-t">
          <h2 className={cn(adultStyles.h3, styles.cardTitle)} id="pl-t">
            Các trang ({pages.length})
          </h2>
          {pages.length === 0 ? (
            <AdultEmpty title="Truyện chưa có trang nào" text="Thêm trang đầu tiên: một tranh lớn và 1–2 câu ngắn. Có thể chèn trang câu hỏi giữa truyện." action={<AdultButton label="Thêm trang đầu tiên" icon="plus" onClick={() => addPage("page")} />} />
          ) : (
            <AdultSortable className={styles.pl} ids={pages.map((p) => p.key)} labelOf={(key) => pageLabel(pages, pages.findIndex((p) => p.key === key)).toLowerCase()} onReorder={reorderKeys}>
              {(api) =>
                pages.map((p, i) => {
                  const isQ = p.kind === "question";
                  const miss = !isQ && !p.audio;
                  return (
                    <li key={p.key} className={cn(styles.pli, p.key === current?.key && styles.sel)} {...api.itemProps(p.key)}>
                      <button type="button" className={styles.grip} {...api.gripProps(p.key)}>
                        <Icon name="grip" size={16} />
                      </button>
                      <button type="button" className={styles.pick} aria-current={p.key === current?.key ? "true" : undefined} onClick={() => setSel(p.key)} onKeyDown={(e) => onPickKey(e, i)}>
                        <span className={cn(styles.th, isQ && styles.thQ)}>
                          {isQ ? <Icon name="exam" size={22} /> : p.image ? <Img src={p.image} alt="" /> : <Icon name="image" size={18} />}
                        </span>
                        <span className={styles.pickText}>
                          <b>
                            {pageLabel(pages, i)}
                            {miss && (
                              <span className={styles.warn} title="Chưa có âm thanh">
                                <Icon name="warn" size={13} />
                                <span className={styles.srOnly}>Chưa có âm thanh</span>
                              </span>
                            )}
                          </b>
                          <small lang="en">{isQ ? p.question.text : p.sentences.join(" ")}</small>
                        </span>
                      </button>
                      <AdultIconButton icon="trash" label={`Xóa ${pageLabel(pages, i).toLowerCase()}`} onClick={() => setRemoving(p.key)} />
                    </li>
                  );
                })
              }
            </AdultSortable>
          )}
          <p className={cn(adultStyles.small, adultStyles.muted, styles.hint)}>Kéo tay nắm hoặc Alt + ↑/↓ để đổi thứ tự.</p>
          <div className={styles.pact}>
            <AdultButton label="Thêm trang" icon="plus" variant="secondary" size="s" disabled={pages.length >= STORY_MAX_PAGES} onClick={() => addPage("page")} />
            <AdultButton label="Chèn câu hỏi" icon="exam" variant="secondary" size="s" disabled={pages.length >= STORY_MAX_PAGES} onClick={() => addPage("question")} />
          </div>
        </AdultCard>

        <AdultCard span={6} aria-labelledby="ed-t">
          {!current ? (
            <AdultEmpty title="Chưa chọn trang" text="Chọn một trang ở cột bên trái hoặc thêm trang mới." />
          ) : current.kind === "question" ? (
            <>
              <h2 className={cn(adultStyles.h2, styles.cardTitle)} id="ed-t">
                Trang câu hỏi giữa truyện
              </h2>
              <div className={styles.form}>
                <AdultInput
                  id="e-q"
                  label="Câu hỏi"
                  lang="en"
                  required
                  value={current.question.text}
                  error={errors.question}
                  onChange={(e) => (patchPage(current.key, { question: { ...current.question, text: e.target.value } }), clear("question", "page"))}
                />
                <fieldset className={cn(styles.group, (errors.choices || errors.correct) && styles.groupError)} data-invalid={errors.choices || errors.correct ? "true" : undefined}>
                  <legend className={adultStyles.h3}>3 lựa chọn · chọn đáp án đúng</legend>
                  <div className={styles.choices}>
                    {current.question.choices.map((text, n) => (
                      <div key={n} className={cn(styles.choice, current.question.correct === n && styles.choiceOk)}>
                        <AdultInput
                          label={`Lựa chọn ${n + 1}`}
                          lang="en"
                          value={text}
                          onChange={(e) => (patchPage(current.key, { question: { ...current.question, choices: current.question.choices.map((c, j) => (j === n ? e.target.value : c)) } }), clear("choices", "page"))}
                        />
                        <label className={styles.radio}>
                          <input type="radio" name="e-ok" checked={current.question.correct === n} onChange={() => (patchPage(current.key, { question: { ...current.question, correct: n } }), clear("correct", "page"))} />
                          Đáp án đúng
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className={cn(adultStyles.err, adultStyles.small)} role="alert" hidden={!errors.choices && !errors.correct}>
                    <Icon name="warn" size={14} />
                    <span>{errors.choices || errors.correct}</span>
                  </p>
                </fieldset>
                <p className={cn(adultStyles.small, adultStyles.muted)}>Trang câu hỏi dùng loa đọc câu hỏi tự động; bé chọn bằng phím 1–3 hoặc chuột.</p>
              </div>
            </>
          ) : (
            <>
              <h2 className={cn(adultStyles.h2, styles.cardTitle)} id="ed-t">
                {pageLabel(pages, index)}
              </h2>
              <div className={styles.form}>
                <div className={adultStyles.field}>
                  <span className={adultStyles.h3}>Tranh</span>
                  <div className={styles.art}>
                    {current.image ? <Img src={current.image} alt={`Tranh ${pageLabel(pages, index).toLowerCase()}`} /> : <Icon name="image" size={48} />}
                    <div className={styles.artBtns}>
                      <input
                        id="e-pic"
                        list="story-pictures"
                        className={styles.picInput}
                        aria-label="Chọn từ thư viện"
                        placeholder="Chọn từ thư viện: gõ tên từ"
                        lang="en"
                        value={pictureWord ?? ""}
                        onChange={(e) => {
                          const found = data.pictures.find((p) => p.word.toLowerCase() === e.target.value.trim().toLowerCase());
                          if (found) {
                            patchPage(current.key, { image: found.image });
                            clear("image");
                          }
                        }}
                      />
                      <AdultButton label="Tải tranh lên" icon="upload" variant="secondary" size="s" loading={uploading === "image"} onClick={() => imageInput.current?.click()} />
                      <input ref={imageInput} type="file" hidden accept="image/png,image/jpeg,image/webp,image/svg+xml" aria-label="Tệp tranh" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload("image", f); e.target.value = ""; }} />
                    </div>
                  </div>
                  <datalist id="story-pictures">
                    {data.pictures.map((p) => (
                      <option key={p.word} value={p.word} />
                    ))}
                  </datalist>
                  <p className={cn(adultStyles.err, adultStyles.small)} role="alert" hidden={!errors.image}>
                    <Icon name="warn" size={14} />
                    <span>{errors.image}</span>
                  </p>
                </div>
                <AdultInput
                  id="e-s1"
                  label="Câu 1"
                  lang="en"
                  required
                  value={current.sentences[0] ?? ""}
                  error={errors.s1}
                  onChange={(e) => (patchPage(current.key, { sentences: [e.target.value, current.sentences[1] ?? ""] }), clear("s1", "s2", "page"))}
                />
                <AdultInput
                  id="e-s2"
                  label="Câu 2 (tùy chọn)"
                  lang="en"
                  value={current.sentences[1] ?? ""}
                  hint="Mỗi trang 1–2 câu, tổng không quá 16 từ."
                  error={errors.s2}
                  onChange={(e) => (patchPage(current.key, { sentences: [current.sentences[0] ?? "", e.target.value] }), clear("s2", "page"))}
                />
                <div className={adultStyles.field} id="e-aud-f">
                  <span className={adultStyles.h3}>Âm thanh đọc</span>
                  <div className={styles.aud}>
                    <span className={cn(styles.chip, silent && styles.chipMiss)} data-audchip>
                      <Icon name={silent ? "warn" : "music"} size={14} />
                      {silent ? "Chưa có âm thanh" : fileName(current.audio)}
                    </span>
                    {current.audio && (
                      <AdultIconButton icon="speaker" label="Nghe âm thanh trang" onClick={() => playPronunciation(current.sentences.join(" "), { audioUrl: current.audio })} />
                    )}
                    <AdultButton label="Tải lên" icon="upload" variant="secondary" size="s" loading={uploading === "audio"} onClick={() => audioInput.current?.click()} />
                    <input ref={audioInput} type="file" hidden accept=".mp3,.wav,audio/mpeg,audio/wav" aria-label="Tệp âm thanh" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload("audio", f); e.target.value = ""; }} />
                    <AdultButton label="Tạo giọng đọc tự động" icon="wand" variant="secondary" size="s" disabled={batch.busy || !data.ttsAvailable} onClick={() => void generate(current)} />
                  </div>
                  {!data.ttsAvailable && <p className={cn(adultStyles.small, adultStyles.muted)}>Máy chủ này chưa cài công cụ tạo giọng đọc (kokoro-js): hãy tải tệp .mp3 / .wav lên.</p>}
                  <AudioBatchStatus state={batch.state} onStop={batch.stop} unit="trang" />
                  <p className={cn(adultStyles.err, adultStyles.small)} id="e-aud-e" role="alert" hidden={!(silent && errors.status) && !errors.audio}>
                    <Icon name="warn" size={14} />
                    <span>{errors.audio || "Trang này cần âm thanh đọc trước khi xuất bản."}</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </AdultCard>

        <div className={cn(adultStyles.s3, styles.side)}>
          <AdultCard aria-labelledby="in-t">
            <h2 className={cn(adultStyles.h3, styles.cardTitle)} id="in-t">
              Thông tin truyện
            </h2>
            <div className={styles.form}>
              <AdultInput id="i-name" label="Tên truyện" lang="en" required value={info.title} error={errors.name} onChange={(e) => (setInfo((i) => ({ ...i, title: e.target.value })), clear("name"))} />
              <AdultInput id="i-vi" label="Tên tiếng Việt" value={info.titleVi} onChange={(e) => setInfo((i) => ({ ...i, titleVi: e.target.value }))} />
              <AdultSelect label="Cấp" value={info.levelId} onChange={(e) => setInfo((i) => ({ ...i, levelId: Number(e.target.value), unitId: null }))} options={data.levels.map((l) => [l.id, `Cấp ${l.number} · ${l.name}`] as const)} />
              <AdultSelect label="Chủ đề" value={info.unitId ?? ""} onChange={(e) => setInfo((i) => ({ ...i, unitId: e.target.value === "" ? null : Number(e.target.value) }))} options={[["", "— Chưa chọn —"], ...units.map((u) => [u.id, u.title] as const)]} />
              <div className={adultStyles.field}>
                <label className={adultStyles.h3} htmlFor="i-word">
                  Từ mới ({info.newWords.length})
                </label>
                <div className={styles.words}>
                  {info.newWords.map((w) => (
                    <span key={w} className={styles.chip} lang="en">
                      {w}
                      <button type="button" className={styles.chipX} aria-label={`Bỏ từ ${w}`} onClick={() => setInfo((i) => ({ ...i, newWords: i.newWords.filter((x) => x !== w) }))}>
                        <Icon name="close" size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  id="i-word"
                  className={adultStyles.input}
                  lang="en"
                  placeholder="Thêm từ, Enter"
                  value={wordDraft}
                  onChange={(e) => setWordDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addWord();
                    }
                  }}
                />
              </div>
              <AdultSegmented
                label="Trạng thái"
                value={info.status}
                onChange={changeStatus}
                options={[
                  ["draft", "Nháp"],
                  ["published", "Xuất bản"],
                ]}
              />
              <p className={cn(adultStyles.err, adultStyles.small)} role="alert" hidden={!errors.status}>
                <Icon name="warn" size={14} />
                <span>{errors.status}</span>
              </p>
              {(errors.form || errors.page) && (
                <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
                  <Icon name="warn" size={14} />
                  <span>{errors.page || errors.form}</span>
                </p>
              )}
            </div>
          </AdultCard>
          <AdultCard className={styles.actions}>
            <AdultButton label="Xem trước như bé" icon="eye" variant="secondary" disabled={pages.length === 0} onClick={openPreview} />
            <AdultButton label="Lưu truyện" icon="check" loading={busy} onClick={() => void save()} />
          </AdultCard>
        </div>
      </AdultGrid>

      <AdultDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title={`Xóa ${removingPage ? pageLabel(pages, pages.indexOf(removingPage)).toLowerCase() : "trang"}?`}
        actions={[
          { label: "Hủy", variant: "ghost" },
          { label: "Xóa trang", variant: "danger", icon: "trash", onClick: () => (removing ? removePage(removing) : undefined) },
        ]}
      >
        <p>
          Tranh, câu và âm thanh của {removingPage ? pageLabel(pages, pages.indexOf(removingPage)).toLowerCase() : "trang này"} sẽ bị xóa khỏi truyện “{info.title}” khi bạn bấm Lưu truyện. Không hoàn tác được sau khi lưu.
        </p>
      </AdultDialog>
      {preview && <StepsPreview steps={[preview]} level={level?.number ?? 3} onClose={() => setPreview(null)} />}
    </div>
  );
}
