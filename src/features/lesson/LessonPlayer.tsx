"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { FocusBadge, LessonCrumb, LessonTools, useFocusMode } from "@/components/lesson";
import { ButtonLink, Mascot, type AvatarHair, type MascotColor } from "@/components/ui";
import type { LessonPlay } from "@/server/lesson-play";
import type { PlayStep } from "@/lib/rules/lesson-play";
import { rewardFor, starsFor } from "@/lib/rules/lesson-score";
import {
  baseId,
  completeStep,
  createSession,
  currentStepId,
  isFinished,
  progressOf,
  rewindStep,
  scoredItems,
  type ItemResult,
  type Session,
} from "@/lib/rules/lesson-session";
import type { LessonCompletion } from "@/lib/schemas";
import { useSound } from "@/features/sound/SoundProvider";
import { useStudyClock, useTimeUpRedirect } from "@/features/study-clock/StudyClock";
import { useHotkeys } from "@/lib/use-hotkeys";
import { completeLessonAction } from "./actions";
import { ExitDialog } from "./ExitDialog";
import { LessonEnd, type SaveState } from "./LessonEnd";
import { LessonFoot, LessonFrame, LessonMain } from "./LessonFrame";
import { StepView } from "./StepView";
import styles from "./lesson.module.css";
import { clearProgress, parseSaved, readSavedRaw, saveProgress } from "./resume";

/** Mỗi bước tính tối đa chừng này vào thời gian học (bé bỏ máy giữa chừng không bị tính). */
const MAX_STEP_MS = 3 * 60 * 1000;

const subscribeNever = () => () => {};

type Props = {
  plan: LessonPlay;
  learnerId: number;
  learnerName: string;
  mascot: MascotColor;
  /** Kiểu tóc và cấp hiện tại của bé, cho ảnh nhỏ trên thanh đường dẫn. */
  hair: AvatarHair;
  learnerLevel: number;
};

type Progress = { session: Session; activeMs: number; /** Lúc bắt đầu bài (ms); 0 nghĩa là chưa xong bước nào. */ startedAt: number };

