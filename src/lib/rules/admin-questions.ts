// Luật của Ngân hàng câu hỏi quản trị (task 12, Adult11): dựng và đọc lại dữ liệu câu hỏi giai đoạn 1 (PRD C8: 8.2–8.4) từ các từ trong ngân hàng từ.
// Hàm thuần, không đụng database. Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { questionDataSchemas, type QuestionType } from "../schemas/question.ts";
import type { PlayStep, PlayWord } from "./lesson-play.ts";

/** Một từ trong ngân hàng, đủ để dựng câu hỏi (đường dẫn hình lấy từ cột `words.image`). */
export type BankWord = { id: number; word: string; image: string | null };

export const QUESTION_TYPE_INFO: Record<QuestionType, { code: string; label: string; hint: string }> = {
  listen_choose_picture: { code: "8.2", label: "Nghe và chọn hình", hint: "Nghe từ, chọn 1 trong 2–4 hình" },
  match_pairs: { code: "8.3", label: "Nối từ với hình", hint: "3–6 cặp từ – hình" },
  choose_word_for_picture: { code: "8.4", label: "Chọn từ đúng cho hình", hint: "Một hình, chọn 1 trong 2–4 từ" },
};

export const MIN_CHOICES = 2;
export const MAX_CHOICES = 4;
export const MIN_PAIRS = 3;
export const MAX_PAIRS = 6;
export const MAX_EXPLANATION = 300;

/** Cấp THCS (6–10) bắt buộc có giải thích đáp án (PRD: học sinh THCS cần biết vì sao sai). */
export const EXPLANATION_FROM_LEVEL = 6;

export function explanationRequired(levelNumber: number): boolean {
  return levelNumber >= EXPLANATION_FROM_LEVEL;
}

/** Nhập của biểu mẫu: dạng chọn (8.2, 8.4) dùng `choices` + `correct`, dạng nối (8.3) dùng `pairs`. Mỗi phần tử là chữ tiếng Anh của một từ. */
export type QuestionForm = { choices: string[]; correct: number | null; pairs: string[] };

export const emptyQuestionForm = (): QuestionForm => ({ choices: ["", "", "", ""], correct: null, pairs: ["", "", "", ""] });

export type BuiltQuestion = { prompt: unknown; options: unknown; answer: unknown };
export type BuildResult = { ok: true; data: BuiltQuestion } | { ok: false; field: "choices" | "pairs"; message: string };

const key = (word: string) => word.trim().replace(/\s+/g, " ").toLowerCase();
const CHOICE_IDS = ["a", "b", "c", "d"] as const;

/** Tìm từng chữ trong ngân hàng; trả về từ chưa có đầu tiên (nếu có). */
function resolve(texts: readonly string[], bank: ReadonlyMap<string, BankWord>): { words: BankWord[] } | { missing: string } {
  const words: BankWord[] = [];
  for (const text of texts) {
    const found = bank.get(key(text));
    if (!found) return { missing: text.trim() };
    words.push(found);
  }
  return { words };
}

/** Dựng `prompt`, `options`, `answer` của một câu hỏi từ nhập biểu mẫu; trả lỗi tiếng Việt gắn vào nhóm ô sai. */
export function buildQuestionData(type: QuestionType, form: QuestionForm, bank: ReadonlyMap<string, BankWord>): BuildResult {
  if (type === "match_pairs") return buildMatch(form.pairs, bank);
  const field = "choices" as const;
  const texts = form.choices.filter((c) => c.trim() !== "");
  if (texts.length < MIN_CHOICES) return { ok: false, field, message: `Cần ít nhất ${MIN_CHOICES} lựa chọn.` };
  if (texts.length > MAX_CHOICES) return { ok: false, field, message: `Tối đa ${MAX_CHOICES} lựa chọn.` };
  const found = resolve(texts, bank);
  if ("missing" in found) return { ok: false, field, message: `“${found.missing}” chưa có trong ngân hàng từ vựng.` };
  if (new Set(found.words.map((w) => w.id)).size !== found.words.length) return { ok: false, field, message: "Có hai lựa chọn trùng nhau." };
  // `correct` là vị trí trong danh sách đã bỏ ô trống.
  const correctText = form.correct === null ? undefined : form.choices[form.correct]?.trim();
  const correctIndex = correctText ? texts.findIndex((t) => key(t) === key(correctText)) : -1;
  if (correctIndex < 0) return { ok: false, field, message: "Chọn một đáp án đúng (ô phải có từ)." };

  const words = found.words;
  const target = words[correctIndex];
  if (type === "listen_choose_picture") {
    const noImage = words.find((w) => !w.image);
    if (noImage) return { ok: false, field, message: `“${noImage.word}” chưa có hình nên chưa dùng được cho dạng nghe và chọn hình.` };
    return {
      ok: true,
      data: {
        prompt: { text: target.word, wordId: target.id },
        options: words.map((w, i) => ({ id: CHOICE_IDS[i], text: w.word, image: w.image! })),
        answer: { correct: [CHOICE_IDS[correctIndex]] },
      },
    };
  }
  if (!target.image) return { ok: false, field, message: `“${target.word}” chưa có hình nên chưa dùng được làm đáp án của dạng chọn từ cho hình.` };
  return {
    ok: true,
    data: {
      prompt: { image: target.image, wordId: target.id },
      options: words.map((w, i) => ({ id: CHOICE_IDS[i], text: w.word })),
      answer: { correct: [CHOICE_IDS[correctIndex]] },
    },
  };
}

