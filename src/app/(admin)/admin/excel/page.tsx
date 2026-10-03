import type { Metadata } from "next";
import { ExcelView } from "@/features/admin/ExcelView";
import { requireAdmin } from "@/server/admin-gate";
import { getExcelPage } from "@/server/admin/excel";

export const metadata: Metadata = { title: "Nhập & xuất Excel — Quản trị" };

// Nhập & xuất Excel (Adult14): tệp mẫu, xem trước báo lỗi từng dòng, lưu khi hết lỗi; xuất theo cấp, trạng thái, cột.
export default async function AdminExcelPage() {
  await requireAdmin();
  return <ExcelView data={await getExcelPage()} />;
}
