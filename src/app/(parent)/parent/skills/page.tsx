import type { Metadata } from "next";
import { NoKids } from "@/features/parent/OverviewView";
import { SkillsView } from "@/features/parent/SkillsView";
import { pickKidId } from "@/features/parent/kid-select";
import { listLearners } from "@/server/learners";
import { requireParentGate } from "@/server/parent-gate";
import { getSkills, parseRange } from "@/server/reports/skills";

export const metadata: Metadata = { title: "Kỹ năng — Khu bố mẹ" };

// Kỹ năng của một bé (chọn bằng ?kid=, khoảng 7 hoặc 30 ngày bằng ?days=). Danh sách con chỉ gồm hồ sơ của tài khoản; id lạ thì dùng con đầu tiên.
export default async function ParentSkillsPage({ searchParams }: { searchParams: Promise<{ kid?: string | string[]; days?: string | string[] }> }) {
  const user = await requireParentGate();
  const learners = await listLearners(user.id);
  const params = await searchParams;
  const kidId = pickKidId(learners, params.kid);
  if (kidId === null) return <NoKids />;
  return <SkillsView key={`${kidId}-${parseRange(params.days)}`} data={await getSkills(user.id, kidId, parseRange(params.days))} />;
}
