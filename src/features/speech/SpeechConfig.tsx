"use client";

import { useEffect } from "react";
import { configureSpeech, resetSpeech, type SpeechAccent } from "@/lib/speech";

/**
 * Đặt giọng Anh/Mỹ của hồ sơ và bảng "chữ → mp3" cho màn đang mở; rời màn thì trả về mặc định.
 * `audio` rỗng khi công tắc "Giọng mp3" tắt: lúc đó mọi chỗ dùng giọng trình duyệt như GĐ1.
 */
export function SpeechConfig({ accent, audio }: { accent: SpeechAccent; audio: Record<string, string> }) {
  useEffect(() => {
    configureSpeech({ accent, audio });
    return resetSpeech;
  }, [accent, audio]);
  return null;
}
