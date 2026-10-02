"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { parentPinSchema, setParentPinSchema } from "@/lib/schemas";
import { db } from "@/server/db";
import { openParentGate } from "@/server/parent-gate";
import { PIN_LIMIT, isLimited, recordFailure, resetFailures } from "@/server/rate-limit";
import { requireUser } from "@/server/session";
import { BCRYPT_COST, verifyUserPassword } from "@/server/users";

export type ParentGateResult = { ok: true } | { ok: false; message: string };

const TOO_MANY = "Đã thử nhiều lần rồi. Bố mẹ nghỉ vài phút rồi thử lại nhé.";
const WRONG = "PIN hoặc mật khẩu chưa đúng. Bố mẹ thử lại nhé!";

/** Mở khóa khu vực bố mẹ bằng PIN (4–6 số) hoặc mật khẩu tài khoản (PRD D1). Sai nhiều lần thì khóa tạm. */
export async function unlockParentAction(secret: unknown): Promise<ParentGateResult> {
  const user = await requireUser();
  const parsed = z.string().min(1).max(72).safeParse(secret);
  if (!parsed.success) return { ok: false, message: "Nhập PIN hoặc mật khẩu của bố mẹ." };

  const key = `pin:${user.id}`;
  if (isLimited(key, PIN_LIMIT.max)) return { ok: false, message: TOO_MANY };

  const row = await db.user.findUnique({ where: { id: user.id }, select: { parentPin: true } });
  let ok = false;
  if (row?.parentPin && parentPinSchema.safeParse(parsed.data).success) ok = await bcrypt.compare(parsed.data, row.parentPin);
  if (!ok) ok = await verifyUserPassword(user.id, parsed.data);

  if (!ok) {
    recordFailure(key, PIN_LIMIT.windowMs);
    return { ok: false, message: WRONG };
  }
  resetFailures(key);
  await openParentGate(user.id);
  return { ok: true };
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
