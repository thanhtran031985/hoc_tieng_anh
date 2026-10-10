"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FocusBadge, LessonCrumb, LessonTools, TestDots, useFocusMode } from "@/components/lesson";
import { Dialog, type AvatarHair, type MascotColor } from "@/components/ui";
import { baseId, completeStep, createSession, currentStepId, isFinished, isRetryId, restoreSession, type ItemResult, type Session } from "@/lib/rules/lesson-session";
import type { PlayStep } from "@/lib/rules/lesson-play";
import type { ExamPlay } from "@/server/exam";
import { LessonFrame } from "@/features/lesson/LessonFrame";
import { StepView } from "@/features/lesson/StepView";
import { clearProgress, readSavedRaw, saveProgress } from "@/features/lesson/resume";
import { useSound } from "@/features/sound/SoundProvider";
import { useStudyClock, useTimeUpRedirect } from "@/features/study-clock/StudyClock";
import { useHotkeys } from "@/lib/use-hotkeys";

/** Kết quả gửi lên khi nộp bài: mỗi câu gốc (không tính câu làm lại) với các mục đã chấm. */
export type ExamPayload = {
  attemptId: number;
  results: { stepId: number; items: { wordId: number | null; questionId?: number; firstTryCorrect: boolean; wrong: number; revealed: boolean; picks: string[]; scored: boolean }[] }[];
};

type Props = {
  play: ExamPlay;
  learner: { id: number; name: string; level: number; hair: AvatarHair };
  mascot: MascotColor;
  onDone: (payload: ExamPayload) => void;
};

// Tiến độ dở lưu ở máy cùng kho với bài học; lượt thi dùng số âm của mã lượt thi làm “mã bài” để không trùng với mã bài học thật.
const savedKey = (attemptId: number) => -attemptId;
const ESC_WHILE_TYPING = ["Escape"] as const;

/** Chuyển kết quả của phiên thành dữ liệu nộp bài (bỏ câu làm lại: không tính điểm). */
export function toPayload(attemptId: number, session: Session): ExamPayload {
  return {
    attemptId,
    results: session.results
      .filter((r) => !isRetryId(r.stepId))
      .map((r) => ({
        stepId: Number(r.stepId.slice(1)),
        items: r.items.map(({ wordId, questionId, firstTryCorrect, wrong, revealed, picks, scored }) => ({ wordId, questionId, firstTryCorrect, wrong, revealed, picks, scored })),
      })),
  };
}

/**
 * Làm bài thi: khung bài học với thanh 20 chấm, mỗi câu dùng lại đúng màn của dạng bài trong bài học (phím tắt, gợi ý, làm lại khi sai).
 * Câu sai vẫn được làm lại để học nhưng không tính điểm và không trừ điểm; không đếm giờ. Thoát giữa chừng thì lần sau làm tiếp từ câu đang dở.
 */
export function ExamPlayer({ play, learner, mascot, onDone }: Props) {
  const router = useRouter();
  const tools = useFocusMode();
  const { sound, setSound, musicAvailable } = useSound();
  const { usedMinutes, limitMinutes } = useStudyClock();
  const stepsById = useMemo(() => new Map<string, PlayStep>(play.steps.map((s) => [s.id, s])), [play.steps]);
  const [session, setSession] = useState<Session>(() => {
    const saved = readSavedRaw(learner.id, savedKey(play.attemptId));
    if (saved) {
      try {
        const restored = restoreSession((JSON.parse(saved) as { session?: unknown }).session, new Set(stepsById.keys()));
        if (restored) return restored;
      } catch {
        // Dữ liệu hỏng: làm từ đầu.
      }
    }
    return createSession(play.steps.map((s) => s.id));
  });
  const [exitOpen, setExitOpen] = useState(false);
  const doneRef = useRef(false);

  const finished = isFinished(session);
  const stepId = currentStepId(session);
  const step = stepId ? stepsById.get(baseId(stepId)) : undefined;
  const answered = session.results.filter((r) => !isRetryId(r.stepId)).length;
  const unit = step ? (play.units[step.id] ?? { title: "", titleVi: "" }) : { title: "", titleVi: "" };
  useTimeUpRedirect(session.position, !finished);

  const persist = useCallback(
    (next: Session) => saveProgress(learner.id, savedKey(play.attemptId), { session: next, activeMs: 0, startedAt: 0 }),
    [learner.id, play.attemptId],
  );

  function handleComplete(items: ItemResult[]) {
    if (!stepId) return;
    const next = completeStep(session, { stepId, items });
    setSession(next);
    persist(next);
  }

  // Xong mọi câu (kể cả câu làm lại): nộp bài một lần.
  useEffect(() => {
    if (!finished || doneRef.current) return;
    doneRef.current = true;
    clearProgress(learner.id, savedKey(play.attemptId));
    onDone(toPayload(play.attemptId, session));
  }, [finished, session, learner.id, play.attemptId, onDone]);

  function closeExit() {
    setExitOpen(false);
    window.setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    }, 0);
  }

  useHotkeys({ Escape: () => (tools.focus ? tools.setFocus(false) : setExitOpen(true)), f: tools.toggle }, { enabled: !exitOpen && !finished, inInputs: ESC_WHILE_TYPING });

  const crumb = (
    <LessonCrumb
      island={play.level.name}
      unit={unit.titleVi}
      lesson="Bài thi lên cấp"
      learner={{ name: learner.name, level: learner.level, hair: learner.hair }}
      minutes={usedMinutes === null ? null : { used: usedMinutes, limit: limitMinutes }}
    />
  );
  const extra = (
    <>
      {tools.focus && <FocusBadge />}
      <LessonTools focus={tools.focus} onToggleFocus={tools.toggle} sound={sound} onSoundChange={setSound} musicAvailable={musicAvailable} />
    </>
  );

  return (
    <LessonFrame
      level={play.level.number}
      mascot={mascot}
      value={answered}
      max={play.steps.length}
      onExit={() => setExitOpen(true)}
      focus={tools.focus}
      crumb={crumb}
      extra={extra}
      head={<TestDots value={answered} max={play.steps.length} />}
    >
      {step && stepId && !finished && <StepView key={stepId} step={step} active={!exitOpen} unit={unit} onComplete={handleComplete} />}
      <Dialog
        open={exitOpen}
        onClose={closeExit}
        expr="tiec"
        title="Dừng bài thi?"
        body={`Bé đã làm ${answered}/${play.steps.length} câu. Nếu dừng, lần sau Bông cho bé làm tiếp từ câu này nhé.`}
        actions={[
          { label: "Làm tiếp", variant: "primary", shortcut: "Enter" },
          { label: "Dừng lại", variant: "secondary", onClick: () => router.push(`/map/${play.level.number}`) },
        ]}
      />
    </LessonFrame>
  );
}
