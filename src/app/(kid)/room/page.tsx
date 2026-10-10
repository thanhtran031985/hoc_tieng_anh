import type { Metadata } from "next";
import { toMascotColor, topbarProps } from "@/features/kid/learner-art";
import { RoomView } from "@/features/room/RoomView";
import { requireActiveLearner } from "@/server/active-learner";
import { getRoom } from "@/server/room";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "Phòng của tớ — Học cùng Bông" };

// Phòng của tớ. getRoom đi qua requireLearner nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập; đặt, cất và mặc đồ đi qua server action.
export default async function RoomPage() {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const data = await getRoom(user.id, learner.id);
  return <RoomView topbar={topbarProps(learner)} mascot={toMascotColor(learner.mascot)} data={data} />;
}
