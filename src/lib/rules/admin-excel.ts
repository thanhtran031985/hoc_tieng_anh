// Luật nhập/xuất Excel của quản trị (task 12, Adult14): cột của tệp mẫu, đọc ô, kiểm từng dòng từ vựng và câu hỏi. Hàm thuần (không đụng tệp hay database).
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { PARTS_OF_SPEECH } from "../schemas/content.ts";
import { SKILLS, QUESTION_TYPES, type QuestionType } from "../schemas/question.ts";
import { MAX_EXPLANATION, QUESTION_TYPE_INFO, buildQuestionData, explanationRequired, type BankWord } from "./admin-questions.ts";
import { exampleContainsWord, isIpaShape, isWordShape, wordKey } from "./admin-vocab.ts";

export const MAX_IMPORT_ROWS = 5000;
export const MAX_IMPORT_BYTES = 10 * 1024 * 1024;

/** Tên trang (sheet) của tệp mẫu. */
export const SHEET_VOCAB = "Từ vựng";
export const SHEET_QUESTIONS = "Câu hỏi";

/** Chuẩn hóa tiêu đề cột để so khớp: bỏ khoảng trắng đầu cuối, viết thường, khoảng trắng thành gạch dưới. */
export function normalizeHeader(header: unknown): string {
  return cellText(header).trim().toLowerCase().replace(/[\s-]+/g, "_");
}

/** Chữ trong một ô Excel (chuỗi, số, ngày, công thức, rich text, liên kết), cắt khoảng trắng hai đầu. */
export function cellText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "object") {
    const v = value as { richText?: { text?: string }[]; text?: unknown; result?: unknown; error?: unknown };
    if (Array.isArray(v.richText)) return v.richText.map((part) => part.text ?? "").join("").trim();
    if (v.result !== undefined) return cellText(v.result);
    if (v.text !== undefined) return cellText(v.text);
  }
  return "";
}

export type ColumnSpec = { key: string; header: string; required: boolean; note: string; example: string };

export const VOCAB_COLUMNS: readonly ColumnSpec[] = [
  { key: "word", header: "word", required: true, note: "Từ tiếng Anh (cụm từ cũng được)", example: "airport" },
  { key: "ipa", header: "ipa", required: true, note: "Phiên âm IPA trong hai dấu /…/", example: "/ˈeə.pɔːt/" },
  { key: "pos", header: "pos", required: true, note: "Loại từ: noun, verb, adjective, adverb, preposition, determiner, pronoun, conjunction, interjection, phrase (hoặc tiếng Việt: danh từ, động từ…)", example: "noun" },
  { key: "meaning", header: "meaning_vi", required: true, note: "Nghĩa tiếng Việt", example: "sân bay" },
  { key: "exampleEn", header: "example_en", required: true, note: "Câu ví dụ tiếng Anh (phải chứa từ)", example: "The airport is very busy." },
  { key: "exampleVi", header: "example_vi", required: false, note: "Dịch câu ví dụ", example: "Sân bay rất đông." },
  { key: "level", header: "level", required: true, note: "Cấp 1–10", example: "8" },
  { key: "topic", header: "topic", required: false, note: "Tên chủ đề (tiếng Anh) có trong cấp đó; bỏ trống nếu chưa gắn chủ đề", example: "Travel" },
];

export const QUESTION_COLUMNS: readonly ColumnSpec[] = [
  { key: "type", header: "type", required: true, note: "listen_choose_picture (8.2), match_pairs (8.3) hoặc choose_word_for_picture (8.4)", example: "listen_choose_picture" },
  { key: "option_1", header: "option_1", required: true, note: "Từ lựa chọn 1 (từ đã có trong ngân hàng từ vựng)", example: "apple" },
  { key: "option_2", header: "option_2", required: true, note: "Từ lựa chọn 2", example: "pear" },
  { key: "option_3", header: "option_3", required: false, note: "Từ lựa chọn 3", example: "orange" },
  { key: "option_4", header: "option_4", required: false, note: "Từ lựa chọn 4", example: "" },
  { key: "option_5", header: "option_5", required: false, note: "Chỉ cho match_pairs (tối đa 6 cặp)", example: "" },
  { key: "option_6", header: "option_6", required: false, note: "Chỉ cho match_pairs", example: "" },
  { key: "answer", header: "answer", required: false, note: "Từ đúng (bắt buộc với listen_choose_picture và choose_word_for_picture; bỏ trống với match_pairs)", example: "apple" },
  { key: "level", header: "level", required: true, note: "Cấp 1–10", example: "1" },
  { key: "skill", header: "skill", required: false, note: `Kỹ năng: ${SKILLS.join(", ")} (mặc định vocabulary)`, example: "listening" },
  { key: "difficulty", header: "difficulty", required: false, note: "Độ khó 1–5 (mặc định 1)", example: "1" },
  { key: "explanation", header: "explanation", required: false, note: `Giải thích đáp án (tối đa ${MAX_EXPLANATION} ký tự; bắt buộc với cấp 6–10)`, example: "" },
  { key: "status", header: "status", required: false, note: "draft (nháp) hoặc published (xuất bản); mặc định draft", example: "draft" },
];

