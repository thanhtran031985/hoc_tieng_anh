import { notFound } from "next/navigation";
import { AdultArea, AdultShell, ToastProvider } from "@/components/adult";
import { KitDemo } from "./kit-demo";

// Trang xem bộ thành phần khu người lớn (chỉ chạy khi phát triển, không cần đăng nhập). Dữ liệu là mẫu, không đọc database.

const KIDS = [
  { id: 1, name: "Minh", grade: 3, level: 2, hair: "short" as const },
  { id: 2, name: "Khánh Linh", grade: 8, level: 8, hair: "bob" as const },
];

async function lock() {
  "use server";
}

export default function AdultKitPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <AdultArea>
      <ToastProvider>
        <AdultShell
          area="parent"
          active="overview"
          title="Bộ thành phần khu người lớn"
          crumb="Trang thử · dữ liệu mẫu"
          kids={{ list: KIDS, selectedId: 1 }}
          user={{ name: "Chị Hương", isAdmin: true }}
          onLock={lock}
          logout={null}
        >
          <KitDemo />
        </AdultShell>
      </ToastProvider>
    </AdultArea>
  );
}
