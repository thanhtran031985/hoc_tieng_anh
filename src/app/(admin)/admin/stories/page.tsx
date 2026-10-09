import type { Metadata } from "next";
import { StoriesView } from "@/features/admin/StoriesView";
import { requireAdmin } from "@/server/admin-gate";
import { getStoryList } from "@/server/admin/stories";

export const metadata: Metadata = { title: "Truyện tranh — Quản trị" };

// Danh sách truyện tranh (Adult19): tìm, lọc theo cấp và trạng thái, thêm truyện mới rồi mở màn soạn.
export default async function AdminStoriesPage() {
  await requireAdmin();
  return <StoriesView data={await getStoryList()} />;
}
