"use client";

import { useState } from "react";
import type { MascotColor } from "@/components/ui";
import type { KidTopbarProps } from "@/features/kid/KidTopbar";
import type { ReviewOverview, ReviewPlay } from "@/server/review";
import { ReviewPlayer } from "./ReviewPlayer";
import { ReviewStart } from "./ReviewStart";

type Props = {
  overview: ReviewOverview;
  plan: ReviewPlay;
  learnerId: number;
  learnerName: string;
  mascot: MascotColor;
  topbar: KidTopbarProps;
};

/** Ôn tập hôm nay: màn bắt đầu (Screen19) rồi các câu hỏi và màn tổng kết (Screen20). */
export function ReviewFlow({ overview: overviewNow, plan: planNow, learnerId, learnerName, mascot, topbar }: Props) {
  // Giữ bộ câu hỏi lúc mở trang: sau khi lưu kết quả, trang tải lại (để thanh trên cùng có số mới) nhưng từ vừa ôn không còn đến hạn nữa.
  const [{ overview, plan }] = useState({ overview: overviewNow, plan: planNow });
  const [playing, setPlaying] = useState(false);
  if (playing && plan.steps.length > 0) return <ReviewPlayer plan={plan} learnerId={learnerId} learnerName={learnerName} mascot={mascot} topbar={topbar} />;
  return <ReviewStart topbar={topbar} learnerName={learnerName} mascot={mascot} overview={overview} onStart={() => setPlaying(true)} />;
}
