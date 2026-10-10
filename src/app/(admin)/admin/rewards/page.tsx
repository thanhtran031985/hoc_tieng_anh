import type { Metadata } from "next";
import { RewardsView } from "@/features/admin/RewardsView";
import { requireAdmin } from "@/server/admin-gate";
import { getRewards } from "@/server/admin/rewards";

export const metadata: Metadata = { title: "Phần thưởng — Quản trị" };

// Danh mục phần thưởng (Adult21): bảng Sticker và Huy hiệu có tìm, lọc, sắp xếp, phân trang; sửa và thêm trong ngăn kéo.
export default async function AdminRewardsPage() {
  await requireAdmin();
  return <RewardsView data={await getRewards()} />;
}
