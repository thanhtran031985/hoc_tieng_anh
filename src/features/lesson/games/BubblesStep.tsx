"use client";

import { useEffect, useRef, useState } from "react";
import { Clouds, GameFoot, type GameEndData } from "@/components/lesson";
import { Icon, KeyHint, SpeakerButton, WordPicture, type Expr } from "@/components/ui";
import { BUBBLE_LANES, BUBBLE_STILL_Y, BUBBLE_X, gameItem, initialBubbleLanes, refillBubbleLane, AUTO_HINT_AFTER } from "@/lib/rules/games";
import { gameCoins, starsFor } from "@/lib/rules/lesson-score";
import type { ItemResult } from "@/lib/rules/lesson-session";
import { seededRandom } from "@/lib/rules/random";
import type { PlayWord } from "@/lib/rules/lesson-play";
import { playSfx } from "@/lib/sound";
import { playPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { burstStars } from "../burst";
import { GameFrame } from "../GameFrame";
import lesson from "../lesson.module.css";
import type { StepProps } from "../types";
import { GameLoop } from "./use-game-loop";
import { useReducedMotion } from "./use-reduced-motion";
import shared from "./games.module.css";
import styles from "./bubbles.module.css";

/** Thời gian bóng bay hết màn (ms): token `--duration-bubble-rise`. */
const RISE_FALLBACK_MS = 11000;
const BACK_WAIT_MS = 1600;
const NOTE_MS = 2300;
const POP_MS = 900;
const END_DELAY_MS = 1100;
const KEYS = ["1", "2", "3", "4", "5"] as const;
const PRAISE = ["Bùm! Đúng rồi!", "Giỏi quá!", "Trúng phóc!"];

type Tip = { expr: Expr; text: string };
type Note = { key: number; lane: number };

function readRiseMs(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--duration-bubble-rise").trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? (raw.endsWith("ms") ? n : n * 1000) : RISE_FALLBACK_MS;
}

/** Bong bóng từ vựng (Screen30): nghe một từ, bấm bong bóng có hình đúng (hoặc phím 1–5). Bóng bay khỏi màn thì bay lại; nhầm thì bóng lắc và Bông nói từ đó. */
export function BubblesStep({ step, unit, host, onComplete }: StepProps<"word_bubbles">) {
  const { targets, pool } = step;
  const total = targets.length;
  const reduced = useReducedMotion();
  const [lanes, setLanes] = useState<PlayWord[]>(() => initialBubbleLanes({ targets, pool }, seededRandom(`${step.id}:lanes`)));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [hint, setHint] = useState(false);
  const [busy, setBusy] = useState(false);
  const [popped, setPopped] = useState<number | null>(null);
  const [wob, setWob] = useState<number | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tip, setTip] = useState<Tip>({ expr: "chao", text: "Nghe từ rồi bấm bong bóng có hình đúng nhé!" });
  const [items, setItems] = useState<ItemResult[]>([]);
  const [end, setEnd] = useState<GameEndData | null>(null);

  const target = targets[Math.min(round, total - 1)];

  const fieldRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const rise = useRef<number[]>([0.12, 0.29, 0.46, 0.2, 0.37]);
  const wait = useRef<number[]>([0, 0, 0, 0, 0]);
  const clock = useRef(0);
  const riseMs = useRef(RISE_FALLBACK_MS);
  const seq = useRef(0);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    riseMs.current = readRiseMs();
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  // Đặt vị trí mỗi bóng bằng transform trực tiếp (không qua React) để giữ 60 khung hình.
  function place(laneIndex: number) {
    const field = fieldRef.current;
    const el = els.current[laneIndex];
    if (!field || !el) return;
    const h = field.clientHeight;
    const d = el.offsetWidth;
    const y = reduced ? BUBBLE_STILL_Y[laneIndex] * h : rise.current[laneIndex] * (h + d) - d;
    const sway = reduced ? 0 : Math.sin(clock.current / 900 + laneIndex * 1.7) * 12;
    el.style.transform = `translate(${sway}px, ${-y}px)`;
  }

  function frame(dt: number) {
    clock.current += dt;
    for (let i = 0; i < BUBBLE_LANES; i++) {
      const el = els.current[i];
      if (!el) continue;
      if (wait.current[i] > 0) {
        wait.current[i] -= dt;
        if (wait.current[i] <= 0) {
          rise.current[i] = 0;
          el.removeAttribute("data-gone");
        }
        continue;
      }
      rise.current[i] += dt / riseMs.current;
      if (rise.current[i] > 1) {
        wait.current[i] = BACK_WAIT_MS;
        el.setAttribute("data-gone", "");
        seq.current += 1;
        const key = seq.current;
        setNotes((list) => [...list, { key, lane: i }]);
        later(() => setNotes((list) => list.filter((n) => n.key !== key)), NOTE_MS);
      }
      place(i);
    }
  }

  // Giảm chuyển động hoặc chưa chạy: đặt bóng đúng chỗ mỗi khi vẽ lại.
  useEffect(() => {
    if (reduced) for (let i = 0; i < BUBBLE_LANES; i++) place(i);
  });

  const hearTarget = () => playPronunciation(target.word, { rate: 0.8 });

  function pick(laneIndex: number) {
    if (busy || end || wait.current[laneIndex] > 0) return;
    const word = lanes[laneIndex];
    if (word.id === target.id) {
      setBusy(true);
      setPopped(laneIndex);
      const item = gameItem(target.id, tries, [...picks, word.word]);
      const all = [...items, item];
      setItems(all);
      burstStars(els.current[laneIndex], 8);
      playPronunciation(word.word);
      setTip({ expr: "vui", text: `${PRAISE[round % PRAISE.length]} ${word.word} = ${word.meaningVi}` });
      const next = round + 1;
      setScore(next);
      if (next >= total) {
        const stars = starsFor(all);
        later(() => setEnd({ correct: all.filter((i) => i.firstTryCorrect).length, total, unit: "từ", stars, coins: gameCoins(stars), note: "Xu được cộng khi cậu xong cả bài." }), END_DELAY_MS);
        return;
      }
      later(() => {
        setRound(next);
        setLanes((list) => refillBubbleLane(list, laneIndex, targets[next], pool, seededRandom(`${step.id}:${next}`)));
        // Bóng mới (có thể là từ cần tìm kế tiếp) hiện lại sau một nhịp ngắn, đã ở trong màn để bé thấy ngay.
        rise.current[laneIndex] = 0.32;
        if (!reduced) {
          wait.current[laneIndex] = 900;
          els.current[laneIndex]?.setAttribute("data-gone", "");
        }
        setPopped(null);
        setTries(0);
        setPicks([]);
        setHint(false);
        setBusy(false);
        setTip({ expr: "chao", text: "Từ tiếp theo! Nghe kỹ nhé." });
      }, POP_MS);
    } else {
      playSfx("retry");
      const nextTries = tries + 1;
      setTries(nextTries);
      setPicks((list) => [...list, word.word]);
      setWob(laneIndex);
      later(() => setWob(null), 460);
      playPronunciation(word.word);
      const auto = nextTries >= AUTO_HINT_AFTER;
      if (auto) setHint(true);
      setTip({ expr: "dongvien", text: `Đây là ${word.word} (${word.meaningVi}). ${auto ? "Bông làm sáng bóng đúng rồi đó!" : "Nghe lại rồi tìm tiếp nhé!"}` });
    }
  }


  return (
    <GameFrame
      host={host}
      skin="sky"
      value={score}
      max={total}
      unitTitle={unit.title}
      left={total - score}
      intro={{
        title: "Bong bóng từ vựng",
        art: (
          <span className={styles.hand}>
            <Icon name="volume" size={40} />
            <span className={styles.demo}>
              <KeyHint>1</KeyHint>
              <WordPicture word={targets[0].word} src={targets[0].image} size={72} label="" />
            </span>
          </span>
        ),
        how: "Nghe từ, rồi bấm bong bóng có hình đúng hoặc nhấn phím số in trên bóng.",
      }}
      end={end}
      onNext={() => onComplete(items)}
    >
      {({ running }) => (
        <>
          <GameLoop active={running && !reduced && !end} onFrame={frame} />
          <AutoSpeak running={running} round={round} text={target.word} />
          <LaneKeys enabled={running && !busy && !end} onPick={pick} />
          <div className={shared.ask}>
            <h1 className={lesson.instr}>Nghe rồi bắn bong bóng có hình đúng</h1>
            <SpeakerButton word={target.word} size="l" label="Nghe từ" rate={0.8} />
          </div>
          <div className={shared.field} ref={fieldRef} role="group" aria-label="Bầu trời bong bóng">
            <Clouds />
            {lanes.map((word, i) => (
                <button
                  key={i}
                  ref={(el) => {
                    els.current[i] = el;
                  }}
                  type="button"
                  className={styles.bub}
                  data-lane={i}
                  data-hint={hint && word.id === target.id ? "" : undefined}
                  data-wob={wob === i ? "" : undefined}
                  data-pop={popped === i ? "" : undefined}
                  style={{ left: `${BUBBLE_X[i]}%` }}
                  aria-keyshortcuts={KEYS[i]}
                  aria-label={`Bong bóng ${i + 1}: ${word.meaningVi}`}
                  disabled={!running}
                  onClick={() => pick(i)}
                >
                  <KeyHint className={styles.key}>{KEYS[i]}</KeyHint>
                  <span className={styles.pic}>
                    <WordPicture word={word.word} src={word.image} size={92} label="" />
                  </span>
                </button>
            ))}
            {notes.map((n) => (
              <span key={n.key} className={`${shared.note} ${styles.back}`} style={{ left: `${BUBBLE_X[n.lane]}%` }}>
                Bóng {n.lane + 1} sẽ bay lại sau
              </span>
            ))}
          </div>
          <GameFoot
            message={running ? tip.text : "Bông đang chờ cậu…"}
            expr={tip.expr}
            score={score}
            total={total}
            unit="từ"
            enabled={running}
            off={busy || !!end}
            hintOff={hint}
            onReplay={hearTarget}
            onHint={() => {
              setHint(true);
              setTip({ expr: "suynghi", text: "Bóng đang phát sáng là bóng đúng đó!" });
            }}
          />
        </>
      )}
    </GameFrame>
  );
}

/** Phím 1–5 chọn bóng, chỉ chạy khi trò chơi đang chạy (không phải lúc tạm dừng). */
function LaneKeys({ enabled, onPick }: { enabled: boolean; onPick: (lane: number) => void }) {
  useHotkeys(Object.fromEntries(KEYS.map((k, i) => [k, () => onPick(i)])), { enabled });
  return null;
}

/** Bông đọc từ cần tìm khi trò chơi bắt đầu chạy, khi sang từ mới hoặc khi chơi tiếp sau tạm dừng. */
function AutoSpeak({ running, round, text }: { running: boolean; round: number; text: string }) {
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => playPronunciation(text, { rate: 0.8 }), 300);
    return () => window.clearTimeout(t);
  }, [running, round, text]);
  return null;
}
