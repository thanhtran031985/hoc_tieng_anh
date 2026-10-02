import { AdultArea } from "@/components/adult";
import { requireUser } from "@/server/session";

// Cổng vào khu bố mẹ: cần đăng nhập tài khoản gia đình nhưng chưa cần mở khóa (đây chính là nơi mở khóa).
export default async function AdultGateLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <AdultArea>{children}</AdultArea>;
}