function buildMatch(pairs: readonly string[], bank: ReadonlyMap<string, BankWord>): BuildResult {
  const field = "pairs" as const;
  const texts = pairs.filter((p) => p.trim() !== "");
  if (texts.length < MIN_PAIRS) return { ok: false, field, message: `Cần ít nhất ${MIN_PAIRS} cặp.` };
  if (texts.length > MAX_PAIRS) return { ok: false, field, message: `Tối đa ${MAX_PAIRS} cặp.` };
  const found = resolve(texts, bank);
  if ("missing" in found) return { ok: false, field, message: `“${found.missing}” chưa có trong ngân hàng từ vựng.` };
  if (new Set(found.words.map((w) => w.id)).size !== found.words.length) return { ok: false, field, message: "4 cặp phải là các từ khác nhau." };
  const noImage = found.words.find((w) => !w.image);
  if (noImage) return { ok: false, field, message: `“${noImage.word}” chưa có hình nên chưa nối được với hình.` };
  const words = found.words;
  return {
    ok: true,
    data: {
      prompt: { text: "Nối từ với hình" },
      options: {
        left: words.map((w, i) => ({ id: `l${i + 1}`, text: w.word })),
        right: words.map((w, i) => ({ id: `r${i + 1}`, text: w.word, image: w.image! })),
      },
      answer: { pairs: words.map((_, i) => ({ left: `l${i + 1}`, right: `r${i + 1}` })) },
    },
  };
}

/** Kiểm dữ liệu đã dựng bằng Zod của dạng câu hỏi; trả thông báo lỗi đầu tiên hoặc null. */
export function validateBuilt(type: QuestionType, data: BuiltQuestion): string | null {
  const result = questionDataSchemas[type].safeParse(data);
  return result.success ? null : (result.error.issues[0]?.message ?? "Dữ liệu câu hỏi chưa hợp lệ.");
}

type Json = Record<string, unknown> | null | undefined;
const asList = (value: unknown): Record<string, unknown>[] => (Array.isArray(value) ? value.filter((v): v is Record<string, unknown> => typeof v === "object" && v !== null) : []);
const textOf = (item: Record<string, unknown>): string => (typeof item.text === "string" ? item.text : "");

/** Đọc lại biểu mẫu từ dữ liệu đã lưu (ngược với `buildQuestionData`). Dữ liệu không đúng hình dạng thì trả biểu mẫu trống. */
export function readQuestionForm(type: string, options: unknown, answer: unknown): QuestionForm {
  const form = emptyQuestionForm();
  if (type === "match_pairs") {
    const left = asList((options as Json)?.left).map(textOf).filter(Boolean);
    return { ...form, pairs: [...left, ...form.pairs].slice(0, Math.max(left.length, form.pairs.length)) };
  }
  const list = asList(options);
  const correctId = Array.isArray((answer as Json)?.correct) ? ((answer as { correct: unknown[] }).correct[0] as string | undefined) : undefined;
  const choices = [...list.map(textOf), "", "", "", ""].slice(0, MAX_CHOICES);
  const index = list.findIndex((o) => o.id === correctId);
  return { ...form, choices, correct: index >= 0 ? index : null };
}

/** Dòng mô tả câu hỏi cho bảng ("Nghe và chọn hình: apple"). */
export function questionSummary(type: string, options: unknown, answer: unknown): string {
  const label = QUESTION_TYPE_INFO[type as QuestionType]?.label ?? type;
  const form = readQuestionForm(type, options, answer);
  if (type === "match_pairs") return `${label}: ${form.pairs.filter(Boolean).join(" · ")}`;
  const target = form.correct === null ? "" : form.choices[form.correct];
  return target ? `${label}: ${target}` : label;
}

const toPlayWord = (w: BankWord): PlayWord => ({ id: w.id, word: w.word, ipa: null, meaningVi: "", exampleEn: null, exampleVi: null, image: w.image });

/**
 * Bước học để "Xem như học sinh": dựng từ nhập biểu mẫu thành đúng kiểu bước mà trình học của bé (task 07) nhận.
 * Chỉ gọi khi `buildQuestionData` đã báo ok; nếu không dựng được thì trả null.
 */
export function buildPreviewStep(type: QuestionType, form: QuestionForm, bank: ReadonlyMap<string, BankWord>): PlayStep | null {
  if (!buildQuestionData(type, form, bank).ok) return null;
  if (type === "match_pairs") {
    const found = resolve(form.pairs.filter((p) => p.trim() !== ""), bank);
    return "words" in found ? { id: "preview", kind: "match_pairs", pairs: found.words.map(toPlayWord) } : null;
  }
  const found = resolve(form.choices.filter((c) => c.trim() !== ""), bank);
  const correctText = form.correct === null ? "" : form.choices[form.correct];
  if (!("words" in found)) return null;
  const options = found.words.map(toPlayWord);
  const target = options.find((o) => key(o.word) === key(correctText));
  if (!target) return null;
  return type === "listen_choose_picture" ? { id: "preview", kind: "listen_choose_picture", target, options, autoPlay: true } : { id: "preview", kind: "choose_word_for_picture", target, options };
}
