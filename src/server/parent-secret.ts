import bcrypt from "bcryptjs";
import { z } from "zod";
import { parentPinSchema } from "@/lib/schemas";
import { db } from "./db";
import { PIN_LIMIT, isLimited, recordFailure, resetFailures } from "./rate-limit";
import { verifyUserPassword } from "./users";

// Kiểm "PIN hoặc mật khẩu của bố mẹ" (PRD D1), dùng chung cho cổng bố mẹ và màn Hết giờ học (thêm giờ).
// Sai nhiều lần thì khóa tạm theo tài khoản (cùng một bộ đếm cho mọi nơi nhập PIN).

export type ParentSecretResult = { ok: true } | { ok: false; message: string };

export const TOO_MANY_ATTEMPTS = "Đã thử nhiều lần rồi. Bố mẹ nghỉ vài phút rồi thử lại nhé.";
export const WRONG_SECRET = "PIN hoặc mật khẩu chưa đúng. Bố mẹ thử lại nhé!";

export async function checkParentSecret(userId: number, secret: unknown): Promise<ParentSecretResult> {
  const parsed = z.string().min(1).max(72).safeParse(secret);
  if (!parsed.success) return { ok: false, message: "Nhập PIN hoặc mật khẩu của bố mẹ." };

  const key = `pin:${userId}`;
  if (isLimited(key, PIN_LIMIT.max)) return { ok: false, message: TOO_MANY_ATTEMPTS };

  const row = await db.user.findUnique({ where: { id: userId }, select: { parentPin: true } });
  let ok = false;
  if (row?.parentPin && parentPinSchema.safeParse(parsed.data).success) ok = await bcrypt.compare(parsed.data, row.parentPin);
  if (!ok) ok = await verifyUserPassword(userId, parsed.data);

  if (!ok) {
    recordFailure(key, PIN_LIMIT.windowMs);
    return { ok: false, message: WRONG_SECRET };
  }
  resetFailures(key);
  return { ok: true };
}
