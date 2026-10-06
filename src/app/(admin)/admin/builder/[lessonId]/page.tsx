import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuilderView } from "@/features/admin/BuilderView";
import { requireAdmin } from "@/server/admin-gate";
import { getBuilder } from "@/server/admin/builder";

export const metadata: Metadata = { title: "Soạn bài học — Quản trị" };

// Soạn một bài học (Adult12): gợi ý từ và câu hỏi, các bước kéo thả, thông tin bài, lưu và xem trước.
export default async function AdminBuilderPage({ params }: { params: Promise<{ lessonId: string }> }) {
  await requireAdmin();
  const { lessonId } = await params;
  const data = await getBuilder({ lessonId: Number(lessonId) });
  if (!data) notFound();
  return <BuilderView data={data} />;
}
