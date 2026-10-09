import type { Metadata } from "next";
import { QuestionTypesView } from "@/features/admin/QuestionTypesView";
import { requireAdmin } from "@/server/admin-gate";
import { getExtraQuestions } from "@/server/admin/question-types";

export const metadata: Metadata = { title: "Câu hỏi dạng mới — Quản trị" };

// Câu hỏi dạng mới (Adult18): ghép âm, sắp xếp câu, nghe và gõ, điền từ. Thêm nhanh theo dạng, bảng có tìm và lọc, ngăn kéo soạn, xem như học sinh.
export default async function AdminQuestionTypesPage() {
  await requireAdmin();
  return <QuestionTypesView data={await getExtraQuestions()} />;
}
