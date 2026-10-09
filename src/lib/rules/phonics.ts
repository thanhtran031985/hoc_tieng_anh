// Âm phonics (Adult20): quy tắc thuần cho bảng âm, kiểm tệp âm thanh tải lên và đổi phiên âm thành ký hiệu của giọng đọc.

export const PHONICS_KINDS = ["single", "consonant_digraph", "vowel_digraph"] as const;
export type PhonicsKind = (typeof PHONICS_KINDS)[number];

export const PHONICS_KIND_LABEL: Record<PhonicsKind, string> = {
  single: "Chữ đơn",
  consonant_digraph: "Âm ghép phụ âm",
  vowel_digraph: "Âm ghép nguyên âm",
};

export type PhonicsExample = { word: string; part: string };

/** Tách từ ví dụ thành phần trước, phần chữ tạo ra âm (in đậm) và phần sau; không thấy phần âm thì cả từ là phần trước. */
export function splitExample(example: PhonicsExample): { before: string; part: string; after: string } {
  const at = example.part ? example.word.indexOf(example.part) : -1;
  if (at < 0) return { before: example.word, part: "", after: "" };
  return { before: example.word.slice(0, at), part: example.part, after: example.word.slice(at + example.part.length) };
}

export type PhonicsStat = { grapheme: string; kind: PhonicsKind; hasAudio: boolean; audioAuto: boolean };

/** Số liệu đầu trang: tổng số âm, chữ đơn, âm ghép, đã có âm thanh (trong đó tự động), các âm còn thiếu. */
export function phonicsStats(rows: readonly PhonicsStat[]) {
  const missing = rows.filter((r) => !r.hasAudio).map((r) => r.grapheme);
  return {
    total: rows.length,
    singles: rows.filter((r) => r.kind === "single").length,
    digraphs: rows.filter((r) => r.kind !== "single").length,
    withAudio: rows.length - missing.length,
    auto: rows.filter((r) => r.hasAudio && r.audioAuto).length,
    missing,
  };
}

/** "0,7 giây" từ số mili giây. */
export function formatSeconds(ms: number): string {
  return `${(Math.round(ms / 100) / 10).toString().replace(".", ",")} giây`;
}

// ---------------------------------------------------------------------------
// Tệp âm thanh tải lên: nhận dạng theo nội dung (không tin đuôi tệp), đo độ dài.
// ---------------------------------------------------------------------------

export const PHONICS_UPLOAD = { maxBytes: 1024 * 1024, minSeconds: 0.3, maxSeconds: 2 } as const;

export type SoundInfo = { format: "mp3" | "wav"; seconds: number };

const MP3_BITRATES_V1 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
const MP3_BITRATES_V2 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0];
const MP3_RATES: Record<number, number[]> = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

