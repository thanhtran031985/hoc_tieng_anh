import type { Metadata } from "next";
import { MediaView } from "@/features/admin/MediaView";
import { requireAdmin } from "@/server/admin-gate";
import { getLibrary } from "@/server/admin/media";

export const metadata: Metadata = { title: "Hình ảnh & âm thanh — Quản trị" };

// Thư viện hình và âm thanh (Adult13): tải hình lên, tìm, lọc "Từ chưa có hình", gán hình cho từ; tab âm thanh.
export default async function AdminMediaPage() {
  await requireAdmin();
  return <MediaView data={await getLibrary()} />;
}
