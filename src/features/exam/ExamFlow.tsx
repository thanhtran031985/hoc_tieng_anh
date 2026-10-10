"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { TestDots } from "@/components/lesson";
import { Button, DataState, Mascot, type AvatarHair, type MascotColor } from "@/components/ui";
import { LessonFoot, LessonFrame, LessonMain } from "@/features/lesson/LessonFrame";
import { SpeechConfig } from "@/features/speech/SpeechConfig";
import type { SpeechAccent } from "@/lib/speech";
import { stageForLevel } from "@/lib/rules/mascot-stage";
import type { ExamResult } from "@/lib/schemas";
import type { ExamPage, ExamPlay } from "@/server/exam";
import { startExamAction, submitExamAction } from "./actions";
import { ExamIntro } from "./ExamIntro";
import { ExamLevelUp } from "./ExamLevelUp";
import { ExamPlayer, type ExamPayload } from "./ExamPlayer";
import { ExamRetry } from "./ExamRetry";
import styles from "./exam.module.css";

type Props = {
  page: ExamPage;
  learner: { id: number; name: string; level: number; hair: AvatarHair; accent: SpeechAccent };
  mascot: MascotColor;
};

type Phase =
  | { name: "intro"; starting: boolean; error: string | null }
  | { name: "play"; play: ExamPlay }
  | { name: "grading"; play: ExamPlay; payload: ExamPayload; error: string | null }
  | { name: "result"; result: ExamResult };

/**
 * Luồng bài thi lên cấp: giới thiệu → làm 20 câu → chấm → lên cấp (đạt) hoặc 3 chủ đề nên ôn (chưa đạt).
 * Lần thi trước chưa đạt và bé chưa ôn thì mở thẳng màn kết quả lần đó (server không cho bắt đầu lượt mới).
 */
export function ExamFlow({ page, learner, mascot }: Props) {
  const [phase, setPhase] = useState<Phase>(page.kind === "review" ? { name: "result", result: page.result } : { name: "intro", starting: false, error: null });
  const intro = page.kind === "intro" ? page : null;
  const audio = phase.name === "play" || phase.name === "grading" ? phase.play.audio : {};

  async function start() {
    if (!intro) return;
    setPhase({ name: "intro", starting: true, error: null });
    try {
      const res = await startExamAction({ level: intro.level.number });
      setPhase(res.ok ? { name: "play", play: res.play } : { name: "intro", starting: false, error: res.message });
    } catch {
      setPhase({ name: "intro", starting: false, error: "Mất kết nối. Bé thử lại nhé!" });
    }
  }

  const submit = useCallback(async (play: ExamPlay, payload: ExamPayload) => {
    setPhase({ name: "grading", play, payload, error: null });
    try {
      const res = await submitExamAction(payload);
      setPhase(res.ok ? { name: "result", result: res.result } : { name: "grading", play, payload, error: res.message });
    } catch {
      setPhase({ name: "grading", play, payload, error: "Mất kết nối. Bé thử lại nhé!" });
    }
  }, []);

  let body: React.ReactNode;
  if (phase.name === "intro" && intro) {
    body = <ExamIntro intro={intro} mascot={mascot} starting={phase.starting} error={phase.error} onStart={start} />;
  } else if (phase.name === "play") {
    const { play } = phase;
    body = <ExamPlayer key={play.attemptId} play={play} learner={learner} mascot={mascot} onDone={(payload) => void submit(play, payload)} />;
  } else if (phase.name === "grading") {
    body = <Grading play={phase.play} payload={phase.payload} error={phase.error} mascot={mascot} onRetry={() => void submit(phase.play, phase.payload)} />;
  } else if (phase.name === "result") {
    body = phase.result.passed ? (
      <ExamLevelUp result={phase.result} learnerName={learner.name} mascot={mascot} islands={intro?.islands ?? []} />
    ) : (
      <ExamRetry result={phase.result} mascot={mascot} />
    );
  }
  return (
    <>
      <SpeechConfig accent={learner.accent} audio={audio} />
      {body}
    </>
  );
}

/** Đang chấm bài (Bông suy nghĩ) hoặc chưa lưu được: bài làm vẫn được giữ trong trang, bấm Thử lại để nộp lại. */
function Grading({ play, payload, error, mascot, onRetry }: { play: ExamPlay; payload: ExamPayload; error: string | null; mascot: MascotColor; onRetry: () => void }) {
  const router = useRouter();
  const total = play.steps.length;
  void payload;
  return (
    <LessonFrame level={play.level.number} mascot={mascot} value={total} max={total} onExit={() => router.push(`/map/${play.level.number}`)} head={<TestDots value={total} max={total} />}>
      <LessonMain>
        {error ? (
          <DataState kind="error" title="Chưa lưu được kết quả" text={`Bài làm của bé vẫn được giữ. ${error}`} onRetry={onRetry} />
        ) : (
          <div className={styles.saving} role="status">
            <Mascot expr="suynghi" size={200} stage={stageForLevel(play.level.number)} />
            <p className={styles.bodyL}>Bông đang chấm bài…</p>
          </div>
        )}
      </LessonMain>
      <LessonFoot right={<Button size="l" label="Đang chấm…" disabled />} />
    </LessonFrame>
  );
}
