import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/RegisterForm";

export const metadata: Metadata = { title: "Tạo tài khoản — Học cùng Bông" };

export default function RegisterPage() {
  return <RegisterForm />;
}
