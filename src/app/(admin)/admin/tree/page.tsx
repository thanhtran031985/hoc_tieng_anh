import type { Metadata } from "next";
import { TreeView } from "@/features/admin/TreeView";
import { requireAdmin } from "@/server/admin-gate";
import { getTree } from "@/server/admin/tree";

export const metadata: Metadata = { title: "Cấu trúc lộ trình — Quản trị" };

// Cây lộ trình (Adult09): Chặng → Cấp → Chủ đề → Bài học; sửa, thêm, xóa, kéo thả đổi thứ tự, Nháp / Đã xuất bản.
export default async function AdminTreePage() {
  await requireAdmin();
  return <TreeView data={await getTree()} />;
}
