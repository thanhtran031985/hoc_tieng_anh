import { z } from "zod";

// Khám phá từ (dạng bài 8.27, task 25): hình dạng JSON của `word_questions.answers`, `word_questions.distractors` và `word_readings.sentences`.
// Bản Nháp được lưu dang dở (thiếu hình, âm thanh, bản dịch); điều kiện xuất bản kiểm riêng ở src/lib/rules/word-explorer.ts.

export const WORD_QUESTION_KINDS = ["identify", "color", "food", "parts", "action", "place", "time", "use", "other"] as const;
export const wordQuestionKindSchema = z.enum(WORD_QUESTION_KINDS);
export type WordQuestionKind = z.infer<typeof wordQuestionKindSchema>;

/** Số đáp án tối đa của một nhánh (một đáp án là hình bé đoán, tất cả hiện khi mở nhánh). */
export const EXPLORER_ANSWERS_MAX = 5;
/** Số hình nhiễu tối đa của một nhánh; cùng đáp án đúng thành 2–3 hình để bé chọn. */
export const EXPLORER_DISTRACTORS_MAX = 2;
/** Số câu tối đa của đoạn văn: mỗi nhánh một câu (WORDLAB.branchMax). */
export const EXPLORER_SENTENCES_MAX = 6;

const mediaPath = z.string().trim().max(255).nullish();

/** Một đáp án: từ hoặc cụm từ tiếng Anh, nghĩa, hình và âm thanh. */
export const explorerAnswerSchema = z.object({
  text: z.string().trim().min(1, "Nhập đáp án").max(80),
  textVi: z.string().trim().max(80).default(""),
  image: mediaPath,
  audio: mediaPath,
  /** Đáp án mà bé đoán bằng hình; không đánh dấu đáp án nào thì dùng đáp án đầu. */
  guess: z.boolean().optional(),
});
export type ExplorerAnswer = z.infer<typeof explorerAnswerSchema>;
export const explorerAnswersSchema = z.array(explorerAnswerSchema).min(1, "Mỗi nhánh cần ít nhất một đáp án").max(EXPLORER_ANSWERS_MAX);

/** Hình nhiễu: một hình sai để bé đoán nhánh (có nhãn tiếng Anh để Bông đọc khi bé chọn). */
export const explorerDistractorSchema = z.object({
  text: z.string().trim().min(1, "Nhập nhãn cho hình").max(80),
  image: mediaPath,
});
export type ExplorerDistractor = z.infer<typeof explorerDistractorSchema>;
export const explorerDistractorsSchema = z.array(explorerDistractorSchema).max(EXPLORER_DISTRACTORS_MAX);

/** Nội dung một nhánh khi soạn hoặc nạp. */
export const wordQuestionDataSchema = z.object({
  kind: wordQuestionKindSchema,
  questionEn: z.string().trim().min(1, "Nhập câu hỏi tiếng Anh").max(255),
  questionVi: z.string().trim().max(255).default(""),
  answers: explorerAnswersSchema,
  distractors: explorerDistractorsSchema,
});
export type WordQuestionData = z.infer<typeof wordQuestionDataSchema>;

/** Một câu của đoạn văn, tiếng Anh kèm bản dịch. */
export const explorerSentenceSchema = z.object({
  en: z.string().trim().min(1, "Nhập câu tiếng Anh").max(300),
  vi: z.string().trim().max(300).default(""),
});
export type ExplorerSentence = z.infer<typeof explorerSentenceSchema>;
export const explorerSentencesSchema = z.array(explorerSentenceSchema).max(EXPLORER_SENTENCES_MAX);

/** Tham số của các thao tác đọc Khám phá theo từ (tab Khám phá trong Sổ từ). */
export const explorerWordInputSchema = z.object({ wordId: z.number().int().positive() });

export const WORD_READING_OWNERS = ["word", "family"] as const;
export const wordReadingOwnerSchema = z.enum(WORD_READING_OWNERS);

/** Đọc JSON từ database về đúng kiểu; hỏng thì trả null để màn bỏ qua nhánh thay vì vỡ. */
export function parseExplorerAnswers(data: unknown): ExplorerAnswer[] | null {
  const result = explorerAnswersSchema.safeParse(data);
  return result.success ? result.data : null;
}
export function parseExplorerDistractors(data: unknown): ExplorerDistractor[] | null {
  const result = explorerDistractorsSchema.safeParse(data);
  return result.success ? result.data : null;
}
export function parseExplorerSentences(data: unknown): ExplorerSentence[] | null {
  const result = explorerSentencesSchema.safeParse(data);
  return result.success ? result.data : null;
}
