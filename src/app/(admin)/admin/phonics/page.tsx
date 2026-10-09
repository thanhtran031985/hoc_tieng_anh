import type { Metadata } from "next";
import { PhonicsView } from "@/features/admin/PhonicsView";
import { requireAdmin } from "@/server/admin-gate";
import { getPhonics } from "@/server/admin/phonics";

export const metadata: Metadata = { title: "Âm phonics — Quản trị" };

// Âm phonics (Adult20): bảng 36 âm, tải tệp ghi âm lên hoặc tạo âm thanh tự động, lọc âm còn thiếu.
export default async function AdminPhonicsPage() {
  await requireAdmin();
  return <PhonicsView data={await getPhonics()} />;
}
