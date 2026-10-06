"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Button, ButtonLink, DataState, Dialog, type MascotColor } from "@/components/ui";
import kid from "@/features/kid/kid.module.css";
import { KidTopbar, type KidTopbarProps } from "@/features/kid/KidTopbar";
import { LessonFrame } from "@/features/lesson/LessonFrame";
import { StepView } from "@/features/lesson/StepView";
import type { PlayStep } from "@/lib/rules/lesson-play";
import { baseId, completeStep, createSession, currentStepId, isFinished, progressOf, scoredItems, type ItemResult, type Session } from "@/lib/rules/lesson-session";
import { rewardForReview, wordResults } from "@/lib/rules/review-play";
import type { ReviewCompletion } from "@/lib/schemas";
import { useTimeUpRedirect } from "@/features/study-clock/StudyClock";
import { useHotkeys } from "@/lib/use-hotkeys";
import type { ReviewPlay } from "@/server/review";
import { completeReviewAction } from "./actions";
import { ReviewEnd, type ReviewSaveState } from "./ReviewEnd";
import { clearProgress, parseSaved, readSavedRaw, saveProgress } from "./resume";

/** Mỗi bước tính tối đa chừng này vào thời gian ôn (bé bỏ máy giữa chừng không bị tính). */
const MAX_STEP_MS = 3 * 60 * 1000;
const REVIEW_UNIT = { title: "Review", titleVi: "Ôn tập" };

const subscribeNever = () => () => {};

type Props = {
  plan: ReviewPlay;
  learnerId: number;
  learnerName: string;
  mascot: MascotColor;
  topbar: KidTopbarProps;
};

type Progress = { session: Session; activeMs: number; /** Lúc bắt đầu phiên (ms); 0 nghĩa là chưa xong bước nào. */ startedAt: number };

