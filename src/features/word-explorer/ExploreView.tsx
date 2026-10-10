"use client";

import { useRouter } from "next/navigation";
import { SpeechConfig } from "@/features/speech/SpeechConfig";
import type { ExplorerContent, ExplorerViewBranch } from "@/lib/rules/word-explorer";
import type { SpeechAccent } from "@/lib/speech";
import { ExplorerPlayer, type ExplorerWord } from "./ExplorerPlayer";

type Props = {
  word: ExplorerWord;
  branches: ExplorerViewBranch[];
  reading: ExplorerContent["reading"];
  glossary: Record<string, string>;
  /** Bảng “chữ → mp3” của từ và câu ví dụ (rỗng khi công tắc “Giọng mp3” tắt). */
  audio: Record<string, string>;
  accent: SpeechAccent;
  speechScoring: boolean;
  /** Nơi quay về khi bé đóng (Sổ từ). */
  closeHref: string;
};

/** Tự khám phá một từ (mở từ Sổ từ): bấm nhánh là mở, không tính sao hay xu, Esc hoặc nút Đóng để về Sổ từ. */
export function ExploreView({ word, branches, reading, glossary, audio, accent, speechScoring, closeHref }: Props) {
  const router = useRouter();
  return (
    <>
      <SpeechConfig accent={accent} audio={audio} />
      <ExplorerPlayer
        mode="explore"
        word={word}
        branches={branches}
        reading={reading}
        glossary={glossary}
        accent={accent}
        speechScoring={speechScoring}
        printHref={`/explore/${word.id}/print`}
        onClose={() => router.push(closeHref)}
      />
    </>
  );
}
