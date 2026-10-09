import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryEditorView } from "@/features/admin/StoryEditorView";
import { requireAdmin } from "@/server/admin-gate";
import { getStoryEditor } from "@/server/admin/stories";

export const metadata: Metadata = { title: "Soạn truyện tranh — Quản trị" };

// Soạn một truyện tranh (Adult19): danh sách trang, sửa trang, thông tin truyện, xem trước.
export default async function AdminStoryEditorPage({ params }: { params: Promise<{ storyId: string }> }) {
  await requireAdmin();
  const { storyId } = await params;
  const data = /^\d+$/.test(storyId) ? await getStoryEditor(Number(storyId)) : null;
  if (!data) notFound();
  return <StoryEditorView data={data} />;
}
