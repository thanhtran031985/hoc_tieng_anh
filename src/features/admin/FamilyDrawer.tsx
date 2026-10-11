"use client";

import { useEffect, useRef, useState } from "react";
import { AdultButton, AdultDialog, AdultDrawer, AdultEmpty, AdultIconButton, AdultInput, AdultSegmented, AdultSelect, AdultTextarea, adultStyles, useToast } from "@/components/adult";
import { Icon, SpeakerButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { PlayStep } from "@/lib/rules/lesson-play";
import {
  FAMILY_SAME_SOUND_MIN,
  buildInfo,
  buildTiles,
  canBuild,
  canPublishFamily,
  familyFieldId,
  familyIssues,
  soundMatches,
  splitRime,
  type FamilyIssue,
  type FamilyView,
} from "@/lib/rules/word-family";
import { BUILD_MIN_REAL } from "@/lib/rules/constants";
import { FAMILY_DECOYS_MAX, FAMILY_MEMBERS_MAX, FAMILY_SENTENCES_MAX, onsetSchema, saveFamilySchema } from "@/lib/schemas";
import type { BankWord, FamilyEditorData, FamilyEditorWord } from "@/server/admin/family";
import { StepsPreview } from "./StepsPreview";
import { suggestFamilyAction, suggestFamilySentencesAction } from "./ai-suggest-actions";
import { generateFamilyAudioAction, getFamilyEditorAction, saveFamilyAction, searchFamilyBankAction } from "./family-actions";
import editor from "./explorer-editor.module.css";
import styles from "./families.module.css";

type Sentence = { key: string; en: string; vi: string };
let counter = 0;
const nextKey = () => `s${++counter}`;
const fileName = (p: string | null | undefined) => (p ? (p.split("/").pop() ?? p) : "");
const toSentence = (s: { en: string; vi: string }): Sentence => ({ key: nextKey(), en: s.en, vi: s.vi });

/** Hình trong danh sách chỉ là tệp tĩnh của thư viện: không cần tối ưu ảnh của Next. */
function Thumb({ src }: { src: string | null | undefined }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <span className={editor.thumb}>{src ? <img src={src} alt="" /> : <Icon name="image" size={16} />}</span>;
}

type Props = {
  /** Null là họ mới. */
  familyId: number | null;
  onClose: () => void;
  /** Đã lưu: ngăn kéo được mở lại với dữ liệu mới (để tạo giọng đọc ngay). */
  onSaved: (id: number) => void;
};

/** Soạn Họ vần (Adult23): ngăn kéo rộng của màn Họ vần. Nạp dữ liệu soạn của họ rồi mở biểu mẫu. */
export function FamilyDrawer({ familyId, onClose, onSaved }: Props) {
  const [data, setData] = useState<FamilyEditorData | null | undefined>(undefined);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let alive = true;
    getFamilyEditorAction({ familyId })
      .then((d) => alive && setData(d))
      .catch(() => alive && setData(null));
    return () => {
      alive = false;
    };
  }, [familyId, version]);

  if (data === undefined || data === null) {
    return (
      <AdultDrawer open wide onClose={onClose} title="Soạn họ vần" footer={<AdultButton label="Đóng" variant="ghost" onClick={onClose} />}>
        {data === undefined ? (
          <p className={cn(adultStyles.body, adultStyles.muted)} aria-live="polite">
            Đang mở họ vần…
          </p>
        ) : (
          <AdultEmpty title="Chưa mở được họ vần" text="Họ vần này không còn hoặc máy chủ đang bận. Thử lại nhé." action={<AdultButton label="Thử lại" icon="replay" variant="secondary" onClick={() => (setData(undefined), setVersion((v) => v + 1))} />} />
        )}
      </AdultDrawer>
    );
  }
  return <EditorBody key={version} data={data} onClose={onClose} onSaved={onSaved} onReload={() => (setData(undefined), setVersion((v) => v + 1))} />;
}

