import { MascotStageProvider } from "@/components/ui";
import { StudyClock } from "@/features/study-clock/StudyClock";
import { stageForLevel } from "@/lib/rules/mascot-stage";
import { getActiveLearner } from "@/server/active-learner";
import { requireUser } from "@/server/session";

// Mọi trang của bé cần đăng nhập tài khoản gia đình; trang cần hồ sơ đang chọn tự gọi requireActiveLearner().
// StudyClock đo giờ học và đưa bé về màn Hết giờ học khi hết thời lượng bố mẹ đặt.
// MascotStageProvider: rồng Bông ở mọi màn của bé có dáng theo cấp hiện tại của hồ sơ đang chọn (chưa chọn hồ sơ thì giữ dáng gốc).
export default async function KidLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  const learner = await getActiveLearner();
  return (
    <MascotStageProvider stage={learner?.currentLevel ? stageForLevel(learner.currentLevel.number) : undefined}>
      <StudyClock>{children}</StudyClock>
    </MascotStageProvider>
  );
}
