"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clouds, type GameEndData } from "@/components/lesson";
import { Button, Icon, Mascot, WordPicture, type Expr } from "@/components/ui";
import { cn } from "@/lib/cn";
import { gameItem, matchedLength, nearestWord, nextRainId, requeue } from "@/lib/rules/games";
import { gameCoins, starsFor } from "@/lib/rules/lesson-score";
import type { ItemResult } from "@/lib/rules/lesson-session";
import { playSfx } from "@/lib/sound";
import { playPronunciation } from "@/lib/speech";
import { burstStars } from "../burst";
import { GameFrame } from "../GameFrame";
import type { StepProps } from "../types";
import { FocusWhenRunning, GameLoop } from "./use-game-loop";
import { useReducedMotion } from "./use-reduced-motion";
import shared from "./games.module.css";
import styles from "./rain.module.css";

const MAX_DROPS = 3;
const SPAWN_EVERY_S = 2.6;
/** Chỗ từ xuất hiện phía trên trời (px, âm = chưa vào màn). */
const SPAWN_Y = -96;
const PUDDLE_MS = 2300;
const END_DELAY_MS = 700;
/** Giảm chuyển động: ba từ đứng yên ở ba tầng trời. */
const STILL = [
  { x: 24, top: 8 },
  { x: 50, top: 26 },
  { x: 76, top: 44 },
] as const;

type Drop = { id: number; x: number; v: number };
type Pop = { key: number; id: number; x: number; y: number };
type Puddle = { key: number; x: number; text: string };
type Tip = { expr: Expr; text: string };

const PRAISE = ["Bùm! Đúng rồi!", "Giỏi quá!", "Chính tả chuẩn luôn!"];