/** Độ dài mp3 (Layer III) bằng cách đếm khung; null nếu không phải mp3. */
function mp3Seconds(bytes: Uint8Array): number | null {
  let pos = 0;
  if (bytes.length >= 10 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
    pos = 10 + (((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f));
  }
  let frames = 0;
  let seconds = 0;
  while (pos + 4 <= bytes.length) {
    if (bytes[pos] !== 0xff || (bytes[pos + 1] & 0xe0) !== 0xe0) {
      if (frames === 0) {
        pos++; // chưa vào khung đầu: dò tiếp
        continue;
      }
      break; // hết dữ liệu khung (có thể còn thẻ ID3 cuối tệp)
    }
    const version = (bytes[pos + 1] >> 3) & 3; // 3 = MPEG1, 2 = MPEG2, 0 = MPEG2.5
    const layer = (bytes[pos + 1] >> 1) & 3; // 1 = Layer III
    const bitrateIndex = (bytes[pos + 2] >> 4) & 15;
    const rateIndex = (bytes[pos + 2] >> 2) & 3;
    const padding = (bytes[pos + 2] >> 1) & 1;
    if (version === 1 || layer !== 1 || bitrateIndex === 0 || bitrateIndex === 15 || rateIndex === 3) {
      if (frames === 0) {
        pos++;
        continue;
      }
      break;
    }
    const kbps = (version === 3 ? MP3_BITRATES_V1 : MP3_BITRATES_V2)[bitrateIndex];
    const rate = MP3_RATES[version][rateIndex];
    const samples = version === 3 ? 1152 : 576;
    const length = Math.floor(((version === 3 ? 144 : 72) * kbps * 1000) / rate) + padding;
    if (length < 4) break;
    frames++;
    seconds += samples / rate;
    pos += length;
  }
  return frames >= 2 ? seconds : null;
}

/** Độ dài WAV (PCM hoặc định dạng khác có `byteRate`); null nếu không phải WAV. */
function wavSeconds(bytes: Uint8Array): number | null {
  if (bytes.length < 44) return null;
  const text = (at: number) => String.fromCharCode(bytes[at], bytes[at + 1], bytes[at + 2], bytes[at + 3]);
  if (text(0) !== "RIFF" || text(8) !== "WAVE") return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let byteRate = 0;
  let pos = 12;
  while (pos + 8 <= bytes.length) {
    const id = text(pos);
    const size = view.getUint32(pos + 4, true);
    if (id === "fmt " && pos + 20 <= bytes.length) byteRate = view.getUint32(pos + 16, true);
    if (id === "data") {
      const dataSize = Math.min(size, bytes.length - pos - 8);
      return byteRate > 0 ? dataSize / byteRate : null;
    }
    pos += 8 + size + (size % 2);
  }
  return null;
}

/** Nhận dạng tệp âm thanh theo nội dung: mp3 hoặc wav kèm độ dài (giây); không nhận ra thì null. */
export function sniffSound(bytes: Uint8Array): SoundInfo | null {
  const wav = wavSeconds(bytes);
  if (wav !== null) return { format: "wav", seconds: wav };
  const mp3 = mp3Seconds(bytes);
  return mp3 !== null ? { format: "mp3", seconds: mp3 } : null;
}

export type UploadCheck = { ok: true; info: SoundInfo } | { ok: false; message: string };

/** Kiểm tệp tải lên cho một âm: đúng loại (.mp3/.wav và đúng nội dung), tối đa 1 MB, dài 0,3–2 giây. Lời nhắn hiện dưới ô chọn tệp. */
export function checkPhonicsUpload(fileName: string, bytes: Uint8Array): UploadCheck {
  if (!/\.(mp3|wav)$/i.test(fileName)) return { ok: false, message: `Tệp “${fileName}” không phải .mp3 hoặc .wav.` };
  if (bytes.length === 0) return { ok: false, message: "Tệp trống." };
  if (bytes.length > PHONICS_UPLOAD.maxBytes) return { ok: false, message: "Tệp lớn hơn 1 MB." };
  const info = sniffSound(bytes);
  if (!info) return { ok: false, message: `Tệp “${fileName}” không phải âm thanh .mp3 hoặc .wav hợp lệ.` };
  if (info.seconds < PHONICS_UPLOAD.minSeconds) return { ok: false, message: "Âm thanh ngắn hơn 0,3 giây." };
  if (info.seconds > PHONICS_UPLOAD.maxSeconds) return { ok: false, message: "Âm thanh dài hơn 2 giây. Chỉ ghi âm, không ghi cả từ." };
  return { ok: true, info };
}

// ---------------------------------------------------------------------------
// Tạo âm bằng giọng đọc tự động: đưa ký hiệu âm thẳng cho mô hình (không qua chữ, nên không đọc tên chữ cái).
// ---------------------------------------------------------------------------

/** Phiên âm (bỏ dấu gạch chéo) → ký hiệu của giọng Kokoro Anh-Mỹ. Ký hiệu nhiều chữ phải đứng trước ký hiệu một chữ. */
const KOKORO_SYMBOLS: readonly (readonly [string, string])[] = [
  ["tʃ", "ʧ"],
  ["dʒ", "ʤ"],
  ["eɪ", "A"],
  ["iː", "i"],
  ["uː", "u"],
  ["ɑː", "ɑ"],
  ["ɔː", "ɔ"],
  ["ɒ", "ɑ"],
  ["e", "ɛ"],
];

/** Âm chặn và âm tắc-xát: đứng một mình khó nghe, thêm "ə" phía sau. */
const NEEDS_VOWEL = new Set(["p", "b", "t", "d", "k", "g", "ʧ", "ʤ"]);

/** Đổi phiên âm như "/k/" hoặc "/tʃ/" thành chuỗi ký hiệu cho giọng đọc; "/ks/" thành "ks" (không thêm nguyên âm). */
export function phonicsPhonemes(ipa: string): string {
  let text = ipa.replace(/^\/|\/$/g, "");
  for (const [from, to] of KOKORO_SYMBOLS) text = text.split(from).join(to);
  return NEEDS_VOWEL.has(text) ? `${text}ə` : text;
}

/** Cắt khoảng lặng đầu và cuối (ngưỡng biên độ 0–1), chừa `padSamples` mẫu mỗi đầu cho khỏi cụt tiếng. */
export function trimSilence(samples: Float32Array, threshold = 0.012, padSamples = 1200): Float32Array {
  let start = 0;
  while (start < samples.length && Math.abs(samples[start]) < threshold) start++;
  if (start === samples.length) return samples;
  let end = samples.length - 1;
  while (end > start && Math.abs(samples[end]) < threshold) end--;
  return samples.slice(Math.max(0, start - padSamples), Math.min(samples.length, end + 1 + padSamples));
}

/** Thêm khoảng lặng ở cuối nếu âm ngắn hơn `minSamples` mẫu (âm như /s/, /f/ chỉ vài trăm mili giây, ngắn hơn mức tối thiểu của tệp tải lên). */
export function padToMinimum(samples: Float32Array, minSamples: number): Float32Array {
  if (samples.length >= minSamples) return samples;
  const out = new Float32Array(minSamples);
  out.set(samples, 0);
  return out;
}

/** Độ dài tối thiểu của âm tạo tự động (giây): cao hơn một chút mức 0,3 giây của tệp tải lên cho chắc. */
export const PHONICS_MIN_GENERATED_SECONDS = 0.35;

// ---------------------------------------------------------------------------
// Giọng trình duyệt đọc âm rời: đọc tên chữ cái ("see") thì sai, nên đọc kèm nguyên âm ("kuh"). Chỉ dùng khi âm chưa có tệp.
// ---------------------------------------------------------------------------

const PHONICS_SAY: Record<string, string> = {
  a: "ae", b: "buh", c: "kuh", d: "duh", e: "eh", f: "fuh", g: "guh", h: "huh", i: "ih", j: "juh", k: "kuh", l: "luh", m: "muh",
  n: "nuh", o: "ah", p: "puh", q: "kwuh", r: "ruh", s: "suh", t: "tuh", u: "uh", v: "vuh", w: "wuh", x: "ks", y: "yuh", z: "zuh",
  sh: "shh", ch: "chuh", th: "thuh", ck: "kuh", ng: "ng", ee: "ee", oo: "oo", ai: "ay", ar: "ar", or: "or",
};

/** Chữ để giọng trình duyệt đọc một âm; âm lạ thì đọc nguyên chữ. */
export function phonicsSay(grapheme: string): string {
  return PHONICS_SAY[grapheme.toLowerCase()] ?? grapheme;
}
