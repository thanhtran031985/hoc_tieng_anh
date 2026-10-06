import type { Metadata } from "next";
import { LessonListView } from "@/features/admin/LessonListView";
import { requireAdmin } from "@/server/admin-gate";
import { getLessonList } from "@/server/admin/builder";

export const metadata: Metadata = { title: "Soạn bài học — Quản trị" };

// Chọn bài cần soạn (Adult12): danh sách mọi bài học, tìm và lọc theo cấp / trạng thái.
export default async function AdminBuilderListPage() {
  await requireAdmin();
  return <LessonListView rows={await getLessonList()} />;
}
