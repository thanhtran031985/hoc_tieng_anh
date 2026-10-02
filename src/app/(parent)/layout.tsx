import { requireParentGate } from "@/server/parent-gate";

// Khu vực bố mẹ: phải đăng nhập và đã mở khóa bằng PIN (hoặc mật khẩu) trong 15 phút gần đây.
export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  await requireParentGate();
  return children;
}
