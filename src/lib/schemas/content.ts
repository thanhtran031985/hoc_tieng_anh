import { z } from "zod";

// Nội dung chi tiết của một từ trong prisma/seed/content/level-NN/<slug-chủ-đề>.json (và dòng nhập Excel ở task 12).
// Tệp này chỉ import zod vì seed chạy thẳng bằng Node.

export const PARTS_OF_SPEECH = ["noun", "verb", "adjective", "adverb", "preposition", "determiner", "pronoun", "conjunction", "interjection", "phrase"] as const;

export const contentWordSchema = z.object({
  /** Khớp đúng một từ trong `target_words` của chủ đề (khung chương trình). */
  word: z.string().trim().min(1).max(100),
  /** Phiên âm quốc tế, trong hai dấu gạch chéo (vd /ˈæpl/). */
  ipa: z.string().trim().regex(/^\/.+\/$/, "Phiên âm nằm trong hai dấu /").max(100),
  part_of_speech: z.enum(PARTS_OF_SPEECH),
  meaning_vi: z.string().trim().min(1).max(255),
  example_en: z.string().trim().min(1).max(500),
  example_vi: z.string().trim().min(1).max(500),
});

export type ContentWord = z.infer<typeof contentWordSchema>;

export const contentTopicSchema = z.array(contentWordSchema).min(1);
