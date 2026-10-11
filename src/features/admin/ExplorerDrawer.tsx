"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AdultButton, AdultDialog, AdultDrawer, AdultEmpty, AdultIconButton, AdultSegmented, AdultSelect, AdultSortable, adultStyles, useToast } from "@/components/adult";
import { Icon, SpeakerButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import { WORDLAB } from "@/lib/rules/constants";
import type { PlayStep } from "@/lib/rules/lesson-play";
import { QUESTION_SETS, canPublish, composeSentence, explorerFieldId, explorerIssues, fillQuestionSet, isPlayable, viewBranches, type ExplorerBranch, type QuestionSetKey } from "@/lib/rules/word-explorer";
import { saveExplorerSchema } from "@/lib/schemas/admin-word-explorer";
import { WORD_QUESTION_KINDS, type SuggestedBranch, type ExplorerAnswer, type ExplorerDistractor, type ExplorerSentence, type WordQuestionKind } from "@/lib/schemas";
import type { ExplorerEditorData } from "@/server/admin/word-explorer";
import { AudioBatchStatus } from "./AudioBatchStatus";
import { StepsPreview } from "./StepsPreview";
import { useAudioBatch } from "./useAudioBatch";
import { suggestExplorerAction } from "./ai-suggest-actions";
import { generateExplorerAudioAction, getExplorerEditorAction, saveExplorerAction } from "./word-explorer-actions";
import styles from "./explorer-editor.module.css";

type EBranch = { key: string; id?: number; kind: WordQuestionKind; questionEn: string; questionVi: string; answers: ExplorerAnswer[]; distractors: ExplorerDistractor[]; sentence: ExplorerSentence; open: boolean };

const KIND_LABEL: Record<WordQuestionKind, string> = {
  identify: "Đây là gì / ai",
  color: "Màu sắc",
  food: "Ăn uống",
  parts: "Bộ phận, có gì",
  action: "Làm được gì",
  place: "Ở đâu",
  time: "Khi nào",
  use: "Dùng để làm gì",
  other: "Khác",
};
const MAX_ANSWERS = 5;
const MAX_DISTRACTORS = 2;
const fileName = (p: string | null | undefined) => (p ? (p.split("/").pop() ?? p) : "");

let counter = 0;
const nextKey = () => `b${++counter}`;
const emptyAnswer = (): ExplorerAnswer => ({ text: "", textVi: "", image: null, audio: null });
const blankBranch = (): EBranch => ({ key: nextKey(), kind: "other", questionEn: "", questionVi: "", answers: [emptyAnswer()], distractors: [], sentence: { en: "", vi: "" }, open: true });
const toEditor = (b: ExplorerEditorData["branches"][number]): EBranch => ({ key: nextKey(), id: b.id, kind: b.kind, questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers, distractors: b.distractors, sentence: b.sentence, open: false });
const fromSuggestion = (b: SuggestedBranch): EBranch => ({
  key: nextKey(),
  kind: b.kind,
  questionEn: b.questionEn,
  questionVi: b.questionVi,
  answers: b.answers.map((a) => ({ text: a.text, textVi: a.textVi, image: a.image, audio: null, guess: a.guess })),
  distractors: b.distractors,
  sentence: b.sentence,
  open: false,
});
const toPayload = (branches: readonly EBranch[]) => branches.map(({ key, open, ...b }) => (void key, void open, b));
/** Hình trong danh sách chỉ là tệp tĩnh của thư viện: không cần tối ưu ảnh của Next. */
function Thumb({ src }: { src: string | null | undefined }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <span className={styles.thumb}>{src ? <img src={src} alt="" /> : <Icon name="image" size={16} />}</span>;
}

type Props = { wordId: number; onClose: () => void };

/** Soạn Khám phá từ (Adult22): ngăn kéo rộng của Ngân hàng từ vựng. Nạp dữ liệu soạn của từ rồi mở biểu mẫu. */
export function ExplorerDrawer({ wordId, onClose }: Props) {
  const router = useRouter();
  const [data, setData] = useState<ExplorerEditorData | null | undefined>(undefined);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let alive = true;
    getExplorerEditorAction({ wordId })
      .then((d) => alive && setData(d))
      .catch(() => alive && setData(null));
    return () => {
      alive = false;
    };
  }, [wordId, version]);

  if (data === undefined || data === null) {
    return (
      <AdultDrawer open wide onClose={onClose} title="Soạn Khám phá từ" footer={<AdultButton label="Đóng" variant="ghost" onClick={onClose} />}>
        {data === undefined ? (
          <p className={cn(adultStyles.body, adultStyles.muted)} aria-live="polite">
            Đang mở Khám phá…
          </p>
        ) : (
          <AdultEmpty title="Chưa mở được Khám phá" text="Từ này không còn hoặc máy chủ đang bận. Thử lại nhé." action={<AdultButton label="Thử lại" icon="replay" variant="secondary" onClick={() => (setData(undefined), setVersion((v) => v + 1))} />} />
        )}
      </AdultDrawer>
    );
  }
  return (
    <EditorBody
      key={version}
      data={data}
      onClose={onClose}
      onSaved={() => {
        router.refresh();
        setData(undefined);
        setVersion((v) => v + 1);
      }}
    />
  );
}