export const OPTION_KEYS = ["option_1", "option_2", "option_3", "option_4", "option_5", "option_6"] as const;

// ---------------------------------------------------------------------------
// Từ vựng
// ---------------------------------------------------------------------------

/** Một dòng từ vựng của tệp nhập: mọi ô là chuỗi để sửa tại chỗ. `n` là số dòng trong tệp Excel. */
export type VocabImportRow = { n: number; word: string; ipa: string; pos: string; meaning: string; exampleEn: string; exampleVi: string; level: string; topic: string };

const POS_VI: Record<string, (typeof PARTS_OF_SPEECH)[number]> = {
  "danh từ": "noun",
  "động từ": "verb",
  "tính từ": "adjective",
  "trạng từ": "adverb",
  "giới từ": "preposition",
  "hạn định từ": "determiner",
  "đại từ": "pronoun",
  "liên từ": "conjunction",
  "thán từ": "interjection",
  "cụm từ": "phrase",
};

/** Mã loại từ (noun…) từ chữ trong ô (tiếng Anh hoặc tiếng Việt); không nhận ra thì null. */
export function parsePos(text: string): (typeof PARTS_OF_SPEECH)[number] | null {
  const value = text.trim().toLowerCase();
  const code = (PARTS_OF_SPEECH as readonly string[]).includes(value) ? (value as (typeof PARTS_OF_SPEECH)[number]) : null;
  return code ?? POS_VI[value] ?? null;
}

/** Cấp 1–10 từ chữ trong ô (chấp nhận "8", "8.0"); ngoài khoảng hoặc không phải số thì null. */
export function parseLevel(text: string): number | null {
  const value = text.trim();
  if (!/^\d{1,2}(\.0+)?$/.test(value)) return null;
  const n = Number(value);
  return n >= 1 && n <= 10 ? n : null;
}

export type ImportErrors = Record<string, string>;

/** Dữ liệu tham chiếu để kiểm dòng nhập (lấy từ database khi đọc tệp). */
export type VocabContext = {
  /** Từ đã có trong ngân hàng: khóa so sánh → nhãn "Cấp N". */
  bank: ReadonlyMap<string, string>;
  /** Chủ đề theo cấp (số cấp → tên chủ đề). */
  topicsByLevel: Readonly<Record<number, readonly string[]>>;
};

/** Kiểm một dòng từ vựng. `firstRow`: dòng đầu tiên của mỗi từ trong tệp (để báo trùng ở các dòng sau). */
export function validateVocabRow(row: VocabImportRow, ctx: VocabContext, firstRow: ReadonlyMap<string, number>): ImportErrors {
  const errors: ImportErrors = {};
  const word = row.word.trim();
  if (!word) errors.word = "Thiếu từ.";
  else if (!isWordShape(word)) errors.word = "Từ chỉ dùng chữ cái tiếng Anh, số, dấu cách, dấu gạch nối.";
  else if (ctx.bank.has(wordKey(word))) errors.word = `Từ “${word}” đã có trong ngân hàng (${ctx.bank.get(wordKey(word))}). Đổi từ hoặc xóa dòng.`;
  else if ((firstRow.get(wordKey(word)) ?? row.n) !== row.n) errors.word = `Trùng với dòng ${firstRow.get(wordKey(word))} trong tệp. Xóa một dòng.`;

  if (!row.ipa.trim()) errors.ipa = "Thiếu phiên âm IPA.";
  else if (!isIpaShape(row.ipa)) errors.ipa = "Phiên âm phải nằm trong /…/.";
  if (!parsePos(row.pos)) errors.pos = "Loại từ chưa đúng (noun, verb, adjective… hoặc danh từ, động từ…).";
  if (!row.meaning.trim()) errors.meaning = "Thiếu nghĩa tiếng Việt.";
  if (!row.exampleEn.trim()) errors.exampleEn = "Thiếu câu ví dụ.";
  else if (word && !exampleContainsWord(word, row.exampleEn)) errors.exampleEn = `Câu ví dụ chưa chứa từ “${word}”.`;

  const level = parseLevel(row.level);
  if (level === null) errors.level = `Cấp phải là số từ 1 đến 10 (đang là “${row.level.trim()}”).`;
  else if (row.topic.trim() && !(ctx.topicsByLevel[level] ?? []).some((t) => t.toLowerCase() === row.topic.trim().toLowerCase())) errors.topic = `Chủ đề “${row.topic.trim()}” không có ở cấp ${level}.`;
  return errors;
}

