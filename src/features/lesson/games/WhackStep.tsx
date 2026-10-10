"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GameFoot, type GameEndData } from "@/components/lesson";
import { Mole } from "@/components/lesson/games/Mole";
import { Icon, KeyHint, SpeakerButton, WordPicture, type Expr } from "@/components/ui";
import { AUTO_HINT_AFTER, WHACK_KEYS, gameItem, initialHoles, retargetHoles, staticHoles, stepMoles, type Hole, type WhackRound } from "@/lib/rules/games";
import type { PlayWord } from "@/lib/rules/lesson-play";
import { gameCoins, starsFor } from "@/lib/rules/lesson-score";
import type { ItemResult } from "@/lib/rules/lesson-session";
import { seededRandom } from "@/lib/rules/random";
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
import styles from "./whack.module.css";

const MOLE_UP_FALLBACK_MS = 3200;
const TICK_MS = 200;
const TONGUE_MS = 1000;
const NEXT_MS = 900;
const END_DELAY_MS = 1100;
const PRAISE = ["Bốp! Đúng rồi!", "Giỏi quá!", "Tai thính ghê!"];

type Tip = { expr: Expr; text: string };

function readUpMs(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--duration-mole-up").trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? (raw.endsWith("ms") ? n : n * 1000) : MOLE_UP_FALLBACK_MS;
}

/** Âm Bông đọc: “b. ball”. */
const soundOf = (round: WhackRound<PlayWord>) => `${round.letter}. ${round.example.word}`;

