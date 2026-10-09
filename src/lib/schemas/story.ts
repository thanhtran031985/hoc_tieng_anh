import { z } from "zod";
import { choiceQuestionSchema } from "./question.ts";

// Truyện tranh (task 16): hình dạng JSON của `story_pages.sentences`, `stories.new_words` và câu hỏi xen giữa truyện.

/** Một trang truyện có tối đa chừng này từ (cả 1–2 câu) để bé đọc kịp. */
export const STORY_PAGE_MAX_WORDS = 16;
export const STORY_PAGE_MAX_SENTENCES = 2;

export const STORY_PAGE_KINDS = ["page", "question"] as const;
export const storyPageKindSchema = z.enum(STORY_PAGE_KINDS);

/** Dạng câu hỏi xen giữa truyện: chọn 1 trong đúng 3 đáp án. */
export const STORY_QUESTION_TYPE = "story_question";

export const storySentenceSchema = z.object({ en: z.string().trim().min(1).max(200), vi: z.string().trim().max(200).optional() });
export const storySentencesSchema = z.array(storySentenceSchema).max(STORY_PAGE_MAX_SENTENCES);
export type StorySentence = z.infer<typeof storySentenceSchema>;

export const storyNewWordsSchema = z.array(z.string().trim().min(1).max(40)).max(12);

/** Câu hỏi xen giữa truyện: đề, đúng 3 lựa chọn chữ, 1 đáp án đúng. */
export const storyQuestionSchema = choiceQuestionSchema.refine((q) => q.options.length === 3, { message: "Câu hỏi giữa truyện cần đúng 3 lựa chọn", path: ["options"] });
export type StoryQuestionData = z.infer<typeof storyQuestionSchema>;

export function parseStoryQuestion(data: unknown): StoryQuestionData | null {
  const result = storyQuestionSchema.safeParse(data);
  return result.success ? result.data : null;
}
