import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { toMascotColor } from "@/features/kid/learner-art";
import { OutsideHoursView } from "@/features/outside-hours/OutsideHoursView";
import { requireActiveLearner } from "@/server/active-learner";
import { getOutsideHours, type OutsideHoursData } from "@/server/study-time";

export const metadata: Metadata = { title: "Chưa đến giờ học — Học cùng Bông" };

// Màn Chưa đến giờ học. Đang trong khung giờ (hoặc bố mẹ đang mở tạm) thì về trang chủ. Lịch lỗi thì vẫn hiện lời Bông, có nút Thử lại và Bố mẹ mở.
export default async function OutsideHoursPage() {
  const learner = await requireActiveLearner({ allowTimeUp: true });
  let data: OutsideHoursData | null = null;
  let failed = false;
  try {
    data = getOutsideHours(learner);
  } catch {
    failed = true;
  }
  if (!failed && !data) redirect("/home");
  return <OutsideHoursView name={learner.name} mascot={toMascotColor(learner.mascot)} data={data} />;
}
