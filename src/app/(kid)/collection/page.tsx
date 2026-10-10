import type { Metadata } from "next";
import { CollectionView, type CollectionTab } from "@/features/collection/CollectionView";
import { toMascotColor, topbarProps } from "@/features/kid/learner-art";
import { requireActiveLearner } from "@/server/active-learner";
import { getCollection } from "@/server/collection";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "Bộ sưu tập — Học cùng Bông" };

// Bộ sưu tập sticker và huy hiệu của bé. getCollection đi qua requireLearner nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập.
export default async function CollectionPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const data = await getCollection(user.id, learner.id);
  const initialTab: CollectionTab = tab === "badges" ? "badges" : "stickers";
  return <CollectionView topbar={topbarProps(learner)} mascot={toMascotColor(learner.mascot)} data={data} initialTab={initialTab} />;
}
