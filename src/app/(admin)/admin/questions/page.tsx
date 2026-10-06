import type { Metadata } from "next";
import { QuestionsView } from "@/features/admin/QuestionsView";
import { requireAdmin } from "@/server/admin-gate";
import { getQuestions } from "@/server/admin/questions";

export const metadata: Metadata = { title: "Ngân hàng câu hỏi — Quản trị" };

// Ngân hàng câu hỏi (Adult11), dạng 8.2–8.4: tìm, lọc, sắp xếp, phân trang; thêm, sửa trong ngăn kéo; xem như học sinh.
export default async function AdminQuestionsPage() {
  await requireAdmin();
  return <QuestionsView data={await getQuestions()} />;
}
