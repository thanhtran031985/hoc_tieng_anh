import type { Metadata } from "next";
import { NoKids } from "@/features/parent/OverviewView";
import { WorksView } from "@/features/parent/WorksView";
import { pickKidId } from "@/features/parent/kid-select";
import { listLearners } from "@/server/learners";
import { requireParentGate } from "@/server/parent-gate";
import { listRecordings } from "@/server/recordings";

export const metadata: Metadata = { title: "Bài viết & ghi âm — Khu bố mẹ" };

// Bản ghi âm giọng nói của một bé (chọn bằng ?kid=). Chỉ gồm hồ sơ của tài khoản đang đăng nhập; id lạ thì dùng con đầu tiên.
export default async function ParentWorksPage({ searchParams }: { searchParams: Promise<{ kid?: string | string[] }> }) {
  const user = await requireParentGate();
  const learners = await listLearners(user.id);
  const kidId = pickKidId(learners, (await searchParams).kid);
  const kid = learners.find((l) => l.id === kidId);
  if (!kid) return <NoKids />;
  const recordings = await listRecordings(user.id, kid.id);
  return <WorksView key={kid.id} kidName={kid.name} recordings={recordings} now={new Date().toISOString()} />;
}
