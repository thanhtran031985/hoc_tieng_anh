"use client";

import { useEffect, useRef, useState } from "react";
import { GameFoot, type GameEndData } from "@/components/lesson";
import { Car } from "@/components/lesson/games/Car";
import { Icon, KeyHint, Mascot, SpeakerButton, WordPicture, type Expr } from "@/components/ui";
import { AUTO_HINT_AFTER, MAX_RACE_ATTEMPTS, gameItem, ghostAt, raceOutcome, toSequence } from "@/lib/rules/games";
import { gameCoins, starsFor } from "@/lib/rules/lesson-score";
import type { ItemResult } from "@/lib/rules/lesson-session";
import { playSfx } from "@/lib/sound";
import { playPronunciation } from "@/lib/speech";
import { useHotkeys } from "@/lib/use-hotkeys";
import { burstStars } from "../burst";
import { saveGameRecordAction } from "../game-actions";
import { GameFrame } from "../GameFrame";
import type { StepProps } from "../types";
import styles from "./race.module.css";

const NEXT_MS = 1100;
const KEYS = ["1", "2", "3", "4"] as const;

type Tip = { expr: Expr; text: string };

/** Vị trí ngang của xe sau `n` đoạn trên `total` đoạn (từ vạch xuất phát đến vạch đích). */
const at = (n: number, total: number) => `calc(var(--st) + (100% - var(--st) - var(--fin)) * ${n / total})`;

