import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata: Metadata = { title: "Đăng nhập — Học cùng Bông" };

export default function LoginPage() {
  return <LoginForm />;
}
