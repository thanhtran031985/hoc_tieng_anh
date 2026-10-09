// Luật của màn Câu hỏi dạng mới (task 15, Adult18): dựng, đọc lại và kiểm 4 dạng ghép âm, sắp xếp câu, nghe và gõ, điền từ.
// Hàm thuần, không đụng database. Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import type { ExtraQuestionType } from "../schemas/question-extra.ts";
import { extraQuestionSchemas } from "../schemas/question-extra.ts";
import type { BankWord } from "./admin-questions.ts";
import { BLANK } from "./grading/fill-blank.ts";
import { READING_CHOICES, READING_MAX_QUESTIONS, READING_MAX_SENTENCES, READING_MIN_QUESTIONS, READING_MIN_SENTENCES, splitPassage } from "./grading/reading.ts";
import { sameWords, wordKey } from "./grading/sentence-order.ts";
import { normalizeAnswer } from "./grading/text.ts";
import { buildPlaySteps, type PhonicsSoundInfo, type PlayStep, type PlayWord } from "./lesson-play.ts";

export const EXTRA_TYPE_INFO: Record<ExtraQuestionType, { code: string; label: string; hint: string; icon: "music" | "grammar" | "keyboard" | "pen" | "notebook"; skill: string; summary: string }> = {
  phonics: { code: "8.5", label: "Ghép âm", hint: "Từ + ô âm + âm thanh", icon: "music", skill: "pronunciation", summary: "Ghép âm" },
  sentence_order: { code: "8.8", label: "Sắp xếp câu", hint: "Tự tách thẻ, từ nhiễu", icon: "grammar", skill: "writing", summary: "Xếp câu" },
  dictation: { code: "8.9", label: "Nghe và gõ", hint: "Âm thanh, đáp án chấp nhận", icon: "keyboard", skill: "listening", summary: "Nghe và gõ" },
  fill_blank: { code: "8.10", label: "Điền từ", hint: "Câu có ô trống, thẻ từ", icon: "pen", skill: "grammar", summary: "Điền" },
  short_reading: { code: "8.11", label: "Đọc hiểu ngắn", hint: "Đoạn 3–6 câu, 2–3 câu hỏi", icon: "notebook", skill: "reading", summary: "Đọc hiểu" },
};

export const MAX_DISTRACTORS = 3;
export const MIN_SENTENCE_WORDS = 3;
export const MIN_CARDS = 3;
export const MAX_CARDS = 4;
export const MAX_ACCEPTED = 6;

/** Các chữ ghép nhiều ký tự (sh, ch, th, ee, oo…) để gộp chung một ô khi tách từ. */
export const DIGRAPHS = ["sh", "ch", "th", "ck", "ng", "ee", "oo", "ai", "ar", "or"] as const;

export type TileForm = { t: string; sound: string };

/** Nhập của biểu mẫu. `text` là từ (ghép âm), câu gốc (sắp xếp câu), nội dung đọc (nghe và gõ) hoặc câu có ô trống (điền từ). */
export type ExtraForm = {
  text: string;
  tiles: TileForm[];
  /** Từ nhiễu cách nhau bằng dấu phẩy (sắp xếp câu). */
  distractors: string;
  /** Các cách sắp xếp khác cũng đúng, mỗi dòng một câu (sắp xếp câu). */
  alternatives: string;
  /** Mỗi dòng một đáp án chấp nhận (nghe và gõ). */
  accepted: string;
  ignoreCase: boolean;
  ignoreEndPunct: boolean;
  /** Tối đa 4 thẻ từ (điền từ). */
  cards: string[];
  correct: number | null;
  /** Tiêu đề bài đọc (đọc hiểu ngắn). */
  title: string;
  /** 3 chỗ cho câu hỏi của bài đọc hiểu; chỗ để trống bị bỏ khi lưu. */
  questions: ReadingQForm[];
  /** Chữ của từ có hình minh họa trong ngân hàng từ; để trống nếu không dùng hình. */
  picture: string;
};

