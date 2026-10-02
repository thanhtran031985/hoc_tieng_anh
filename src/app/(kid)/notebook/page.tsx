import type { Metadata } from "next";
import { toMascotColor, topbarProps } from "@/features/kid/learner-art";
import { NotebookView } from "@/features/notebook/NotebookView";
import { requireActiveLearner } from "@/server/active-learner";
import { getNotebook } from "@/server/notebook";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "Sổ từ — Học cùng Bông" };

// Sổ từ của bé. getNotebook đi qua requireLearner nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập.
export default async function NotebookPage() {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const notebook = await getNotebook(user.id, learner.id);
  return <NotebookView topbar={topbarProps(learner)} learnerName={learner.name} mascot={toMascotColor(learner.mascot)} notebook={notebook} />;
}
