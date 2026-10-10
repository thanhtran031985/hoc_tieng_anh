import { z } from "zod";

// Tệp nội dung dạng bài mới của một chủ đề: prisma/seed/content-extra/level-NN/<slug>.json (task 19).
// Viết gọn để soạn nhiều câu: đáp án đúng luôn đứng đầu, thứ tự thẻ/đáp án được trộn theo hạt giống khi nạp.

const sentence = z.string().trim().min(3).max(120);
const word = z.string().trim().min(1).max(20);
const choice = z.string().trim().min(1).max(30);

/** Điền từ: "I have a ___. | cat | dog | pig" — câu có một ô trống, rồi đáp án ĐÚNG, rồi 2–3 thẻ nhiễu. */
export const fillEntry = z
  .string()
  .trim()
  .refine((s) => {
    const parts = s.split("|").map((p) => p.trim());
    return parts.length >= 4 && parts.length <= 5 && parts.every(Boolean) && parts[0].split("___").length === 2;
  }, "Điền từ cần dạng “Câu có ___ | đáp án đúng | thẻ nhiễu | thẻ nhiễu”");

export const sentenceOrderEntry = z.union([sentence, z.object({ text: sentence, distractors: z.array(word).max(3).optional() })]);

export const readingEntry = z.object({
  title: z.string().trim().min(1).max(60),
  text: z.string().trim().min(10).max(500),
  /** Mỗi câu hỏi: đề, 3 đáp án (đáp án ĐÚNG đứng đầu), câu (từ 0) của đoạn chứa đáp án. */
  questions: z
    .array(z.object({ q: z.string().trim().min(3).max(120), a: z.array(choice).length(3), evidence: z.number().int().min(0).max(5) }))
    .min(2)
    .max(3),
});

export const contentExtraSchema = z
  .object({
    phonics: z.array(z.string().regex(/^[a-z]{3,8}$/, "Ghép âm cần một từ chữ thường 3–8 chữ cái")).default([]),
    sentence_order: z.array(sentenceOrderEntry).default([]),
    fill_blank: z.array(fillEntry).default([]),
    dictation: z.array(sentence).default([]),
    speaking: z.array(sentence).default([]),
    short_reading: z.array(readingEntry).default([]),
  })
  .strict();

export type ContentExtra = z.infer<typeof contentExtraSchema>;
