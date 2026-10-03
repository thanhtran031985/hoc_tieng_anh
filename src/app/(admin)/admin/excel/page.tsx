import type { Metadata } from "next";
import { ExcelView, type ExcelTab } from "@/features/admin/ExcelView";
import { requireAdmin } from "@/server/admin-gate";
import { getExcelPage } from "@/server/admin/excel";

export const metadata: Metadata = { title: "Nhập & xuất Excel — Quản trị" };

// Nhập & xuất Excel (Adult14): tệp mẫu, xem trước báo lỗi từng dòng, lưu khi hết lỗi; xuất theo cấp, trạng thái, cột.
export default async function AdminExcelPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  await requireAdmin();
  const { tab } = await searchParams;
  const initialTab: ExcelTab = tab === "topic" || tab === "exp" ? tab : "imp";
  return <ExcelView data={await getExcelPage()} initialTab={initialTab} />;
}
