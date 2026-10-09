// Âm thanh hiệu ứng và nhạc nền của bài học (GĐ2). Hàm thuần: chỉ mô tả nốt nhạc và độ to, không đụng Web Audio.
// Hiệu ứng tạo bằng Web Audio (src/lib/sound.ts), không cần tệp. Giọng đọc tiếng Anh nằm ngoài các quy tắc này: luôn bật.

export type SfxName = "correct" | "retry" | "coin" | "gift";

export type SfxNote = {
  /** Tần số (Hz). */
  freq: number;
  /** Lúc bắt đầu tính từ khi phát (giây). */
  at: number;
  /** Độ dài nốt (giây). */
  length: number;
  /** Độ to tương đối 0–1 (trước khi nhân với âm lượng). */
  gain: number;
  wave: "sine" | "triangle";
};

/**
 * Tiếng đúng: "ting" hai nốt đi lên. Chưa đúng: hai nốt mềm đi xuống, nhỏ hơn tiếng đúng (không phạt, không gắt).
 * Nhận xu: hai nốt cao nhanh. Mở quà: "pop" rồi ba nốt đi lên.
 */
export const SFX_NOTES: Record<SfxName, readonly SfxNote[]> = {
  correct: [
    { freq: 784, at: 0, length: 0.14, gain: 0.5, wave: "sine" },
    { freq: 1175, at: 0.09, length: 0.28, gain: 0.5, wave: "sine" },
  ],
  retry: [
    { freq: 392, at: 0, length: 0.16, gain: 0.3, wave: "triangle" },
    { freq: 330, at: 0.13, length: 0.24, gain: 0.3, wave: "triangle" },
  ],
  coin: [
    { freq: 1568, at: 0, length: 0.1, gain: 0.4, wave: "sine" },
    { freq: 2093, at: 0.08, length: 0.3, gain: 0.4, wave: "sine" },
  ],
  gift: [
    { freq: 220, at: 0, length: 0.08, gain: 0.5, wave: "triangle" },
    { freq: 523, at: 0.1, length: 0.16, gain: 0.45, wave: "sine" },
    { freq: 659, at: 0.2, length: 0.16, gain: 0.45, wave: "sine" },
    { freq: 784, at: 0.3, length: 0.4, gain: 0.45, wave: "sine" },
  ],
};

/** Tổng thời gian của một hiệu ứng (giây). */
export function sfxDuration(name: SfxName): number {
  return Math.max(...SFX_NOTES[name].map((n) => n.at + n.length));
}

/** Độ to tối đa của hiệu ứng khi âm lượng 100%. */
export const SFX_MASTER_GAIN = 0.5;
/** Độ to tối đa của nhạc nền khi âm lượng 100%: nhỏ hơn hiệu ứng để không át giọng đọc. */
export const MUSIC_MASTER_GAIN = 0.2;
/** Nhạc nền chỉ còn chừng này phần khi giọng đọc đang chạy. */
export const MUSIC_DUCK_RATIO = 0.3;
/** Thời gian nhạc nền hạ/lên khi giọng đọc bắt đầu/xong (ms). */
export const MUSIC_FADE_MS = 250;

/** Âm lượng người dùng (0–100) → hệ số 0–1, cong nhẹ vì tai nghe theo lôga. */
export function volumeCurve(volume: number): number {
  const v = Math.min(100, Math.max(0, Number.isFinite(volume) ? volume : 0)) / 100;
  return v * v;
}

/** Độ to của hiệu ứng: 0 khi tắt hiệu ứng hoặc âm lượng 0. */
export function sfxGain(enabled: boolean, volume: number): number {
  return enabled ? SFX_MASTER_GAIN * volumeCurve(volume) : 0;
}

/** Độ to của nhạc nền (0–1 cho `HTMLAudioElement.volume`): hạ xuống khi giọng đọc chạy. */
export function musicGain(volume: number, speaking: boolean): number {
  return MUSIC_MASTER_GAIN * volumeCurve(volume) * (speaking ? MUSIC_DUCK_RATIO : 1);
}

const MUSIC_EXTENSIONS = [".mp3", ".ogg", ".wav", ".m4a"];

/** Chọn tệp nhạc nền trong thư mục public/media/music: tệp âm thanh đầu tiên theo tên. Không có thì null (công tắc Nhạc nền mờ). */
export function pickMusicTrack(fileNames: readonly string[]): string | null {
  const tracks = fileNames.filter((n) => MUSIC_EXTENSIONS.includes(n.slice(n.lastIndexOf(".")).toLowerCase())).sort((a, b) => a.localeCompare(b));
  return tracks[0] ?? null;
}