export const emptyExtraForm = (): ExtraForm => ({
  text: "",
  tiles: [],
  distractors: "",
  alternatives: "",
  accepted: "",
  ignoreCase: true,
  ignoreEndPunct: true,
  cards: ["", "", "", ""],
  correct: null,
  title: "",
  questions: [emptyReadingQuestion(), emptyReadingQuestion(), emptyReadingQuestion()],
  picture: "",
});

/** Một câu hỏi của bài Đọc hiểu ngắn trong biểu mẫu: đề, 3 đáp án, đáp án đúng, câu (từ 0) chứa đáp án. */
export type ReadingQForm = { text: string; choices: string[]; correct: number | null; evidence: number };

export const emptyReadingQuestion = (): ReadingQForm => ({ text: "", choices: ["", "", ""], correct: null, evidence: 0 });

export type ExtraField = "text" | "tiles" | "distractors" | "alternatives" | "title" | "questions" | "accepted" | "cards" | "picture";
export type ExtraBuilt = { prompt: unknown; options: unknown; answer: unknown };
export type ExtraBuildResult = { ok: true; data: ExtraBuilt } | { ok: false; field: ExtraField; message: string };

/** Ngữ cảnh tra cứu: từ trong ngân hàng (theo chữ thường) và các âm phonics đang có. */
export type ExtraContext = { bank: ReadonlyMap<string, BankWord>; sounds: ReadonlyMap<string, PhonicsSoundInfo> };

const key = (text: string) => text.trim().replace(/\s+/g, " ").toLowerCase();
const clean = (text: string) => text.trim().replace(/\s+/g, " ");

/** Tách từ thành các ô âm: chữ ghép (sh, ch, th, ee, oo…) chung một ô, còn lại mỗi chữ cái một ô. Âm thanh mặc định là chính ô đó nếu có trong bộ âm. */
export function splitIntoTiles(word: string, knownSounds: { has(grapheme: string): boolean }): TileForm[] {
  const text = key(word).replace(/[^a-z]/g, "");
  const tiles: TileForm[] = [];
  for (let i = 0; i < text.length; ) {
    const pair = text.slice(i, i + 2);
    const t = (DIGRAPHS as readonly string[]).includes(pair) ? pair : text[i];
    tiles.push({ t, sound: knownSounds.has(t) ? t : "" });
    i += t.length;
  }
  return tiles;
}

/** Gộp ô `index` với ô kế tiếp (vd c + h → ch); âm thanh tự chọn lại nếu ô gộp có trong bộ âm, không thì để trống. */
export function mergeTiles(tiles: readonly TileForm[], index: number, knownSounds: { has(grapheme: string): boolean }): TileForm[] {
  if (index < 0 || index >= tiles.length - 1) return [...tiles];
  const t = tiles[index].t + tiles[index + 1].t;
  return [...tiles.slice(0, index), { t, sound: knownSounds.has(t) ? t : "" }, ...tiles.slice(index + 2)];
}

const sentenceWords = (text: string) => clean(text).split(" ").filter(Boolean);

function pictureOf(form: ExtraForm, ctx: ExtraContext): { wordId?: number } | { error: string } {
  if (!form.picture.trim()) return {};
  const word = ctx.bank.get(key(form.picture));
  if (!word) return { error: `“${form.picture.trim()}” chưa có trong ngân hàng từ vựng.` };
  if (!word.image) return { error: `“${word.word}” chưa có hình minh họa.` };
  return { wordId: word.id };
}

