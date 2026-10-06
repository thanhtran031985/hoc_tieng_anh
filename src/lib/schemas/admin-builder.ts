import { z } from "zod";
import { ACTIVITY_INFO, MAX_STEPS } from "../rules/admin-builder.ts";
import { activityTypeSchema } from "./lesson-step-config.ts";

// Dữ liệu ghi của màn Soạn bài học quản trị (task 12, Adult12). Dùng chung giữa client và server action.

const stepSchema = z.object({
  /** Có `id` là bước đã lưu (giữ nguyên id khi lưu lại); không có là bước mới. */
  id: z.number().int().positive().optional(),
  activityType: activityTypeSchema,
  wordId: z.number().int().positive().nullable(),
  questionId: z.number().int().positive().nullable(),
  config: z.record(z.string(), z.unknown()).nullable(),
});

export const saveLessonSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1, "Nhập tên bài.").max(150, "Tên bài tối đa 150 ký tự."),
  status: z.enum(["draft", "published"]),
  steps: z
    .array(stepSchema)
    .max(MAX_STEPS, `Một bài tối đa ${MAX_STEPS} bước.`)
    .superRefine((steps, ctx) => {
      steps.forEach((step, index) => {
        if (ACTIVITY_INFO[step.activityType]?.needsWord && step.wordId === null) ctx.addIssue({ code: "custom", path: [index], message: `Bước ${index + 1} cần chọn một từ.` });
      });
    }),
});

export type SaveLessonInput = z.infer<typeof saveLessonSchema>;
export const lessonIdSchema = z.object({ lessonId: z.number().int().positive() });
export const unitWordsSchema = z.object({ unitId: z.number().int().positive() });
