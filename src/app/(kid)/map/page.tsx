import { redirect } from "next/navigation";
import { requireActiveLearner } from "@/server/active-learner";

// Nút "Bản đồ" ở trang chủ: đi tới bản đồ của cấp hiện tại của bé.
export default async function MapIndexPage() {
  const learner = await requireActiveLearner();
  redirect(`/map/${learner.currentLevel?.number ?? 1}`);
}