/** Mưa từ vựng (Screen11): từ kèm hình rơi chậm, bé gõ đúng chính tả rồi Enter để phá. Chạm đất không trừ điểm, từ sẽ quay lại sau. Không đồng hồ đếm ngược. */
export function RainStep({ step, unit, host, onComplete }: StepProps<"word_rain">) {
  const { words } = step;
  const byId = useMemo(() => new Map(words.map((w) => [w.id, w])), [words]);
  const reduced = useReducedMotion();

  const [pending, setPending] = useState<number[]>(() => words.map((w) => w.id));
  const [drops, setDrops] = useState<Drop[]>([]);
  const [typed, setTyped] = useState("");
  const [wrong, setWrong] = useState<Record<number, number>>({});
  const [pops, setPops] = useState<Pop[]>([]);
  const [puddles, setPuddles] = useState<Puddle[]>([]);
  const [tip, setTip] = useState<Tip>({ expr: "chao", text: "Gõ từ đang rơi rồi nhấn Enter nhé!" });
  const [shake, setShake] = useState(false);
  const [end, setEnd] = useState<GameEndData | null>(null);
  const [result, setResult] = useState<ItemResult[]>([]);

  const fieldRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const els = useRef(new Map<number, HTMLElement>());
  const ys = useRef(new Map<number, number>());
  const landed = useRef(new Set<number>());
  const seq = useRef(0);
  const spawnIn = useRef(0.4);
  const live = useRef({ pending, drops });
  const timers = useRef<number[]>([]);
  useEffect(() => {
    live.current = { pending, drops };
  });
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const total = words.length;
  const done = total - pending.length;
  const visible = reduced
    ? pending.slice(0, MAX_DROPS).map((id, i) => ({ id, x: STILL[i].x, top: STILL[i].top as number | undefined }))
    : drops.map((d) => ({ id: d.id, x: d.x, top: undefined as number | undefined }));
  const onScreenWords = visible.map((v) => byId.get(v.id)!.word);

  function frame(dtMs: number) {
    const field = fieldRef.current;
    if (!field) return;
    const s = dtMs / 1000;
    const { pending: waiting, drops: falling } = live.current;
    spawnIn.current -= s;
    if (spawnIn.current <= 0 && falling.length < MAX_DROPS) {
      const id = nextRainId(waiting, falling.map((d) => d.id));
      if (id !== null) {
        seq.current += 1;
        const k = seq.current;
        landed.current.delete(id);
        ys.current.set(id, SPAWN_Y);
        setDrops((list) => (list.some((d) => d.id === id) ? list : [...list, { id, x: 12 + ((k * 23) % 76), v: 34 + (k % 3) * 6 }]));
        spawnIn.current = SPAWN_EVERY_S;
      } else spawnIn.current = 0.5;
    }
    const limit = field.clientHeight - (groundRef.current?.offsetHeight ?? 0);
    for (const d of falling) {
      const el = els.current.get(d.id);
      if (!el || landed.current.has(d.id)) continue;
      const y = (ys.current.get(d.id) ?? SPAWN_Y) + d.v * s;
      ys.current.set(d.id, y);
      el.style.transform = `translate(-50%, ${y}px)`;
      if (y + el.offsetHeight >= limit) land(d);
    }
  }

  // Chạm đất: không trừ điểm, từ xếp lại cuối hàng và sẽ rơi lại sau.
  function land(d: Drop) {
    landed.current.add(d.id);
    ys.current.delete(d.id);
    const word = byId.get(d.id)!.word;
    setDrops((list) => list.filter((x) => x.id !== d.id));
    setPending((list) => requeue(list, d.id));
    seq.current += 1;
    const key = seq.current;
    setPuddles((list) => [...list, { key, x: d.x, text: `${word} sẽ quay lại sau` }]);
    later(() => setPuddles((list) => list.filter((p) => p.key !== key)), PUDDLE_MS);
    setTip({ expr: "dongvien", text: `${word} chạm đất rồi, sẽ quay lại sau nhé!` });
  }

  function destroy(id: number) {
    const word = byId.get(id)!;
    const spot = visible.find((v) => v.id === id);
    const el = els.current.get(id) ?? null;
    burstStars(el, 6);
    playPronunciation(word.word);
    seq.current += 1;
    const key = seq.current;
    if (spot) setPops((list) => [...list, { key, id, x: spot.x, y: reduced ? 0 : (ys.current.get(id) ?? 0) }]);
    later(() => setPops((list) => list.filter((p) => p.key !== key)), 460);
    ys.current.delete(id);
    setDrops((list) => list.filter((d) => d.id !== id));
    const rest = pending.filter((x) => x !== id);
    setPending(rest);
    setTyped("");
    setTip({ expr: "vui", text: `${PRAISE[done % PRAISE.length]} ${word.word} = ${word.meaningVi}` });
    if (rest.length === 0) {
      const items = words.map((w) => gameItem(w.id, wrong[w.id] ?? 0));
      const stars = starsFor(items);
      setResult(items);
      later(
        () =>
          setEnd({
            correct: items.filter((i) => i.firstTryCorrect).length,
            total,
            unit: "từ",
            stars,
            coins: gameCoins(stars),
            note: "Xu được cộng khi cậu xong cả bài.",
          }),
        END_DELAY_MS,
      );
    }
  }

  function fire() {
    const t = typed.trim().toLowerCase();
    if (!t || end) return;
    const hit = visible.find((v) => byId.get(v.id)!.word.toLowerCase() === t);
    if (hit) return destroy(hit.id);
    playSfx("retry");
    const near = nearestWord(onScreenWords, t);
    if (near) {
      const nearId = visible.find((v) => byId.get(v.id)!.word === near)?.id;
      if (nearId !== undefined) setWrong((w) => ({ ...w, [nearId]: (w[nearId] ?? 0) + 1 }));
    }
    setShake(true);
    later(() => setShake(false), 450);
    setTip(near ? { expr: "dongvien", text: `Gần đúng rồi! Nhìn kỹ chữ ${near} nhé.` } : { expr: "suynghi", text: "Chưa có từ này trên trời. Thử từ khác nhé!" });
  }

  const sample = words[0];
  return (
    <GameFrame
      host={host}
      skin="sea"
      value={done}
      max={total}
      unitTitle={unit.title}
      left={total - done}
      head={
        <>
          <h1 className={styles.title}>Mưa từ vựng</h1>
          <span className={styles.score} data-gscore>
            <Icon name="star" size={28} />
            <b>{done}</b>
            <span>/{total} từ đã phá</span>
          </span>
        </>
      }
      intro={{
        title: "Mưa từ vựng",
        art: (
          <span className={styles.demo}>
            <span className={styles.bub}>
              <span className={styles.pic}>
                <WordPicture word={sample.word} src={sample.image} size={48} label="" />
              </span>
              <span className={styles.wd} lang="en">
                {sample.word}
              </span>
            </span>
          </span>
        ),
        how: "Gõ đúng chính tả từ đang rơi rồi nhấn Enter để phá. Từ chạm đất sẽ quay lại sau.",
      }}
      end={end}
      onNext={() => onComplete(result)}
    >
      {({ running }) => (
        <>
          <GameLoop active={running && !reduced && !end} onFrame={frame} />
          <FocusWhenRunning running={running} target={inputRef} />
          <div className={shared.field} ref={fieldRef} role="list" aria-label="Từ đang rơi">
            <Clouds />
            {visible.map((v) => {
              const word = byId.get(v.id)!;
              const hit = matchedLength(word.word, typed);
              return (
                <div
                  key={v.id}
                  role="listitem"
                  ref={(el) => {
                    if (el) els.current.set(v.id, el);
                    else els.current.delete(v.id);
                  }}
                  className={cn(styles.drop, v.top !== undefined && styles.still, hit > 0 && styles.target)}
                  style={{ left: `${v.x}%`, top: v.top !== undefined ? `${v.top}%` : undefined }}
                >
                  <div className={styles.bub}>
                    <span className={styles.pic}>
                      <WordPicture word={word.word} src={word.image} size={48} label="" />
                    </span>
                    <span className={styles.wd} lang="en">
                      {hit > 0 ? (
                        <>
                          <span className={styles.hit}>{word.word.slice(0, hit)}</span>
                          {word.word.slice(hit)}
                        </>
                      ) : (
                        word.word
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
            {pops.map((p) => {
              const word = byId.get(p.id)!;
              return (
                <div key={p.key} className={styles.pop} aria-hidden="true" style={{ left: `${p.x}%`, ["--y" as string]: `${p.y}px` }}>
                  <div className={styles.bub}>
                    <span className={styles.pic}>
                      <WordPicture word={word.word} src={word.image} size={48} label="" />
                    </span>
                    <span className={styles.wd}>{word.word}</span>
                  </div>
                </div>
              );
            })}
            {puddles.map((p) => (
              <span key={p.key} className={cn(shared.note, styles.puddle)} style={{ left: `${p.x}%` }}>
                {p.text}
              </span>
            ))}
            <div className={styles.ground} ref={groundRef} />
          </div>
          <footer className={styles.typebar}>
            <div className={styles.typein}>
              <Mascot expr={tip.expr} size={84} className={styles.dragon} />
              <p className={styles.msg} aria-live="polite">
                {tip.text}
              </p>
              <input
                ref={inputRef}
                className={cn(styles.input, shake && styles.shake)}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    fire();
                  }
                }}
                disabled={!running}
                placeholder="gõ ở đây…"
                aria-label="Gõ từ tiếng Anh"
                lang="en"
                maxLength={24}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              <Button size="l" label="Phá" shortcut="Enter" disabled={!running} onClick={() => (fire(), inputRef.current?.focus())} />
            </div>
          </footer>
        </>
      )}
    </GameFrame>
  );
}
