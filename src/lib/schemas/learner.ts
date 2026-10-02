import { z } from "zod";

// Dữ liệu tạo hoặc sửa hồ sơ học sinh. Mọi thao tác ghi bảng `learners` đều qua schema này.

export const AVATARS = ["short", "bob", "buns", "spiky"] as const;
export const MASCOT_COLORS = ["ngoc", "dao", "nang", "tim"] as const;
export const UI_THEMES = ["tieu_hoc", "thcs", "auto"] as const;

export const learnerInputSchema = z.object({
  name: z.string().trim().min(1, "Nhập tên của bé").max(100),
  birthYear: z.number().int().min(2000).max(new Date().getFullYear()).nullish(),
  schoolGrade: z.number().int().min(1).max(9).nullish(),
  textbook: z.string().trim().max(100).nullish(),
  avatar: z.enum(AVATARS).default("short"),
  mascot: z.enum(MASCOT_COLORS).default("ngoc"),
  mascotName: z.string().trim().min(1).max(50).default("Bông"),
  uiTheme: z.enum(UI_THEMES).default("auto"),
});

export type LearnerInput = z.infer<typeof learnerInputSchema>;

/** Hồ sơ tạo ở luồng 3 bước: tên tối đa 16 chữ, tên rồng tối đa 12 chữ (theo thiết kế). Bố mẹ đổi được sau ở phần cài đặt. */
export const createLearnerFormSchema = learnerInputSchema.extend({
  name: z.string().trim().min(1, "Nhập tên của bé").max(16, "Tên tối đa 16 chữ"),
  schoolGrade: z.number().int().min(1, "Chọn lớp của bé").max(9),
  mascotName: z.string().trim().min(1, "Đặt tên cho bạn rồng").max(12, "Tên rồng tối đa 12 chữ"),
});

export type CreateLearnerForm = z.infer<typeof createLearnerFormSchema>;