/** Đập chuột chữ cái (Screen31): lưới 3×3 hang theo bàn phím số (7 8 9 / 4 5 6 / 1 2 3). 5 lượt chuột cầm chữ rồi 3 lượt chuột cầm hình; luôn có con đúng, đập sai chuột lè lưỡi và không trừ điểm. */
export function WhackStep({ step, unit, host, onComplete }: StepProps<"whack_letters">) {
  const { rounds } = step;
  const total = rounds.length;
  const reduced = useReducedMotion();
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [holes, setHoles] = useState<Hole[]>(() => initialHoles(rounds[0], seededRandom(`${step.id}:m0`), MOLE_UP_FALLBACK_MS));
  const [tries, setTries] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [hint, setHint] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tongue, setTongue] = useState<number | null>(null);
  const [bonk, setBonk] = useState<number | null>(null);
  const [tip, setTip] = useState<Tip>({ expr: "chao", text: "Nghe âm rồi đập con chuột đúng nhé!" });
  const [items, setItems] = useState<ItemResult[]>([]);
  const [end, setEnd] = useState<GameEndData | null>(null);

  const current = rounds[Math.min(round, total - 1)];
  const statics = useMemo(() => staticHoles(current, seededRandom(`${step.id}:s${round}`)), [current, round, step.id]);
  const view = reduced ? statics : holes;

  const upMs = useRef(MOLE_UP_FALLBACK_MS);
  const rng = useRef(seededRandom(`${step.id}:tick`));
  const acc = useRef(0);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    upMs.current = readUpMs();
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  function frame(dt: number) {
    if (busy) return;
    acc.current += dt;
    if (acc.current < TICK_MS) return;
    const span = Math.floor(acc.current / TICK_MS) * TICK_MS;
    acc.current -= span;
    setHoles((list) => stepMoles(list, span, current, rng.current, upMs.current));
  }

  const pictureOf = (value: string) => current.pictures.find((p) => p.word === value) ?? null;
  const labelOf = (h: Hole): string => {
    if (!h.up || h.value === null) return "trống";
    if (current.kind === "letter") return `chữ ${h.value}`;
    return pictureOf(h.value)?.meaningVi ?? h.value;
  };

  function whack(i: number) {
    const h = view[i];
    if (busy || end || !h.up || h.value === null) return;
    if (h.value === current.answer) {
      setBusy(true);
      setBonk(i);
      const item = gameItem(current.example.id, tries, picks);
      const all = [...items, item];
      setItems(all);
      burstStars(document.querySelector(`[data-hole="${i}"]`), 8);
      playPronunciation(current.example.word);
      const next = round + 1;
      setScore(next);
      setTip({
        expr: "vui",
        text: `${PRAISE[round % PRAISE.length]} ${current.letter} như ${current.example.word} (${current.example.meaningVi})`,
      });
      if (next >= total) {
        const stars = starsFor(all);
        const sounds = rounds.filter((r) => r.kind === "letter").map((r) => r.letter).join(", ");
        later(
          () =>
            setEnd({
              correct: all.filter((x) => x.firstTryCorrect).length,
              total,
              unit: "âm",
              stars,
              coins: gameCoins(stars),
              note: `Cậu nhận ra cả ${total} âm: ${sounds}… Xu được cộng khi cậu xong cả bài.`,
            }),
          END_DELAY_MS,
        );
        return;
      }
      later(() => {
        setHoles((list) => retargetHoles(list.map((x, j) => (j === i ? { up: false, value: null, left: 900 } : x)), rounds[next], rng.current, upMs.current));
        acc.current = 0;
        setRound(next);
        setTries(0);
        setPicks([]);
        setHint(false);
        setBonk(null);
        setBusy(false);
        setTip({ expr: "chao", text: next === rounds.findIndex((r) => r.kind === "picture") ? "Giờ chuột cầm hình! Đập hình bắt đầu bằng âm Bông đọc." : "Âm tiếp theo! Nghe kỹ nhé." });
      }, NEXT_MS);
    } else {
      playSfx("retry");
      const nextTries = tries + 1;
      setTries(nextTries);
      setPicks((list) => [...list, h.value as string]);
      setTongue(i);
      later(() => setTongue(null), TONGUE_MS);
      playPronunciation(h.value);
      const auto = nextTries >= AUTO_HINT_AFTER;
      if (auto) setHint(true);
      const what = current.kind === "letter" ? `chữ ${h.value}` : `${h.value} (${pictureOf(h.value)?.meaningVi ?? ""})`;
      setTip({ expr: "dongvien", text: `Lêu lêu! Đây là ${what}. ${auto ? "Chuột đúng đang phát sáng đó!" : "Nghe lại âm nhé!"}` });
    }
  }

  const hear = () => playPronunciation(soundOf(current), { rate: 0.8 });

  return (
    <GameFrame
      host={host}
      skin="sky"
      value={score}
      max={total}
      unitTitle={unit.title}
      left={total - score}
      intro={{
        title: "Đập chuột chữ cái",
        art: (
          <span className={styles.demo}>
            <Icon name="volume" size={40} />
            <span className={styles.demoSign} lang="en">
              {rounds[0].answer}
            </span>
            <KeyHint>5</KeyHint>
          </span>
        ),
        how: "Nghe âm, rồi đập con chuột cầm chữ đúng bằng chuột hoặc phím số 1–9.",
      }}
      end={end}
      onNext={() => onComplete(items)}
    >
      {({ running }) => (
        <>
          <GameLoop active={running && !reduced && !end} onFrame={frame} />
          <AutoSound running={running} round={round} text={soundOf(current)} />
          <HoleKeys enabled={running && !busy && !end} onWhack={whack} />
          <div className={shared.ask}>
            <h1 className={lesson.instr}>{current.kind === "letter" ? "Đập chuột cầm chữ có âm Bông đọc" : "Đập chuột cầm hình bắt đầu bằng âm Bông đọc"}</h1>
            <SpeakerButton word={soundOf(current)} size="l" label="Nghe âm" rate={0.8} />
          </div>
          <div className={styles.yard}>
            <div className={styles.lawn} role="group" aria-label="Sân 9 hang chuột">
              {view.map((h, i) => {
                const picture = h.up && h.value !== null && current.kind === "picture" ? pictureOf(h.value) : null;
                return (
                  <button
                    key={i}
                    type="button"
                    className={styles.hole}
                    data-hole={i}
                    data-up={h.up ? "" : undefined}
                    data-tongue={tongue === i ? "" : undefined}
                    data-hint={hint && h.up && h.value === current.answer ? "" : undefined}
                    aria-keyshortcuts={WHACK_KEYS[i]}
                    aria-label={`Hang phím ${WHACK_KEYS[i]}: ${labelOf(h)}`}
                    disabled={!running}
                    onClick={() => whack(i)}
                  >
                    <KeyHint className={styles.key}>{WHACK_KEYS[i]}</KeyHint>
                    <span className={styles.pit} />
                    <span className={styles.clip}>
                      <span className={styles.mole}>
                        <Mole mood={bonk === i ? "bonk" : tongue === i ? "tongue" : "idle"} />
                        <span className={styles.sign}>
                          {h.value !== null &&
                            (picture ? (
                              <WordPicture word={picture.word} src={picture.image} size={60} label="" />
                            ) : (
                              <span lang="en">{h.value}</span>
                            ))}
                        </span>
                      </span>
                    </span>
                    <span className={styles.lip} />
                  </button>
                );
              })}
            </div>
          </div>
          <GameFoot
            message={running ? tip.text : "Chuột đang chờ cậu…"}
            expr={tip.expr}
            score={score}
            total={total}
            unit="âm"
            replayLabel="Nghe âm"
            enabled={running}
            off={busy || !!end}
            hintOff={hint}
            onReplay={hear}
            onHint={() => {
              setHint(true);
              setTip({ expr: "suynghi", text: `Âm ${current.letter} như ${current.example.word}. Chuột phát sáng là chuột đúng!` });
              playPronunciation(current.example.word, { rate: 0.7 });
            }}
          />
        </>
      )}
    </GameFrame>
  );
}

/** Phím 7 8 9 / 4 5 6 / 1 2 3 đập hang tương ứng, chỉ khi trò chơi đang chạy. */
function HoleKeys({ enabled, onWhack }: { enabled: boolean; onWhack: (hole: number) => void }) {
  useHotkeys(Object.fromEntries(WHACK_KEYS.map((k, i) => [k, () => onWhack(i)])), { enabled });
  return null;
}

/** Bông đọc âm khi trò chơi bắt đầu chạy, khi sang lượt mới hoặc khi chơi tiếp sau tạm dừng. */
function AutoSound({ running, round, text }: { running: boolean; round: number; text: string }) {
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => playPronunciation(text, { rate: 0.8 }), 300);
    return () => window.clearTimeout(t);
  }, [running, round, text]);
  return null;
}