/** Dựng `prompt`, `options`, `answer` của một câu hỏi từ nhập biểu mẫu; lỗi tiếng Việt gắn vào nhóm ô sai (theo bản thiết kế Adult18). */
export function buildExtraData(type: ExtraQuestionType, form: ExtraForm, ctx: ExtraContext): ExtraBuildResult {
  const text = clean(form.text);
  const fail = (field: ExtraField, message: string): ExtraBuildResult => ({ ok: false, field, message });
  const picture = pictureOf(form, ctx);
  const withPicture = "wordId" in picture && picture.wordId !== undefined ? { wordId: picture.wordId } : {};

  switch (type) {
    case "phonics": {
      if (!text) return fail("text", "Nhập từ cần ghép.");
      if (form.tiles.length < 2) return fail("tiles", "Bấm “Tách thành ô âm” để chia từ thành các ô.");
      const joined = form.tiles.map((t) => t.t.trim()).join("");
      if (joined.toLowerCase() !== text.toLowerCase()) return fail("tiles", `Các ô âm ghép lại phải thành “${text}” (đang là “${joined}”).`);
      const missing = form.tiles.find((t) => !t.sound.trim() || !ctx.sounds.has(t.sound.trim()));
      if (missing) return fail("tiles", `Ô “${missing.t}” chưa chọn âm thanh.`);
      if ("error" in picture) return fail("picture", picture.error);
      const tiles = form.tiles.map((t) => ({ t: t.t.trim(), sound: t.sound.trim() }));
      return { ok: true, data: { prompt: { text, ...withPicture }, options: { tiles }, answer: { order: tiles.map((t) => t.t) } } };
    }
    case "sentence_order": {
      if (!text) return fail("text", "Nhập câu gốc.");
      const words = sentenceWords(text);
      if (words.length < MIN_SENTENCE_WORDS) return fail("text", `Câu cần ít nhất ${MIN_SENTENCE_WORDS} từ để sắp xếp.`);
      const distractors = form.distractors.split(",").map(clean).filter(Boolean);
      if (distractors.length > MAX_DISTRACTORS) return fail("distractors", `Tối đa ${MAX_DISTRACTORS} từ nhiễu.`);
      const inSentence = new Set(words.map(wordKey));
      const seen = new Set<string>();
      for (const d of distractors) {
        if (/\s/.test(d)) return fail("distractors", `Từ nhiễu “${d}” chỉ được một từ.`);
        if (inSentence.has(wordKey(d)) || seen.has(wordKey(d))) return fail("distractors", `Từ nhiễu “${d}” trùng với từ trong câu.`);
        seen.add(wordKey(d));
      }
      const alternatives = form.alternatives.split("\n").map(sentenceWords).filter((w) => w.length > 0);
      for (const alt of alternatives) {
        if (!sameWords(alt, words)) return fail("alternatives", `Cách sắp xếp khác “${alt.join(" ")}” phải dùng đúng các từ của câu.`);
      }
      if ("error" in picture) return fail("picture", picture.error);
      return { ok: true, data: { prompt: { text: words.join(" "), ...withPicture }, options: { distractors }, answer: alternatives.length ? { words, alternatives } : { words } } };
    }
    case "dictation": {
      if (!text) return fail("text", "Nhập nội dung được đọc.");
      const accepted = form.accepted.split("\n").map(clean).filter(Boolean);
      if (accepted.length === 0) return fail("accepted", "Cần ít nhất một đáp án chấp nhận.");
      if (accepted.length > MAX_ACCEPTED) return fail("accepted", `Tối đa ${MAX_ACCEPTED} đáp án chấp nhận.`);
      const options = { ignoreCase: form.ignoreCase, ignoreEndPunct: form.ignoreEndPunct };
      if (!accepted.some((a) => normalizeAnswer(a, options) === normalizeAnswer(text, options))) return fail("accepted", "Chưa có đáp án nào trùng với nội dung được đọc.");
      if ("error" in picture) return fail("picture", picture.error);
      return { ok: true, data: { prompt: { text, ...withPicture }, options, answer: { accepted } } };
    }
    case "fill_blank": {
      if (!text) return fail("text", "Nhập câu.");
      const blanks = text.split(BLANK).length - 1;
      if (blanks === 0) return fail("text", `Câu chưa có ô trống ${BLANK}.`);
      if (blanks > 1) return fail("text", `Câu chỉ được có một ô trống ${BLANK}.`);
      const indexed = form.cards.map((c, i) => ({ word: clean(c), i })).filter((c) => c.word);
      if (indexed.length < MIN_CARDS) return fail("cards", `Cần ít nhất ${MIN_CARDS} thẻ từ (đang có ${indexed.length}).`);
      if (new Set(indexed.map((c) => key(c.word))).size !== indexed.length) return fail("cards", "Có hai thẻ trùng nhau.");
      const correct = indexed.findIndex((c) => c.i === form.correct);
      if (correct < 0) return fail("cards", "Chọn một thẻ đúng.");
      if ("error" in picture) return fail("picture", picture.error);
      return { ok: true, data: { prompt: { text, ...withPicture }, options: { cards: indexed.map((c) => c.word) }, answer: { correct } } };
    }
    case "short_reading": {
      const title = clean(form.title);
      if (!title) return fail("title", "Nhập tiêu đề bài đọc.");
      if (!text) return fail("text", "Nhập đoạn văn.");
      const sentences = splitPassage(text);
      if (sentences.length < READING_MIN_SENTENCES || sentences.length > READING_MAX_SENTENCES) return fail("text", `Đoạn văn cần ${READING_MIN_SENTENCES}–${READING_MAX_SENTENCES} câu (đang có ${sentences.length}).`);
      const filled = form.questions.map((q, i) => ({ q, i })).filter(({ q }) => clean(q.text) || q.choices.some((c) => clean(c)));
      if (filled.length < READING_MIN_QUESTIONS) return fail("questions", `Cần ít nhất ${READING_MIN_QUESTIONS} câu hỏi (đang có ${filled.length}).`);
      if (filled.length > READING_MAX_QUESTIONS) return fail("questions", `Tối đa ${READING_MAX_QUESTIONS} câu hỏi.`);
      for (const [n, { q }] of filled.entries()) {
        const choices = q.choices.map(clean);
        if (!clean(q.text)) return fail("questions", `Câu hỏi ${n + 1} chưa có nội dung.`);
        if (choices.length !== READING_CHOICES || choices.some((c) => !c)) return fail("questions", `Câu hỏi ${n + 1} cần đủ ${READING_CHOICES} đáp án.`);
        if (new Set(choices.map(key)).size !== choices.length) return fail("questions", `Câu hỏi ${n + 1} có hai đáp án trùng nhau.`);
        if (q.correct === null || q.correct < 0 || q.correct >= READING_CHOICES) return fail("questions", `Câu hỏi ${n + 1} chưa chọn đáp án đúng.`);
        if (q.evidence < 0 || q.evidence >= sentences.length) return fail("questions", `Câu hỏi ${n + 1}: câu chứa đáp án phải nằm trong đoạn văn.`);
      }
      if ("error" in picture) return fail("picture", picture.error);
      return {
        ok: true,
        data: {
          prompt: { title, text: sentences.join(" "), ...withPicture },
          options: { questions: filled.map(({ q }) => ({ text: clean(q.text), choices: q.choices.map(clean), evidence: q.evidence })) },
          answer: { correct: filled.map(({ q }) => q.correct as number) },
        },
      };
    }
  }
}

