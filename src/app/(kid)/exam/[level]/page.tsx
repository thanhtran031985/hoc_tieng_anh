import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { toHair, toMascotColor } from "@/features/kid/learner-art";
import { ExamFlow } from "@/features/exam/ExamFlow";
import { SoundProvider } from "@/features/sound/SoundProvider";
import { requireActiveLearner } from "@/server/active-learner";
import { getExamPage } from "@/server/exam";
import { getMusicSrc } from "@/server/music";
import { ExamGateClosedError, LevelLockedError } from "@/server/map";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "Bài thi lên cấp — Học cùng Bông" };

// Bài thi lên cấp. Cổng khóa (còn vùng chưa xong), cấp không phải cấp bé đang học hoặc hồ sơ không thuộc tài khoản thì về bản đồ, kể cả khi gõ thẳng URL.
export default async function ExamPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: levelParam } = await params;
  const levelNumber = Number(levelParam);
  if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > 10) notFound();

  const user = await requireUser();
  const learner = await requireActiveLearner();
  let page;
  try {
    page = await getExamPage(user.id, learner.id, levelNumber);
  } catch (error) {
    if (error instanceof ExamGateClosedError) redirect(`/map/${levelNumber}`);
    if (error instanceof LevelLockedError) redirect("/levels");
    throw error;
  }

  const { musicOn, soundOn, volume } = learner.settings;
  return (
    <SoundProvider initial={{ musicOn, soundOn, volume }} musicSrc={await getMusicSrc()}>
      <ExamFlow
        page={page}
        mascot={toMascotColor(learner.mascot)}
        learner={{ id: learner.id, name: learner.name, level: learner.currentLevel?.number ?? levelNumber, hair: toHair(learner.avatar), accent: learner.settings.voice.accent }}
      />
    </SoundProvider>
  );
}
