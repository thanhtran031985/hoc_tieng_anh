"use client";

import { Topbar, type TopbarLearner } from "@/components/ui";

const learners: TopbarLearner[] = [
  { name: "Minh An", level: 1, levelName: "Hạt giống", hair: "buns" },
  { name: "Bảo Ngọc", level: 3, levelName: "Lá xanh", hair: "bob" },
  { name: "Gia Huy", level: 7, levelName: "Sydney", hair: "spiky" },
];

export function TopbarDemo() {
  return (
    <>
      {learners.map((l, i) => (
        <div key={l.name} className="rounded-lg bg-bg shadow-card">
          <Topbar learner={l} onBack={i === 0 ? () => {} : undefined} stars={128 + i} coins={340} streak={5} />
        </div>
      ))}
    </>
  );
}
