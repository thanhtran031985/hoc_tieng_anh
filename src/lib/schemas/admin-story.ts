import { z } from "zod";
import { STORY_MAX_NEW_WORDS, STORY_MAX_PAGES, STORY_QUESTION_CHOICES } from "../rules/admin-story.ts";
import { TTS_UI_BATCH_SIZE } from "../rules/tts.ts";
import { storyPageKindSchema } from "./story.ts";

// Dữ liệu ghi của màn Soạn truyện tranh (task 16, Adult19). Dùng chung giữa biểu mẫu ở client và server action.
// Biểu mẫu gửi cả truyện một lần; server kiểm từng trang bằng cùng luật (rules/admin-story.ts) rồi mới ghi.

export const storyPageInputSchema = z.object({
  /** Trang đã lưu có `id`; trang mới thì null. */
  id: z.number().int().positive().nullable(),
  kind: storyPageKindSchema,
  image: z.string().max(255).nullable(),
  sentences: z.array(z.string().max(200, "Mỗi câu tối đa 200 ký tự.")).max(2),
  question: z.object({
    text: z.string().max(200, "Câu hỏi tối đa 200 ký tự."),
    choices: z.array(z.string().max(40, "Lựa chọn tối đa 40 ký tự.")).length(STORY_QUESTION_CHOICES),
    correct: z.number().int().min(0).max(STORY_QUESTION_CHOICES - 1).nullable(),
  }),
});

export const saveStorySchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1, "Nhập tên truyện.").max(150, "Tên truyện tối đa 150 ký tự."),
  titleVi: z.string().trim().max(150, "Tên tiếng Việt tối đa 150 ký tự."),
  levelId: z.number().int().positive(),
  unitId: z.number().int().positive().nullable(),
  newWords: z.array(z.string().trim().min(1).max(40)).max(STORY_MAX_NEW_WORDS),
  status: z.enum(["draft", "published"]),
  pages: z.array(storyPageInputSchema).max(STORY_MAX_PAGES, `Một truyện tối đa ${STORY_MAX_PAGES} trang.`),
});
export type SaveStoryInput = z.infer<typeof saveStorySchema>;

export const createStorySchema = z.object({
  title: z.string().trim().min(1, "Nhập tên truyện.").max(150, "Tên truyện tối đa 150 ký tự."),
  levelId: z.number().int().positive(),
});

/** Tạo giọng đọc cho một lượt trang (tối đa `TTS_UI_BATCH_SIZE` trang mỗi lần gọi). */
export const generateStoryAudioSchema = z.object({
  pageIds: z.array(z.number().int().positive()).min(1, "Chọn ít nhất một trang.").max(TTS_UI_BATCH_SIZE, `Mỗi lượt tối đa ${TTS_UI_BATCH_SIZE} trang.`),
  force: z.boolean().default(false),
});
