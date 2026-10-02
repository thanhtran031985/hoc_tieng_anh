import type { Metadata } from "next";
import { toMascotColor, topbarProps } from "@/features/kid/learner-art";
import { ReviewFlow } from "@/features/review/ReviewFlow";
import { requireActiveLearner } from "@/server/active-learner";
import { getReviewOverview, getReviewPlay } from "@/server/review";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "Ôn tập — Học cùng Bông" };

// Ôn tập hôm nay. Cả hai hàm đi qua requireLearner nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập.
export default async function ReviewPage() {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const [overview, plan] = await Promise.all([getReviewOverview(user.id, learner.id), getReviewPlay(user.id, learner.id)]);
  // Số từ đến hạn lấy theo phiên thật sự chơi được (từ không dựng được câu hỏi không tính).
  const sessionCount = plan.words.length;
  return (
    <ReviewFlow
      overview={{ ...overview, sessionCount }}
      plan={plan}
      learnerId={learner.id}
      learnerName={learner.name}
      mascot={toMascotColor(learner.mascot)}
      topbar={topbarProps(learner)}
    />
  );
}
