"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, SpeakerButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import { completionScore, praiseFor, scoreSpeech } from "@/lib/rules/speaking";
import { playSfx } from "@/lib/sound";
import { stopPronunciation, type SpeechAccent } from "@/lib/speech";
import { canRecord, hasMicrophone, useRecorder } from "@/features/lesson/use-recorder";
import { speechRecognitionCtor, useSpeechRecognition } from "@/features/lesson/use-speech-recognition";
import styles from "./along-speak.module.css";

type Outcome = "idle" | "scoring" | "ok" | "again";

type Props = {
  /** Câu mẫu bé nghe rồi nói theo. */
  text: string;
  accent?: SpeechAccent;
  /** Hồ sơ bật “Chấm phát âm” (Adult07): tắt thì chỉ ghi nhận bé đã nói, không gọi nhận diện giọng nói. */
  scoring?: boolean;
};

/**
 * “Nói theo” sau khi mở đủ nhánh (task 17): nghe câu mẫu, bấm micro rồi nói lại. Dễ tính, không phạt; chỉ để bé tập nói nên không lưu bản ghi
 * và không tính sao. Máy không có micro thì Bông nhắn nhẹ nhàng, bé vẫn đi tiếp được.
 */
export function AlongSpeak({ text, accent, scoring = true }: Props) {
  const [outcome, setOutcome] = useState<Outcome>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [mic, setMic] = useState<"unknown" | "present" | "none">("unknown");
  const recognition = useSpeechRecognition("en-US");
  const alive = useRef(true);
  const canScore = scoring && speechRecognitionCtor() !== null;

  useEffect(() => {
    alive.current = true;
    if (!canRecord()) {
      void Promise.resolve().then(() => alive.current && setMic("none"));
    } else {
      void hasMicrophone().then((has) => alive.current && setMic(has ? "present" : "none"));
    }
    return () => {
      alive.current = false;
      recognition.cancel();
      stopPronunciation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recorder = useRecorder(async () => {
    setOutcome("scoring");
    const heard = canScore ? await recognition.end() : null;
    if (!alive.current) return;
    const score = heard !== null ? scoreSpeech(text, heard, "easy") : completionScore(text);
    setMessage(praiseFor(score.stars, score.weak[0]));
    setOutcome(score.stars >= 2 ? "ok" : "again");
    if (score.stars >= 2) playSfx("correct");
  });

  useEffect(() => {
    if (recorder.state === "denied" || recorder.state === "nomic" || recorder.state === "error") recognition.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorder.state]);

  function toggle() {
    if (recorder.state === "recording") return recorder.stop();
    if (outcome === "scoring") return;
    stopPronunciation();
    setOutcome("idle");
    setMessage(null);
    if (canScore) recognition.begin();
    void recorder.start();
  }

  const recording = recorder.state === "recording";
  const blocked = recorder.state === "denied";
  const noMic = mic === "none" || recorder.state === "nomic";
  const line = recording
    ? "Bông đang nghe…"
    : outcome === "scoring"
      ? "Bông đang nghe lại…"
      : (message ?? (blocked ? "Chưa bật được micro. Nhờ bố mẹ cho phép micro nhé." : noMic ? "Máy chưa có micro. Cậu nghe rồi đọc to theo Bông nhé!" : `Bấm micro rồi nói “${text}”`));

  return (
    <div className={styles.along} data-along>
      <p className={styles.label}>Nghe rồi nói lại câu này:</p>
      <div className={styles.row}>
        <SpeakerButton word={text} size="m" label="Nghe câu mẫu" accent={accent} />
        <b lang="en">{text}</b>
      </div>
      <button
        type="button"
        className={cn(styles.mic, recording && styles.rec, outcome === "ok" && styles.okMic)}
        data-mic
        disabled={noMic}
        aria-label={recording ? "Đang nghe cậu nói, bấm để dừng" : "Bấm để nói (Space)"}
        onClick={toggle}
      >
        <Icon name={outcome === "ok" ? "check" : "mic"} size={34} />
      </button>
      <p className={styles.msg} aria-live="polite">
        {line}
      </p>
    </div>
  );
}
