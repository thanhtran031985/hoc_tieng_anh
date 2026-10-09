// Âm thanh của bài học (chỉ chạy trên trình duyệt): hiệu ứng tạo bằng Web Audio, nhạc nền đọc tệp trong public/media/music/.
// Mặc định TẮT cho tới khi `SoundProvider` nạp cài đặt của hồ sơ, nên màn nào chưa có cài đặt thì im lặng như trước.
// Giọng đọc tiếng Anh (src/lib/speech.ts) không đi qua đây và không bao giờ bị tắt.
import { MUSIC_FADE_MS, SFX_NOTES, musicGain, sfxGain, type SfxName } from "./rules/sound-effects";
import { isSpeaking, onSpeaking } from "./speech";

export type SoundConfig = {
  /** Hiệu ứng (đúng, chưa đúng, nhận xu, mở quà). */
  sfxOn: boolean;
  /** Nhạc nền; chỉ phát khi có `musicSrc`. */
  musicOn: boolean;
  /** 0–100. */
  volume: number;
  /** Đường dẫn tệp nhạc nền, ví dụ "/media/music/nhac-nen.mp3"; null là chưa có tệp. */
  musicSrc: string | null;
};

const OFF: SoundConfig = { sfxOn: false, musicOn: false, volume: 0, musicSrc: null };

let config: SoundConfig = OFF;
let context: AudioContext | null = null;
let music: HTMLAudioElement | null = null;
let fade: ReturnType<typeof setInterval> | null = null;
let unsubscribeSpeech: (() => void) | null = null;
let gestureArmed = false;

function audioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!context) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === "suspended") void context.resume().catch(() => {});
  return context;
}

/** Phát một hiệu ứng theo cài đặt hiện tại. Tắt hiệu ứng hoặc âm lượng 0 thì không phát gì. */
export function playSfx(name: SfxName): void {
  const level = sfxGain(config.sfxOn, config.volume);
  if (level <= 0) return;
  const ctx = audioContext();
  if (!ctx) return;
  try {
    const start = ctx.currentTime + 0.01;
    for (const note of SFX_NOTES[name]) {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      const t0 = start + note.at;
      const peak = Math.max(0.0001, note.gain * level);
      osc.type = note.wave;
      osc.frequency.value = note.freq;
      amp.gain.setValueAtTime(0.0001, t0);
      amp.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
      amp.gain.exponentialRampToValueAtTime(0.0001, t0 + note.length);
      osc.connect(amp).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + note.length + 0.02);
    }
  } catch {
    // Không phát được thì thôi, bài học vẫn chạy.
  }
}

function targetMusicVolume(): number {
  return musicGain(config.volume, isSpeaking());
}

/** Hạ hoặc nâng nhạc nền từ từ tới độ to mục tiêu (giọng đọc bắt đầu thì hạ, xong thì nâng lại). */
function fadeMusic(): void {
  if (!music) return;
  const audio = music;
  if (fade) clearInterval(fade);
  const goal = targetMusicVolume();
  const steps = Math.max(1, Math.round(MUSIC_FADE_MS / 25));
  const from = audio.volume;
  let i = 0;
  fade = setInterval(() => {
    i++;
    audio.volume = Math.min(1, Math.max(0, from + ((goal - from) * i) / steps));
    if (i >= steps && fade) {
      clearInterval(fade);
      fade = null;
    }
  }, 25);
}

// Trình duyệt chỉ cho phát nhạc sau một thao tác của người dùng: chờ lần bấm hoặc phím đầu tiên rồi thử lại.
function armGesture(): void {
  if (gestureArmed || typeof window === "undefined") return;
  gestureArmed = true;
  const retry = () => {
    gestureArmed = false;
    window.removeEventListener("pointerdown", retry, true);
    window.removeEventListener("keydown", retry, true);
    syncMusic();
  };
  window.addEventListener("pointerdown", retry, true);
  window.addEventListener("keydown", retry, true);
}

function syncMusic(): void {
  if (typeof window === "undefined") return;
  const wanted = config.musicOn && config.musicSrc !== null && config.volume > 0;
  if (!wanted) {
    music?.pause();
    return;
  }
  if (!music || music.getAttribute("src") !== config.musicSrc) {
    music?.pause();
    music = new Audio(config.musicSrc!);
    music.loop = true;
    music.volume = 0;
  }
  fadeMusic();
  void music.play().catch(armGesture);
}

/** Nạp cài đặt âm thanh (gọi khi bé đổi công tắc hoặc âm lượng). */
export function configureSound(next: SoundConfig): void {
  config = next;
  if (!unsubscribeSpeech && typeof window !== "undefined") unsubscribeSpeech = onSpeaking(() => fadeMusic());
  syncMusic();
}

/** Rời bài học: tắt hết, ngừng nhạc. */
export function shutdownSound(): void {
  config = OFF;
  if (fade) clearInterval(fade);
  fade = null;
  music?.pause();
  music = null;
  unsubscribeSpeech?.();
  unsubscribeSpeech = null;
}
