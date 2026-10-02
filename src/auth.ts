import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { loginSchema } from "@/lib/schemas";
import { db } from "@/server/db";
import { LOGIN_LIMIT, isLimited, recordFailure, resetFailures } from "@/server/rate-limit";

/** Đăng nhập sai quá nhiều lần: khóa tạm. */
export class TooManyAttempts extends CredentialsSignin {
  code = "too_many_attempts";
}

// Băm giả để thời gian trả lời giống nhau dù email có tồn tại hay không.
const DUMMY_HASH = bcrypt.hashSync("không-phải-mật-khẩu-thật", 12);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const key = `login:${email}`;
        if (isLimited(key, LOGIN_LIMIT.max)) throw new TooManyAttempts();

        const user = await db.user.findUnique({ where: { email } });
        const ok = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
        if (!user || !ok) {
          recordFailure(key, LOGIN_LIMIT.windowMs);
          return null;
        }
        resetFailures(key);
        return { id: String(user.id), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
});
