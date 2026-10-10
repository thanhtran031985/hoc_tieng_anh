// Phát âm từ và câu tiếng Anh (chỉ chạy trên trình duyệt).
// Dùng tệp mp3 nếu có (công tắc "Giọng mp3" của quản trị bật và từ có tệp), nếu không thì dùng giọng đọc của trình duyệt (speechSynthesis).
import { audioKey } from "@/lib/rules/tts";

export type SpeechAccent = "en-US" | "en-GB";

/** Tốc độ đọc chậm hơn bình thường một chút cho bé nghe rõ (như bản thiết kế). */
export const DEFAULT_SPEECH_RATE = 0.82;

/** Thời gian tối thiểu hiện hiệu ứng khi trình duyệt không báo lúc đọc xong (ms). */
const MIN_PLAYING_MS = 1300;
const PLAYING_MS_PER_CHAR = 150;

export type PronunciationOptions = {
  /** Đường dẫn tệp mp3 của từ (nếu có). Không truyền thì tra bảng của `configureSpeech`. Lỗi tải tệp thì dùng giọng đọc của trình duyệt. */
  audioUrl?: string | null;
  accent?: SpeechAccent;
  rate?: number;
  /** Gọi đúng một lần khi đọc xong, bị ngắt hoặc không đọc được. */
  onEnd?: () => void;
};

let currentAudio: HTMLAudioElement | null = null;

// Cấu hình chung của màn đang mở (do SpeechConfig đặt): giọng Anh/Mỹ của bé và bảng "chữ → mp3". Nhờ vậy các bước học
// chỉ gọi playPronunciation(text) mà vẫn dùng đúng giọng và tệp mp3, không phải truyền qua từng thành phần.
let configAccent: SpeechAccent = "en-US";
let configAudio: Readonly<Record<string, string>> = {};

/** Đặt giọng và bảng mp3 cho màn đang mở. `audio` rỗng (công tắc "Giọng mp3" tắt) thì luôn dùng giọng trình duyệt. */
export function configureSpeech(next: { accent?: SpeechAccent; audio?: Readonly<Record<string, string>> | null }): void {
  if (next.accent) configAccent = next.accent;
  if (next.audio !== undefined) configAudio = next.audio ?? {};
}

/** Về cài đặt mặc định (khi rời màn). */
export function resetSpeech(): void {
  configAccent = "en-US";
  configAudio = {};
}

// Báo cho nhạc nền biết giọng đọc đang chạy để hạ nhỏ (src/lib/sound.ts). Giọng đọc không bao giờ phụ thuộc cài đặt âm thanh.
type SpeakingListener = (speaking: boolean) => void;
const speakingListeners = new Set<SpeakingListener>();
let speaking = false;
let activeToken = 0;

function setSpeaking(next: boolean): void {
  if (speaking === next) return;
  speaking = next;
  speakingListeners.forEach((listener) => listener(next));
}

/** Đăng ký nhận tin "giọng đọc bắt đầu/xong". Trả về hàm hủy đăng ký. */
export function onSpeaking(listener: SpeakingListener): () => void {
  speakingListeners.add(listener);
  return () => speakingListeners.delete(listener);
}

export const isSpeaking = (): boolean => speaking;

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
  activeToken++;
  setSpeaking(false);
  silence();
}

function silence(): void {
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
  const { accent = configAccent, rate = DEFAULT_SPEECH_RATE, onEnd } = options;
  const audioUrl = options.audioUrl !== undefined ? options.audioUrl : (configAudio[audioKey(text)] ?? null);
  silence();
  const token = ++activeToken;
  setSpeaking(true);

  let finished = false;
  const timer = setTimeout(() => finish(), Math.max(MIN_PLAYING_MS, text.length * PLAYING_MS_PER_CHAR));
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    if (token === activeToken) setSpeaking(false);
    onEnd?.();
  }

  // Tệp lỗi làm cả `onerror` lẫn `play().catch` chạy: chỉ đọc bằng giọng trình duyệt một lần.
  let fellBack = false;
  const fallback = () => {
    if (fellBack || finished) return;
    fellBack = true;
    speakWithVoice(text, accent, rate, finish);
  };

  if (audioUrl) {
    const audio = new Audio(audioUrl);
    // Tốc độ chậm hơn mặc định (đọc chậm, từ khó) cũng áp cho tệp mp3, không chỉ giọng trình duyệt.
    if (options.rate !== undefined && options.rate < DEFAULT_SPEECH_RATE) audio.playbackRate = Math.max(0.5, options.rate / DEFAULT_SPEECH_RATE);
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
