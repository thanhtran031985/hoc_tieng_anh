import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PARENT_GATE_COOKIE } from "./cookies";
import { requireUser, type SessionUser } from "./session";
import { signValue, verifyValue } from "./signed-cookie";

// Cổng bố mẹ: sau khi nhập đúng PIN (hoặc mật khẩu) server đặt cookie httpOnly có ký "<userId>.<hết hạn>" sống 15 phút.
// Trang của bố mẹ luôn kiểm cookie này ở server; hết hạn thì phải mở khóa lại.

export const PARENT_GATE_MINUTES = 15;

export async function openParentGate(userId: number): Promise<void> {
  const expiresAt = Date.now() + PARENT_GATE_MINUTES * 60 * 1000;
  (await cookies()).set(PARENT_GATE_COOKIE, signValue(`${userId}.${expiresAt}`), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PARENT_GATE_MINUTES * 60,
  });
}

export async function closeParentGate(): Promise<void> {
  (await cookies()).delete(PARENT_GATE_COOKIE);
}

/** Cổng đang mở cho đúng tài khoản này và chưa hết hạn? */
export async function isParentGateOpen(userId: number): Promise<boolean> {
  const payload = verifyValue((await cookies()).get(PARENT_GATE_COOKIE)?.value);
  const match = payload?.match(/^(\d+)\.(\d+)$/);
  return Boolean(match) && Number(match![1]) === userId && Number(match![2]) > Date.now();
}

/** Dùng ở đầu mọi trang của bố mẹ: chưa mở khóa thì về cổng vào khu bố mẹ (/parent/unlock). */
export async function requireParentGate(): Promise<SessionUser> {
  const user = await requireUser();
  if (!(await isParentGateOpen(user.id))) redirect("/parent/unlock");
  return user;
}
