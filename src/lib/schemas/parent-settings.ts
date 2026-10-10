import { z } from "zod";
import { MAX_PASSWORD_LENGTH } from "./auth";
import { UI_THEMES } from "./learner";
import { validateName, validateNewPassword, validateNewPin, validateStudyWindow } from "../rules/parent-settings";
import { ALL_DAYS, validateStudyDays } from "../rules/study-window";

// Dữ liệu bố mẹ gửi khi lưu Cài đặt. Luật kiểm nằm ở src/lib/rules/parent-settings.ts (dùng chung với biểu mẫu trên trình duyệt).

const learnerId = z.number().int().positive();

export const DAILY_LIMIT_CHOICES = ["15", "20", "30", "45", "60", "none"] as const;

export const studyTimeInputSchema = z
  .object({
    learnerId,
    limit: z.enum(DAILY_LIMIT_CHOICES),
    /** Khung giờ được học (dạng giờ:phút); để trống cả hai là mọi giờ. */
    from: z.string().max(5),
    to: z.string().max(5),
    /** Các thứ được học (1 = thứ Hai … 7 = Chủ nhật). */
    days: z.array(z.number().int()).default([...ALL_DAYS]),
  })
  .superRefine((value, ctx) => {
    const dayError = validateStudyDays(value.days);
    if (dayError) ctx.addIssue({ code: "custom", path: ["days"], message: dayError });
    const errors = validateStudyWindow(value.from, value.to);
    if (errors.from) ctx.addIssue({ code: "custom", path: ["from"], message: errors.from });
    if (errors.to) ctx.addIssue({ code: "custom", path: ["to"], message: errors.to });
  });

export const appearanceInputSchema = z.object({
  learnerId,
  uiTheme: z.enum(UI_THEMES),
  accent: z.enum(["en-US", "en-GB"]),
  speed: z.enum(["normal", "slow"]),
  soundOn: z.boolean(),
  speechScoring: z.boolean(),
});

const nameField = z.string().superRefine((value, ctx) => {
  const message = validateName(value);
  if (message) ctx.addIssue({ code: "custom", message });
});

export const renameInputSchema = z.object({ learnerId, name: nameField });
export const gradeInputSchema = z.object({ learnerId, grade: z.number().int().min(1).max(9) });
export const levelInputSchema = z.object({ learnerId, level: z.number().int().min(1).max(10) });
export const resetProgressInputSchema = z.object({ learnerId });
/** Xóa hồ sơ: phải gõ đúng tên con (kiểm lại ở server). */
export const deleteLearnerInputSchema = z.object({ learnerId, confirmName: z.string().min(1).max(100) });

export const changePasswordInputSchema = z
  .object({
    current: z.string().min(1, "Nhập mật khẩu hiện tại.").max(MAX_PASSWORD_LENGTH),
    password: z.string().max(MAX_PASSWORD_LENGTH).superRefine((value, ctx) => {
      const message = validateNewPassword(value);
      if (message) ctx.addIssue({ code: "custom", message });
    }),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Hai mật khẩu mới chưa khớp nhau.", path: ["confirm"] });

export const changePinInputSchema = z
  .object({
    /** PIN hiện tại, hoặc mật khẩu tài khoản khi chưa có PIN. */
    current: z.string().min(1, "Nhập PIN hiện tại.").max(MAX_PASSWORD_LENGTH),
    pin: z.string().superRefine((value, ctx) => {
      const message = validateNewPin(value);
      if (message) ctx.addIssue({ code: "custom", message });
    }),
    confirmPin: z.string(),
  })
  .refine((v) => v.pin === v.confirmPin, { message: "Hai mã PIN chưa khớp nhau.", path: ["confirmPin"] });
