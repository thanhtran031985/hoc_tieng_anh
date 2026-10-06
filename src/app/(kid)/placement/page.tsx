import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { toMascotColor, topbarProps } from "@/features/kid/learner-art";
import { PlacementFlow } from "@/features/placement/PlacementFlow";
import { requireActiveLearner } from "@/server/active-learner";
import { getPlacementSetup } from "@/server/placement";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "Bài xếp lớp — Học cùng Bông" };

// Bài xếp lớp cho bé mới. getPlacementSetup đi qua requireLearner; bé đã học hoặc đã làm bài này rồi thì về trang chủ.
export default async function PlacementPage() {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const setup = await getPlacementSetup(user.id, learner.id);
  if (!setup) redirect("/home");
  return <PlacementFlow setup={setup} mascot={toMascotColor(learner.mascot)} learner={topbarProps(learner).learner} />;
}