/** Dòng đầu tiên của mỗi từ trong tệp (khóa so sánh → số dòng). */
export function firstRowByWord(rows: readonly { n: number; word: string }[]): Map<string, number> {
  const first = new Map<string, number>();
  for (const row of rows) {
    const key = wordKey(row.word);
    if (key && !first.has(key)) first.set(key, row.n);
  }
  return first;
}

// ---------------------------------------------------------------------------
// Câu hỏi
// ---------------------------------------------------------------------------

/** Một dòng câu hỏi của tệp nhập. `options`: 6 ô từ (từ lựa chọn hoặc từ của các cặp nối). */
export type QuestionImportRow = { n: number; type: string; options: string[]; answer: string; level: string; skill: string; difficulty: string; explanation: string; status: string };

export type QuestionContext = {
  bank: ReadonlyMap<string, BankWord>;
};

/** Dạng câu hỏi từ chữ trong ô: mã đầy đủ hoặc số mục PRD (8.2, 8.3, 8.4). */
export function parseQuestionType(text: string): QuestionType | null {
  const value = text.trim().toLowerCase();
  if ((QUESTION_TYPES as readonly string[]).includes(value)) return value as QuestionType;
  return QUESTION_TYPES.find((t) => QUESTION_TYPE_INFO[t].code === value) ?? null;
}

export function parseDifficulty(text: string): number | null {
  const value = text.trim();
  if (value === "") return 1;
  return /^[1-5](\.0+)?$/.test(value) ? Number(value) : null;
}

export function parseSkill(text: string): (typeof SKILLS)[number] | null {
  const value = text.trim().toLowerCase();
  if (value === "") return "vocabulary";
  return (SKILLS as readonly string[]).includes(value) ? (value as (typeof SKILLS)[number]) : null;
}

export function parseStatus(text: string): "draft" | "published" | null {
  const value = text.trim().toLowerCase();
  if (value === "" || value === "draft") return "draft";
  return value === "published" ? "published" : null;
}

/** Dựng nhập của biểu mẫu câu hỏi (choices + correct hoặc pairs) từ một dòng; dùng chung cho kiểm và lưu. */
export function questionFormOf(type: QuestionType, row: Pick<QuestionImportRow, "options" | "answer">) {
  if (type === "match_pairs") return { choices: ["", "", "", ""], correct: null, pairs: row.options.map((o) => o.trim()).filter(Boolean) };
  const choices = row.options.slice(0, 4).map((o) => o.trim());
  const answer = wordKey(row.answer);
  const index = choices.findIndex((c) => c !== "" && wordKey(c) === answer);
  return { choices, correct: index >= 0 ? index : null, pairs: ["", "", "", ""] };
}

/** Kiểm một dòng câu hỏi (cùng luật dựng câu hỏi như màn Ngân hàng câu hỏi). `levelNumber`→ giải thích bắt buộc từ cấp 6. */
export function validateQuestionRow(row: QuestionImportRow, ctx: QuestionContext): ImportErrors {
  const errors: ImportErrors = {};
  const type = parseQuestionType(row.type);
  if (!type) errors.type = "Dạng câu hỏi chưa đúng (listen_choose_picture, match_pairs hoặc choose_word_for_picture).";
  const level = parseLevel(row.level);
  if (level === null) errors.level = `Cấp phải là số từ 1 đến 10 (đang là “${row.level.trim()}”).`;
  if (!parseSkill(row.skill)) errors.skill = `Kỹ năng chưa đúng (${SKILLS.join(", ")}).`;
  if (parseDifficulty(row.difficulty) === null) errors.difficulty = "Độ khó là số từ 1 đến 5.";
  if (!parseStatus(row.status)) errors.status = "Trạng thái là draft hoặc published.";
  if (row.explanation.trim().length > MAX_EXPLANATION) errors.explanation = `Giải thích tối đa ${MAX_EXPLANATION} ký tự.`;
  else if (level !== null && explanationRequired(level) && !row.explanation.trim()) errors.explanation = `Câu hỏi THCS (cấp ${level}) cần có giải thích.`;

  if (type) {
    if (type !== "match_pairs" && !row.answer.trim()) errors.answer = "Thiếu từ đúng (answer).";
    else {
      const form = questionFormOf(type, row);
      if (type !== "match_pairs" && form.correct === null) errors.answer = "Từ đúng (answer) phải là một trong các từ lựa chọn.";
      else {
        const built = buildQuestionData(type, form, ctx.bank);
        if (!built.ok) errors.options = built.message;
      }
    }
  }
  return errors;
}
