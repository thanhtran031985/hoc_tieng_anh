import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/session";

// Trang gốc chỉ chuyển hướng: đã đăng nhập thì chọn hồ sơ, chưa thì đăng nhập.
export default async function RootPage() {
  redirect((await getSessionUser()) ? "/profiles" : "/login");
}
