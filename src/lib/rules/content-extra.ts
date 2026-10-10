// Đổi nội dung dạng bài mới của một chủ đề (task 19) thành các dòng `questions` (hàm thuần, không đụng database).
// Dùng lại `buildExtraData` của màn Câu hỏi dạng mới (Adult18) để mọi câu đi qua đúng luật như khi quản trị tự soạn.
// Import tương đối có đuôi .ts để Node chạy thẳng được (seed, test).
import type { ContentExtra } from "../schemas/content-extra.ts";
import type { ExtraQuestionType } from "../schemas/question-extra.ts";
import { buildExtraData, emptyExtraForm, splitIntoTiles, validateExtraBuilt, EXTRA_TYPE_INFO, type ExtraContext, type ExtraForm } from "./admin-question-types.ts";

export type ExtraItem = {
  type: ExtraQuestionType;
  /** Khóa ổn định của câu (dạng + chữ chính) để nạp lại không nhân đôi. */
  key: string;
  prompt: unknown;
  options: unknown;
  answer: unknown;
  skill: string;
  difficulty: number;
};

/** Chuẩn hóa chữ để làm khóa: bỏ khoảng trắng thừa, không phân biệt hoa thường. */
const norm = (text: string) => text.trim().replace(/\s+/g, " ").toLowerCase();

/** Khóa của một câu hỏi: `dạng:chữ chính` (từ ghép âm, câu gốc, nội dung đọc, câu có ô trống, câu mẫu hoặc tiêu đề bài đọc). */
export const extraKey = (type: string, text: string): string => `${type}:${norm(text)}`;

/** Khóa của câu hỏi đã lưu, từ cột `prompt`. */
export function extraKeyOf(type: string, prompt: unknown): string | null {
  const p = prompt as { text?: unknown; title?: unknown } | null;
  const main = type === "short_reading" ? p?.title : p?.text;
  return typeof main === "string" ? extraKey(type, main) : null;
}

/** Vị trí ổn định (0…n-1) theo khóa: đặt đáp án đúng ở chỗ khác nhau mà tải lại vẫn như cũ. */
export function stableIndex(key: string, n: number): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return n > 0 ? h % n : 0;
}

/** Tách một dòng điền từ: câu, đáp án đúng, các thẻ nhiễu. */
export function parseFillEntry(entry: string): { text: string; correct: string; distractors: string[] } {
  const [text, correct, ...distractors] = entry.split("|").map((p) => p.trim());
  return { text, correct, distractors };
}

const place = <T>(correct: T, others: readonly T[], key: string): { list: T[]; index: number } => {
  const index = stableIndex(key, others.length + 1);
  const list = [...others];
  list.splice(index, 0, correct);
  return { list, index };
};

export type ExtraBuild = { items: ExtraItem[]; errors: string[] };

/**
 * Dựng mọi câu hỏi của một chủ đề. `ctx.bank` có từ nào có hình thì ghép âm và điền từ gắn hình của từ đó;
 * `ctx.sounds` là bộ âm phonics. Câu lỗi được báo trong `errors` (kèm khóa) và bỏ qua, các câu khác vẫn dựng.
 */
export function buildExtraItems(content: ContentExtra, levelNumber: number, ctx: ExtraContext): ExtraBuild {
  const items: ExtraItem[] = [];
  const errors: string[] = [];
  const difficulty = levelNumber <= 2 ? 1 : 2;
  const leniency = levelNumber <= 2 ? "easy" : "normal";

  const add = (type: ExtraQuestionType, key: string, form: ExtraForm) => {
    const built = buildExtraData(type, form, ctx);
    if (!built.ok) return void errors.push(`${key}: ${built.message}`);
    const invalid = validateExtraBuilt(type, built.data);
    if (invalid) return void errors.push(`${key}: ${invalid}`);
    items.push({ type, key, prompt: built.data.prompt, options: built.data.options, answer: built.data.answer, skill: EXTRA_TYPE_INFO[type].skill, difficulty });
  };
  const withPicture = (word: string): string => (ctx.bank.get(norm(word))?.image ? word : "");

  for (const word of content.phonics) {
    const form = emptyExtraForm();
    form.text = word;
    form.tiles = splitIntoTiles(word, ctx.sounds);
    form.picture = withPicture(word);
    add("phonics", extraKey("phonics", word), form);
  }
  for (const entry of content.sentence_order) {
    const form = emptyExtraForm();
    const e = typeof entry === "string" ? { text: entry, distractors: undefined } : entry;
    form.text = e.text;
    form.distractors = (e.distractors ?? []).join(", ");
    add("sentence_order", extraKey("sentence_order", e.text), form);
  }
  for (const entry of content.fill_blank) {
    const { text, correct, distractors } = parseFillEntry(entry);
    const key = extraKey("fill_blank", text);
    const { list, index } = place(correct, distractors, key);
    const form = emptyExtraForm();
    form.text = text;
    form.cards = [...list, "", "", ""].slice(0, 4);
    form.correct = index;
    add("fill_blank", key, form);
  }
  for (const text of content.dictation) {
    const form = emptyExtraForm();
    form.text = text;
    form.accepted = text;
    add("dictation", extraKey("dictation", text), form);
  }
  for (const text of content.speaking) {
    const form = emptyExtraForm();
    form.text = text;
    form.leniency = leniency;
    add("speaking", extraKey("speaking", text), form);
  }
  for (const entry of content.short_reading) {
    const key = extraKey("short_reading", entry.title);
    const form = emptyExtraForm();
    form.title = entry.title;
    form.text = entry.text;
    form.questions = entry.questions.map((q, n) => {
      const { list, index } = place(q.a[0], q.a.slice(1), `${key}#${n}`);
      return { text: q.q, choices: list, correct: index, evidence: q.evidence };
    });
    while (form.questions.length < 3) form.questions.push({ text: "", choices: ["", "", ""], correct: null, evidence: 0 });
    add("short_reading", key, form);
  }
  return { items, errors };
}

/** Các khóa của chủ đề theo dạng, đúng thứ tự trong tệp (đưa cho `buildLessons`). */
export function extrasOf(items: readonly ExtraItem[]): Partial<Record<ExtraQuestionType, string[]>> {
  const out: Partial<Record<ExtraQuestionType, string[]>> = {};
  for (const item of items) (out[item.type] ??= []).push(item.key);
  return out;
}
