import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSessionUser } from "@/server/session";

// Tên cookie phiên của Auth.js v5 (bản http và bản https), kèm các mảnh .0 .1 khi cookie quá dài.
const SESSION_COOKIES = ["authjs.session-token", "__Secure-authjs.session-token"];
const CHUNKS = ["", ".0", ".1", ".2"];

// Cookie đăng nhập còn hạn nhưng tài khoản đã không còn trong database (xóa tài khoản, làm mới database…).
// Phải xóa cookie rồi mới về /login, nếu không proxy thấy "đã đăng nhập" và đẩy ngược về /profiles, lặp mãi.
// Chỉ xóa đúng trường hợp này; ai gõ địa chỉ này khi cookie bình thường thì chỉ được chuyển hướng.
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.redirect(new URL("/login", request.url));
  if (await getSessionUser()) return NextResponse.redirect(new URL("/profiles", request.url));
  const response = NextResponse.redirect(new URL("/login", request.url));
  for (const name of SESSION_COOKIES) {
    for (const chunk of CHUNKS) response.cookies.set(`${name}${chunk}`, "", { path: "/", maxAge: 0, httpOnly: true, secure: name.startsWith("__Secure-") });
  }
  return response;
}
