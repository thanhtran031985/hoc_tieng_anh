import type { Metadata } from "next";
import { toMascotColor, topbarProps } from "@/features/kid/learner-art";
import { ShopView } from "@/features/shop/ShopView";
import { requireActiveLearner } from "@/server/active-learner";
import { requireUser } from "@/server/session";
import { getShop } from "@/server/shop";

export const metadata: Metadata = { title: "Cửa hàng — Học cùng Bông" };

// Cửa hàng của bé. getShop đi qua requireLearner nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập; mua đồ đi qua server action có kiểm xu.
export default async function ShopPage() {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const data = await getShop(user.id, learner.id);
  return <ShopView topbar={topbarProps(learner)} mascot={toMascotColor(learner.mascot)} data={data} />;
}
