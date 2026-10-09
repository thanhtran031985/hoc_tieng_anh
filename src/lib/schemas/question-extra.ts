import { z } from "zod";
import { BLANK } from "../rules/grading/fill-blank.ts";
import { READING_CHOICES, READING_MAX_QUESTIONS, READING_MAX_SENTENCES, READING_MIN_QUESTIONS, READING_MIN_SENTENCES, splitPassage } from "../rules/grading/reading.ts";
import { sameWords } from "../rules/grading/sentence-order.ts";
import { normalizeAnswer } from "../rules/grading/text.ts";

// Bốn dạng câu hỏi của task 15: nội dung nằm hẳn trong bảng `questions` (không dựng từ ngân hàng từ).
// Hình dạng cột JSON `prompt`, `options`, `answer` của từng dạng.

export const EXTRA_QUESTION_TYPES = ["phonics", "sentence_order", "dictation", "fill_blank", "short_reading"] as const;
export const extraQuestionTypeSchema = z.enum(EXTRA_QUESTION_TYPES);
export type ExtraQuestionType = z.infer<typeof extraQuestionTypeSchema>;

export const isExtraQuestionType = (type: string): type is ExtraQuestionType => (EXTRA_QUESTION_TYPES as readonly string[]).includes(type);

const textPrompt = (max: number) => z.object({ text: z.string().trim().min(1).max(max), wordId: z.number().int().positive().optional() });

// Ghép âm: `tiles` theo thứ tự đúng; `sound` là chữ (grapheme) của bảng `phonics_sounds` để phát âm.
const phonicsTile = z.object({ t: z.string().trim().min(1).max(4), sound: z.string().trim().min(1).max(4) });
export const phonicsQuestionSchema = z
  .object({
    prompt: textPrompt(20),
    options: z.object({ tiles: z.array(phonicsTile).min(2).max(8) }),
    answer: z.object({ order: z.array(z.string().min(1).max(4)).min(2).max(8) }),
  })
  .refine((q) => q.answer.order.join("|") === q.options.tiles.map((t) => t.t).join("|"), { message: "Thứ tự đúng phải khớp các ô âm", path: ["answer"] })
  .refine((q) => q.options.tiles.map((t) => t.t).join("").toLowerCase() === q.prompt.text.toLowerCase(), {
    message: "Các ô âm ghép lại phải thành từ",
    path: ["options"],
  });

// Sắp xếp câu: `answer.words` là các từ theo thứ tự đúng (dấu câu dính từ cuối); `distractors` là từ nhiễu.
export const sentenceOrderQuestionSchema = z
  .object({
    prompt: textPrompt(200),
    options: z.object({ distractors: z.array(z.string().trim().min(1).max(30)).max(3) }),
    answer: z.object({
      words: z.array(z.string().min(1).max(30)).min(3).max(14),
      /** Các cách sắp xếp khác cũng đúng (cùng các từ, khác thứ tự). */
      alternatives: z.array(z.array(z.string().min(1).max(30)).min(3).max(14)).max(4).optional(),
    }),
  })
  .refine((q) => q.answer.words.join(" ") === q.prompt.text.split(/\s+/).join(" "), { message: "Các thẻ phải ghép lại thành câu gốc", path: ["answer"] })
  .refine((q) => (q.answer.alternatives ?? []).every((alt) => sameWords(alt, q.answer.words)), { message: "Cách sắp xếp khác phải dùng đúng các từ của câu", path: ["answer"] });

// Nghe và gõ: `accepted` là các đáp án chấp nhận; cờ trong `options` quyết định cách so.
export const dictationQuestionSchema = z
  .object({
    prompt: textPrompt(200),
    options: z.object({ ignoreCase: z.boolean(), ignoreEndPunct: z.boolean() }),
    answer: z.object({ accepted: z.array(z.string().trim().min(1).max(200)).min(1).max(6) }),
  })
  .refine(
    (q) => {
      const same = (s: string) => normalizeAnswer(s, q.options);
      return q.answer.accepted.some((a) => same(a) === same(q.prompt.text));
    },
    { message: "Chưa có đáp án nào trùng với nội dung được đọc", path: ["answer"] },
  );

