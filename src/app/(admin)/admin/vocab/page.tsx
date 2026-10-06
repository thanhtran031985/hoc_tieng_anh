import type { Metadata } from "next";
import { VocabView } from "@/features/admin/VocabView";
import { requireAdmin } from "@/server/admin-gate";
import { getVocab } from "@/server/admin/vocab";

export const metadata: Metadata = { title: "Ngân hàng từ vựng — Quản trị" };

// Ngân hàng từ vựng (Adult10): tìm, lọc theo cấp / chủ đề / thiếu hình–âm, sắp xếp, phân trang; sửa và thêm từ trong ngăn kéo.
export default async function AdminVocabPage() {
  await requireAdmin();
  return <VocabView data={await getVocab()} />;
}
