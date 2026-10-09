import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { toHair, toMascotColor } from "@/features/kid/learner-art";
import { LessonEmpty } from "@/features/lesson/LessonEmpty";
import { LessonPlayer } from "@/features/lesson/LessonPlayer";
import { SoundProvider } from "@/features/sound/SoundProvider";
import { SpeechConfig } from "@/features/speech/SpeechConfig";
import { requireActiveLearner } from "@/server/active-learner";
import { getMusicSrc } from "@/server/music";
import { LessonLockedError, getLessonPlay } from "@/server/lesson-play";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "Bài học — Học cùng Bông" };

// Trình học một bài. getLessonPlay kiểm quyền sở hữu hồ sơ và chỉ trả bài đã xuất bản, đã mở với bé;
// bài còn khóa thì về bản đồ, bài không có thì 404.
export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId: idParam } = await params;
  const lessonId = Number(idParam);
  if (!Number.isInteger(lessonId) || lessonId < 1) notFound();

  const user = await requireUser();
  const learner = await requireActiveLearner();
  let plan;
  try {
    plan = await getLessonPlay(user.id, learner.id, lessonId);
  } catch (error) {
    if (error instanceof LessonLockedError) redirect("/map");
    throw error;
  }
  if (!plan) notFound();

  const mascot = toMascotColor(learner.mascot);
  if (plan.steps.length === 0) return <LessonEmpty level={plan.levelNumber} mascot={mascot} />;
  const { musicOn, soundOn, volume } = learner.settings;
  return (
    <SoundProvider initial={{ musicOn, soundOn, volume }} musicSrc={await getMusicSrc()}>
      <SpeechConfig accent={learner.settings.voice.accent} audio={plan.audio} />
      <LessonPlayer
        plan={plan}
        learnerId={learner.id}
        learnerName={learner.name}
        mascot={mascot}
        hair={toHair(learner.avatar)}
        learnerLevel={learner.currentLevel?.number ?? plan.levelNumber}
      />
    </SoundProvider>
  );
}