// Điền từ: câu có đúng một `___`, 3–4 thẻ, `correct` là chỉ số thẻ đúng.
export const fillBlankQuestionSchema = z
  .object({
    prompt: textPrompt(200).refine((p) => p.text.split(BLANK).length === 2, "Câu cần đúng một ô trống ___"),
    options: z
      .object({ cards: z.array(z.string().trim().min(1).max(30)).min(3).max(4) })
      .refine((o) => new Set(o.cards.map((c) => c.toLowerCase())).size === o.cards.length, "Có hai thẻ trùng nhau"),
    answer: z.object({ correct: z.number().int().min(0).max(3) }),
  })
  .refine((q) => q.answer.correct < q.options.cards.length, { message: "Chọn một thẻ đúng", path: ["answer"] });

// Đọc hiểu ngắn (8.11): đoạn 3–6 câu và 2–3 câu hỏi, mỗi câu 3 đáp án; `evidence` là chỉ số (từ 0) câu trong đoạn chứa đáp án (gợi ý sáng câu đó).
export const readingQuestionSchema = z.object({
  text: z.string().trim().min(1).max(120),
  choices: z.array(z.string().trim().min(1).max(30)).length(READING_CHOICES),
  evidence: z.number().int().min(0).max(READING_MAX_SENTENCES - 1),
});
export const shortReadingQuestionSchema = z
  .object({
    prompt: z.object({ title: z.string().trim().min(1).max(60), text: z.string().trim().min(1).max(800), wordId: z.number().int().positive().optional() }),
    options: z.object({ questions: z.array(readingQuestionSchema).min(READING_MIN_QUESTIONS).max(READING_MAX_QUESTIONS) }),
    answer: z.object({ correct: z.array(z.number().int().min(0).max(READING_CHOICES - 1)).min(READING_MIN_QUESTIONS).max(READING_MAX_QUESTIONS) }),
  })
  .refine((q) => splitPassage(q.prompt.text).length >= READING_MIN_SENTENCES && splitPassage(q.prompt.text).length <= READING_MAX_SENTENCES, { message: `Đoạn văn cần ${READING_MIN_SENTENCES}–${READING_MAX_SENTENCES} câu`, path: ["prompt"] })
  .refine((q) => q.answer.correct.length === q.options.questions.length, { message: "Mỗi câu hỏi cần một đáp án đúng", path: ["answer"] })
  .refine((q) => q.options.questions.every((x) => x.evidence < splitPassage(q.prompt.text).length), { message: "Câu chứa đáp án phải nằm trong đoạn văn", path: ["options"] })
  .refine((q) => q.options.questions.every((x) => new Set(x.choices.map((c) => c.toLowerCase())).size === x.choices.length), { message: "Có hai đáp án trùng nhau", path: ["options"] });

export const extraQuestionSchemas = {
  phonics: phonicsQuestionSchema,
  sentence_order: sentenceOrderQuestionSchema,
  dictation: dictationQuestionSchema,
  fill_blank: fillBlankQuestionSchema,
  short_reading: shortReadingQuestionSchema,
} satisfies Record<ExtraQuestionType, z.ZodType>;

export type PhonicsQuestionData = z.infer<typeof phonicsQuestionSchema>;
export type SentenceOrderQuestionData = z.infer<typeof sentenceOrderQuestionSchema>;
export type DictationQuestionData = z.infer<typeof dictationQuestionSchema>;
export type FillBlankQuestionData = z.infer<typeof fillBlankQuestionSchema>;
export type ShortReadingQuestionData = z.infer<typeof shortReadingQuestionSchema>;
export type ExtraQuestionData = PhonicsQuestionData | SentenceOrderQuestionData | DictationQuestionData | FillBlankQuestionData | ShortReadingQuestionData;

/** Kiểm tra bộ ba prompt/options/answer của một trong 4 dạng; ném ZodError nếu sai (dùng khi ghi). */
export function validateExtraQuestion(type: string, data: unknown): ExtraQuestionData {
  return extraQuestionSchemas[extraQuestionTypeSchema.parse(type)].parse(data);
}

/** Như `validateExtraQuestion` nhưng trả null thay vì ném lỗi (dùng khi đọc). */
export function parseExtraQuestion(type: string, data: unknown): ExtraQuestionData | null {
  const t = extraQuestionTypeSchema.safeParse(type);
  if (!t.success) return null;
  const result = extraQuestionSchemas[t.data].safeParse(data);
  return result.success ? result.data : null;
}
