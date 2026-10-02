import type { NextAuthConfig } from "next-auth";

// Cấu hình NextAuth không đụng tới database, dùng chung cho `proxy.ts` và `auth.ts`.
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export const authConfig = {
  pages: { signIn: "/login" },
  // Chỉ dùng Credentials (không OAuth, không gửi email) nên không phụ thuộc tiêu đề Host; nhờ vậy `npm start` trên máy hoặc sau proxy của hosting chạy ngay.
  // Khi deploy vẫn nên đặt AUTH_URL đúng origin (xem .env.example).
  trustHost: true,
  // Phiên JWT 30 ngày chính là "nhớ đăng nhập".
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.userId = Number(user.id);
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = String(token.userId);
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
