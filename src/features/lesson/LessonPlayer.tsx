"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { BossArt, FocusBadge, GameStartDialog, LessonCrumb, LessonTools, useFocusMode } from "@/components/lesson";
import { ButtonLink, Mascot, type AvatarHair, type MascotColor } from "@/components/ui";
import { BOSS_LINES, bossEnergy, pickLine, type Boss } from "@/lib/rules/bosses";
import { bossReward } from "@/lib/rules/rewards";
import type { LessonPlay } from "@/server/lesson-play";
import { isGameActivity } from "@/lib/rules/games";
import type { PlayStep } from "@/lib/rules/lesson-play";
import { isPrimaryLevel, rewardFor, starsFor } from "@/lib/rules/lesson-score";
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
import { BossStrip, type BossBeat } from "./boss/BossStrip";
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
/** Esc vẫn mở hộp thoại thoát khi bé đang gõ trong ô nhập (bài nghe và gõ, điền từ). */
const ESC_WHILE_TYPING = ["Escape"] as const;

export function LessonPlayer({ plan, learnerId, learnerName, mascot, hair, learnerLevel }: Props) {
  const router = useRouter();
  const tools = useFocusMode();
  const { sound, setSound, musicAvailable } = useSound();
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
  // Trận trùm (unit_test): lớp phủ thách đấu trước khi bắt đầu, dải trùm + năng lượng, trùm phản ứng sau mỗi câu.
  const boss = plan.boss as Pick<Boss, "name" | "accessory" | "fur"> | null;
  const [introSeen, setIntroSeen] = useState(false);
  const [beat, setBeat] = useState<BossBeat>({ mood: "tease", line: "Hô hô! Cậu làm được thì làm đi!", n: 0 });
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
  const isGame = step !== undefined && isGameActivity(step.kind);
  const mapHref = `/map/${plan.levelNumber}`;
  // Hết giờ học giữa bài: làm nốt câu đang dở rồi chuyển sang màn Hết giờ học (tiến độ dở đã giữ trên máy).
  useTimeUpRedirect(session?.position ?? 0, !finished);

  // Ghi kết quả lên server. Kết quả vẫn nằm trong localStorage cho tới khi lưu xong; gửi lại cùng `startedAt` thì server chỉ ghi một lần.
  const runSave = useCallback(
    async (progress: Progress) => {
      saveStarted.current = true;
      const items = progress.session.results.flatMap((r) => r.items).map(({ wordId, questionId, firstTryCorrect, wrong, revealed, picks, scored }) => ({ wordId, questionId, firstTryCorrect, wrong, revealed, picks, scored }));
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
    if (boss) {
      const missed = items.some((i) => !i.firstTryCorrect);
      const n = beat.n + 1;
      setBeat({ mood: missed ? "tease" : "hit", line: pickLine(missed ? BOSS_LINES.tease : BOSS_LINES.hit, n), n });
      window.setTimeout(() => setBeat((b) => (b.n === n ? { ...b, mood: "tease" } : b)), 1400);
    }
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
    { enabled: !exitOpen && !stopped && state !== null && !finished && !isGame, inInputs: ESC_WHILE_TYPING },
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
    const reward = boss ? bossReward(isPrimaryLevel(plan.levelNumber)) : rewardFor(stars, plan.levelNumber);
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
          bossInfo={boss as Pick<Boss, "name" | "accessory" | "fur"> | null}
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

  const crumb = (
    <LessonCrumb
      island={plan.levelName}
      unit={plan.unitTitleVi}
      lesson={plan.title}
      learner={{ name: learnerName, level: learnerLevel, hair }}
      minutes={usedMinutes === null ? null : { used: usedMinutes, limit: limitMinutes }}
    />
  );
  const extra = (
    <>
      {tools.focus && <FocusBadge />}
      <LessonTools focus={tools.focus} onToggleFocus={tools.toggle} sound={sound} onSoundChange={setSound} musicAvailable={musicAvailable} />
    </>
  );

  // Mini game tự vẽ khung của mình (bắt đầu, tạm dừng, kết thúc) nên không đặt trong khung bài học.
  if (step && stepId && isGame) {
    return (
      <StepView
        key={stepId}
        step={step}
        active
        unit={{ title: plan.unitTitle, titleVi: plan.unitTitleVi }}
        lessonId={plan.lessonId}
        host={{ level: plan.levelNumber, mascot, crumb, extra, focus: tools.focus, onStop: stop }}
        onComplete={handleComplete}
      />
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
      crumb={crumb}
      extra={extra}
      head={boss ? <BossStrip boss={boss} energy={bossEnergy(value, max)} total={max} beat={beat} /> : undefined}
    >
      {step && stepId && (
        <StepView key={stepId} step={step} active={!exitOpen && (!boss || introSeen || value > 0)} unit={{ title: plan.unitTitle, titleVi: plan.unitTitleVi }} onBack={canRewind ? handleBack : undefined} onComplete={handleComplete} />
      )}
      {boss && (
        <GameStartDialog
          open={!introSeen && value === 0 && !exitOpen}
          title={`Trận trùm: ${boss.name}`}
          art={<BossArt boss={boss} mood="tease" size={150} />}
          how={`${BOSS_LINES.intro(boss.name, plan.unitTitleVi)} ${max} câu trộn dạng bài, không đếm giờ, sai thì làm lại. Thắng được 30 xu và huy hiệu!`}
          onStart={() => setIntroSeen(true)}
        />
      )}
      <ExitDialog open={exitOpen} onClose={closeExit} onStop={stop} left={Math.max(0, max - value)} unitTitle={plan.unitTitle} />
    </LessonFrame>
  );
}