/** Đua xe trả lời (Screen32): trả lời đúng thì xe chạy thêm một đoạn, chưa đúng thì xe đứng chờ và làm lại câu đó. Xe ma là chính bé ở lần trước, đi theo số câu đúng sau cùng số lượt trả lời (không theo giờ). */
export function RaceStep({ step, unit, host, lessonId, onComplete }: StepProps<"race">) {
  const { questions, ghost } = step;
  const total = questions.length;
  const [q, setQ] = useState(0);
  const [pos, setPos] = useState(0);
  const [attempts, setAttempts] = useState<boolean[]>([]);
  const [tries, setTries] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<number | null>(null);
  const [okId, setOkId] = useState<number | null>(null);
  const [dimId, setDimId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<ItemResult[]>([]);
  const [end, setEnd] = useState<GameEndData | null>(null);
  const [tip, setTip] = useState<Tip>({ expr: "chao", text: ghost ? "Đua với chính cậu lần trước nào!" : "Trả lời đúng, xe chạy thêm một đoạn!" });

  const question = questions[Math.min(q, total - 1)];
  const answer = question.word;
  const ghostPos = ghostAt(ghost, attempts.length);
  const bodyRefs = useRef(new Map<number, HTMLButtonElement>());
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const spoken = question.kind === "sent" && question.sentence ? question.sentence.replace("___", answer.word) : question.kind === "listen" ? answer.word : "What is this?";
  const hear = () => playPronunciation(spoken, { rate: 0.8 });

  function choose(index: number) {
    const option = question.options[index];
    if (busy || end || !option) return;
    playPronunciation(option.word, { rate: 0.85 });
    const all = [...attempts, option.id === answer.id];
    setAttempts(all);
    if (option.id === answer.id) {
      setBusy(true);
      setOkId(option.id);
      setWrongId(null);
      const item = gameItem(answer.id, tries, [...picks, option.word]);
      const nextItems = [...items, item];
      setItems(nextItems);
      const nextPos = pos + 1;
      setPos(nextPos);
      burstStars(bodyRefs.current.get(option.id) ?? null, 8);
      const beat = ghost !== null && nextPos > (ghostAt(ghost, all.length) ?? 0);
      setTip({ expr: "vui", text: `${beat ? "Vượt xe lần trước rồi! " : "Đúng rồi! "}${answer.word} = ${answer.meaningVi}` });
      if (nextPos >= total) {
        const stars = starsFor(nextItems);
        const outcome = raceOutcome(ghost ? ghost.length : null, all.length);
        const correct = nextItems.filter((i) => i.firstTryCorrect).length;
        // Lưu thành tích cho xe ma lần sau; lỗi không làm hỏng bài.
        if (lessonId) void saveGameRecordAction({ game: "race", lessonId, correct, total, sequence: toSequence(all.slice(0, MAX_RACE_ATTEMPTS)) }).catch(() => undefined);
        later(() => setEnd({ title: outcome.title, note: `${outcome.note} Xu được cộng khi cậu xong cả bài.`, correct, total, unit: "câu", stars, coins: gameCoins(stars) }), NEXT_MS);
        return;
      }
      later(() => {
        setQ((n) => n + 1);
        setOkId(null);
        setTries(0);
        setPicks([]);
        setDimId(null);
        setBusy(false);
      }, NEXT_MS);
    } else {
      playSfx("retry");
      const nextTries = tries + 1;
      setTries(nextTries);
      setPicks((list) => [...list, option.word]);
      setWrongId(option.id);
      const auto = nextTries >= AUTO_HINT_AFTER && dimId === null;
      if (auto) setDimId(question.options.find((o) => o.id !== answer.id && o.id !== option.id)?.id ?? null);
      setTip({ expr: "dongvien", text: `${option.word} là “${option.meaningVi}”. Xe đứng chờ, cậu thử lại nhé!${nextTries >= AUTO_HINT_AFTER ? " Bông làm mờ một đáp án rồi." : ""}` });
    }
  }

  const first = ghost === null;
  return (
    <GameFrame
      host={host}
      skin="sky"
      value={pos}
      max={total}
      unitTitle={unit.title}
      left={total - pos}
      intro={{
        title: "Đua xe trả lời",
        art: (
          <span className={styles.demo}>
            <Car />
          </span>
        ),
        how: "Trả lời đúng (phím 1–4) thì xe chạy thêm một đoạn. Đua với chính cậu lần trước!",
      }}
      end={end}
      onNext={() => onComplete(items)}
    >
      {({ running }) => (
        <>
          <OptionKeys enabled={running && !busy && !end} count={question.options.length} onChoose={choose} />
          <div className={styles.rc}>
            <section className={styles.qc} aria-label={`Câu ${Math.min(q + 1, total)}`}>
              <div className={styles.pic}>
                {question.kind === "listen" ? (
                  <span className={styles.ear}>
                    <SpeakerButton word={answer.word} size="l" label="Nghe từ" rate={0.8} />
                  </span>
                ) : (
                  <WordPicture word={answer.word} src={answer.image} size={130} label="Hình gợi ý" />
                )}
              </div>
              <div className={styles.r}>
                <p className={styles.q}>
                  {question.kind === "listen" ? (
                    <span>
                      Nghe rồi chọn từ đúng
                      <small>Bấm loa to để nghe lại</small>
                    </span>
                  ) : question.kind === "sent" ? (
                    <>
                      <span lang="en">{question.sentence}</span>
                      <SpeakerButton word={spoken} size="s" label="Nghe câu" rate={0.8} />
                    </>
                  ) : (
                    <>
                      <span lang="en">What is this?</span>
                      <SpeakerButton word="What is this?" size="s" label="Nghe câu hỏi" rate={0.8} />
                    </>
                  )}
                </p>
                <div className={styles.ans} role="group" aria-label="Đáp án" style={{ ["--n" as string]: question.options.length }}>
                  {question.options.map((o, i) => (
                    <div key={o.id} className={styles.an}>
                      <button
                        ref={(el) => {
                          if (el) bodyRefs.current.set(o.id, el);
                          else bodyRefs.current.delete(o.id);
                        }}
                        type="button"
                        className={styles.opt}
                        lang="en"
                        data-ok={okId === o.id ? "" : undefined}
                        data-retry={wrongId === o.id ? "" : undefined}
                        data-dim={dimId === o.id ? "" : undefined}
                        aria-keyshortcuts={KEYS[i]}
                        disabled={!running || busy || dimId === o.id}
                        onClick={() => choose(i)}
                      >
                        <KeyHint>{KEYS[i]}</KeyHint>
                        {o.word}
                      </button>
                      <SpeakerButton className={styles.speak} word={o.word} size="s" label={`Nghe: ${o.word}`} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div
              className={styles.track}
              role="img"
              aria-label={`Đường đua: xe của cậu ở đoạn ${pos} trên ${total}${ghostPos === null ? "" : `, xe lần trước ở đoạn ${ghostPos}`}`}
            >
              <div className={styles.road}>
                {!first && (
                  <div className={styles.lane}>
                    <span className={styles.tag}>Lần trước</span>
                    <div className={styles.car} style={{ left: at(ghostPos ?? 0, total) }}>
                      <Car ghost />
                      <span className={styles.label}>Lần trước · {ghostPos ?? 0} câu</span>
                    </div>
                  </div>
                )}
                <div className={styles.lane}>
                  <span className={styles.tag}>Cậu</span>
                  <div className={styles.car} style={{ left: at(pos, total) }}>
                    <Car />
                    <Mascot expr="vui" size={60} className={styles.driver} />
                  </div>
                </div>
                <span className={styles.finish} />
                <span className={styles.flag}>
                  <Icon name="flag" size={22} />
                  Đích
                </span>
                <div className={styles.ticks}>
                  {Array.from({ length: total + 1 }, (_, i) => (
                    <span key={i} style={{ left: `${(100 * i) / total}%` }} />
                  ))}
                </div>
              </div>
            </div>
            {first && (
              <p className={styles.first}>
                <Icon name="star" size={18} />
                Lần đầu chơi: chưa có xe “Lần trước”. Lần sau cậu sẽ đua với chính mình!
              </p>
            )}
          </div>
          <GameFoot
            message={running ? tip.text : "Xe đang chờ ở vạch xuất phát…"}
            expr={tip.expr}
            score={pos}
            total={total}
            unit="câu"
            enabled={running}
            off={busy || !!end}
            hintOff={dimId !== null}
            onReplay={hear}
            onHint={() => {
              setDimId(question.options.find((o) => o.id !== answer.id && o.id !== wrongId)?.id ?? null);
              setTip({ expr: "suynghi", text: "Bông làm mờ một đáp án sai rồi nhé!" });
            }}
          />
          <h1 className="sr-only">Đua xe trả lời</h1>
        </>
      )}
    </GameFrame>
  );
}

/** Phím 1–4 chọn đáp án, chỉ khi trò chơi đang chạy. */
function OptionKeys({ enabled, count, onChoose }: { enabled: boolean; count: number; onChoose: (index: number) => void }) {
  useHotkeys(Object.fromEntries(KEYS.slice(0, count).map((k, i) => [k, () => onChoose(i)])), { enabled });
  return null;
}