function EditorBody({ data, onClose, onSaved }: { data: ExplorerEditorData; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const { word } = data;
  const [branches, setBranches] = useState<EBranch[]>(() => data.branches.map(toEditor));
  const [readingAudio, setReadingAudio] = useState(data.readingAudio);
  const [status, setStatus] = useState<"draft" | "published">(data.status === "published" ? "published" : "draft");
  const [set, setSet] = useState<QuestionSetKey>("animals");
  const [errors, setErrors] = useState<{ form?: string; status?: string }>({});
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiConfirm, setAiConfirm] = useState(false);
  const [aiWarnings, setAiWarnings] = useState<string[]>([]);
  const [preview, setPreview] = useState<PlayStep | null>(null);
  const [bankPick, setBankPick] = useState<Record<string, string>>({});
  // Bản đã lưu (chữ đoạn văn và toàn bộ nội dung) để biết đã sửa chưa và giọng đọc đoạn văn còn đúng không.
  const [saved, setSaved] = useState(() => ({ text: data.branches.map((b) => b.sentence.en).join("\n"), json: JSON.stringify(toPayload(data.branches.map(toEditor))) }));
  const bodyRef = useRef<HTMLDivElement>(null);

  const patch = (key: string, change: Partial<EBranch> | ((b: EBranch) => Partial<EBranch>)) => setBranches((list) => list.map((b) => (b.key === key ? { ...b, ...(typeof change === "function" ? change(b) : change) } : b)));
  const setAnswer = (key: string, index: number, change: Partial<ExplorerAnswer>) => patch(key, (b) => ({ answers: b.answers.map((a, i) => (i === index ? { ...a, ...change } : a)) }));
  const setDistractor = (key: string, index: number, change: Partial<ExplorerDistractor>) => patch(key, (b) => ({ distractors: b.distractors.map((d, i) => (i === index ? { ...d, ...change } : d)) }));

  const sentencesText = branches.map((b) => b.sentence.en).join("\n");
  // Âm thanh đoạn văn chỉ đúng khi chữ chưa đổi so với lúc tạo.
  const readingValid = readingAudio !== null && sentencesText === saved.text;
  const rules: ExplorerBranch[] = branches.map((b) => ({ kind: b.kind, questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers, distractors: b.distractors }));
  const issues = explorerIssues(rules, { sentences: branches.map((b) => b.sentence), audio: readingValid ? readingAudio : null });
  const dirty = JSON.stringify(toPayload(branches)) !== saved.json;
  // Lời nhắc của AI trừ những việc đã có trong khung “Còn … việc trước khi xuất bản”.
  const shownAiWarnings = aiWarnings.filter((w) => !issues.some((i) => i.message === w));

  // Tạo giọng đọc: lượt mục là các nhánh còn đáp án chưa có tệp và (nếu chưa có) đoạn văn.
  const batch = useAudioBatch(
    () => {
      void getExplorerEditorAction({ wordId: word.id }).then((fresh) => {
        if (!fresh) return;
        // Chỉ lấy lại phần âm thanh, giữ nguyên chỗ đang sửa dở.
        setBranches((list) => list.map((b) => ({ ...b, answers: b.answers.map((a) => ({ ...a, audio: fresh.branches.find((f) => f.id === b.id)?.answers.find((x) => x.text === a.text)?.audio ?? a.audio })) })));
        setReadingAudio(fresh.readingAudio);
        setSaved({ text: fresh.branches.map((b) => b.sentence.en).join("\n"), json: JSON.stringify(toPayload(fresh.branches.map(toEditor))) });
      });
    },
    (ids, force) => generateExplorerAudioAction({ wordId: word.id, ids, force }),
  );
  const audioTodo = [...branches.filter((b) => b.id !== undefined && b.answers.some((a) => !a.audio)).map((b) => b.id as number), ...(branches.length > 0 && !readingValid ? [0] : [])];
  const audioWhy = !data.ttsAvailable ? "Máy chủ này chưa có công cụ tạo giọng đọc" : dirty ? "Lưu thay đổi trước khi tạo giọng đọc" : audioTodo.length === 0 ? "Mọi đáp án và đoạn văn đã có giọng đọc" : undefined;

  function jump(field: string) {
    const match = /^branch-(\d+)-/.exec(field);
    if (match) {
      const target = branches[Number(match[1])];
      if (target && !target.open) patch(target.key, { open: true });
    }
    window.setTimeout(() => {
      const el = bodyRef.current?.querySelector<HTMLElement>(`[data-field="${field}"]`) ?? document.querySelector<HTMLElement>(`[data-field="${field}"]`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      el?.focus({ preventScroll: true });
    }, 60);
  }

  function fillQuestions() {
    const filled = fillQuestionSet(set, word.word, word.meaningVi);
    setBranches((list) => {
      const next = list.map((b, i) => (filled[i] ? { ...b, ...filled[i] } : b));
      for (let i = list.length; i < filled.length; i++) next.push({ ...blankBranch(), ...filled[i], open: false });
      return next;
    });
    toast(`Đã điền sẵn ${filled.length} câu hỏi mẫu “${QUESTION_SETS[set].label}”. Đáp án giữ nguyên.`);
  }

  // Có nội dung đã soạn thì hỏi trước khi AI thay thế (đáp án cũ đã có giọng đọc sẽ mất giọng đọc).
  const hasContent = branches.some((b) => b.questionEn.trim() !== "" || b.answers.some((a) => a.text.trim() !== "" || a.image));

  async function suggest() {
    setAiConfirm(false);
    setAiBusy(true);
    setErrors({});
    try {
      const result = await suggestExplorerAction({ wordId: word.id, set });
      if (!result.ok) {
        toast(result.message);
        return;
      }
      const { branches: next, suggestedSet, warnings } = result.data;
      setBranches(next.map(fromSuggestion));
      if (suggestedSet) setSet(suggestedSet);
      setAiWarnings(warnings);
      toast(`AI đã điền ${next.length} nhánh (chưa lưu). Hãy đọc lại, sửa rồi bấm Lưu thay đổi.`);
    } catch {
      toast("Chưa gợi ý được. Kiểm tra mạng rồi thử lại nhé.");
    } finally {
      setAiBusy(false);
    }
  }

  function composeParagraph() {
    setBranches((list) =>
      list.map((b) => {
        const en = composeSentence(b.kind, word.word, b.answers);
        if (!en) return b;
        return { ...b, sentence: { en, vi: en === b.sentence.en ? b.sentence.vi : "" } };
      }),
    );
    toast("Đã ghép đoạn từ các câu trả lời. Hãy đọc lại và dịch từng câu.");
  }

  function addFromBank(key: string) {
    const typed = (bankPick[key] ?? "").trim().toLowerCase();
    const found = data.bank.find((w) => w.word.toLowerCase() === typed);
    if (!found) {
      toast("Chưa thấy từ này trong kho từ vựng.");
      return;
    }
    patch(key, (b) => (b.answers.length >= MAX_ANSWERS ? {} : { answers: [...b.answers.filter((a) => a.text.trim() !== "" || a.image), { text: found.word, textVi: found.meaningVi, image: found.image, audio: found.audio }] }));
    setBankPick((m) => ({ ...m, [key]: "" }));
  }

  function openPreview() {
    const content = {
      branches: branches.map((b, i) => ({ id: i + 1, kind: b.kind, questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers, distractors: b.distractors, sentence: b.sentence })),
      reading: { sentences: branches.map((b) => b.sentence), audio: readingValid ? readingAudio : null },
      glossary: {},
    };
    if (!isPlayable(content) || branches.some((b) => b.questionEn.trim() === "" || b.answers.some((a) => a.text.trim() === ""))) {
      toast(`Cần ${WORDLAB.branchMin}–${WORDLAB.branchMax} nhánh, mỗi nhánh có câu hỏi, đáp án và một câu trong đoạn văn mới xem thử được.`);
      return;
    }
    setPreview({
      id: "preview",
      kind: "word_explorer",
      word: { id: word.id, word: word.word, ipa: word.ipa, meaningVi: word.meaningVi, exampleEn: word.exampleEn, exampleVi: word.exampleVi, image: word.image },
      branches: viewBranches(content, "preview"),
      reading: content.reading,
      glossary: {},
    });
  }

  async function save() {
    setErrors({});
    if (status === "published" && !canPublish(issues)) {
      setErrors({ status: `Chưa xuất bản được: ${issues[0].message}${issues.length > 1 ? ` (còn ${issues.length - 1} việc nữa)` : ""} Lưu Nháp trước, xong rồi xuất bản.` });
      jump(issues[0].field);
      return;
    }
    const parsed = saveExplorerSchema.safeParse({ wordId: word.id, status, branches: toPayload(branches) });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setErrors({ form: `${issue?.path[0] === "branches" && typeof issue.path[1] === "number" ? `Nhánh ${issue.path[1] + 1}: ` : ""}${issue?.message ?? "Dữ liệu chưa hợp lệ."}` });
      return;
    }
    setBusy(true);
    const result = await saveExplorerAction(parsed.data);
    setBusy(false);
    if (!result.ok) {
      setErrors(result.field === "status" ? { status: result.message } : { form: result.message });
      return;
    }
    toast(branches.length === 0 ? `Đã gỡ Khám phá của “${word.word}”.` : status === "published" ? `Đã xuất bản Khám phá của “${word.word}”.` : `Đã lưu Khám phá của “${word.word}” (nháp).`);
    onSaved();
  }

  const removeBranch = branches.find((b) => b.key === removing);
  return (
    <>
      <AdultDrawer
        open
        wide
        onClose={onClose}
        title={`Khám phá từ “${word.word}”`}
        footer={
          <>
            <AdultButton label="Hủy" variant="ghost" onClick={onClose} />
            <AdultButton label="Xem như học sinh" icon="eye" variant="secondary" onClick={openPreview} />
            <AdultButton label="Lưu thay đổi" icon="check" loading={busy} onClick={() => void save()} />
          </>
        }
      >
        <div className={styles.body} ref={bodyRef}>
          <datalist id="explorer-pictures">
            {data.pictures.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
          <datalist id="explorer-bank">
            {data.bank.map((w) => (
              <option key={w.word} value={w.word}>
                {w.meaningVi}
              </option>
            ))}
          </datalist>

          <div className={styles.wordHead}>
            <Thumb src={word.image} />
            <span>
              <b lang="en">{word.word}</b> <span className={cn(adultStyles.small, adultStyles.muted)}>{word.ipa}</span>
              <br />
              <span className={cn(adultStyles.small, adultStyles.muted)}>
                {word.meaningVi} · Cấp {word.levelNumber}
                {word.topic ? ` · ${word.topic}` : ""}
              </span>
            </span>
          </div>

          {issues.length > 0 && (
            <section className={styles.warn} aria-label="Việc cần làm trước khi xuất bản" data-field={explorerFieldId.branches} tabIndex={-1}>
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

          <section className={styles.sec} aria-label="Bộ câu hỏi mẫu">
            <h3 className={adultStyles.h3}>Bộ câu hỏi mẫu</h3>
            <div className={styles.setRow}>
              <AdultSelect label="Nhóm từ" value={set} onChange={(e) => setSet(e.target.value as QuestionSetKey)} options={(Object.keys(QUESTION_SETS) as QuestionSetKey[]).map((k) => [k, QUESTION_SETS[k].label] as const)} />
              <AdultButton label="Điền sẵn câu hỏi" icon="wand" variant="secondary" onClick={fillQuestions} />
              <AdultButton
                label={aiBusy ? "AI đang soạn…" : "Gợi ý bằng AI"}
                icon="wand"
                loading={aiBusy}
                disabled={!data.aiAvailable || aiBusy}
                title={data.aiAvailable ? "AI soạn nháp các nhánh, đáp án, hình nhiễu và câu cho đoạn văn; bạn đọc, sửa rồi mới lưu" : "Chưa bật AI: điền GEMINI_API_KEY vào tệp .env rồi khởi động lại máy chủ"}
                onClick={() => (hasContent ? setAiConfirm(true) : void suggest())}
              />
            </div>
            <p className={cn(adultStyles.small, adultStyles.muted)}>Điền câu hỏi tiếng Anh và tiếng Việt theo nhóm từ; đáp án đã soạn được giữ nguyên. “Gợi ý bằng AI” soạn nháp cả nhánh (mất 5–10 giây), chưa lưu gì cho đến khi bạn bấm Lưu thay đổi.</p>
            {shownAiWarnings.length > 0 && (
              <div className={styles.warn} role="status">
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
          </section>

          <section className={styles.sec} aria-label="Các nhánh câu hỏi">
            <div className={styles.secHead}>
              <h3 className={adultStyles.h3}>
                Các nhánh ({branches.length}/{WORDLAB.branchMax})
              </h3>
              <AdultButton label="Thêm nhánh" icon="plus" variant="secondary" size="s" disabled={branches.length >= WORDLAB.branchMax} onClick={() => setBranches((l) => [...l, blankBranch()])} />
            </div>
            <p className={cn(adultStyles.small, adultStyles.muted)}>Cần {WORDLAB.branchMin}–{WORDLAB.branchMax} nhánh. Kéo tay nắm hoặc Tab tới tay nắm rồi ↑ ↓ để đổi thứ tự; câu của nhánh trong đoạn văn đi theo nhánh.</p>
            {branches.length === 0 ? (
              <AdultEmpty title="Từ này chưa có nhánh nào" text="Chọn bộ câu hỏi mẫu rồi bấm Điền sẵn câu hỏi, hoặc Thêm nhánh." />
            ) : (
              <AdultSortable
                className={styles.list}
                ids={branches.map((b) => b.key)}
                labelOf={(key) => `nhánh ${branches.findIndex((b) => b.key === key) + 1}`}
                onReorder={(keys) => setBranches((list) => keys.map((k) => list.find((b) => b.key === k)!).filter(Boolean))}
              >
                {(api) =>
                  branches.map((b, i) => (
                    <li key={b.key} className={styles.branch} {...api.itemProps(b.key)}>
                      <div className={styles.bHead}>
                        <button type="button" className={styles.grip} {...api.gripProps(b.key)}>
                          <Icon name="grip" size={16} />
                        </button>
                        <span className={styles.no}>{i + 1}</span>
                        <button type="button" className={styles.bTitle} aria-expanded={b.open} onClick={() => patch(b.key, { open: !b.open })}>
                          <b lang="en">{b.questionEn || "Câu hỏi chưa nhập"}</b>
                          <span className={cn(adultStyles.small, adultStyles.muted)}>{b.answers.filter((a) => a.text.trim()).length} đáp án</span>
                          <Icon name={b.open ? "sortup" : "sortdown"} size={14} />
                        </button>
                        <AdultIconButton icon="trash" label={`Xóa nhánh ${i + 1}`} onClick={() => setRemoving(b.key)} />
                      </div>
                      {b.open && (
                        <div className={styles.bBody}>
                          <div className={styles.q2}>
                            <label className={styles.lab}>
                              Câu hỏi tiếng Anh
                              <input className={adultStyles.input} lang="en" value={b.questionEn} onChange={(e) => patch(b.key, { questionEn: e.target.value })} />
                            </label>
                            <label className={styles.lab}>
                              Dịch tiếng Việt
                              <input className={adultStyles.input} data-field={explorerFieldId.question(i)} value={b.questionVi} onChange={(e) => patch(b.key, { questionVi: e.target.value })} />
                            </label>
                          </div>
                          <label className={styles.lab}>
                            Loại câu hỏi
                            <select className={adultStyles.input} value={b.kind} onChange={(e) => patch(b.key, { kind: e.target.value as WordQuestionKind })}>
                              {WORD_QUESTION_KINDS.map((k) => (
                                <option key={k} value={k}>
                                  {KIND_LABEL[k]}
                                </option>
                              ))}
                            </select>
                          </label>

                          <fieldset className={styles.group}>
                            <legend className={adultStyles.h3}>Đáp án</legend>
                            {b.answers.map((a, j) => {
                              const guess = a.guess || (!b.answers.some((x) => x.guess) && j === 0);
                              return (
                                <div key={j} className={styles.ans}>
                                  <input className={adultStyles.input} lang="en" aria-label={`Đáp án ${j + 1} của nhánh ${i + 1}`} placeholder="Đáp án (a bird, brown…)" value={a.text} onChange={(e) => setAnswer(b.key, j, { text: e.target.value, audio: e.target.value.trim() === a.text.trim() ? a.audio : null })} />
                                  <input className={adultStyles.input} aria-label={`Nghĩa của đáp án ${j + 1} nhánh ${i + 1}`} placeholder="Nghĩa tiếng Việt" value={a.textVi} onChange={(e) => setAnswer(b.key, j, { textVi: e.target.value })} />
                                  <AdultIconButton icon="close" label={`Bỏ đáp án ${j + 1} của nhánh ${i + 1}`} disabled={b.answers.length <= 1} onClick={() => patch(b.key, { answers: b.answers.filter((_, x) => x !== j) })} />
                                  <div className={styles.pic}>
                                    <Thumb src={a.image} />
                                    <input className={adultStyles.input} list="explorer-pictures" data-field={explorerFieldId.answerImage(i, j)} aria-label={`Hình của đáp án ${j + 1} nhánh ${i + 1}`} placeholder="Chọn hình trong thư viện" value={a.image ?? ""} onChange={(e) => setAnswer(b.key, j, { image: e.target.value.trim() === "" ? null : e.target.value.trim() })} />
                                  </div>
                                  <label className={styles.radio}>
                                    <input type="radio" name={`guess-${b.key}`} checked={guess} onChange={() => patch(b.key, { answers: b.answers.map((x, y) => ({ ...x, guess: y === j })) })} />
                                    Hình để đoán
                                  </label>
                                  <span className={cn(styles.chip, a.audio ? styles.chipOk : styles.chipNo)} data-field={explorerFieldId.answerAudio(i, j)} tabIndex={-1}>
                                    {a.audio ? (
                                      <>
                                        <SpeakerButton word={a.text} audioUrl={a.audio} size="s" label={`Nghe tệp của đáp án ${a.text}`} />
                                        {fileName(a.audio)}
                                      </>
                                    ) : (
                                      <>
                                        <Icon name="music" size={14} /> Chưa có âm thanh
                                      </>
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                            <div className={styles.addRow}>
                              <AdultButton label="Gõ đáp án mới" icon="plus" variant="ghost" size="s" disabled={b.answers.length >= MAX_ANSWERS} onClick={() => patch(b.key, { answers: [...b.answers, emptyAnswer()] })} />
                              <input className={cn(adultStyles.input, styles.bank)} list="explorer-bank" aria-label={`Chọn đáp án từ kho từ vựng cho nhánh ${i + 1}`} placeholder="Hoặc chọn từ trong kho từ vựng…" value={bankPick[b.key] ?? ""} onChange={(e) => setBankPick((m) => ({ ...m, [b.key]: e.target.value }))} />
                              <AdultButton label="Lấy từ kho" icon="copy" variant="secondary" size="s" disabled={b.answers.length >= MAX_ANSWERS || !(bankPick[b.key] ?? "").trim()} onClick={() => addFromBank(b.key)} />
                            </div>
                          </fieldset>

                          <fieldset className={styles.group} data-field={explorerFieldId.distractors(i)} tabIndex={-1}>
                            <legend className={adultStyles.h3}>Hình nhiễu (1–{MAX_DISTRACTORS}) cho lúc bé đoán</legend>
                            {b.distractors.map((d, j) => (
                              <div key={j} className={styles.dis}>
                                <Thumb src={d.image} />
                                <input className={adultStyles.input} lang="en" aria-label={`Nhãn hình nhiễu ${j + 1} nhánh ${i + 1}`} placeholder="Nhãn (a cat)" value={d.text} onChange={(e) => setDistractor(b.key, j, { text: e.target.value })} />
                                <input className={adultStyles.input} list="explorer-pictures" data-field={explorerFieldId.distractorImage(i, j)} aria-label={`Hình nhiễu ${j + 1} nhánh ${i + 1}`} placeholder="Chọn hình" value={d.image ?? ""} onChange={(e) => setDistractor(b.key, j, { image: e.target.value.trim() === "" ? null : e.target.value.trim() })} />
                                <AdultIconButton icon="close" label={`Bỏ hình nhiễu ${j + 1} của nhánh ${i + 1}`} onClick={() => patch(b.key, { distractors: b.distractors.filter((_, x) => x !== j) })} />
                              </div>
                            ))}
                            <AdultButton label="Thêm hình nhiễu" icon="plus" variant="ghost" size="s" disabled={b.distractors.length >= MAX_DISTRACTORS} onClick={() => patch(b.key, { distractors: [...b.distractors, { text: "", image: null }] })} />
                          </fieldset>
                        </div>
                      )}
                    </li>
                  ))
                }
              </AdultSortable>
            )}
          </section>

          <section className={styles.sec} aria-label="Đoạn văn Đọc cả đoạn" data-field={explorerFieldId.reading} tabIndex={-1}>
            <div className={styles.secHead}>
              <h3 className={adultStyles.h3}>Đoạn văn “Đọc cả đoạn”</h3>
              <AdultButton label="Ghép đoạn từ các câu trả lời" icon="wand" variant="secondary" size="s" disabled={branches.length === 0} onClick={composeParagraph} />
            </div>
            {branches.length === 0 ? (
              <p className={cn(adultStyles.small, adultStyles.muted)}>Thêm nhánh trước; mỗi nhánh có một câu trong đoạn văn.</p>
            ) : (
              <ol className={styles.sents}>
                {branches.map((b, i) => (
                  <li key={b.key}>
                    <span className={styles.no}>{i + 1}</span>
                    <input className={adultStyles.input} lang="en" aria-label={`Câu ${i + 1} của đoạn văn (tiếng Anh)`} placeholder="Câu tiếng Anh" value={b.sentence.en} onChange={(e) => patch(b.key, { sentence: { ...b.sentence, en: e.target.value } })} />
                    <input className={adultStyles.input} data-field={explorerFieldId.sentence(i)} aria-label={`Câu ${i + 1} của đoạn văn (dịch tiếng Việt)`} placeholder="Dịch tiếng Việt" value={b.sentence.vi} onChange={(e) => patch(b.key, { sentence: { ...b.sentence, vi: e.target.value } })} />
                  </li>
                ))}
              </ol>
            )}
            <div className={styles.readAudio} data-field={explorerFieldId.readingAudio} tabIndex={-1}>
              <span className={cn(adultStyles.small, adultStyles.muted)}>{readingValid ? `Giọng đọc đoạn văn: ${fileName(readingAudio)}` : "Đoạn văn chưa có giọng đọc."}</span>
              <span className={styles.audioBtns}>
                {readingValid && readingAudio && <SpeakerButton word={branches.map((b) => b.sentence.en).join(" ")} audioUrl={readingAudio} size="s" label="Nghe giọng đọc đoạn văn" />}
                <AdultButton label="Tạo giọng đọc tự động" icon="speaker" variant="secondary" size="s" disabled={batch.busy || audioTodo.length === 0 || !data.ttsAvailable || dirty} title={audioWhy} onClick={() => void batch.start(audioTodo)} />
              </span>
            </div>
            <AudioBatchStatus state={batch.state} onStop={batch.stop} />
          </section>

          <section className={styles.sec} aria-label="Trạng thái">
            <h3 className={adultStyles.h3}>Trạng thái</h3>
            <AdultSegmented
              label="Trạng thái Khám phá"
              labelHidden
              value={status}
              onChange={(v) => (setStatus(v), setErrors((e) => ({ ...e, status: undefined })))}
              options={[
                ["draft", "Nháp"],
                ["published", "Xuất bản"],
              ]}
            />
            <p className={cn(adultStyles.small, adultStyles.muted)}>Bản Nháp không tới bé. Xuất bản cần đủ {WORDLAB.branchMin}–{WORDLAB.branchMax} nhánh, mọi đáp án có hình và âm thanh, mỗi nhánh có hình nhiễu, mọi câu có bản dịch và đoạn văn có giọng đọc.</p>
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
        title="Thay các nhánh hiện có bằng gợi ý của AI?"
        actions={[
          { label: "Giữ nguyên", variant: "ghost" },
          { label: "Thay bằng gợi ý", icon: "wand", onClick: () => void suggest() },
        ]}
      >
        <p className={adultStyles.body}>AI sẽ soạn lại toàn bộ các nhánh, đáp án, hình nhiễu và đoạn văn của “{word.word}”. Đáp án cũ đã có giọng đọc sẽ mất giọng đọc (tạo lại được). Chưa lưu gì cho đến khi bạn bấm Lưu thay đổi; bấm Hủy để bỏ hết.</p>
      </AdultDialog>

      <AdultDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title={`Xóa nhánh ${removeBranch ? branches.indexOf(removeBranch) + 1 : ""}?`}
        actions={[
          { label: "Giữ lại", variant: "ghost" },
          {
            label: "Xóa nhánh",
            variant: "danger",
            icon: "trash",
            onClick: () => {
              setBranches((list) => list.filter((b) => b.key !== removing));
              setRemoving(null);
            },
          },
        ]}
      >
        <p className={adultStyles.body}>
          Nhánh “{removeBranch?.questionEn || "chưa nhập"}” cùng các đáp án và câu của nó trong đoạn văn sẽ bị bỏ khi bạn bấm Lưu thay đổi.
        </p>
      </AdultDialog>
      {preview && <StepsPreview steps={[preview]} level={word.levelNumber} onClose={() => setPreview(null)} />}
    </>
  );
}
