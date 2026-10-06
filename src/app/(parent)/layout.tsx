import { Suspense } from "react";
import { AdultArea, ToastProvider } from "@/components/adult";
import { LogoutIconButton } from "@/features/auth/LogoutIconButton";
import { toHair } from "@/features/kid/learner-art";
import { lockParentAreaAction } from "@/features/parent/actions";
import { ParentFrame } from "@/features/parent/ParentFrame";
import { listLearners } from "@/server/learners";
import { requireParentGate } from "@/server/parent-gate";

// Khu vực bố mẹ: phải đăng nhập và đã mở khóa bằng PIN (hoặc mật khẩu) trong 15 phút gần đây (không thì về /parent/unlock).
// Khung (menu, thanh trên, chọn con) nằm ở đây để giữ nguyên khi đổi trang; danh sách con chỉ gồm hồ sơ của tài khoản này.
export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireParentGate();
  const learners = await listLearners(user.id);
  const kids = learners.map((l) => ({ id: l.id, name: l.name, grade: l.schoolGrade, level: l.currentLevel?.number ?? 1, hair: toHair(l.avatar) }));
  return (
    <AdultArea>
      <ToastProvider>
        <Suspense>
          <ParentFrame user={{ name: user.name, isAdmin: user.role === "admin" }} kids={kids} onLock={lockParentAreaAction} logout={<LogoutIconButton />}>
            {children}
          </ParentFrame>
        </Suspense>
      </ToastProvider>
    </AdultArea>
  );
}
