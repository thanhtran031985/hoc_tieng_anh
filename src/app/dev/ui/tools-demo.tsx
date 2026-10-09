"use client";

import { useState } from "react";
import { FocusBadge, LessonCrumb, LessonTools } from "@/components/lesson";
import type { SoundSettings } from "@/lib/schemas";

/** Hai nút công cụ bài học, bảng âm thanh và thanh đường dẫn (đối chiếu designs/components/LessonTools, Screen46). Không lưu gì lên server. */
export function ToolsDemo() {
  const [focus, setFocus] = useState(false);
  const [sound, setSound] = useState<SoundSettings>({ musicOn: true, soundOn: true, volume: 70 });
  return (
    <div className="flex flex-col gap-4">
      <LessonCrumb island="Lá xanh" unit="Nhà của em" lesson="Bài 3 · My home" learner={{ name: "Minh", level: 3, hair: "short" }} minutes={{ used: 12, limit: 20 }} />
      <div className="flex items-center justify-end gap-4 pb-16">
        {focus && <FocusBadge />}
        <LessonTools focus={focus} onToggleFocus={() => setFocus((on) => !on)} sound={sound} onSoundChange={(patch) => setSound((s) => ({ ...s, ...patch }))} />
      </div>
      <div className="flex items-center justify-end gap-4 pb-16">
        <LessonTools focus={false} onToggleFocus={() => {}} sound={sound} onSoundChange={(patch) => setSound((s) => ({ ...s, ...patch }))} musicAvailable={false} />
        <span className="font-body text-caption text-ink-soft">Chưa có tệp nhạc nền: công tắc Nhạc nền mờ kèm chú thích.</span>
      </div>
    </div>
  );
}
