import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/schemas";
import { db } from "./db";

export const BCRYPT_COST = 12;

/** Vai trò của tài khoản mới: chưa có admin nào thì người đăng ký đầu tiên là admin, còn lại là parent. */
export function roleForNewUser(adminCount: number): "admin" | "parent" {
  return adminCount === 0 ? "admin" : "parent";
}

export type RegisterResult = { ok: true; userId: number } | { ok: false; error: "email_taken" };

/** Tạo tài khoản gia đình. `input` được kiểm bằng Zod; mật khẩu chỉ lưu dạng băm bcrypt. */
export async function registerUser(input: unknown): Promise<RegisterResult> {
  const data = registerSchema.parse(input);
  const password = await bcrypt.hash(data.password, BCRYPT_COST);
  try {
    const user = await db.$transaction(async (tx) => {
      const role = roleForNewUser(await tx.user.count({ where: { role: "admin" } }));
      return tx.user.create({ data: { name: data.name, email: data.email, password, role } });
    });
    return { ok: true, userId: user.id };
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") return { ok: false, error: "email_taken" };
    throw error;
  }
}

/** Kiểm mật khẩu của tài khoản (dùng cho cổng bố mẹ). */
export async function verifyUserPassword(userId: number, password: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { password: true } });
  return user ? bcrypt.compare(password, user.password) : false;
}
