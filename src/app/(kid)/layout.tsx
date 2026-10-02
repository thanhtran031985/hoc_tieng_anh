import { StudyClock } from "@/features/study-clock/StudyClock";
import { requireUser } from "@/server/session";

// Mọi trang của bé cần đăng nhập tài khoản gia đình; trang cần hồ sơ đang chọn tự gọi requireActiveLearner().
// StudyClock đo giờ học và đưa bé về màn Hết giờ học khi hết thời lượng bố mẹ đặt.
export default async function KidLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <StudyClock>{children}</StudyClock>;
}
