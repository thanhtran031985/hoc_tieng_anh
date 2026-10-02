import bcrypt from "bcryptjs";
import { z } from "zod";
import { parentPinSchema } from "@/lib/schemas";
import { db } from "./db";
import { PIN_LIMIT, attemptsLeft, isLimited, recordFailure, resetFailures, secondsLeft } from "./rate-limit";
import { verifyUserPassword } from "./users";

// Kiểm "PIN hoặc mật khẩu của bố mẹ" (PRD D1), dùng chung cho cổng bố mẹ, màn Hết giờ học (thêm giờ) và Cài đặt.
// Sai 5 lần thì khóa 5 phút theo tài khoản, đếm ở server (bộ nhớ tiến trình) nên tải lại trang vẫn bị khóa.

export type ParentSecretMethod = "pin" | "password";

export type ParentSecretResult = { ok: true } | { ok: false; message: string; /** Số lần thử còn lại; 0 là đang bị khóa. */ remaining?: number };

export const TOO_MANY_ATTEMPTS = "Đã thử nhiều lần rồi. Bố mẹ nghỉ vài phút rồi thử lại nhé.";
export const WRONG_SECRET = "PIN hoặc mật khẩu chưa đúng. Bố mẹ thử lại nhé!";

const keyOf = (userId: number) => `pin:${userId}`;

function lockedMessage(userId: number): string {
  const minutes = Math.max(1, Math.ceil(secondsLeft(keyOf(userId)) / 60));
  return `Đã nhập sai nhiều lần. Khu bố mẹ khóa tạm, thử lại sau khoảng ${minutes} phút.`;
}

/**
 * Kiểm PIN hoặc mật khẩu. `method` giới hạn cách kiểm ("pin": chỉ PIN, "password": chỉ mật khẩu tài khoản);
 * bỏ trống thì nhận cả hai (màn thêm giờ ở khu của bé).
 */
export async function checkParentSecret(userId: number, secret: unknown, method?: ParentSecretMethod): Promise<ParentSecretResult> {
  const parsed = z.string().min(1).max(72).safeParse(secret);
  if (!parsed.success) return { ok: false, message: method === "pin" ? "Nhập mã PIN của bố mẹ." : method === "password" ? "Nhập mật khẩu tài khoản gia đình." : "Nhập PIN hoặc mật khẩu của bố mẹ." };

  const key = keyOf(userId);
  if (isLimited(key, PIN_LIMIT.max)) return { ok: false, message: lockedMessage(userId), remaining: 0 };

  let ok = false;
  if (method !== "password") {
    const row = await db.user.findUnique({ where: { id: userId }, select: { parentPin: true } });
    if (row?.parentPin && parentPinSchema.safeParse(parsed.data).success) ok = await bcrypt.compare(parsed.data, row.parentPin);
  }
  if (!ok && method !== "pin") ok = await verifyUserPassword(userId, parsed.data);

  if (!ok) {
    recordFailure(key, PIN_LIMIT.windowMs);
    const remaining = attemptsLeft(key, PIN_LIMIT.max);
    if (remaining === 0) return { ok: false, message: lockedMessage(userId), remaining };
    const what = method === "pin" ? "Mã PIN" : method === "password" ? "Mật khẩu" : "PIN hoặc mật khẩu";
    return { ok: false, message: `${what} chưa đúng. Còn ${remaining} lần thử trước khi khóa 5 phút.`, remaining };
  }
  resetFailures(key);
  return { ok: true };
}
