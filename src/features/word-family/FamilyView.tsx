"use client";

import { useRouter } from "next/navigation";
import { SpeechConfig } from "@/features/speech/SpeechConfig";
import type { FamilyView as FamilyData } from "@/lib/rules/word-family";
import type { SpeechAccent } from "@/lib/speech";
import { FamilyPlayer } from "./FamilyPlayer";

type Props = {
  family: FamilyData;
  /** Bảng “chữ → mp3” của các từ trong họ (rỗng khi công tắc “Giọng mp3” tắt). */
  audio: Record<string, string>;
  accent: SpeechAccent;
  /** Từ được tô nổi (từ bé vừa xem ở Sổ từ). */
  highlight: number | null;
  /** Nơi quay về khi bé đóng (Sổ từ). */
  closeHref: string;
  /** Đường dẫn Ghép chữ đầu của họ, thêm `?first=<mã từ>` khi mở từ một thẻ. */
  buildHref: string;
};

/** Tự khám phá một họ vần (mở từ Sổ từ): bấm thẻ là nghe, không tính sao hay xu, Esc hoặc nút Đóng để về Sổ từ. */
export function FamilyView({ family, audio, accent, highlight, closeHref, buildHref }: Props) {
  const router = useRouter();
  return (
    <>
      <SpeechConfig accent={accent} audio={audio} />
      <FamilyPlayer mode="explore" family={family} accent={accent} highlight={highlight} onClose={() => router.push(closeHref)} onBuild={(wordId) => router.push(`${buildHref}${buildHref.includes("?") ? "&" : "?"}first=${wordId}`)} />
    </>
  );
}
