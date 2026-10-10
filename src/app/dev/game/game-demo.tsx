"use client";

import { useState } from "react";
import { ClickableWords, GameFoot, type GameEndData } from "@/components/lesson";
import { Button, Icon } from "@/components/ui";
import { GameFrame } from "@/features/lesson/GameFrame";
import { LessonMain } from "@/features/lesson/LessonFrame";

const TOTAL = 3;
const GLOSSARY = { this: "đây, cái này", is: "là", a: "một", bird: "con chim", brown: "màu nâu", it: "nó", likes: "thích", seeds: "hạt" };

/** Trò chơi giả để thử khung: mỗi lần bấm "Chọn đúng" là một điểm, đủ 3 thì kết thúc. Không có bộ đếm giờ. */
export function GameDemo() {
  const [score, setScore] = useState(0);
  const [end, setEnd] = useState<GameEndData | null>(null);
  const [log, setLog] = useState("");

  return (
    <GameFrame
      host={{ level: 3, mascot: "ngoc", onStop: () => setLog("Bé chọn Dừng lại") }}
      value={score}
      max={TOTAL}
      unitTitle="Con vật"
      left={TOTAL - score}
      intro={{
        title: "Mưa từ",
        art: <Icon name="star" size={96} />,
        how: "Bấm vào từ đúng trước khi nó rơi xuống đất.",
      }}
      end={end}
      onNext={() => {
        setEnd(null);
        setScore(0);
        setLog("Bé bấm Tiếp tục ở bảng kết thúc");
      }}
    >
      {({ running }) => (
        <>
          <LessonMain>
            <p data-testid="sentence" style={{ fontSize: "var(--text-word)", lineHeight: "var(--text-word--line-height)", fontFamily: "var(--font-display)", fontWeight: 700, paddingTop: "var(--space-12)" }}>
              <ClickableWords text="This is a brown bird. It likes seeds!" glossary={GLOSSARY} />
            </p>
            <Button
              label="Chọn đúng"
              disabled={!running}
              data-testid="correct"
              onClick={() => {
                const next = score + 1;
                setScore(next);
                if (next >= TOTAL) setEnd({ correct: next, total: TOTAL, unit: "từ", stars: 3, coins: 20 });
              }}
            />
            <p data-testid="log" aria-live="polite">
              {log}
            </p>
            <p data-testid="running">{running ? "đang chạy" : "đã dừng"}</p>
          </LessonMain>
          <GameFoot
            message={running ? "Cố lên nào!" : "Bông chờ cậu."}
            score={score}
            total={TOTAL}
            enabled={running}
            onReplay={() => setLog("Nghe lại (Space)")}
            onHint={() => setLog("Gợi ý (H)")}
          />
        </>
      )}
    </GameFrame>
  );
}
