import { z } from "zod";
import { lessonItemSchema } from "./lesson-complete";

// Dữ liệu của bài thi lên cấp: đầu vào từ client (bắt đầu, nộp bài), các cột JSON của `exam_attempts` và kết quả trả về cho màn kết quả.
// Sao, xu và đạt/chưa đạt do server tính từ kết quả từng câu (client không gửi các số này).

const id = z.number().int().positive();

export const startExamInputSchema = z.object({ level: z.number().int().min(1).max(10) });

/** Một câu của bộ đề đã chọn: bước bài học và chủ đề của nó. Cột `exam_attempts.items`. */
export const examItemSchema = z.object({ stepId: id, unitId: id });
export const examItemsSchema = z.array(examItemSchema).min(1).max(60);

/** Cột `exam_attempts.answers`: câu nào đúng ngay lần đầu. */
export const examAnswersSchema = z.array(z.object({ stepId: id, correct: z.boolean() })).max(60);

/** Cột `exam_attempts.weak_units`: tối đa 3 chủ đề sai nhiều nhất. */
export const examWeakUnitsSchema = z.array(z.object({ unitId: id, wrong: z.number().int().min(0), total: z.number().int().min(0), wordIds: z.array(id).max(3) })).max(3);

/** Kết quả từng câu bé gửi khi nộp bài: mã bước và các mục đã chấm của bước đó (một câu thi thường có một mục). */
export const examStepResultSchema = z.object({ stepId: id, items: z.array(lessonItemSchema).max(10) });

export const submitExamInputSchema = z.object({
  attemptId: id,
  results: z.array(examStepResultSchema).max(60),
});

export type SubmitExamInput = z.infer<typeof submitExamInputSchema>;

/** Một chủ đề gợi ý ôn khi chưa đạt. */
export type ExamWeakTopic = {
  unitId: number;
  title: string;
  titleVi: string;
  /** Số câu đúng trên số câu của chủ đề trong lượt thi. */
  correct: number;
  total: number;
  /** Từ hay sai của chủ đề (tối đa 3). */
  words: { word: string; meaningVi: string }[];
  /** Bài còn thiếu sao nhất của chủ đề để mở “Ôn chủ đề này”; null nếu chủ đề không còn bài. */
  reviewLessonId: number | null;
};

/** Kết quả một lượt thi đã nộp. */
export type ExamResult = {
  attemptId: number;
  passed: boolean;
  score: number;
  total: number;
  /** Số câu đúng tối thiểu để đạt (16 khi 20 câu). */
  passScore: number;
  percent: number;
  /** Tên cấp vừa thi và cấp kế (cho lời chúc và bản đồ đảo mới mở). */
  level: { number: number; name: string };
  next: { number: number; name: string } | null;
  weak: ExamWeakTopic[];
  /** Có khi vừa đạt: phần thưởng lên cấp của lần nộp này (nộp lại cùng lượt thì trả lại đúng số đã trao, `badge.isNew` giữ như lần đầu). */
  levelUp: { stars: number; coins: number; badge: { name: string; isNew: boolean } | null } | null;
};