/** Kiểm dữ liệu đã dựng bằng Zod của dạng; trả thông báo lỗi đầu tiên hoặc null. */
export function validateExtraBuilt(type: ExtraQuestionType, data: ExtraBuilt): string | null {
  const result = extraQuestionSchemas[type].safeParse(data);
  return result.success ? null : (result.error.issues[0]?.message ?? "Dữ liệu câu hỏi chưa hợp lệ.");
}

type Json = Record<string, unknown> | null | undefined;
const asStrings = (value: unknown): string[] => (Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : []);

/** Đọc lại biểu mẫu từ dữ liệu đã lưu (ngược với `buildExtraData`). `pictureWord` là chữ của từ có `prompt.wordId` (nếu có). */
export function readExtraForm(type: string, prompt: unknown, options: unknown, answer: unknown, pictureWord = ""): ExtraForm {
  const form = emptyExtraForm();
  const p = prompt as Json;
  const o = options as Json;
  const a = answer as Json;
  form.text = typeof p?.text === "string" ? p.text : "";
  form.picture = pictureWord;
  if (type === "phonics") {
    const tiles = Array.isArray(o?.tiles) ? (o.tiles as unknown[]) : [];
    form.tiles = tiles.flatMap((t) => (typeof t === "object" && t !== null && typeof (t as TileForm).t === "string" ? [{ t: (t as TileForm).t, sound: String((t as TileForm).sound ?? "") }] : []));
  } else if (type === "sentence_order") {
    form.distractors = asStrings(o?.distractors).join(", ");
    form.alternatives = (Array.isArray(a?.alternatives) ? (a.alternatives as unknown[]) : []).map((alt) => asStrings(alt).join(" ")).join("\n");
  } else if (type === "dictation") {
    form.accepted = asStrings(a?.accepted).join("\n");
    form.ignoreCase = o?.ignoreCase !== false;
    form.ignoreEndPunct = o?.ignoreEndPunct !== false;
  } else if (type === "short_reading") {
    form.title = typeof p?.title === "string" ? p.title : "";
    const qs = Array.isArray(o?.questions) ? (o.questions as Record<string, unknown>[]) : [];
    const correct = Array.isArray(a?.correct) ? (a.correct as unknown[]) : [];
    form.questions = [0, 1, 2].map((i) => {
      const x = qs[i];
      if (!x) return emptyReadingQuestion();
      return { text: typeof x.text === "string" ? x.text : "", choices: [...asStrings(x.choices), "", "", ""].slice(0, READING_CHOICES), correct: typeof correct[i] === "number" ? (correct[i] as number) : null, evidence: typeof x.evidence === "number" ? x.evidence : 0 };
    });
  } else if (type === "fill_blank") {
    const cards = asStrings(o?.cards);
    form.cards = [...cards, "", "", "", ""].slice(0, MAX_CARDS);
    form.correct = typeof a?.correct === "number" && a.correct < cards.length ? a.correct : null;
  }
  return form;
}

