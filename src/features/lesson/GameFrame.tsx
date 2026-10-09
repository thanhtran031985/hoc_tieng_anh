"use client";

import { useState } from "react";
import { GameEndDialog, GamePauseDialog, GameStartDialog, type GameEndData } from "@/components/lesson";
import type { MascotColor } from "@/components/ui";
import { useHotkeys } from "@/lib/use-hotkeys";
import { ExitDialog } from "./ExitDialog";
import { LessonFrame } from "./LessonFrame";

export type GameFrameProps = {
  level: number;
  mascot: MascotColor;
  /** Tiến độ của bài (thanh trên cùng). */
  value: number;
  max: number;
  unitTitle: string;
  /** Số câu còn lại, hiện trong hộp "Dừng bài học?". */
  left: number;
  /** Lớp phủ bắt đầu. */
  intro: { title: string; art?: React.ReactNode; how: string };
  /** Có giá trị thì mở bảng kết thúc; trò chơi đặt khi hết lượt. */
  end?: GameEndData | null;
  /** Bé xác nhận "Dừng lại" trong hộp "Dừng bài học?". */
  onExit: () => void;
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
export function GameFrame({ level, mascot, value, max, unitTitle, left, intro, end = null, onExit, onNext, children }: GameFrameProps) {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [exiting, setExiting] = useState(false);

  const running = started && !paused && !exiting && !end;
  useHotkeys({ Escape: () => setPaused(true) }, { enabled: running });

  function askExit() {
    setExiting(true);
  }

  return (
    <LessonFrame level={level} mascot={mascot} value={value} max={max} onExit={askExit} onPause={started ? () => setPaused(true) : undefined}>
      {children({ running })}
      <GameStartDialog open={!started && !exiting} title={intro.title} art={intro.art} how={intro.how} onStart={() => setStarted(true)} />
      <GamePauseDialog open={started && paused && !exiting && !end} onResume={() => setPaused(false)} onExit={askExit} />
      {end && <GameEndDialog open={!exiting} result={end} onNext={onNext} />}
      <ExitDialog open={exiting} onClose={() => setExiting(false)} onStop={onExit} left={left} unitTitle={unitTitle} />
    </LessonFrame>
  );
}