function EditorBody({ data, onClose, onSaved, onReload }: { data: FamilyEditorData; onClose: () => void; onSaved: (id: number) => void; onReload: () => void }) {
  const toast = useToast();
  const [pattern, setPattern] = useState(data.pattern);
  const [soundIpa, setSoundIpa] = useState(data.soundIpa);
  const [levelId, setLevelId] = useState(data.levelId);
  const [buildRime, setBuildRime] = useState(data.buildRime ?? "");
  const [decoys, setDecoys] = useState<string[]>(data.decoys);
  const [decoyInput, setDecoyInput] = useState("");
  const [decoyError, setDecoyError] = useState("");
  const [trapNote, setTrapNote] = useState(data.trapNote);
  const [members, setMembers] = useState<FamilyEditorWord[]>(data.members);
  const [sentences, setSentences] = useState<Sentence[]>(() => data.sentences.map(toSentence));
  const [readingAudio] = useState(data.readingAudio);
  const [status, setStatus] = useState<"draft" | "published">(data.status);
  const [touched, setTouched] = useState<ReadonlySet<string>>(new Set());
  const [attempted, setAttempted] = useState(false);
  // Lỗi của lần bấm Lưu gần nhất; chỉ hiện khi nội dung chưa đổi kể từ lúc đó (sửa xong là lỗi cũ tự mất).
  const [lastErrors, setErrors] = useState<{ form?: string; status?: string; at?: string }>({});
  const [busy, setBusy] = useState(false);
  const [making, setMaking] = useState(false);
  const [preview, setPreview] = useState<PlayStep[] | null>(null);
  const [suggest, setSuggest] = useState<{ open: boolean; query: string; loading: boolean; results: BankWord[]; picks: number[] }>({ open: false, query: "", loading: false, results: [], picks: [] });
  const [aiBusy, setAiBusy] = useState(false);
  const [aiConfirm, setAiConfirm] = useState(false);
  const [aiWarnings, setAiWarnings] = useState<string[]>([]);
  // Gợi ý riêng phần câu (task 31).
  const [sentBusy, setSentBusy] = useState(false);
  const [sentConfirm, setSentConfirm] = useState(false);
  const [sentWarnings, setSentWarnings] = useState<string[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);

  const payloadOf = () => ({
    id: data.id ?? undefined,
    pattern,
    soundIpa,
    levelId,
    buildRime: buildRime.trim() === "" ? null : buildRime,
    decoys,
    trapNote,
    members: members.map((m) => ({ wordId: m.wordId, sameSound: m.sameSound })),
    sentences: sentences.filter((s) => s.en.trim() !== "").map((s) => ({ en: s.en, vi: s.vi })),
    status,
  });
  const [saved, setSaved] = useState(() => ({ text: data.sentences.map((s) => s.en).join("\n"), json: JSON.stringify(payloadOf()) }));
  const now = JSON.stringify(payloadOf());
  const dirty = now !== saved.json;
  const errors = lastErrors.at === now ? lastErrors : {};
  const sentencesText = sentences.filter((s) => s.en.trim() !== "").map((s) => s.en).join("\n");
  // Giọng đọc chỉ đúng khi chữ chưa đổi so với lúc tạo.
  const readingValid = readingAudio !== null && sentencesText === saved.text;

  const same = members.filter((m) => m.sameSound);
  const issues: FamilyIssue[] = familyIssues({
    pattern,
    soundIpa,
    buildRime: buildRime.trim() === "" ? null : buildRime.trim().toLowerCase(),
    decoys,
    trapNote,
    members: members.map((m) => ({ wordId: m.wordId, word: m.word, sameSound: m.sameSound, ipa: m.ipa })),
    reading: sentences.some((s) => s.en.trim() !== "") ? { sentences: sentences.filter((s) => s.en.trim() !== "").map((s) => ({ en: s.en, vi: s.vi })), audio: readingValid ? readingAudio : null } : null,
  });
  // Lời nhắc của AI trừ những việc đã có trong khung “Còn … việc”.
  const shownAiWarnings = aiWarnings.filter((w) => !issues.some((i) => i.message === w));
  const shownSentWarnings = sentWarnings.filter((w) => !issues.some((i) => i.message === w));
  const info = buildInfo(members.map((m) => ({ wordId: m.wordId, word: m.word, sameSound: m.sameSound })), pattern.trim().toLowerCase(), buildRime.trim() === "" ? null : buildRime, decoys);
  const levelNumber = data.levels.find((l) => l.id === levelId)?.number ?? 1;
  const patternKey = pattern.trim().toLowerCase();
  const ipaOk = /^\/[^/\s][^/]*\/$/.test(soundIpa.trim());

  const touch = (field: string) => setTouched((s) => new Set(s).add(field));
  const fieldError = (field: string): string | undefined => {
    const issue = issues.find((i) => i.field === field && i.scope === "save");
    return issue && (attempted || touched.has(field)) ? issue.message : undefined;
  };

  function jump(field: string) {
    window.setTimeout(() => {
      const el = bodyRef.current?.querySelector<HTMLElement>(`[data-field="${field}"]`) ?? document.querySelector<HTMLElement>(`[data-field="${field}"]`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      el?.focus({ preventScroll: true });
    }, 60);
  }

  function addMembers(words: readonly BankWord[]) {
    setMembers((list) => {
      const have = new Set(list.map((m) => m.wordId));
      const fresh = words.filter((w) => !have.has(w.wordId)).map((w): FamilyEditorWord => ({ wordId: w.wordId, word: w.word, ipa: w.ipa, partOfSpeech: w.partOfSpeech, meaningVi: w.meaningVi, image: w.image, sameSound: !ipaOk || soundMatches(w.ipa, soundIpa) }));
      return [...list, ...fresh].slice(0, FAMILY_MEMBERS_MAX);
    });
  }

  async function runSearch(query: string) {
    if (!/^[a-z]{1,6}$/.test(patternKey)) {
      touch(familyFieldId.pattern);
      setSuggest((s) => ({ ...s, open: true, results: [], loading: false }));
      toast("Nhập vần (1–6 chữ cái a–z) trước để gợi ý từ trong kho.");
      return;
    }
    setSuggest((s) => ({ ...s, open: true, query, loading: true }));
    const results = await searchFamilyBankAction({ pattern: patternKey, query });
    setSuggest((s) => ({ ...s, results, loading: false, picks: s.picks.filter((id) => results.some((r) => r.wordId === id)) }));
  }

  function addPicked() {
    const words = suggest.results.filter((r) => suggest.picks.includes(r.wordId));
    addMembers(words);
    const traps = words.filter((w) => ipaOk && !soundMatches(w.ipa, soundIpa)).length;
    toast(`Đã thêm ${words.length} từ${traps > 0 ? `, trong đó ${traps} từ khác âm thành Bẫy` : ""}.`);
    setSuggest((s) => ({ ...s, picks: [] }));
  }

  // Có nội dung đã soạn thì hỏi trước khi AI thay thế.
  const hasContent = members.length > 0 || decoys.length > 0 || trapNote.trim() !== "" || sentences.some((s) => s.en.trim() !== "");

  async function suggestWithAi() {
    setAiConfirm(false);
    if (!/^[a-z]{1,6}$/.test(patternKey)) {
      touch(familyFieldId.pattern);
      toast("Nhập vần (1–6 chữ cái a–z) trước để AI gợi ý.");
      return;
    }
    setAiBusy(true);
    try {
      const result = await suggestFamilyAction({ pattern: patternKey });
      if (!result.ok) {
        toast(result.message);
        return;
      }
      const d = result.data;
      if (d.soundIpa) setSoundIpa(d.soundIpa);
      setMembers(d.members.map((m) => ({ wordId: m.wordId, word: m.word, ipa: m.ipa, partOfSpeech: m.partOfSpeech, meaningVi: m.meaningVi, image: m.image, sameSound: m.sameSound })));
      setDecoys(d.decoys);
      setTrapNote(d.trapNote);
      setSentences(d.sentences.map(toSentence));
      setAiWarnings(d.warnings);
      toast(`AI đã điền ${d.members.length} từ, ${d.decoys.length} chữ đầu nhiễu và ${d.sentences.length} câu (chưa lưu). Hãy đọc lại, sửa rồi bấm Lưu thay đổi.`);
    } catch {
      toast("Chưa gợi ý được. Kiểm tra mạng rồi thử lại nhé.");
    } finally {
      setAiBusy(false);
    }
  }

  const hasSentences = sentences.some((s) => s.en.trim() !== "" || s.vi.trim() !== "");
  const sentenceAiWhy = !data.aiAvailable ? "Chưa bật AI: điền GEMINI_API_KEY vào tệp .env rồi khởi động lại máy chủ" : same.length === 0 ? "Thêm ít nhất một từ cùng âm vào họ để AI viết câu" : undefined;

  async function suggestSentences() {
    setSentConfirm(false);
    setSentBusy(true);
    try {
      const result = await suggestFamilySentencesAction({ pattern: patternKey, soundIpa: soundIpa.trim(), levelId, members: members.map((m) => ({ wordId: m.wordId, sameSound: m.sameSound })) });
      if (!result.ok) {
        toast(result.message);
        return;
      }
      setSentences(result.data.sentences.map(toSentence));
      setSentWarnings(result.data.warnings);
      toast(`AI đã viết ${result.data.sentences.length} câu (chưa lưu). Hãy đọc lại, sửa rồi bấm Lưu thay đổi.`);
    } catch {
      toast("Chưa gợi ý được. Kiểm tra mạng rồi thử lại nhé.");
    } finally {
      setSentBusy(false);
    }
  }

  function addDecoy() {
    const raw = decoyInput.trim().toLowerCase();
    if (!raw) return;
    const parsed = onsetSchema.safeParse(raw);
    if (!parsed.success) return setDecoyError(parsed.error.issues[0]?.message ?? "Chữ đầu gồm 1–3 chữ cái a–z.");
    if (decoys.includes(parsed.data)) return setDecoyError(`Chữ đầu “${parsed.data}” đã có.`);
    if (decoys.length >= FAMILY_DECOYS_MAX) return setDecoyError(`Tối đa ${FAMILY_DECOYS_MAX} chữ đầu nhiễu.`);
    setDecoys((list) => [...list, parsed.data]);
    setDecoyInput("");
    setDecoyError("");
  }

  function openPreview() {
    const sentenceList = sentences.filter((s) => s.en.trim() !== "").map((s) => ({ en: s.en, vi: s.vi }));
    if (same.length === 0) {
      toast("Cần ít nhất một từ cùng âm để xem thử.");
      return;
    }
    const buildable = new Set(info.words.map((w) => w.wordId));
    const family: FamilyView = {
      id: data.id ?? 0,
      pattern: patternKey,
      soundIpa,
      members: same.map((m) => ({ wordId: m.wordId, word: m.word, ipa: m.ipa, partOfSpeech: m.partOfSpeech, meaningVi: m.meaningVi, image: m.image, learned: true, hasExplorer: false, buildable: buildable.has(m.wordId) })),
      traps: members.filter((m) => !m.sameSound).map((m) => ({ wordId: m.wordId, word: m.word, ipa: m.ipa, partOfSpeech: m.partOfSpeech, meaningVi: m.meaningVi })),
      trapNote,
      reading: sentenceList.length ? { sentences: sentenceList, audio: readingValid ? readingAudio : null } : null,
      glossary: {},
      build: info,
    };
    const steps: PlayStep[] = [{ id: "preview-family", kind: "word_family", family }];
    if (canBuild(info)) steps.push({ id: "preview-build", kind: "build_family", family, tiles: buildTiles(info, "preview") });
    setPreview(steps);
  }

  async function save() {
    setErrors({});
    setAttempted(true);
    const blocking = issues.find((i) => i.scope === "save");
    if (blocking) {
      setErrors({ form: blocking.message, at: now });
      jump(blocking.field);
      return;
    }
    if (status === "published" && !canPublishFamily(issues)) {
      setErrors({ status: `Chưa xuất bản được: ${issues[0].message}${issues.length > 1 ? ` (còn ${issues.length - 1} việc nữa)` : ""} Lưu Nháp trước, xong rồi xuất bản.`, at: now });
      jump(issues[0].field);
      return;
    }
    const parsed = saveFamilySchema.safeParse(payloadOf());
    if (!parsed.success) {
      setErrors({ form: parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ.", at: now });
      return;
    }
    setBusy(true);
    const result = await saveFamilyAction(parsed.data);
    setBusy(false);
    if (!result.ok) {
      setErrors(result.field === "status" ? { status: result.message, at: now } : { form: result.message, at: now });
      if (result.field) jump(result.field);
      return;
    }
    toast(status === "published" ? `Đã xuất bản họ vần -${patternKey}.` : `Đã lưu họ vần -${patternKey} (nháp).`);
    setSaved({ text: sentencesText, json: JSON.stringify(payloadOf()) });
    onSaved(result.id ?? data.id ?? 0);
  }

  async function makeAudio() {
    if (data.id === null) return;
    setMaking(true);
    const result = await generateFamilyAudioAction({ familyId: data.id, force: false });
    setMaking(false);
    if (!result.ok) {
      toast(result.message);
      return;
    }
    toast(result.made ? "Đã tạo giọng đọc đoạn văn." : "Đoạn văn đã có giọng đọc.");
    onReload();
  }

  const audioWhy = !data.ttsAvailable ? "Máy chủ này chưa có công cụ tạo giọng đọc" : data.id === null ? "Lưu họ vần trước khi tạo giọng đọc" : dirty ? "Lưu thay đổi trước khi tạo giọng đọc" : sentencesText === "" ? "Chưa có câu nào để đọc" : readingValid ? "Đoạn văn đã có giọng đọc" : undefined;
  const title = data.id === null ? "Thêm họ vần" : `Họ vần -${data.pattern}`;
  const trapCount = members.length - same.length;

  return (
    <>
      <AdultDrawer
        open
        wide
        onClose={onClose}
        title={title}
        footer={
          <>
            <AdultButton label="Hủy" variant="ghost" onClick={onClose} />
            <AdultButton label="Xem như học sinh" icon="eye" variant="secondary" onClick={openPreview} />
            <AdultButton label="Lưu thay đổi" icon="check" loading={busy} onClick={() => void save()} />
          </>
        }
      >
        <div className={editor.body} ref={bodyRef}>
          <section className={editor.sec} aria-label="Thông tin họ vần">
            <div className={styles.info}>
              <AdultInput label="Vần" lang="en" required placeholder="at" data-field={familyFieldId.pattern} value={pattern} error={fieldError(familyFieldId.pattern)} onBlur={() => touch(familyFieldId.pattern)} onChange={(e) => setPattern(e.target.value)} />
              <AdultInput label="Âm IPA" required placeholder="/æt/" data-field={familyFieldId.ipa} value={soundIpa} error={fieldError(familyFieldId.ipa)} onBlur={() => touch(familyFieldId.ipa)} onChange={(e) => setSoundIpa(e.target.value)} />
              <AdultSelect label="Cấp" value={levelId} onChange={(e) => setLevelId(Number(e.target.value))} options={data.levels.map((l) => [l.id, `Cấp ${l.number} · ${l.name}`] as const)} />
              <AdultInput label="Vần để ghép" lang="en" placeholder={patternKey || "at"} hint="Chỉ điền khi khác vần (họ ir ghép bằng irt)." data-field={familyFieldId.buildRime} value={buildRime} onChange={(e) => setBuildRime(e.target.value)} />
            </div>
          </section>

          {issues.length > 0 && (
            <section className={editor.warn} aria-label="Việc cần làm trước khi xuất bản" tabIndex={-1}>
              <h3 className={adultStyles.h3}>
                <Icon name="warn" size={16} /> Còn {issues.length} việc trước khi xuất bản
              </h3>
              <ul>
                {issues.slice(0, 8).map((issue, i) => (
                  <li key={`${issue.field}-${i}`}>
                    <button type="button" onClick={() => jump(issue.field)}>
                      {issue.message}
                    </button>
                  </li>
                ))}
                {issues.length > 8 && <li className={cn(adultStyles.small, adultStyles.muted)}>… và {issues.length - 8} việc nữa.</li>}
              </ul>
            </section>
          )}

          <section className={editor.sec} aria-label="Từ của họ vần" data-field={familyFieldId.members} tabIndex={-1}>
            <div className={editor.secHead}>
              <h3 className={adultStyles.h3}>
                Từ của họ ({same.length} cùng âm{trapCount > 0 ? `, ${trapCount} bẫy` : ""})
              </h3>
              <span className={editor.audioBtns}>
                <AdultButton label="Gợi ý từ trong kho" icon="wand" variant="secondary" size="s" onClick={() => void runSearch(suggest.query)} />
                <AdultButton
                  label={aiBusy ? "AI đang soạn…" : "Gợi ý bằng AI"}
                  icon="wand"
                  size="s"
                  loading={aiBusy}
                  disabled={!data.aiAvailable || aiBusy}
                  title={data.aiAvailable ? "AI chọn từ cùng âm và từ Bẫy trong kho, soạn chữ đầu nhiễu, lời Bông và câu vui; bạn đọc, sửa rồi mới lưu" : "Chưa bật AI: điền GEMINI_API_KEY vào tệp .env rồi khởi động lại máy chủ"}
                  onClick={() => (hasContent ? setAiConfirm(true) : void suggestWithAi())}
                />
              </span>
            </div>
            {shownAiWarnings.length > 0 && (
              <div className={editor.warn} role="status">
                <h3 className={adultStyles.h3}>
                  <Icon name="warn" size={16} /> AI nhắc bạn xem lại
                </h3>
                <ul>
                  {shownAiWarnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
                <AdultButton label="Ẩn" variant="ghost" size="s" onClick={() => setAiWarnings([])} />
              </div>
            )}
            <p className={cn(adultStyles.small, adultStyles.muted)}>
              Cần ít nhất {FAMILY_SAME_SOUND_MIN} từ cùng âm. Từ cùng chữ nhưng khác âm (eat, what trong họ -at) đánh dấu “Bẫy: khác âm” để bé nghe kỹ.
            </p>
            {suggest.open && (
              <div className={styles.suggest} aria-label="Gợi ý từ trong kho">
                <div className={styles.suggestHead}>
                  <AdultInput label="Lọc theo chữ" placeholder="Gõ để lọc các từ chứa vần" value={suggest.query} onChange={(e) => setSuggest((s) => ({ ...s, query: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), void runSearch(suggest.query))} />
                  <AdultButton label="Tìm" icon="search" variant="secondary" onClick={() => void runSearch(suggest.query)} />
                  <AdultIconButton icon="close" label="Đóng gợi ý" onClick={() => setSuggest((s) => ({ ...s, open: false }))} />
                </div>
                {suggest.loading ? (
                  <p className={cn(adultStyles.small, adultStyles.muted)} aria-live="polite">
                    Đang tìm…
                  </p>
                ) : suggest.results.length === 0 ? (
                  <p className={cn(adultStyles.small, adultStyles.muted)}>Không thấy từ nào chứa “{patternKey}” trong kho từ vựng.</p>
                ) : (
                  <>
                    <ul className={styles.suggestList}>
                      {suggest.results.map((w) => {
                        const added = members.some((m) => m.wordId === w.wordId);
                        const different = ipaOk && !soundMatches(w.ipa, soundIpa);
                        return (
                          <li key={w.wordId}>
                            <label data-added={added ? "" : undefined}>
                              <input type="checkbox" disabled={added} checked={added || suggest.picks.includes(w.wordId)} onChange={(e) => setSuggest((s) => ({ ...s, picks: e.target.checked ? [...s.picks, w.wordId] : s.picks.filter((id) => id !== w.wordId) }))} aria-label={`Chọn từ ${w.word}`} />
                              <Thumb src={w.image} />
                              <span className={styles.memInfo}>
                                <span className={styles.memWord} lang="en">
                                  {w.word}
                                  {different && <span className={styles.maybe}>khác âm?</span>}
                                </span>
                                <span className={cn(adultStyles.small, adultStyles.muted)}>
                                  {w.ipa ?? ""} {w.meaningVi}
                                  {added ? " · đã thêm" : ""}
                                </span>
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                    <div>
                      <AdultButton label={`Thêm ${suggest.picks.length} từ đã chọn`} icon="plus" size="s" disabled={suggest.picks.length === 0 || members.length >= FAMILY_MEMBERS_MAX} onClick={addPicked} />
                    </div>
                  </>
                )}
              </div>
            )}
            {members.length === 0 ? (
              <AdultEmpty title="Họ này chưa có từ nào" text="Nhập vần rồi bấm Gợi ý từ trong kho, tick các từ cùng vần và Thêm." />
            ) : (
              <ul className={styles.members}>
                {members.map((m, i) => {
                  const parts = splitRime(m.word, patternKey);
                  const different = m.sameSound && ipaOk && !soundMatches(m.ipa, soundIpa);
                  return (
                    <li key={m.wordId} className={cn(styles.mem, !m.sameSound && styles.memTrap)} data-field={familyFieldId.member(i)} tabIndex={-1}>
                      <Thumb src={m.image} />
                      <span className={styles.memInfo}>
                        <span className={styles.memWord} lang="en">
                          {parts.before}
                          {parts.rime && <span className={m.sameSound ? styles.rime : styles.mark}>{parts.rime}</span>}
                          {parts.after}
                          {different && <span className={styles.maybe}>khác âm?</span>}
                        </span>
                        <span className={cn(adultStyles.small, adultStyles.muted)}>
                          {m.ipa ?? "chưa có phiên âm"} · {m.meaningVi}
                        </span>
                      </span>
                      <AdultSegmented
                        label={`Loại của từ ${m.word}`}
                        labelHidden
                        value={m.sameSound ? "same" : "trap"}
                        onChange={(v) => setMembers((list) => list.map((x) => (x.wordId === m.wordId ? { ...x, sameSound: v === "same" } : x)))}
                        options={[
                          ["same", "Cùng âm"],
                          ["trap", "Bẫy: khác âm"],
                        ]}
                      />
                      <AdultIconButton icon="close" label={`Bỏ từ ${m.word} khỏi họ`} onClick={() => setMembers((list) => list.filter((x) => x.wordId !== m.wordId))} />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className={editor.sec} aria-label="Lời giải thích Bẫy chính tả">
            <AdultTextarea label="Lời Bông giải thích ô “Bẫy chính tả”" rows={3} maxLength={500} data-field={familyFieldId.trapNote} value={trapNote} hint="Hiện trong ô Bẫy chính tả của bé. Cần khi họ có từ Bẫy." onChange={(e) => setTrapNote(e.target.value)} />
          </section>

          <section className={editor.sec} aria-label="Ghép chữ đầu">
            <h3 className={adultStyles.h3}>Ghép chữ đầu</h3>
            {info.words.length === 0 ? (
              <p className={cn(adultStyles.small, adultStyles.muted)}>Chưa có từ cùng âm nào viết đúng “chữ đầu + {info.rime || "vần"}”.</p>
            ) : (
              <ul className={styles.real} aria-label="Từ thật ghép được">
                {info.words.map((w) => (
                  <li key={w.wordId} lang="en">
                    {w.onset} + {info.rime} = {w.word}
                  </li>
                ))}
              </ul>
            )}
            <p className={cn(adultStyles.small, adultStyles.muted)}>
              Chữ đầu của các từ thật được tự tính. Cần ít nhất {BUILD_MIN_REAL} từ ghép được thì màn Ghép chữ đầu mới dùng được (hiện {info.words.length}); mục tiêu của bé là {info.goal} từ.
            </p>
            <div data-field={familyFieldId.decoys} tabIndex={-1} className={editor.group}>
              <span className={adultStyles.h3}>Chữ đầu nhiễu (không thành từ: z, v, j…)</span>
              {decoys.length > 0 && (
                <ul className={styles.decoys}>
                  {decoys.map((d) => {
                    const bad = info.words.some((w) => w.onset === d);
                    return (
                      <li key={d} className={cn(styles.decoy, bad && styles.decoyBad)} lang="en">
                        {d}
                        <AdultIconButton icon="close" label={`Bỏ chữ đầu nhiễu ${d}`} onClick={() => setDecoys((list) => list.filter((x) => x !== d))} />
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className={styles.decoyAdd}>
                <AdultInput label="Thêm chữ đầu nhiễu" lang="en" placeholder="z" error={decoyError} value={decoyInput} onChange={(e) => (setDecoyInput(e.target.value), setDecoyError(""))} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDecoy())} />
                <AdultButton label="Thêm" icon="plus" variant="secondary" disabled={decoys.length >= FAMILY_DECOYS_MAX} onClick={addDecoy} />
              </div>
              {issues.some((i) => i.field === familyFieldId.decoys) && (attempted || touched.has(familyFieldId.decoys) || decoys.length > 0) && (
                <p className={cn(adultStyles.err, adultStyles.small, styles.fieldErr)} role="alert">
                  <Icon name="warn" size={14} />
                  <span>{issues.find((i) => i.field === familyFieldId.decoys)?.message}</span>
                </p>
              )}
            </div>
          </section>

          <section className={editor.sec} aria-label="Đoạn văn vui" data-field={familyFieldId.reading} tabIndex={-1}>
            <div className={editor.secHead}>
              <h3 className={adultStyles.h3}>
                Đoạn văn vui “Đọc cả đoạn” ({sentences.length}/{FAMILY_SENTENCES_MAX} câu)
              </h3>
              <span className={editor.audioBtns}>
                <AdultButton
                  label={sentBusy ? "AI đang viết…" : "Gợi ý câu bằng AI"}
                  icon="wand"
                  variant="secondary"
                  size="s"
                  loading={sentBusy}
                  disabled={sentenceAiWhy !== undefined || sentBusy}
                  title={sentenceAiWhy ?? "AI viết 2–3 câu vui dùng các từ trong họ, kèm bản dịch; bạn đọc, sửa rồi mới lưu"}
                  onClick={() => (hasSentences ? setSentConfirm(true) : void suggestSentences())}
                />
                <AdultButton label="Thêm câu" icon="plus" variant="secondary" size="s" disabled={sentences.length >= FAMILY_SENTENCES_MAX} onClick={() => setSentences((list) => [...list, toSentence({ en: "", vi: "" })])} />
              </span>
            </div>
            {shownSentWarnings.length > 0 && (
              <div className={editor.warn} role="status">
                <h3 className={adultStyles.h3}>
                  <Icon name="warn" size={16} /> AI nhắc bạn xem lại các câu
                </h3>
                <ul>
                  {shownSentWarnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
                <AdultButton label="Ẩn" variant="ghost" size="s" onClick={() => setSentWarnings([])} />
              </div>
            )}
            {sentences.length === 0 ? (
              <p className={cn(adultStyles.small, adultStyles.muted)}>Thêm 1–{FAMILY_SENTENCES_MAX} câu vui dùng các từ trong họ (The fat cat sat on a mat.), mỗi câu kèm bản dịch.</p>
            ) : (
              <ol className={editor.sents}>
                {sentences.map((s, i) => (
                  <li key={s.key}>
                    <span className={editor.no}>{i + 1}</span>
                    <input className={adultStyles.input} lang="en" aria-label={`Câu ${i + 1} của đoạn văn (tiếng Anh)`} placeholder="Câu tiếng Anh" value={s.en} onChange={(e) => setSentences((list) => list.map((x) => (x.key === s.key ? { ...x, en: e.target.value } : x)))} />
                    <input className={adultStyles.input} data-field={familyFieldId.sentence(i)} aria-label={`Câu ${i + 1} của đoạn văn (dịch tiếng Việt)`} placeholder="Dịch tiếng Việt" value={s.vi} onChange={(e) => setSentences((list) => list.map((x) => (x.key === s.key ? { ...x, vi: e.target.value } : x)))} />
                    <AdultIconButton icon="close" label={`Bỏ câu ${i + 1}`} onClick={() => setSentences((list) => list.filter((x) => x.key !== s.key))} />
                  </li>
                ))}
              </ol>
            )}
            <div className={editor.readAudio} data-field={familyFieldId.readingAudio} tabIndex={-1}>
              <span className={cn(adultStyles.small, adultStyles.muted)}>{readingValid ? `Giọng đọc đoạn văn: ${fileName(readingAudio)}` : "Đoạn văn chưa có giọng đọc."}</span>
              <span className={editor.audioBtns}>
                {readingValid && readingAudio && <SpeakerButton word={sentencesText.split("\n").join(" ")} audioUrl={readingAudio} size="s" label="Nghe giọng đọc đoạn văn" />}
                <AdultButton label="Tạo giọng đọc tự động" icon="speaker" variant="secondary" size="s" loading={making} disabled={audioWhy !== undefined} title={audioWhy} onClick={() => void makeAudio()} />
              </span>
            </div>
          </section>

          <section className={editor.sec} aria-label="Trạng thái">
            <h3 className={adultStyles.h3}>Trạng thái</h3>
            <AdultSegmented
              label="Trạng thái họ vần"
              labelHidden
              value={status}
              onChange={setStatus}
              options={[
                ["draft", "Nháp"],
                ["published", "Xuất bản"],
              ]}
            />
            <p className={cn(adultStyles.small, adultStyles.muted)}>Bản Nháp không tới bé. Xuất bản cần ít nhất {FAMILY_SAME_SOUND_MIN} từ cùng âm chứa vần, lời giải thích bẫy (nếu có từ Bẫy), đoạn văn có bản dịch và giọng đọc.</p>
            {errors.status && (
              <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
                <Icon name="warn" size={14} />
                <span>{errors.status}</span>
              </p>
            )}
          </section>
          {errors.form && (
            <p className={cn(adultStyles.err, adultStyles.small)} role="alert">
              <Icon name="warn" size={14} />
              <span>{errors.form}</span>
            </p>
          )}
        </div>
      </AdultDrawer>

      <AdultDialog
        open={aiConfirm}
        onClose={() => setAiConfirm(false)}
        title="Thay nội dung hiện có bằng gợi ý của AI?"
        actions={[
          { label: "Giữ nguyên", variant: "ghost" },
          { label: "Thay bằng gợi ý", icon: "wand", onClick: () => void suggestWithAi() },
        ]}
      >
        <p className={adultStyles.body}>AI sẽ soạn lại các từ của họ -{patternKey}, chữ đầu nhiễu, lời Bông giải thích Bẫy và đoạn văn vui (vần và cấp giữ nguyên; âm IPA được điền lại nếu AI đề xuất). Giọng đọc đoạn văn cũ sẽ mất (tạo lại được). Chưa lưu gì cho đến khi bạn bấm Lưu thay đổi; bấm Hủy để bỏ hết.</p>
      </AdultDialog>
      <AdultDialog
        open={sentConfirm}
        onClose={() => setSentConfirm(false)}
        title="Thay các câu hiện có bằng gợi ý của AI?"
        actions={[
          { label: "Giữ nguyên", variant: "ghost" },
          { label: "Thay bằng gợi ý", icon: "wand", onClick: () => void suggestSentences() },
        ]}
      >
        <p className={adultStyles.body}>AI sẽ viết lại các câu của đoạn văn vui dựa trên các từ đang có trong họ -{patternKey}; từ, chữ đầu nhiễu và lời Bông giữ nguyên. Giọng đọc đoạn văn cũ sẽ mất (tạo lại được). Chưa lưu gì cho đến khi bạn bấm Lưu thay đổi; bấm Hủy để bỏ hết.</p>
      </AdultDialog>
      {preview && <StepsPreview steps={preview} level={levelNumber} onClose={() => setPreview(null)} />}
    </>
  );
}
