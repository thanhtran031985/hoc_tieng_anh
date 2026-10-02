import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

// Chuyển hướng cho tiện: chưa đăng nhập thì về /login, đã đăng nhập thì khỏi vào /login, /register.
// Phân quyền thật nằm ở server (requireUser, requireRole, requireActiveLearner), không dựa vào file này.
const { auth } = NextAuth(authConfig);

const PROTECTED = ["/profiles", "/home", "/parent", "/admin"];
const AUTH_PAGES = ["/login", "/register"];

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const loggedIn = Boolean(request.auth);
  if (loggedIn && AUTH_PAGES.includes(pathname)) return NextResponse.redirect(new URL("/profiles", request.url));
  if (!loggedIn && PROTECTED.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
});

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"] };
