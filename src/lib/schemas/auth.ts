import { z } from "zod";

// Đăng ký và đăng nhập tài khoản gia đình. bcrypt chỉ đọc 72 byte đầu của mật khẩu, nên giới hạn tối đa 72.

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 72;

const email = z.string().trim().toLowerCase().min(1, "Nhập email").max(191).pipe(z.email("Email chưa đúng, kiểm tra lại nhé"));

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Nhập mật khẩu").max(MAX_PASSWORD_LENGTH),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Nhập tên của bố mẹ").max(100),
    email,
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Mật khẩu cần ít nhất ${MIN_PASSWORD_LENGTH} ký tự`)
      .refine((v) => new TextEncoder().encode(v).length <= MAX_PASSWORD_LENGTH, "Mật khẩu hơi dài, rút ngắn lại nhé"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, { message: "Hai mật khẩu chưa giống nhau", path: ["confirmPassword"] });

export type RegisterInput = z.infer<typeof registerSchema>;

/** PIN bố mẹ: 4–6 chữ số. */
export const parentPinSchema = z.string().regex(/^\d{4,6}$/, "PIN gồm 4 đến 6 chữ số");

export const setParentPinSchema = z
  .object({ pin: parentPinSchema, confirmPin: z.string() })
  .refine((v) => v.pin === v.confirmPin, { message: "Hai lần nhập PIN chưa giống nhau", path: ["confirmPin"] });
