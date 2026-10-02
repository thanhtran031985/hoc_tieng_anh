"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MascotColor, TopbarLearner } from "@/components/ui";
import { answerPlacement, createPlacement, isPlacementDone, pickQuestion, suggestLevel, type PlacementState } from "@/lib/rules/placement";
import type { PlacementSetup } from "@/server/placement";
import { useTimeUpRedirect } from "@/features/study-clock/StudyClock";
import { applyStartLevelAction, completePlacementAction } from "./actions";
import { PlacementIntro } from "./PlacementIntro";
import { PlacementQuiz } from "./PlacementQuiz";
import { PlacementResult, type PlacementSave } from "./PlacementResult";

type Props = {
  setup: PlacementSetup;
  mascot: MascotColor;
  learner: TopbarLearner;
};

type Phase = "intro" | "quiz" | "result";
type Answer = { wordId: number; level: number; correct: boolean };

/** Bài xếp lớp: giới thiệu → câu hỏi thích ứng → kết quả. Giữ trạng thái chọn câu, gửi kết quả lên server khi xong. */
export function PlacementFlow({ setup, mascot, learner }: Props) {
  const router = useRouter();
  const { pools, maxLevel, gradeLevel } = setup;
  const [phase, setPhase] = useState<Phase>("intro");
  const [state, setState] = useState<PlacementState>(() => createPlacement(setup.grade, maxLevel));
  const [log, setLog] = useState<Answer[]>([]);
  const [used, setUsed] = useState<ReadonlySet<string>>(new Set());
  const [early, setEarly] = useState(false);
  const [save, setSave] = useState<PlacementSave>({ status: "idle" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef(0);
  const [durationMs, setDurationMs] = useState(0);

  // Hết giờ học giữa bài xếp lớp: làm nốt câu đang dở rồi chuyển sang màn Hết giờ học.
  useTimeUpRedirect(log.length, phase === "quiz");

  const question = useMemo(() => (phase === "quiz" ? pickQuestion(pools, state.level, used) : null), [phase, pools, state.level, used]);

  const runSave = useCallback(async (answers: Answer[], elapsed: number) => {
    setSave({ status: "idle" });
    try {
      const result = await completePlacementAction({ durationMs: Math.round(elapsed), answers });
      setSave(result.ok ? { status: "ok", result: result.result } : { status: "error", message: result.message });
    } catch {
      setSave({ status: "error", message: "Mất kết nối. Bé thử lại nhé!" });
    }
  }, []);

  function start() {
    setState(createPlacement(setup.grade, maxLevel));
    setLog([]);
    setUsed(new Set());
    setEarly(false);
    setSave({ status: "idle" });
    startedAt.current = Date.now();
    setPhase("quiz");
  }

  function finish(answers: Answer[]) {
    const elapsed = Date.now() - startedAt.current;
    setDurationMs(elapsed);
    setPhase("result");
    void runSave(answers, elapsed);
  }

  function handleAnswer(correct: boolean) {
    if (!question) return;
    const nextLog = [...log, { wordId: question.target.id, level: question.level, correct }];
    const nextState = answerPlacement(state, correct, maxLevel);
    const nextUsed = new Set(used).add(question.id);
    setLog(nextLog);
    setState(nextState);
    setUsed(nextUsed);
    // Hết câu theo luật (12 câu) hoặc kho câu hỏi đã cạn thì kết thúc.
    if (isPlacementDone(nextState) || pickQuestion(pools, nextState.level, nextUsed) === null) finish(nextLog);
  }

  function stop() {
    setDurationMs(Date.now() - startedAt.current);
    setEarly(true);
    setPhase("result");
  }

  // Đặt cấp bắt đầu rồi vào trang chủ.
  async function go(level: number) {
    setBusy(true);
    setError(null);
    try {
      const result = await applyStartLevelAction({ level });
      if (result.ok) {
        router.push("/home");
        return;
      }
      setError(result.message);
    } catch {
      setError("Chưa đặt được cấp. Kiểm tra mạng rồi thử lại nhé.");
    }
    setBusy(false);
  }

  if (phase === "quiz" && question) {
    return (
      <PlacementQuiz
        key={question.id}
        question={question}
        answered={log.length}
        themeLevel={gradeLevel.number}
        mascot={mascot}
        learnerName={setup.learnerName}
        grade={setup.grade}
        onAnswer={handleAnswer}
        onStop={stop}
      />
    );
  }

  if (phase === "result") {
    const suggested = suggestLevel(log, maxLevel, gradeLevel.number);
    return (
      <PlacementResult
        learner={learner}
        learnerName={setup.learnerName}
        grade={setup.grade}
        gradeLevel={gradeLevel}
        levels={setup.levels}
        suggested={setup.levels.some((l) => l.number === suggested) ? suggested : gradeLevel.number}
        save={save}
        early={early}
        answered={log.length}
        durationMs={durationMs}
        busy={busy}
        error={error}
        onRetry={() => void runSave(log, durationMs)}
        onContinue={() => {
          setEarly(false);
          setPhase("quiz");
        }}
        onStart={(level) => void go(level)}
      />
    );
  }

  return (
    <PlacementIntro
      setup={setup}
      learner={learner}
      busy={busy}
      error={error}
      onBack={() => router.push("/profiles")}
      onStart={start}
      onSkip={() => void go(gradeLevel.number)}
    />
  );
}
