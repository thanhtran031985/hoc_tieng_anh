"use client";

import { useRouter } from "next/navigation";
import { SpeechConfig } from "@/features/speech/SpeechConfig";
import type { FamilyView } from "@/lib/rules/word-family";
import type { SpeechAccent } from "@/lib/speech";
import { BuildPlayer } from "./BuildPlayer";

type Props = {
  family: FamilyView;
  /** Hàng chữ đầu đã chọn và xáo theo hạt giống. */
  tiles: string[];
  /** Từ cần ghép đầu tiên (mã từ), nếu mở từ một thẻ. */
  first: number | null;
  /** Bảng “chữ → mp3” của các từ trong họ (rỗng khi công tắc “Giọng mp3” tắt). */
  audio: Record<string, string>;
  accent: SpeechAccent;
  /** Nơi quay về khi bé đóng (Sổ từ) và màn Họ vần của họ này. */
  closeHref: string;
  familyHref: string;
};

/** Tự ghép chữ đầu (mở từ Họ vần hoặc Sổ từ): không tính sao hay xu, Esc hoặc nút Đóng để về Sổ từ, “Về họ vần” để quay lại họ. */
export function BuildView({ family, tiles, first, audio, accent, closeHref, familyHref }: Props) {
  const router = useRouter();
  return (
    <>
      <SpeechConfig accent={accent} audio={audio} />
      <BuildPlayer mode="explore" family={family} tiles={tiles} first={first} accent={accent} onClose={() => router.push(closeHref)} onBackToFamily={() => router.push(familyHref)} />
    </>
  );
}
