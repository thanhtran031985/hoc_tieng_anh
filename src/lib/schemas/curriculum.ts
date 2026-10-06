import { z } from "zod";

// Khung chương trình: một chủ đề trong tệp prisma/seed/curriculum/level-NN.json (và dòng nhập Excel ở task 12).
// Tệp này không import gì khác ngoài zod vì seed chạy thẳng bằng Node.

export const curriculumTopicSchema = z.object({
  /** Khóa ổn định trong cấp (kebab-case). */
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug chỉ gồm chữ thường, số, dấu gạch ngang").max(100),
  title: z.string().trim().min(1).max(150),
  title_vi: z.string().trim().min(1).max(150),
  /** Nguồn từ mục tiêu (vd Cambridge Starters). */
  source: z.string().trim().min(1).max(100),
  target_words: z.array(z.string().trim().min(1).max(100)).min(1),
});

export type CurriculumTopic = z.infer<typeof curriculumTopicSchema>;

export const curriculumLevelSchema = z.array(curriculumTopicSchema).min(1);
