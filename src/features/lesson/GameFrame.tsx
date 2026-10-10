"use client";

import { useEffect, useState } from "react";
import { GameEndDialog, GamePauseDialog, GameStartDialog, type GameEndData } from "@/components/lesson";
import { useHotkeys } from "@/lib/use-hotkeys";
import { ExitDialog } from "./ExitDialog";
import { cn } from "@/lib/cn";
import { LessonFrame } from "./LessonFrame";
import skins from "./games/games.module.css";
import type { GameHost } from "./types";

/** Khung mặc định khi xem thử ở Soạn bài học (không có trình học bao quanh). */
const PREVIEW_HOST: GameHost = { level: 1, mascot: "ngoc", onStop: () => {} };

export type GameFrameProps = {
  /** Khung của bài học đang chơi (đường dẫn, công cụ, thoát bài). Không có thì dùng khung xem thử. */
  host?: GameHost;
  /** Tiến độ của trò chơi (thanh trên cùng). */
  value: number;
  max: number;
  unitTitle: string;
  /** Số lượt còn lại, hiện trong hộp "Dừng bài học?". */
  left: number;
  /** Thay thanh tiến độ ở đầu màn bằng tiêu đề riêng (Mưa từ vựng). */
  head?: React.ReactNode;
  /** Nền của màn: biển (Mưa từ vựng) hoặc trời (các trò còn lại). */
  skin?: "sea" | "sky";
  /** Lớp phủ bắt đầu. */
  intro: { title: string; art?: React.ReactNode; how: string };
  /** Có giá trị thì mở bảng kết thúc; trò chơi đặt khi hết lượt. */
  end?: GameEndData | null;
  /** Bấm "Tiếp tục" ở bảng kết thúc. */
  onNext: () => void;
  /** Trò chơi vẽ phần giữa và chân bài (GameFoot). `running` là false khi chưa bắt đầu, đang tạm dừng, đang hỏi thoát hoặc đã xong: dừng bộ đếm, chuyển động và phím tắt. */
  children: (state: { running: boolean }) => React.ReactNode;
};

/**
 * Khung mini game: bắt đầu → chơi → (Esc hoặc ⏸ = tạm dừng) → kết thúc.
 * Esc khi đang chơi mở "Tạm dừng"; "Thoát" trong đó mở "Dừng bài học?" (hộp tạm dừng ẩn đi, đóng lại thì quay về hộp tạm dừng).
 * Dùng hoàn toàn bằng bàn phím: Enter bắt đầu / chơi tiếp / tiếp tục, Esc tạm dừng hoặc chơi tiếp.
 */
export function GameFrame({ host = PREVIEW_HOST, value, max, unitTitle, left, head, skin = "sky", intro, end = null, onNext, children }: GameFrameProps) {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [exiting, setExiting] = useState(false);

  const running = started && !paused && !exiting && !end;
  // Esc tạm dừng cả khi bé đang gõ trong ô nhập (Mưa từ vựng).
  useHotkeys({ Escape: () => setPaused(true) }, { enabled: running, inInputs: ["Escape"] });
  // Rời tab thì trò chơi tự tạm dừng, quay lại bé bấm "Chơi tiếp".
  useEffect(() => {
    const onHidden = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => document.removeEventListener("visibilitychange", onHidden);
  }, []);

  function askExit() {
    setExiting(true);
  }

  return (
    <LessonFrame level={host.level} mascot={host.mascot} value={value} max={max} onExit={askExit} onPause={started ? () => setPaused(true) : undefined} crumb={host.crumb} extra={host.extra} focus={host.focus} head={head} className={cn(skins.skin, skin === "sea" ? skins.sea : skins.sky)}>
      {children({ running })}
      <GameStartDialog open={!started && !exiting} title={intro.title} art={intro.art} how={intro.how} onStart={() => setStarted(true)} />
      <GamePauseDialog open={started && paused && !exiting && !end} onResume={() => setPaused(false)} onExit={askExit} />
      {end && <GameEndDialog open={!exiting} result={end} onNext={onNext} />}
      <ExitDialog open={exiting} onClose={() => setExiting(false)} onStop={host.onStop} left={left} unitTitle={unitTitle} />
    </LessonFrame>
  );
}
