import { notFound, redirect } from "next/navigation";
import { isParentGateOpen } from "./parent-gate";
import { getSessionUser, requireUser, type SessionUser } from "./session";

/**
 * Cửa vào của khu quản trị nội dung: dùng ở layout, trang, server action và route handler của nhóm `(admin)`.
 * Thứ tự kiểm: đăng nhập → role `admin` (tài khoản `parent` luôn thấy 404) → cổng bố mẹ còn mở
 * (chưa mở thì về /profiles; muốn vào phải qua khu bố mẹ nhập PIN trước, nên bé gõ /admin trên máy đang đăng nhập không vào được).
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") notFound();
  if (!(await isParentGateOpen(user.id))) redirect("/profiles");
  return user;
}

/** Như `requireAdmin` nhưng không chuyển trang: trả null nếu không đủ quyền. Dùng ở route handler (trả mã lỗi thay vì chuyển hướng). */
export async function getAdminOrNull(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return null;
  return (await isParentGateOpen(user.id)) ? user : null;
}
