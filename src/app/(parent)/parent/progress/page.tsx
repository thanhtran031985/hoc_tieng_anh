import type { Metadata } from "next";
import { NoKids } from "@/features/parent/OverviewView";
import { ProgressView } from "@/features/parent/ProgressView";
import { pickKidId } from "@/features/parent/kid-select";
import { listLearners } from "@/server/learners";
import { requireParentGate } from "@/server/parent-gate";
import { getProgressTree } from "@/server/parent-progress";

export const metadata: Metadata = { title: "Tiến độ & mở khóa — Khu bố mẹ" };

// Tiến độ của một bé và mở khóa thủ công (chọn bằng ?kid=). Danh sách con chỉ gồm hồ sơ của tài khoản; id lạ thì dùng con đầu tiên.
export default async function ParentProgressPage({ searchParams }: { searchParams: Promise<{ kid?: string | string[] }> }) {
  const user = await requireParentGate();
  const learners = await listLearners(user.id);
  const kidId = pickKidId(learners, (await searchParams).kid);
  if (kidId === null) return <NoKids />;
  return <ProgressView key={kidId} data={await getProgressTree(user.id, kidId)} />;
}
