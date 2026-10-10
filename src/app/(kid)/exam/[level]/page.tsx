import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ExamGateClosedError, LevelLockedError, requireOpenExamGate } from "@/server/map";
import { requireActiveLearner } from "@/server/active-learner";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "Bài thi lên cấp — Học cùng Bông" };

// Bài thi lên cấp. Cổng khóa (còn vùng chưa xong) hoặc cấp không phải cấp bé đang học thì về bản đồ, kể cả khi gõ thẳng URL.
export default async function ExamPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: levelParam } = await params;
  const levelNumber = Number(levelParam);
  if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > 10) notFound();

  const user = await requireUser();
  const learner = await requireActiveLearner();
  try {
    await requireOpenExamGate(user.id, learner.id, levelNumber);
  } catch (error) {
    if (error instanceof ExamGateClosedError) redirect(`/map/${levelNumber}`);
    if (error instanceof LevelLockedError) redirect("/levels");
    throw error;
  }
  return <main>Bài thi lên cấp {levelNumber}</main>;
}
