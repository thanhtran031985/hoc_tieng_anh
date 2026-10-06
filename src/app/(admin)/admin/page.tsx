import type { Metadata } from "next";
import { DashboardView } from "@/features/admin/DashboardView";
import { requireAdmin } from "@/server/admin-gate";
import { getDashboard } from "@/server/admin/dashboard";

export const metadata: Metadata = { title: "Bảng điều khiển — Quản trị" };

// Bảng điều khiển nội dung (Adult08): số liệu theo cấp, cảnh báo nội dung còn thiếu, chủ đề chưa có bài, độ phủ hình/âm thanh.
export default async function AdminDashboardPage() {
  await requireAdmin();
  return <DashboardView data={await getDashboard()} />;
}
