"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ButtonLink, Mascot, type MascotColor } from "@/components/ui";
import type { LessonPlay } from "@/server/lesson-play";
import type { PlayStep } from "@/lib/rules/lesson-play";
import { baseId, completeStep, createSession, currentStepId, isFinished, progressOf, type ItemResult, type Session } from "@/lib/rules/lesson-session";
import { useHotkeys } from "@/lib/use-hotkeys";
import { ExitDialog } from "./ExitDialog";
import { LessonFoot, LessonFrame, LessonMain } from "./LessonFrame";
import { StubStep } from "./StubStep";
import styles from "./lesson.module.css";
import { clearProgress, parseSaved, readSavedRaw, saveProgress } from "./resume";

/** Mỗi bước tính tối đa chừng này vào thời gian học (bé bỏ máy giữa chừng không bị tính). */
const MAX_STEP_MS = 3 * 60 * 1000;

const subscribeNever = () => () => {};

type Props = {
  plan: LessonPlay;
  learnerId: number;
  mascot: MascotColor;
};

type Progress = { session: Session; activeMs: number };

// Trình học một bài: giữ trạng thái luồng câu hỏi, hỏi trước khi thoát, giữ tiến độ dở trên máy.
export function LessonPlayer({ plan, learnerId, mascot }: Props) {
  const router = useRouter();
  const stepsById = useMemo(() => new Map<string, PlayStep>(plan.steps.map((s) => [s.id, s])), [plan.steps]);
  const baseIds = useMemo(() => new Set(stepsById.keys()), [stepsById]);

  // Tiến độ đã lưu chỉ có ở trình duyệt: lần render đầu (cả khi hydrate) là undefined, sau đó mới đọc localStorage.
  const savedRef = useRef<{ raw: string | null } | null>(null);
  const savedRaw = useSyncExternalStore(
    subscribeNever,
    () => (savedRef.current ??= { raw: readSavedRaw(learnerId, plan.lessonId) }).raw,
    () => undefined,
  );

  const [local, setLocal] = useState<Progress | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  const [stopped, setStopped] = useState(false);
  const lastTick = useRef(0);
  useEffect(() => {
    lastTick.current = Date.now();
  }, []);

  const initial = useMemo<Progress | null>(() => {
    if (savedRaw === undefined) return null;
    return parseSaved(savedRaw, baseIds) ?? { session: createSession(plan.steps.map((s) => s.id)), activeMs: 0 };
  }, [savedRaw, baseIds, plan.steps]);
  const state = local ?? initial;

  const session = state?.session ?? null;
  const finished = session ? isFinished(session) : false;
  const stepId = session ? currentStepId(session) : null;
  const step = stepId ? stepsById.get(baseId(stepId)) : undefined;
  const { value, max } = session ? progressOf(session) : { value: 0, max: plan.steps.length };
  const mapHref = `/map/${plan.levelNumber}`;

  function handleComplete(items: ItemResult[]) {
    if (!state || !session || !stepId) return;
    const now = Date.now();
    const activeMs = state.activeMs + Math.min(now - lastTick.current, MAX_STEP_MS);
    lastTick.current = now;
    const next: Progress = { session: completeStep(session, { stepId, items }), activeMs };
    setLocal(next);
    if (isFinished(next.session)) clearProgress(learnerId, plan.lessonId);
    else saveProgress(learnerId, plan.lessonId, next);
  }

  // Hộp thoại trả focus về nút × khi đóng; bỏ focus đi để Enter tiếp tục bài thay vì mở lại hộp thoại.
  function closeExit() {
    setExitOpen(false);
    window.setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    }, 0);
  }

  function stop() {
    if (session) saveProgress(learnerId, plan.lessonId, state!);
    setStopped(true);
  }

  // Dừng bài: hiện lời chào ngắn rồi về bản đồ.
  useEffect(() => {
    if (!stopped) return;
    const timer = window.setTimeout(() => router.push(mapHref), 2000);
    return () => window.clearTimeout(timer);
  }, [stopped, router, mapHref]);

  useHotkeys({ Escape: () => setExitOpen(true) }, { enabled: !exitOpen && !stopped && state !== null && !finished });

  useHotkeys({ Enter: () => router.push(mapHref) }, { enabled: stopped || finished });

  if (stopped) {
    return (
      <LessonFrame level={plan.levelNumber} mascot={mascot} value={value} max={max} onExit={() => {}}>
        <LessonMain>
          <div className={styles.bye}>
            <Mascot expr="chao" size={220} />
            <h1 className={styles.byeTitle}>Hẹn gặp lại nhé!</h1>
            <p className={styles.byeText}>Bông giữ chỗ ở câu {Math.min(value + 1, max)} cho bé. Lần sau mình học tiếp.</p>
          </div>
        </LessonMain>
        <LessonFoot right={<ButtonLink href={mapHref} size="l" icon="map" label="Về bản đồ" shortcut="Enter" />} />
      </LessonFrame>
    );
  }

  return (
    <LessonFrame level={plan.levelNumber} mascot={mascot} value={value} max={max} onExit={() => setExitOpen(true)}>
      {step && stepId && !finished && <StubStep key={stepId} step={step} active={!exitOpen} onComplete={handleComplete} />}
      {finished && (
        <>
          <LessonMain>
            <div className={styles.bye}>
              <Mascot expr="chucmung" size={220} />
              <h1 className={styles.byeTitle}>Xong bài rồi!</h1>
            </div>
          </LessonMain>
          <LessonFoot right={<ButtonLink href={mapHref} size="l" icon="map" label="Về bản đồ" shortcut="Enter" />} />
        </>
      )}
      <ExitDialog open={exitOpen} onClose={closeExit} onStop={stop} left={Math.max(0, max - value)} unitTitle={plan.unitTitle} />
    </LessonFrame>
  );
}
