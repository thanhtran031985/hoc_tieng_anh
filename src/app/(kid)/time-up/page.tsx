import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { toMascotColor } from "@/features/kid/learner-art";
import { TimeUpView } from "@/features/time-up/TimeUpView";
import { requireActiveLearner } from "@/server/active-learner";
import { requireUser } from "@/server/session";
import { getStudyStatusFor, getTimeUpSummary, type TimeUpSummary } from "@/server/study-time";

export const metadata: Metadata = { title: "Hết giờ học — Học cùng Bông" };

// Màn Hết giờ học. Chưa hết giờ thì về trang chủ. Tóm tắt hôm nay lỗi thì vẫn hiện lời chúc ngủ ngon (có nút Thử lại).
export default async function TimeUpPage() {
  const user = await requireUser();
  const learner = await requireActiveLearner({ allowTimeUp: true });
  if (!(await getStudyStatusFor(learner)).exhausted) redirect("/home");
  let summary: TimeUpSummary | null = null;
  try {
    summary = await getTimeUpSummary(user.id, learner.id);
  } catch {
    summary = null;
  }
  return <TimeUpView name={learner.name} mascot={toMascotColor(learner.mascot)} summary={summary} />;
}