/** Dòng mô tả câu hỏi cho bảng ("Ghép âm: cat"). */
export function extraQuestionSummary(type: string, prompt: unknown): string {
  const info = EXTRA_TYPE_INFO[type as ExtraQuestionType];
  const p = prompt as Json;
  const text = type === "short_reading" && typeof p?.title === "string" ? p.title : typeof p?.text === "string" ? String(p.text) : "";
  return `${info?.summary ?? type}: ${text}`.trim();
}

const toPlayWord = (w: BankWord): PlayWord => ({ id: w.id, word: w.word, ipa: null, meaningVi: "", exampleEn: null, exampleVi: null, image: w.image });

/**
 * Bước học để "Xem như học sinh": dựng từ nhập biểu mẫu thành đúng kiểu bước mà trình học nhận (cùng đường dẫn với bài thật).
 * Chỉ trả khi `buildExtraData` báo ok; không dựng được thì null.
 */
export function buildExtraPreviewStep(type: ExtraQuestionType, form: ExtraForm, ctx: ExtraContext): PlayStep | null {
  const built = buildExtraData(type, form, ctx);
  if (!built.ok || validateExtraBuilt(type, built.data)) return null;
  const picture = ctx.bank.get(key(form.picture));
  const extras = { words: picture ? new Map([[picture.id, toPlayWord(picture)]]) : undefined, sounds: ctx.sounds };
  const [step] = buildPlaySteps([{ id: 0, activityType: type, config: {}, word: null, question: { id: 0, type, ...built.data } }], [], "preview", extras);
  if (!step) return null;
  return { ...step, id: "preview", questionId: null } as PlayStep;
}
