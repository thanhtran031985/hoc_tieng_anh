import { z } from "zod";

// Dữ liệu client gửi khi bé làm xong bài xếp lớp, và kết quả server trả về. Cấp đề xuất do server tính lại từ các câu trả lời.

const MAX_ANSWERS = 30;
const MAX_DURATION_MS = 3 * 60 * 60 * 1000;

export const placementAnswerSchema = z.object({
  wordId: z.number().int().positive(),
  /** Cấp của câu hỏi (server đối chiếu lại với cấp của từ). */
  level: z.number().int().min(1).max(10),
  /** Đúng hay sai; "Tớ chưa biết" gửi là sai. */
  correct: z.boolean(),
});

export type PlacementAnswerInput = z.infer<typeof placementAnswerSchema>;

export const completePlacementInputSchema = z.object({
  durationMs: z.number().int().min(0).max(MAX_DURATION_MS),
  answers: z.array(placementAnswerSchema).min(1).max(MAX_ANSWERS),
});

export type CompletePlacementInput = z.infer<typeof completePlacementInputSchema>;

/** Chọn cấp bắt đầu (từ kết quả, hoặc "Bỏ qua, bắt đầu theo lớp"). */
export const applyStartLevelInputSchema = z.object({
  level: z.number().int().min(1).max(10),
});

export type PlacementTopic = { title: string; ok: boolean };

export type PlacementResult = {
  suggestedLevel: number;
  /** Chủ đề bé đã gặp: `ok` khi đúng hết (vững), không thì "sẽ học". Tối đa 5. */
  topics: PlacementTopic[];
  minutes: number;
};
