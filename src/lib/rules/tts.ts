// Giọng đọc mp3: quy tắc thuần (đặt tên tệp, văn bản cần đọc, chia lô, dải byte). Phần gọi mô hình và ghi tệp nằm ở src/server/audio/.

/** Loại nội dung có tệp mp3: từ, câu ví dụ, câu hỏi, âm phonics, trang truyện, đáp án và đoạn văn của Khám phá từ. */
export const AUDIO_KINDS = ["word", "example", "question", "phonics", "story", "explorer"] as const;
export type AudioKind = (typeof AUDIO_KINDS)[number];

/** Giọng Kokoro mặc định cho cả web (Anh-Mỹ, nữ). Đổi bằng biến môi trường `TTS_VOICE` (vd `am_michael`). */
export const TTS_DEFAULT_VOICE = "af_heart";
/** Tốc độ đọc khi tạo tệp (chậm hơn bình thường một chút cho bé nghe rõ). */
export const TTS_SPEED = 0.9;
/** Văn bản dài hơn mức này không tạo giọng đọc (trùng giới hạn câu hỏi 500 ký tự). */
export const TTS_MAX_CHARS = 500;
/** Số mục mỗi lượt khi tạo hàng loạt ở quản trị và dòng lệnh. */
export const TTS_BATCH_SIZE = 20;
/** Khóa cài đặt hệ thống của công tắc "Giọng mp3". */
export const VOICE_MP3_SETTING_KEY = "voice_mp3";

const NAME_PATTERN = new RegExp(`^(?:${AUDIO_KINDS.join("|")})-[0-9]{1,10}-[0-9a-f]{8}\\.(?:mp3|wav)$`);
const URL_PREFIX = "/audio/";

/** Gọn khoảng trắng và dấu xuống dòng trước khi đưa cho giọng đọc. */
export function spokenText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Tách văn bản thành từng câu (theo . ! ?) để đọc lần lượt; giữ dấu câu ở cuối mỗi câu. */
export function splitSentences(text: string): string[] {
  return spokenText(text)
    .split(/(?<=[.!?])\s+/)
    .filter((part) => part.length > 0);
}

/** Khóa tra cứu một câu/từ trong bảng tệp mp3 (không phân biệt hoa thường và khoảng trắng thừa). */
export function audioKey(text: string): string {
  return spokenText(text).toLowerCase();
}

/** Đuôi tệp âm thanh được lưu: mp3 (giọng tạo tự động) và wav (âm phonics tải lên). */
export type AudioExt = "mp3" | "wav";

/** Tên tệp, ví dụ `word-12-ab12cd34.mp3`; `hash` là 8 ký tự hex tính từ văn bản và giọng (đổi chữ thì đổi tên tệp). */
export function audioFileName(kind: AudioKind, id: number, hash: string, ext: AudioExt = "mp3"): string {
  if (!Number.isInteger(id) || id < 1) throw new RangeError("id phải là số nguyên dương");
  if (!/^[0-9a-f]{8}$/.test(hash)) throw new RangeError("hash phải là 8 ký tự hex");
  return `${kind}-${id}-${hash}.${ext}`;
}

/** Kiểu nội dung (Content-Type) theo đuôi tên tệp hợp lệ. */
export function audioMimeOf(name: string): string {
  return name.endsWith(".wav") ? "audio/wav" : "audio/mpeg";
}

/** Tên tệp hợp lệ: chặn mọi đường dẫn lạ (`../`, thư mục con, đuôi khác). */
export function isAudioFileName(name: string): boolean {
  return NAME_PATTERN.test(name);
}

/** Đường dẫn lưu ở cột `audio`/`example_audio` và dùng làm `src`. */
export function audioUrlPath(name: string): string {
  return URL_PREFIX + name;
}

/** Lấy tên tệp từ đường dẫn đã lưu; không phải đường dẫn mp3 hợp lệ thì null. */
export function audioNameFromUrl(path: string | null | undefined): string | null {
  if (!path || !path.startsWith(URL_PREFIX)) return null;
  const name = path.slice(URL_PREFIX.length);
  return isAudioFileName(name) ? name : null;
}

/** Chia danh sách thành các lô nhỏ. */
export function chunk<T>(items: readonly T[], size: number = TTS_BATCH_SIZE): T[][] {
  if (!Number.isInteger(size) || size < 1) throw new RangeError("size phải là số nguyên dương");
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export type ByteRange = { start: number; end: number };

/**
 * Đọc tiêu đề `Range: bytes=…` (một dải). Không có hoặc không hiểu thì `null` (trả cả tệp);
 * dải nằm ngoài tệp thì `"unsatisfiable"` (trả 416).
 */
export function parseByteRange(header: string | null | undefined, size: number): ByteRange | "unsatisfiable" | null {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || (match[1] === "" && match[2] === "")) return null;
  let start: number;
  let end: number;
  if (match[1] === "") {
    const suffix = Number(match[2]);
    if (suffix === 0) return "unsatisfiable";
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] === "" ? size - 1 : Math.min(Number(match[2]), size - 1);
  }
  if (start >= size || start > end) return "unsatisfiable";
  return { start, end };
}

export type AudioSource = { word: string; audio: string | null; exampleEn: string | null; exampleAudio: string | null };

/** Bảng "chữ → đường dẫn mp3" cho các từ của một bài (từ và câu ví dụ); chỉ lấy đường dẫn mp3 hợp lệ. */
export function buildAudioMap(words: readonly AudioSource[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const w of words) {
    if (audioNameFromUrl(w.audio)) map[audioKey(w.word)] = w.audio as string;
    if (w.exampleEn && audioNameFromUrl(w.exampleAudio)) map[audioKey(w.exampleEn)] = w.exampleAudio as string;
  }
  return map;
}

export type AudioTarget = { kind: "word" | "example"; field: "audio" | "exampleAudio"; text: string };

/**
 * Những chỗ của một từ cần tạo giọng đọc: chính từ (cột `audio`) và câu ví dụ (cột `exampleAudio`).
 * Chỉ lấy chỗ còn thiếu tệp, hoặc tất cả khi `force`; bỏ chỗ không có chữ hoặc dài quá giới hạn.
 */
export function audioTargets(w: AudioSource, force = false): AudioTarget[] {
  const out: AudioTarget[] = [];
  const word = spokenText(w.word);
  if (word && word.length <= TTS_MAX_CHARS && (force || !w.audio)) out.push({ kind: "word", field: "audio", text: word });
  const example = spokenText(w.exampleEn ?? "");
  if (example && example.length <= TTS_MAX_CHARS && (force || !w.exampleAudio)) out.push({ kind: "example", field: "exampleAudio", text: example });
  return out;
}

/** Từ đã có đủ tiếng: cả từ lẫn câu ví dụ (nếu có câu ví dụ). */
export function hasFullAudio(w: AudioSource): boolean {
  return Boolean(w.audio) && (!spokenText(w.exampleEn ?? "") || Boolean(w.exampleAudio));
}

/** Số mục mỗi lượt khi tạo hàng loạt ở màn quản trị: nhỏ để thanh tiến trình nhích đều và nút Dừng có tác dụng sớm. */
export const TTS_UI_BATCH_SIZE = 5;
