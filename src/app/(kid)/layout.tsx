import { requireUser } from "@/server/session";

// Mọi trang của bé cần đăng nhập tài khoản gia đình; trang cần hồ sơ đang chọn tự gọi requireActiveLearner().
export default async function KidLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return children;
}
