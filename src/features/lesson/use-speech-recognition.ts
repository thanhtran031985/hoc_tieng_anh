"use client";

import { useCallback, useRef } from "react";

// Nhận diện giọng nói có sẵn của Chrome/Edge (Web Speech API). Âm thanh được trình duyệt gửi tới máy chủ của Google/Microsoft,
// nên chỉ dùng khi hồ sơ bật “Chấm phát âm” (Adult07). Không hỗ trợ hoặc lỗi thì trả null và bài tính hoàn thành, không chấm.

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type RecognitionCtor = new () => Recognition;

/** Trình duyệt có nhận diện giọng nói không (kiểm lúc gọi vì chỉ có ở trình duyệt). */
export function speechRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Chờ kết quả cuối nhiều nhất chừng này sau khi bé nói xong (ms). */
const END_WAIT_MS = 2500;

/** `begin()` bắt đầu nghe cùng lúc ghi âm; `end()` dừng và trả chữ nhận diện được (gộp các đoạn), hoặc null nếu không nhận diện được. */
export function useSpeechRecognition(lang: string) {
  const current = useRef<{ rec: Recognition; heard: string[]; failed: boolean; ended: Promise<void> } | null>(null);

  const begin = useCallback((): boolean => {
    const Ctor = speechRecognitionCtor();
    if (!Ctor) return false;
    try {
      const rec = new Ctor();
      rec.lang = lang;
      rec.continuous = true;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      const state = { rec, heard: [] as string[], failed: false, ended: Promise.resolve() };
      state.ended = new Promise<void>((resolve) => {
        rec.onend = () => resolve();
      });
      rec.onresult = (event) => {
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal && result[0]) state.heard[i] = result[0].transcript;
        }
      };
      rec.onerror = (event) => {
        // “no-speech” và “aborted” không phải lỗi hỏng dịch vụ; còn lại (mạng, bị chặn) thì không chấm được.
        if (event.error !== "no-speech" && event.error !== "aborted") state.failed = true;
      };
      current.current = state;
      rec.start();
      return true;
    } catch {
      current.current = null;
      return false;
    }
  }, [lang]);

  const end = useCallback(async (): Promise<string | null> => {
    const state = current.current;
    current.current = null;
    if (!state) return null;
    try {
      state.rec.stop();
    } catch {
      // đã dừng
    }
    await Promise.race([state.ended, new Promise<void>((resolve) => setTimeout(resolve, END_WAIT_MS))]);
    if (state.failed) return null;
    return state.heard.filter(Boolean).join(" ").trim();
  }, []);

  const cancel = useCallback(() => {
    const state = current.current;
    current.current = null;
    try {
      state?.rec.abort();
    } catch {
      // đã dừng
    }
  }, []);

  return { begin, end, cancel };
}
