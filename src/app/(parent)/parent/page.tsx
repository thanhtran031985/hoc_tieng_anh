import type { Metadata } from "next";
import { NoKids, OverviewView } from "@/features/parent/OverviewView";
import { pickKidId } from "@/features/parent/kid-select";
import { listLearners } from "@/server/learners";
import { requireParentGate } from "@/server/parent-gate";
import { getOverview } from "@/server/reports/overview";

export const metadata: Metadata = { title: "Tổng quan — Khu bố mẹ" };

// Tổng quan học tập của một bé (chọn bằng ?kid=). Danh sách con chỉ gồm hồ sơ của tài khoản; id lạ thì dùng con đầu tiên.
export default async function ParentOverviewPage({ searchParams }: { searchParams: Promise<{ kid?: string | string[] }> }) {
  const user = await requireParentGate();
  const learners = await listLearners(user.id);
  const kidId = pickKidId(learners, (await searchParams).kid);
  if (kidId === null) return <NoKids />;
  return <OverviewView key={kidId} data={await getOverview(user.id, kidId)} />;
}
