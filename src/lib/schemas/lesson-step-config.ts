import { z } from "zod";

// Cấu hình riêng của từng bước trong bài, lưu ở cột JSON `lesson_steps.config`.
// `activity_type` là chuỗi (không phải enum database) để giai đoạn sau thêm dạng bài mà không phải ALTER bảng.

/** Dạng bài của giai đoạn 1 (PRD C8: 8.1–8.4, và trò chơi lật thẻ C9). */
export const ACTIVITY_TYPES = [
  "word_card",
  "listen_choose_picture",
  "match_pairs",
  "choose_word_for_picture",
  "memory_game",
  "phonics",
  "sentence_order",
  "dictation",
  "fill_blank",
  "story",
  "short_reading",
] as const;
export const activityTypeSchema = z.enum(ACTIVITY_TYPES);
export type ActivityType = z.infer<typeof activityTypeSchema>;

const choiceCount = z.number().int().min(2).max(4);

export const lessonStepConfigSchemas = {
  /** 8.1 Thẻ từ. */
  word_card: z.object({ showExample: z.boolean().default(true) }),
  /** 8.2 Nghe và chọn hình. */
  listen_choose_picture: z.object({ autoPlay: z.boolean().default(true), optionCount: choiceCount.default(3) }),
  /** 8.3 Nối cặp. */
  match_pairs: z.object({ pairCount: z.number().int().min(3).max(6).default(4), mode: z.enum(["click", "drag"]).default("click") }),
  /** 8.4 Chọn từ đúng cho hình. */
  choose_word_for_picture: z.object({ optionCount: choiceCount.default(3) }),
  /** 9. Lật thẻ ghép cặp (trò chơi nhỏ): mỗi cặp là một hình và một chữ, 6 cặp = 12 thẻ. Thiếu từ có hình trong bài thì lấy thêm từ cùng chủ đề. */
  memory_game: z.object({ pairCount: z.number().int().min(3).max(6).default(6) }),
  /** 8.5 / 8.8 / 8.9 / 8.10 (task 15): nội dung nằm hẳn trong câu hỏi gắn vào bước, nên không có cấu hình riêng. */
  phonics: z.object({}),
  sentence_order: z.object({}),
  dictation: z.object({}),
  fill_blank: z.object({}),
  /** 8.6 Truyện tranh có đọc to (task 16): truyện nào lấy từ `stories`. */
  story: z.object({ storyId: z.number().int().positive() }),
  /** 8.11 Đọc hiểu ngắn (task 16): nội dung nằm trong câu hỏi gắn vào bước. */
  short_reading: z.object({}),
} satisfies Record<ActivityType, z.ZodType>;

export type LessonStepConfig = z.infer<(typeof lessonStepConfigSchemas)[ActivityType]>;

/**
 * Kiểm tra cấu hình theo dạng bài; thiếu trường thì lấy mặc định.
 * Trả về null nếu dạng bài chưa được hỗ trợ hoặc cấu hình sai.
 */
export function parseLessonStepConfig(activityType: string, config: unknown): LessonStepConfig | null {
  const type = activityTypeSchema.safeParse(activityType);
  if (!type.success) return null;
  const result = lessonStepConfigSchemas[type.data].safeParse(config ?? {});
  return result.success ? result.data : null;
}
