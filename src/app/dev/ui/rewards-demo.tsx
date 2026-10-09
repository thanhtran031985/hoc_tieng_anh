"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { GiftBox, Medal, RewardPopup, Sticker } from "@/components/rewards";

/** Hộp quà nhận thưởng: mở thử sticker và huy hiệu, kèm các hình dùng trong hộp (đối chiếu designs/components/RewardPopup). */
export function RewardsDemo() {
  const [kind, setKind] = useState<"sticker" | "badge" | null>(null);
  const [added, setAdded] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button label="Mở quà: sticker" variant="primary" size="m" onClick={() => setKind("sticker")} />
        <Button label="Mở quà: huy hiệu" variant="secondary" size="m" onClick={() => setKind("badge")} />
        <span className="font-body text-body" data-testid="added">
          Đã cho vào bộ sưu tập: {added}
        </span>
      </div>
      <div className="flex flex-wrap items-end gap-8">
        <GiftBox size={120} />
        <GiftBox open size={120} />
        <Sticker word="cat" label="Sticker cat, con mèo" tilt={-4} />
        <Sticker word="dog" isNew tilt={3} />
        <Sticker word="bird" owned={false} />
        <Medal icon="flame" level={3} size={96} />
        <Medal icon="star" level={6} size={96} earned={false} />
      </div>

      <RewardPopup
        key={kind ?? "none"}
        open={kind === "sticker"}
        kind="sticker"
        word="cat"
        en="cat"
        vi="con mèo"
        onAdd={() => {
          setAdded((n) => n + 1);
          setKind(null);
        }}
      />
      <RewardPopup
        key={`${kind ?? "none"}-b`}
        open={kind === "badge"}
        kind="badge"
        icon="flame"
        level={3}
        en="Streak star"
        vi="Ngôi sao chuyên cần"
        cond="Học 3 ngày liên tiếp"
        onAdd={() => {
          setAdded((n) => n + 1);
          setKind(null);
        }}
      />
    </div>
  );
}
