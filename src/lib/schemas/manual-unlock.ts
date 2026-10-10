import { z } from "zod";

// Mở khóa thủ công của bố mẹ (task 24, Adult17). Dùng chung giữa client (hộp xác nhận) và server action.

export const MANUAL_TARGET_TYPES = ["level", "unit", "lesson"] as const;

export const unlockTargetSchema = z.object({
  type: z.enum(MANUAL_TARGET_TYPES, { error: "Loại mục chưa hợp lệ." }),
  id: z.number({ error: "Mục chưa hợp lệ." }).int().positive("Mục chưa hợp lệ."),
});
export type UnlockTarget = z.infer<typeof unlockTargetSchema>;

/** Tối đa số mục mở trong một lần (đủ cho cả một cấp có nhiều chủ đề, chặn gửi hàng loạt). */
export const MAX_UNLOCK_TARGETS = 100;

export const unlockInputSchema = z.object({
  learnerId: z.number({ error: "Chọn hồ sơ của con." }).int().positive(),
  targets: z.array(unlockTargetSchema).min(1, "Chọn ít nhất một mục để mở khóa.").max(MAX_UNLOCK_TARGETS, `Mỗi lần chỉ mở tối đa ${MAX_UNLOCK_TARGETS} mục.`),
});
export type UnlockInput = z.infer<typeof unlockInputSchema>;
