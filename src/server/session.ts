import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "./db";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "parent";
  hasParentPin: boolean;
};

/** Người dùng đang đăng nhập, đọc lại từ database (tài khoản đã xóa hoặc đổi vai trò có hiệu lực ngay). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  const id = Number(session?.user?.id);
  if (!session?.user || !Number.isInteger(id)) return null;
  const user = await db.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true, parentPin: true } });
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role, hasParentPin: user.parentPin !== null };
}

/** Dùng ở đầu layout, trang và server action cần đăng nhập. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    // Có cookie nhưng tài khoản không còn: về /login thẳng sẽ lặp vô tận (proxy thấy cookie và đẩy lại), nên xóa cookie trước.
    const session = await auth();
    redirect(session?.user ? "/session-expired" : "/login");
  }
  return user;
}

/** Khu quản trị nội dung chỉ cho role admin; người khác thấy trang không tồn tại. */
export async function requireRole(role: "admin" | "parent"): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== role) notFound();
  return user;
}
