import type { Metadata } from "next";
import { FamiliesView } from "@/features/admin/FamiliesView";
import { requireAdmin } from "@/server/admin-gate";
import { getFamilyList } from "@/server/admin/family";

export const metadata: Metadata = { title: "Họ vần — Quản trị" };

// Họ vần (Adult23): bảng các họ vần, thêm và soạn trong ngăn kéo (từ cùng âm, Bẫy chính tả, chữ đầu nhiễu, đoạn văn vui, xuất bản).
export default async function AdminFamiliesPage() {
  await requireAdmin();
  return <FamiliesView data={await getFamilyList()} />;
}
