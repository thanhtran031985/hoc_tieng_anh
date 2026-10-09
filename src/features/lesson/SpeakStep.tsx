"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Icon, Mascot, SpeakerButton, WordPicture } from "@/components/ui";
import { ClickableWords } from "@/components/lesson";
import { cn } from "@/lib/cn";
import type { ItemResult } from "@/lib/rules/lesson-session";
import { REC_MAX_MS } from "@/lib/rules/recording";
import { COMPLETION_STARS, completionScore, praiseFor, scoreSpeech, spokenWords, type SpeechScore } from "@/lib/rules/speaking";
import { playSfx } from "@/lib/sound";
import { playPronunciation, stopPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { burstStars } from "./burst";
import { LessonFoot, LessonMain } from "./LessonFrame";
import { ListenChooseStep } from "./ListenChooseStep";
import lesson from "./lesson.module.css";
import { saveRecordingAction } from "./speak-actions";
import styles from "./speak.module.css";
import type { StepProps } from "./types";
import { canRecord, hasMicrophone, useRecorder, type Recorded } from "./use-recorder";
import { speechRecognitionCtor, useSpeechRecognition } from "./use-speech-recognition";

type Phase = "ready" | "recording" | "scoring" | "result";
const MIN_SCORING_MS = 900;
const HINT_WORD_MS = 700;

type Outcome = { score: SpeechScore; transcript: string | null; scored: boolean; url: string | null };

/** Luyện nói (Screen25): nghe mẫu, ghi âm (phím R, tối đa 10 giây), Bông chấm 1–3 sao dễ tính, nghe lại giọng mình, nói lại. */
export function SpeakStep({ step, active, unit, onComplete }: StepProps<"speak">) {
  const [stage, setStage] = useState<Exclude<Phase, "recording">>("ready");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [mic, setMic] = useState<"unknown" | "present" | "none">("unknown");
  const [lit, setLit] = useState<number | null>(null);
  const [hearing, setHearing] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const urlRef = useRef<string | null>(null);
  const mineRef = useRef<HTMLAudioElement | null>(null);
  const hintTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognition = useSpeechRecognition(step.scoring ? "en-US" : "en-US");
  const words = useMemo(() => spokenWords(step.text), [step.text]);
  const canScore = step.scoring && speechRecognitionCtor() !== null;

  // Máy không có micro (hoặc trình duyệt không ghi âm được): đổi sang câu nghe và chọn hình, bài vẫn đi tiếp.
  useEffect(() => {
    let alive = true;
    if (!canRecord()) {
      void Promise.resolve().then(() => alive && setMic("none"));
      return () => void (alive = false);
    }
    void hasMicrophone().then((has) => alive && setMic(has ? "present" : "none"));
    return () => void (alive = false);
  }, []);

  const recorder = useRecorder(handleRecorded);
  const phase: Phase = recorder.state === "recording" ? "recording" : stage;

  async function handleRecorded(recorded: Recorded) {
    setStage("scoring");
    const started = Date.now();
    const heard = canScore ? await recognition.end() : null;
    const scored = canScore && heard !== null;
    const score = scored ? scoreSpeech(step.text, heard ?? "", step.leniency) : completionScore(step.text);
    const wait = MIN_SCORING_MS - (Date.now() - started);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(recorded.blob);
    urlRef.current = url;
    setOutcome({ score, transcript: scored ? (heard ?? "") : null, scored, url });
    setStage("result");
    playSfx("correct");
    // Lưu bản ghi cho bố mẹ nghe lại; lỗi không làm hỏng bài.
    if (step.questionId !== null) {
      const body = new FormData();
      body.set("file", new File([recorded.blob], `rec.${recorded.ext}`, { type: recorded.mime }));
      body.set("questionId", String(step.questionId));
      body.set("durationMs", String(recorded.ms));
      body.set("stars", String(score.stars));
      body.set("scored", scored ? "1" : "0");
      if (scored && heard) body.set("transcript", heard.slice(0, 500));
      void saveRecordingAction(body).catch(() => undefined);
    }
  }

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      mineRef.current?.pause();
      if (hintTimer.current) clearInterval(hintTimer.current);
      recognition.cancel();
      stopPronunciation();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  function record() {
    if (phase === "recording") {
      recorder.stop();
      return;
    }
    if (phase === "scoring") return;
    stopPronunciation();
    mineRef.current?.pause();
    setOutcome(null);
    if (canScore) recognition.begin();
    void recorder.start();
  }

  // Micro bị chặn hoặc lỗi thì thôi nhận diện giọng nói đã mở (màn hướng dẫn hiện theo `recorder.state`).
  useEffect(() => {
    if (recorder.state === "denied" || recorder.state === "nomic" || recorder.state === "error") recognition.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorder.state]);

  const hearModel = () => playPronunciation(step.text, { audioUrl: step.audio ?? undefined, rate: 0.8 });
  const hearMine = () => {
    if (!outcome?.url) return;
    mineRef.current?.pause();
    const audio = new Audio(outcome.url);
    mineRef.current = audio;
    audio.onended = () => setHearing(false);
    setHearing(true);
    void audio.play().catch(() => setHearing(false));
  };

  // Gợi ý (H): Bông đọc chậm, từng từ sáng lên.
  function hint() {
    if (phase !== "ready") return;
    if (hintTimer.current) clearInterval(hintTimer.current);
    playPronunciation(step.text, { rate: 0.5, audioUrl: null });
    let i = 0;
    setLit(0);
    hintTimer.current = setInterval(() => {
      i += 1;
      if (i >= words.length) {
        if (hintTimer.current) clearInterval(hintTimer.current);
        setLit(null);
      } else setLit(i);
    }, HINT_WORD_MS);
  }

  function finish(stars: number, transcript: string | null) {
    const item: ItemResult = {
      wordId: step.picture?.id ?? null,
      ...(step.questionId !== null ? { questionId: step.questionId } : {}),
      firstTryCorrect: stars >= 2,
      wrong: 0,
      revealed: false,
      picks: transcript ? [transcript.slice(0, 200)] : [],
      scored: true,
    };
    onComplete([item]);
  }

  const resultMode = phase === "result" && outcome;
  useEffect(() => {
    if (phase === "result") burstStars(document.querySelector("[data-stars]"));
  }, [phase]);

  const blocked = recorder.state === "denied";
  const noMic = mic === "none" || recorder.state === "nomic";
  useHotkeys(
    {
      r: record,
      Space: hearModel,
      h: hint,
      Enter: () => {
        if (resultMode) finish(outcome.score.stars, outcome.transcript);
      },
    },
    { enabled: active && !noMic && !blocked && phase !== "scoring", captureNative: true },
  );

  // ---- Không có micro: câu nghe và chọn hình thay thế (hoặc thông báo nhẹ và đi tiếp)
  if (noMic) {
    if (step.fallback) {
      return (
        <ListenChooseStep
          step={{ id: `${step.id}~mic`, kind: "listen_choose_picture", target: step.fallback.target, options: step.fallback.options, autoPlay: true }}
          active={active}
          unit={unit}
          onComplete={(items) => onComplete(items.map((i) => ({ ...i, ...(step.questionId !== null ? { questionId: step.questionId } : {}) })))}
        />
      );
    }
    return (
      <>
        <LessonMain>
          <div className={styles.card}>
            <Mascot expr="chao" size={170} />
            <div>
              <h1 className={lesson.instr}>Máy này chưa có micro</h1>
              <p className={styles.lead}>Bông cho cậu đi tiếp nhé. Bài vẫn được tính đủ!</p>
            </div>
          </div>
        </LessonMain>
        <LessonFoot right={<Button variant="primary" size="l" icon="next" label="Tiếp tục" shortcut="Enter" onClick={() => finish(COMPLETION_STARS, null)} />} />
        <EnterKey active={active} onEnter={() => finish(COMPLETION_STARS, null)} />
      </>
    );
  }

  // ---- Chưa cho dùng micro: hướng dẫn bố mẹ
  if (blocked) {
    return (
      <>
        <LessonMain>
          <div className={styles.card}>
            <Mascot expr="suynghi" size={170} />
            <div>
              <h1 className={lesson.instr}>Trình duyệt chưa cho dùng micro</h1>
              <p className={styles.lead}>Bố mẹ giúp Bông một chút nhé:</p>
              <ol className={styles.steps}>
                <li>
                  Bấm biểu tượng <Icon name="lock" size={20} /> cạnh địa chỉ trang.
                </li>
                <li>
                  Ở mục <b>Micro</b>, chọn <b>Cho phép</b>.
                </li>
                <li>
                  Bấm <b>Thử lại</b> bên dưới.
                </li>
              </ol>
              <div className={styles.listen}>
                <Button variant="primary" size="l" icon="replay" label="Thử lại" onClick={() => (recorder.reset(), void recorder.start())} />
                <Button variant="secondary" size="l" label="Hôm nay bỏ qua phần nói" onClick={() => (setSkipped(true), finish(COMPLETION_STARS, null))} disabled={skipped} />
              </div>
            </div>
          </div>
        </LessonMain>
        <LessonFoot right={<Button variant="primary" size="l" icon="next" label="Tiếp tục" shortcut="Enter" disabled />} />
      </>
    );
  }

  const recording = phase === "recording";
  const scoring = phase === "scoring";
  const marks = resultMode ? outcome.score.marks : null;
  return (
    <>
      <LessonMain>
        <h1 className={lesson.instr}>{words.length <= 1 ? "Nói to từ này" : "Nói to câu này"}</h1>
        <div className={styles.sp}>
          <div className={styles.pic}>
            {step.picture ? <WordPicture word={step.picture.word} src={step.picture.image} size={260} label="Hình minh họa" /> : <Icon name="mic" size={96} />}
          </div>
          <div className={styles.col}>
            <div className={styles.model} lang="en">
              <SpeakerButton word={step.text} size="m" label="Nghe giọng mẫu" audioUrl={step.audio} rate={0.8} />
              {marks ? (
                <span className={styles.words}>
                  {step.text.split(/\s+/).map((w, i) => (
                    <button key={i} type="button" className={cn(styles.w, marks[words.indexOf(spokenWords(w)[0] ?? "")] === "soso" ? styles.soso : styles.ok)} onClick={() => playPronunciation(w.replace(/[.,!?]/g, ""), { rate: 0.8 })}>
                      {w}
                    </button>
                  ))}
                </span>
              ) : (
                <span>
                  <ClickableWords text={step.text} litIndex={lit} />
                </span>
              )}
            </div>

            {!resultMode && (
              <div className={styles.microw}>
                <button
                  type="button"
                  className={cn(styles.mic, recording && styles.isRec)}
                  data-mic
                  aria-pressed={recording}
                  aria-label={recording ? "Dừng ghi âm (R)" : "Bắt đầu nói (R)"}
                  disabled={scoring || recorder.state === "starting"}
                  onClick={record}
                >
                  <Icon name={recording ? "pause" : "mic"} size={56} />
                  <kbd className={styles.micKey} aria-hidden="true">
                    R
                  </kbd>
                </button>
                <div className={styles.rec} role="status" aria-live="polite">
                  <Wave idle={!recording} />
                  {recording && (
                    <div className={styles.meter} aria-label="Thời lượng ghi âm, tối đa 10 giây">
                      <span style={{ animationDuration: `${REC_MAX_MS}ms` }} />
                    </div>
                  )}
                  {scoring ? (
                    <span className={styles.body}>
                      <b>Bông đang chấm…</b>
                    </span>
                  ) : recording ? (
                    <span className={styles.body}>
                      <b>Bông đang nghe…</b> Bấm lại micro hoặc phím R để dừng (tối đa 10 giây).
                    </span>
                  ) : (
                    <span className={styles.body}>
                      Bấm micro hoặc phím <b>R</b> rồi nói. Nghe mẫu trước nếu cậu muốn.
                    </span>
                  )}
                </div>
              </div>
            )}

            {resultMode && (
              <>
                <div className={styles.res} role="status">
                  <Mascot expr={outcome.score.stars === 3 ? "chucmung" : "vui"} size={110} />
                  <div>
                    <div className={styles.stars} role="img" aria-label={`${outcome.score.stars} trên 3 sao`} data-stars>
                      {[1, 2, 3].map((n) => (
                        <span key={n} className={styles.star}>
                          <Icon name={n <= outcome.score.stars ? "star" : "starEmpty"} />
                        </span>
                      ))}
                    </div>
                    <p className={styles.praise}>{outcome.scored ? praiseFor(outcome.score.stars, outcome.score.weak[0]) : "Cậu đã nói rồi, giỏi lắm! Bông ghi lại giọng của cậu nhé."}</p>
                  </div>
                </div>
                <div className={styles.listen}>
                  <Button variant="secondary" icon={hearing ? "pause" : "play"} label="Nghe giọng tớ" onClick={hearMine} />
                  <Button variant="secondary" icon="speaker" label="Nghe giọng mẫu" onClick={hearModel} />
                  <Button variant="secondary" icon="mic" label="Nói lại" shortcut="R" onClick={() => (setOutcome(null), setStage("ready"))} />
                </div>
              </>
            )}
          </div>
        </div>
      </LessonMain>
      <LessonFoot
        left={
          <>
            <Button variant="secondary" size="l" icon="speaker" label="Nghe mẫu" shortcut="Space" onClick={hearModel} />
            <Button variant="secondary" size="l" icon="bulb" label="Gợi ý" shortcut="H" disabled={phase !== "ready"} onClick={hint} />
          </>
        }
        right={<Button variant="primary" size="l" icon="next" label="Tiếp tục" shortcut="Enter" disabled={!resultMode} onClick={() => outcome && finish(outcome.score.stars, outcome.transcript)} />}
      />
    </>
  );
}

function EnterKey({ active, onEnter }: { active: boolean; onEnter: () => void }) {
  useHotkeys({ Enter: onEnter }, { enabled: active, captureNative: true });
  return null;
}

/** Sóng âm trang trí: nhảy khi đang ghi, phẳng khi chờ. Giảm chuyển động thì đứng yên (CSS). */
function Wave({ idle }: { idle: boolean }) {
  return (
    <div className={cn(styles.wave, idle && styles.idle)} aria-hidden="true">
      {Array.from({ length: 28 }, (_, i) => (
        <i key={i} style={{ height: `${20 + Math.round(52 * Math.abs(Math.sin(i * 1.3)))}px`, animationDelay: `${(i % 7) * 0.09}s` }} />
      ))}
    </div>
  );
}
