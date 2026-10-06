import { z } from "zod";

// Dữ liệu client gửi khi bé xong một bài. Chỉ gồm kết quả từng mục; sao, xu và XP do server tính (không tin số từ client).

const MAX_ITEMS = 60;
const MAX_DURATION_MS = 3 * 60 * 60 * 1000;

export const lessonItemSchema = z.object({
  wordId: z.number().int().positive(),
  /** Đúng ngay lần chọn đầu tiên. */
  firstTryCorrect: z.boolean(),
  wrong: z.number().int().min(0).max(20),
  revealed: z.boolean(),
  /** Các lựa chọn bé đã bấm, theo thứ tự (ghi nhật ký câu trả lời). */
  picks: z.array(z.string().min(1).max(40)).max(6),
  /** Mục làm lại ở cuối bài không tính sao nhưng vẫn ghi nhật ký. */
  scored: z.boolean(),
});

export type LessonItemInput = z.infer<typeof lessonItemSchema>;

export const completeLessonInputSchema = z.object({
  lessonId: z.number().int().positive(),
  /** Lúc bé bắt đầu bài (ms), giữ nguyên qua các lần thử lưu lại để một lượt học chỉ ghi một lần. */
  startedAtMs: z.number().int().positive(),
  /** Thời gian đang học thực tế (ms). */
  durationMs: z.number().int().min(0).max(MAX_DURATION_MS),
  items: z.array(lessonItemSchema).max(MAX_ITEMS),
});

export type CompleteLessonInput = z.infer<typeof completeLessonInputSchema>;

/** Kết quả server trả về cho màn kết thúc bài. */
export type LessonCompletion = {
  stars: 1 | 2 | 3;
  coins: number;
  xp: number;
  correct: number;
  total: number;
  minutes: number;
  /** Chặng kế tiếp trên bản đồ (bài tiếp theo hoặc trùm đã mở); null nếu xong hết cấp. */
  nextLessonId: number | null;
};
