import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintExplorer } from "@/features/word-explorer/PrintExplorer";
import { APP_TIME_ZONE } from "@/lib/rules/dates";
import { requireActiveLearner } from "@/server/active-learner";
import { requireUser } from "@/server/session";
import { getExplorerPrint } from "@/server/word-explorer";

export const metadata: Metadata = { title: "In Khám phá từ — Học cùng Bông" };

const printDate = () => new Intl.DateTimeFormat("vi-VN", { timeZone: APP_TIME_ZONE, day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date());

// Bản in Khám phá từ (?translate=1 in kèm bản dịch). getExplorerPrint đi qua requireLearner nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập;
// chỉ bản đã xuất bản mới in được, từ chưa có thì hiện trang trống.
export default async function ExplorerPrintPage({ params, searchParams }: { params: Promise<{ wordId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ wordId: idParam }, query] = await Promise.all([params, searchParams]);
  const wordId = Number(idParam);
  if (!Number.isInteger(wordId) || wordId < 1) notFound();

  const user = await requireUser();
  const learner = await requireActiveLearner();
  const data = await getExplorerPrint(user.id, learner.id, wordId);
  if (!data) notFound();

  const { content } = data;
  return (
    <PrintExplorer
      header={{ learnerName: data.learnerName, grade: data.grade, levelLabel: data.levelLabel, topicLabel: data.topicLabel, date: printDate() }}
      word={data.word}
      branches={content ? content.branches.map((b) => ({ questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers.map((a) => ({ text: a.text, textVi: a.textVi, image: a.image ?? null })) })) : null}
      sentences={content?.reading.sentences ?? []}
      initialTranslate={query.translate === "1"}
      backHref={`/explore/${wordId}`}
    />
  );
}