// Trình học một bài: giữ trạng thái luồng câu hỏi, hỏi trước khi thoát, giữ tiến độ dở trên máy, ghi kết quả khi xong.
export function LessonPlayer({ plan, learnerId, learnerName, mascot, hair, learnerLevel }: Props) {
  const router = useRouter();
  const tools = useFocusMode();
  const { sound, setSound } = useSound();
  const { usedMinutes, limitMinutes } = useStudyClock();
  const stepsById = useMemo(() => new Map<string, PlayStep>(plan.steps.map((s) => [s.id, s])), [plan.steps]);
  const baseIds = useMemo(() => new Set(stepsById.keys()), [stepsById]);
  const freshProgress = useCallback((): Progress => ({ session: createSession(plan.steps.map((s) => s.id)), activeMs: 0, startedAt: 0 }), [plan.steps]);

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
  const [save, setSave] = useState<SaveState>({ status: "idle" });
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
  const mapHref = `/map/${plan.levelNumber}`;
  // Hết giờ học giữa bài: làm nốt câu đang dở rồi chuyển sang màn Hết giờ học (tiến độ dở đã giữ trên máy).
  useTimeUpRedirect(session?.position ?? 0, !finished);

  // Ghi kết quả lên server. Kết quả vẫn nằm trong localStorage cho tới khi lưu xong; gửi lại cùng `startedAt` thì server chỉ ghi một lần.
  const runSave = useCallback(
    async (progress: Progress) => {
      saveStarted.current = true;
      const items = progress.session.results.flatMap((r) => r.items).map(({ wordId, firstTryCorrect, wrong, revealed, picks, scored }) => ({ wordId, firstTryCorrect, wrong, revealed, picks, scored }));
      try {
        const result = await completeLessonAction({
          lessonId: plan.lessonId,
          startedAtMs: progress.startedAt || Date.now(),
          durationMs: Math.round(progress.activeMs),
          items,
        });
        if (result.ok) {
          clearProgress(learnerId, plan.lessonId);
          setSave({ status: "ok", completion: result.completion });
        } else {
          setSave({ status: "error", message: result.message });
        }
      } catch {
        setSave({ status: "error", message: "Mất kết nối. Bé thử lại nhé!" });
      }
    },
    [learnerId, plan.lessonId],
  );

  // Mở lại một bài đã xong nhưng chưa lưu được (đóng trình duyệt giữa chừng): lưu tiếp.
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
    saveProgress(learnerId, plan.lessonId, next);
    if (isFinished(next.session)) void runSave(next);
  }

  function retry() {
    setSave({ status: "idle" });
    if (state) void runSave(state);
  }

  function replay() {
    clearProgress(learnerId, plan.lessonId);
    saveStarted.current = false;
    lastTick.current = Date.now();
    setSave({ status: "idle" });
    setLocal(freshProgress());
  }

  // Hộp thoại trả focus về nút × khi đóng; bỏ focus đi để Enter tiếp tục bài thay vì mở lại hộp thoại.
  function closeExit() {
    setExitOpen(false);
    window.setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    }, 0);
  }

  // Xem lại thẻ trước: chỉ giữa các thẻ từ liền nhau.
  const prevId = session && session.position > 0 ? session.order[session.position - 1] : null;
  const canRewind = step?.kind === "word_card" && prevId !== null && stepsById.get(baseId(prevId))?.kind === "word_card" && session !== null && rewindStep(session) !== session;
  function handleBack() {
    if (!state || !session) return;
    setLocal({ ...state, session: rewindStep(session) });
  }

  function stop() {
    if (state) saveProgress(learnerId, plan.lessonId, state);
    setStopped(true);
  }

  // Dừng bài: hiện lời chào ngắn rồi về bản đồ.
  useEffect(() => {
    if (!stopped) return;
    const timer = window.setTimeout(() => router.push(mapHref), 2000);
    return () => window.clearTimeout(timer);
  }, [stopped, router, mapHref]);

  // Esc thoát học tập trung trước; bấm Esc lần nữa mới hỏi "Dừng bài học?". F bật/tắt học tập trung.
  useHotkeys(
    { Escape: () => (tools.focus ? tools.setFocus(false) : setExitOpen(true)), f: tools.toggle },
    { enabled: !exitOpen && !stopped && state !== null && !finished },
  );
  useHotkeys({ Enter: () => router.push(mapHref) }, { enabled: stopped });

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

  if (finished && session && state) {
    const scored = scoredItems(session);
    const stars = starsFor(scored);
    const reward = rewardFor(stars, plan.levelNumber);
    const preview: LessonCompletion = {
      stars,
      coins: reward.coins,
      xp: reward.xp,
      correct: scored.filter((i) => i.firstTryCorrect).length,
      total: scored.length,
      minutes: Math.max(1, Math.ceil(state.activeMs / 60000)),
      nextLessonId: null,
    };
    return (
      <div data-level={plan.levelNumber} data-dragon={mascot}>
        <LessonEnd
          learnerName={learnerName}
          unitTitleVi={plan.unitTitleVi}
          lessonTitle={plan.title}
          bossLesson={plan.kind === "unit_test"}
          preview={preview}
          words={plan.words}
          mapHref={mapHref}
          save={save}
          onRetry={retry}
          onReplay={replay}
        />
      </div>
    );
  }

  return (
    <LessonFrame
      level={plan.levelNumber}
      mascot={mascot}
      value={value}
      max={max}
      onExit={() => setExitOpen(true)}
      focus={tools.focus}
      crumb={
        <LessonCrumb
          island={plan.levelName}
          unit={plan.unitTitleVi}
          lesson={plan.title}
          learner={{ name: learnerName, level: learnerLevel, hair }}
          minutes={usedMinutes === null ? null : { used: usedMinutes, limit: limitMinutes }}
        />
      }
      extra={
        <>
          {tools.focus && <FocusBadge />}
          <LessonTools focus={tools.focus} onToggleFocus={tools.toggle} sound={sound} onSoundChange={setSound} />
        </>
      }
    >
      {step && stepId && (
        <StepView key={stepId} step={step} active={!exitOpen} unit={{ title: plan.unitTitle, titleVi: plan.unitTitleVi }} onBack={canRewind ? handleBack : undefined} onComplete={handleComplete} />
      )}
      <ExitDialog open={exitOpen} onClose={closeExit} onStop={stop} left={Math.max(0, max - value)} unitTitle={plan.unitTitle} />
    </LessonFrame>
  );
}
