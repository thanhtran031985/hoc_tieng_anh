import { z } from "zod";
import { GAME_NAME, MAX_RACE_ATTEMPTS } from "../rules/games.ts";

// Thành tích mini game gửi lên server (task 18). Dùng chung giữa client và server.
const GAME_NAMES = Object.values(GAME_NAME) as [string, ...string[]];

export const MAX_GAME_SEQUENCE = MAX_RACE_ATTEMPTS;

export const saveGameRecordSchema = z
  .object({
    game: z.enum(GAME_NAMES),
    lessonId: z.number().int().positive(),
    /** Số lượt đúng ngay lần đầu. */
    correct: z.number().int().min(0).max(MAX_GAME_SEQUENCE),
    /** Số lượt của trò. */
    total: z.number().int().min(1).max(MAX_GAME_SEQUENCE),
    /** Từng lượt trả lời theo thứ tự: 1 đúng, 0 chưa đúng. */
    sequence: z.array(z.union([z.literal(0), z.literal(1)])).max(MAX_GAME_SEQUENCE),
  })
  .refine((v) => v.correct <= v.total, { message: "Số lượt đúng vượt quá tổng số lượt.", path: ["correct"] });

export type SaveGameRecordInput = z.infer<typeof saveGameRecordSchema>;
