import { Suspense } from "react";
import { AdultArea, ToastProvider } from "@/components/adult";
import { LogoutIconButton } from "@/features/auth/LogoutIconButton";
import { AdminFrame } from "@/features/admin/AdminFrame";
import { lockParentAreaAction } from "@/features/parent/actions";
import { requireAdmin } from "@/server/admin-gate";

// Khu quản trị nội dung: chỉ role admin và phải đã mở cổng bố mẹ (PIN) trong 15 phút gần đây.
// Server action và route handler của nhóm này cũng gọi `requireAdmin()` ở dòng đầu, không dựa vào layout.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <AdultArea>
      <ToastProvider>
        <Suspense>
          <AdminFrame user={{ name: user.name, isAdmin: true }} onLock={lockParentAreaAction} logout={<LogoutIconButton />}>
            {children}
          </AdminFrame>
        </Suspense>
      </ToastProvider>
    </AdultArea>
  );
}