// Trình ôn tập: dùng lại khung và các dạng câu hỏi của bài học, giữ tiến độ dở theo ngày, ghi kết quả khi xong.
export function ReviewPlayer({ plan, learnerId, learnerName, mascot, topbar }: Props) {
  const stepsById = useMemo(() => new Map<string, PlayStep>(plan.steps.map((s) => [s.id, s])), [plan.steps]);
  const baseIds = useMemo(() => new Set(stepsById.keys()), [stepsById]);
  const freshProgress = useCallback((): Progress => ({ session: createSession(plan.steps.map((s) => s.id)), activeMs: 0, startedAt: 0 }), [plan.steps]);

  const savedRef = useRef<{ raw: string | null } | null>(null);
  const savedRaw = useSyncExternalStore(
    subscribeNever,
    () => (savedRef.current ??= { raw: readSavedRaw(learnerId, plan.day) }).raw,
    () => undefined,
  );

  const [local, setLocal] = useState<Progress | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [save, setSave] = useState<ReviewSaveState>({ status: "idle" });
  const saveStarted = useRef(false);
  const lastTick = useRef(0);
  useEffect(() => {
    lastTick.current = Date.now();
  }, []);

  const initial = useMemo<Progress | null>(() => {
    if (savedRaw === undefined) return null;
    return parseSaved(savedRaw, baseIds) ?? freshProgress();
  }, [savedRaw, baseIds, freshProgress]);
  const state = local ?? initial;

  const session = state?.session ?? null;
  const finished = session ? isFinished(session) : false;
  const stepId = session ? currentStepId(session) : null;
  const step = stepId ? stepsById.get(baseId(stepId)) : undefined;
  const { value, max } = session ? progressOf(session) : { value: 0, max: plan.steps.length };
  // Hết giờ học giữa phiên ôn: làm nốt câu đang dở rồi chuyển sang màn Hết giờ học.
  useTimeUpRedirect(session?.position ?? 0, !finished);

  // Kết quả vẫn nằm trong localStorage cho tới khi lưu xong; gửi lại cùng `startedAt` thì server chỉ ghi một lần.
  const runSave = useCallback(
    async (progress: Progress) => {
      saveStarted.current = true;
      const items = progress.session.results.flatMap((r) => r.items).map(({ wordId, firstTryCorrect, wrong, revealed, picks, scored }) => ({ wordId, firstTryCorrect, wrong, revealed, picks, scored }));
      try {
        const result = await completeReviewAction({ startedAtMs: progress.startedAt || Date.now(), durationMs: Math.round(progress.activeMs), items });
        if (result.ok) {
          clearProgress(learnerId, plan.day);
          setSave({ status: "ok", completion: result.completion });
        } else {
          setSave({ status: "error", message: result.message });
        }
      } catch {
        setSave({ status: "error", message: "Mất kết nối. Bé thử lại nhé!" });
      }
    },
    [learnerId, plan.day],
  );

  // Mở lại một phiên đã xong nhưng chưa lưu được (đóng trình duyệt giữa chừng): lưu tiếp.
  useEffect(() => {
    if (finished && state && local === null && !saveStarted.current) void runSave(state);
  }, [finished, state, local, runSave]);

  function handleComplete(items: ItemResult[]) {
    if (!state || !session || !stepId) return;
    const now = Date.now();
    const activeMs = state.activeMs + Math.min(now - lastTick.current, MAX_STEP_MS);
    lastTick.current = now;
    const next: Progress = { session: completeStep(session, { stepId, items }), activeMs, startedAt: state.startedAt || now - activeMs };
    setLocal(next);
    saveProgress(learnerId, plan.day, next);
    if (isFinished(next.session)) void runSave(next);
  }

  function retry() {
    setSave({ status: "idle" });
    if (state) void runSave(state);
  }

  // Hộp thoại trả focus về nút × khi đóng; bỏ focus đi để Enter tiếp tục thay vì mở lại hộp thoại.
  function closeExit() {
    setExitOpen(false);
    window.setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    }, 0);
  }

  function stop() {
    if (state) saveProgress(learnerId, plan.day, state);
    setStopped(true);
  }

  useHotkeys({ Escape: () => setExitOpen(true) }, { enabled: !exitOpen && !stopped && state !== null && !finished });
  useHotkeys({ Enter: () => setStopped(false) }, { enabled: stopped });

  if (stopped) {
    return (
      <div className={kid.screen} data-level={plan.levelNumber} data-dragon={mascot}>
        <KidTopbar {...topbar} backHref="/home" backLabel="Về trang chủ" />
        <main className={kid.main}>
          <DataState
            kind="empty"
            expr="vui"
            size={220}
            title="Hẹn cậu lần sau nhé!"
            text={`Còn ${Math.max(0, max - value)} câu đang chờ trong hộp. Lúc nào rảnh mình ôn tiếp.`}
            action={
              <>
                <Button size="l" icon="replay" label="Ôn tiếp" shortcut="Enter" onClick={() => setStopped(false)} />
                <ButtonLink href="/home" variant="secondary" size="l" icon="house" label="Về trang chủ" />
              </>
            }
          />
        </main>
      </div>
    );
  }

  if (finished && session && state) {
    const scored = scoredItems(session);
    const words = wordResults(scored).length;
    const reward = rewardForReview(words, plan.levelNumber);
    const preview: ReviewCompletion = { ...reward, total: words, minutes: Math.max(1, Math.ceil(state.activeMs / 60000)), up: [], back: 0 };
    return <ReviewEnd topbar={topbar} learnerName={learnerName} mascot={mascot} levelNumber={plan.levelNumber} preview={preview} save={save} onRetry={retry} />;
  }

  return (
    <LessonFrame level={plan.levelNumber} mascot={mascot} value={value} max={max} onExit={() => setExitOpen(true)}>
      {step && stepId && <StepView key={stepId} step={step} active={!exitOpen} unit={REVIEW_UNIT} onComplete={handleComplete} />}
      <Dialog
        open={exitOpen}
        onClose={closeExit}
        expr="tiec"
        title="Dừng ôn tập?"
        body={`Còn ${Math.max(0, max - value)} câu nữa là xong ôn tập hôm nay. Nếu dừng, lần sau mình ôn tiếp từ câu này nhé.`}
        actions={[
          { label: "Ôn tiếp", variant: "primary", shortcut: "Enter" },
          { label: "Dừng lại", variant: "secondary", onClick: stop },
        ]}
      />
    </LessonFrame>
  );
}

