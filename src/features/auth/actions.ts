"use server";

import { cookies } from "next/headers";
import { AuthError } from "next-auth";
import { ZodError } from "zod";
import { signIn, signOut } from "@/auth";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { LEARNER_COOKIE, PARENT_GATE_COOKIE } from "@/server/cookies";
import { registerUser } from "@/server/users";

// Trạng thái trả về cho biểu mẫu (useActionState). Lời nhắn nhẹ nhàng, không dùng giọng trách móc.
export type AuthFormState = {
  status: "idle" | "error";
  /** Lỗi chung của biểu mẫu (hiện ở ô mật khẩu). */
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "password" | "confirmPassword", string>>;
  /** Không kết nối được máy chủ hoặc database: hiện hộp "Chưa kết nối được" và nút Thử lại. */
  connection?: boolean;
};

const text = (value: FormDataEntryValue | null) => (typeof value === "string" ? value : "");

function fieldErrorsOf(error: ZodError): NonNullable<AuthFormState["fieldErrors"]> {
  const result: NonNullable<AuthFormState["fieldErrors"]> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if ((key === "name" || key === "email" || key === "password" || key === "confirmPassword") && !result[key]) result[key] = issue.message;
  }
  return result;
}

const WRONG_CREDENTIALS = "Email hoặc mật khẩu chưa đúng. Bố mẹ kiểm tra lại rồi thử nhé!";
const TOO_MANY = "Đã thử nhiều lần rồi. Bố mẹ nghỉ vài phút rồi đăng nhập lại nhé.";

/** Đăng nhập; thành công thì chuyển tới /profiles. */
export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({ email: text(formData.get("email")), password: text(formData.get("password")) });
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrorsOf(parsed.error) };
  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/profiles" });
  } catch (error) {
    if (!(error instanceof AuthError)) throw error; // NEXT_REDIRECT khi đăng nhập thành công
    const code = (error as AuthError & { code?: string }).code;
    if (code === "too_many_attempts") return { status: "error", message: TOO_MANY };
    if (error.type === "CredentialsSignin") return { status: "error", message: WRONG_CREDENTIALS };
    return { status: "error", connection: true };
  }
  return { status: "idle" };
}

/** Đăng ký tài khoản gia đình rồi đăng nhập luôn. */
export async function registerAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const raw = {
    name: text(formData.get("name")),
    email: text(formData.get("email")),
    password: text(formData.get("password")),
    confirmPassword: text(formData.get("confirmPassword")),
  };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrorsOf(parsed.error) };

  try {
    const result = await registerUser(parsed.data);
    if (!result.ok) return { status: "error", fieldErrors: { email: "Email này đã có tài khoản. Bố mẹ đăng nhập nhé!" } };
    await signIn("credentials", { email: parsed.data.email, password: parsed.data.password, redirectTo: "/profiles" });
  } catch (error) {
    if (error instanceof AuthError || error instanceof ZodError) return { status: "error", connection: true };
    if ((error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { status: "error", connection: true };
  }
  return { status: "idle" };
}

/** Đăng xuất và xóa các cookie chọn hồ sơ, cổng bố mẹ. */
export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(LEARNER_COOKIE);
  jar.delete(PARENT_GATE_COOKIE);
  await signOut({ redirectTo: "/login" });
}
