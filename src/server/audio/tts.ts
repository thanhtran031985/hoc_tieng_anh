import { createRequire } from "node:module";
import path from "node:path";
import { TTS_DEFAULT_VOICE, TTS_MAX_CHARS, TTS_SPEED, spokenText, splitSentences } from "@/lib/rules/tts";
import { encodeMp3 } from "./mp3";

// Tạo giọng đọc mp3 bằng mô hình Kokoro chạy ngay trên máy chủ (không gọi dịch vụ trên mạng, không cần khóa API).
// `kokoro-js` là devDependency: chỉ có ở máy dev. Nơi không có (hosting) thì `synthesizeMp3` ném `TtsUnavailableError`
// và cả web vẫn chạy bằng giọng trình duyệt. Mô hình (~160 MB) tải về lần đầu rồi dùng offline.

const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
/** Khoảng lặng giữa các câu khi một đoạn văn được đọc thành nhiều câu (giây). */
const SENTENCE_GAP_SECONDS = 0.25;

/** Công cụ tạo giọng đọc không dùng được trên máy chủ này (chưa cài, chưa tải được mô hình…). */
export class TtsUnavailableError extends Error {
  constructor(message = "Máy chủ này chưa có công cụ tạo giọng đọc (cần chạy ở máy phát triển đã cài kokoro-js).") {
    super(message);
    this.name = "TtsUnavailableError";
  }
}

/** Văn bản không đọc được (rỗng hoặc quá dài). */
export class TtsTextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TtsTextError";
  }
}

type RawAudio = { audio: Float32Array; sampling_rate: number };
type Engine = { generate: (text: string, options: { voice: string; speed: number }) => Promise<RawAudio> };

type KokoroModule = { KokoroTTS: { from_pretrained: (id: string, options: { dtype: string; device: string }) => Promise<unknown> } };

// Nạp `kokoro-js` bằng `require` của Node, không qua bộ đóng gói của Next: gói này tìm tệp giọng theo vị trí của chính nó
// (`voices/*.bin`), qua bộ đóng gói thì đường dẫn bị sai.
const nodeRequire = createRequire(path.join(process.cwd(), "package.json"));
const loadKokoro = (): KokoroModule => nodeRequire("kokoro-js") as KokoroModule;

let enginePromise: Promise<Engine> | null = null;

function loadEngine(): Promise<Engine> {
  enginePromise ??= (async () => {
    try {
      const { KokoroTTS } = loadKokoro();
      return (await KokoroTTS.from_pretrained(MODEL_ID, { dtype: "fp16", device: "cpu" })) as unknown as Engine;
    } catch (error) {
      enginePromise = null;
      throw new TtsUnavailableError(`Không nạp được giọng đọc: ${error instanceof Error ? error.message : String(error)}`);
    }
  })();
  return enginePromise;
}

/** Giọng đang dùng: biến môi trường `TTS_VOICE` (tùy chọn) hoặc giọng mặc định. */
export function currentVoice(): string {
  return process.env.TTS_VOICE?.trim() || TTS_DEFAULT_VOICE;
}

/** Công cụ tạo giọng đọc có dùng được không (để quản trị biết nút "Tạo giọng đọc" có chạy được). */
export async function isTtsAvailable(): Promise<boolean> {
  try {
    nodeRequire.resolve("kokoro-js");
    return true;
  } catch {
    return false;
  }
}

/** Đọc `text` thành tệp mp3 (đơn kênh). Ném `TtsTextError` hoặc `TtsUnavailableError`. */
export async function synthesizeMp3(text: string, voice: string = currentVoice()): Promise<Buffer> {
  const clean = spokenText(text);
  if (clean.length === 0) throw new TtsTextError("Không có chữ để đọc");
  if (clean.length > TTS_MAX_CHARS) throw new TtsTextError(`Văn bản dài quá ${TTS_MAX_CHARS} ký tự`);
  const engine = await loadEngine();
  const chunks: Float32Array[] = [];
  let rate = 24000;
  // Đọc từng câu rồi nối (hàm stream() của kokoro-js treo ở câu cuối khi truyền chuỗi thường).
  for (const sentence of splitSentences(clean)) {
    const part = await engine.generate(sentence, { voice, speed: TTS_SPEED });
    rate = part.sampling_rate;
    if (chunks.length > 0) chunks.push(new Float32Array(Math.round(rate * SENTENCE_GAP_SECONDS)));
    chunks.push(part.audio);
  }
  const total = chunks.reduce((n, c) => n + c.length, 0);
  if (total === 0) throw new TtsTextError("Giọng đọc không tạo ra âm thanh");
  const samples = new Float32Array(total);
  let offset = 0;
  for (const c of chunks) {
    samples.set(c, offset);
    offset += c.length;
  }
  return encodeMp3(samples, rate);
}
