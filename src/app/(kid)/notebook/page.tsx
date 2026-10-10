import type { Metadata } from "next";
import { toMascotColor, topbarProps } from "@/features/kid/learner-art";
import { NotebookView } from "@/features/notebook/NotebookView";
import { requireActiveLearner } from "@/server/active-learner";
import { getNotebook } from "@/server/notebook";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "Sổ từ — Học cùng Bông" };

// Sổ từ của bé (?word=ID&tab=explore mở sẵn thẻ phóng to). getNotebook đi qua requireLearner nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập.
export default async function NotebookPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const wordId = Number(pick(query.word));
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const notebook = await getNotebook(user.id, learner.id);
  // ?word=ID&tab=explore: quay về thẻ phóng to của từ (sau khi đóng màn Khám phá đầy đủ).
  const initialZoom = Number.isInteger(wordId) && wordId > 0 ? { wordId, tab: pick(query.tab) === "explore" ? ("explore" as const) : ("card" as const) } : undefined;
  return <NotebookView topbar={topbarProps(learner)} learnerName={learner.name} mascot={toMascotColor(learner.mascot)} notebook={notebook} initialZoom={initialZoom} />;
}
