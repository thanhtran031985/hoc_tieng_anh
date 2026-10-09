import { playPronunciation } from "@/lib/speech";

/** Đọc một đoạn rồi báo xong (hoặc bị ngắt). Dùng để đọc lần lượt từng âm, từng thẻ. */
export function sayAsync(text: string, options: { rate?: number; audioUrl?: string | null } = {}): Promise<void> {
  return new Promise((resolve) => {
    playPronunciation(text, { ...options, onEnd: resolve });
  });
}

/** Chờ `ms` mili giây. */
export const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
