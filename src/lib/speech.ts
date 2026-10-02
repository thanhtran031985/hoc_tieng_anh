// Phát âm từ và câu tiếng Anh (chỉ chạy trên trình duyệt).
// GĐ1: dùng tệp mp3 nếu từ có `audio`, nếu không thì dùng giọng đọc của trình duyệt (speechSynthesis).

export type SpeechAccent = "en-US" | "en-GB";

/** Tốc độ đọc chậm hơn bình thường một chút cho bé nghe rõ (như bản thiết kế). */
export const DEFAULT_SPEECH_RATE = 0.82;

/** Thời gian tối thiểu hiện hiệu ứng khi trình duyệt không báo lúc đọc xong (ms). */
const MIN_PLAYING_MS = 1300;
const PLAYING_MS_PER_CHAR = 150;

export type PronunciationOptions = {
  /** Đường dẫn tệp mp3 của từ (nếu có). Lỗi tải tệp thì dùng giọng đọc của trình duyệt. */
  audioUrl?: string | null;
  accent?: SpeechAccent;
  rate?: number;
  /** Gọi đúng một lần khi đọc xong, bị ngắt hoặc không đọc được. */
  onEnd?: () => void;
};

let currentAudio: HTMLAudioElement | null = null;

function normalizeLang(lang: string): string {
  return lang.replace("_", "-").toLowerCase();
}

/** Chọn giọng đúng vùng (en-US/en-GB), không có thì lấy giọng tiếng Anh bất kỳ. */
function pickVoice(accent: SpeechAccent): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => normalizeLang(v.lang) === accent.toLowerCase()) ??
    voices.find((v) => normalizeLang(v.lang).startsWith("en")) ??
    null
  );
}

/** Dừng mọi âm thanh đang phát. */
export function stopPronunciation(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

function speakWithVoice(text: string, accent: SpeechAccent, rate: number, finish: () => void): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = accent;
  utterance.rate = rate;
  const voice = pickVoice(accent);
  if (voice) utterance.voice = voice;
  utterance.onend = finish;
  utterance.onerror = finish;
  window.speechSynthesis.speak(utterance);
}

/**
 * Phát âm `text`. Trả về hàm dừng. `onEnd` được gọi đúng một lần.
 * Nếu trình duyệt không hỗ trợ giọng đọc, hiệu ứng vẫn chạy một lúc rồi kết thúc.
 */
export function playPronunciation(text: string, options: PronunciationOptions = {}): () => void {
  const { audioUrl, accent = "en-US", rate = DEFAULT_SPEECH_RATE, onEnd } = options;
  stopPronunciation();

  let finished = false;
  const timer = setTimeout(() => finish(), Math.max(MIN_PLAYING_MS, text.length * PLAYING_MS_PER_CHAR));
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    onEnd?.();
  }

  const fallback = () => speakWithVoice(text, accent, rate, finish);

  if (audioUrl) {
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.onended = () => {
      currentAudio = null;
      finish();
    };
    audio.onerror = () => {
      currentAudio = null;
      fallback();
    };
    audio.play().catch(() => {
      if (currentAudio === audio) currentAudio = null;
      fallback();
    });
  } else {
    fallback();
  }

  return () => {
    finish();
    stopPronunciation();
  };
}
