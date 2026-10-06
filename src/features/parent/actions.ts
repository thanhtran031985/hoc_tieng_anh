"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { setParentPinSchema } from "@/lib/schemas";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { closeParentGate, openParentGate } from "@/server/parent-gate";
import { TOO_MANY_ATTEMPTS, checkParentSecret } from "@/server/parent-secret";
import { PIN_LIMIT, isLimited, recordFailure, resetFailures } from "@/server/rate-limit";
import { requireUser } from "@/server/session";
import { BCRYPT_COST, verifyUserPassword } from "@/server/users";

export type ParentGateResult = { ok: true } | { ok: false; message: string; /** Số lần thử còn lại; 0 là đang bị khóa. */ remaining?: number };

const TOO_MANY = TOO_MANY_ATTEMPTS;

/**
 * Mở khóa khu vực bố mẹ bằng PIN (4–6 số) hoặc mật khẩu tài khoản (PRD D1), theo `method` bé chọn ở cổng.
 * Sai 5 lần thì khóa 5 phút (đếm ở server); kết quả báo số lần còn lại.
 */
export async function unlockParentAction(secret: unknown, method?: unknown): Promise<ParentGateResult> {
  const user = await requireUser();
  const chosen = method === "pin" || method === "password" ? method : undefined;
  const result = await checkParentSecret(user.id, secret, chosen);
  if (!result.ok) return result;
  await openParentGate(user.id);
  return { ok: true };
}

/** Khóa lại khu người lớn (đóng cổng) rồi về màn chọn hồ sơ. */
export async function lockParentAreaAction(): Promise<void> {
  await requireUser();
  await closeParentGate();
  redirect("/profiles");
}

/** Đặt PIN lần đầu: cần mật khẩu tài khoản (để bé không tự đặt PIN khi máy đang đăng nhập) và nhập PIN hai lần. Đổi PIN làm ở phần cài đặt (task 11). */
export async function setParentPinAction(input: unknown): Promise<ParentGateResult> {
  const user = await requireUser();
  const parsed = z.object({ password: z.string().min(1).max(72) }).and(setParentPinSchema).safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Thông tin chưa đúng" };

  const key = `pin:${user.id}`;
  if (isLimited(key, PIN_LIMIT.max)) return { ok: false, message: TOO_MANY };
  if (user.hasParentPin) return { ok: false, message: "Tài khoản đã có PIN rồi. Bố mẹ nhập PIN để mở khóa nhé." };

  if (!(await verifyUserPassword(user.id, parsed.data.password))) {
    recordFailure(key, PIN_LIMIT.windowMs);
    return { ok: false, message: "Mật khẩu tài khoản chưa đúng. Bố mẹ thử lại nhé!" };
  }
  resetFailures(key);
  await db.user.update({ where: { id: user.id }, data: { parentPin: await bcrypt.hash(parsed.data.pin, BCRYPT_COST) } });
  await openParentGate(user.id);
  return { ok: true };
}
