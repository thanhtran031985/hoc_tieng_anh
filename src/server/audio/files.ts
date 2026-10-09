import { createHash } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { audioFileName, audioNameFromUrl, audioUrlPath, isAudioFileName, type AudioKind } from "@/lib/rules/tts";

// Tệp mp3 lưu ở storage/uploads/audio/ (ngoài public/), trả về qua route /audio/[name] có kiểm tra đăng nhập.
// Tên tệp chứa mã băm của văn bản và giọng, nên đổi chữ hoặc giọng thì ra tệp mới, tạo lại cùng nội dung thì ghi đè đúng tệp cũ.

export const AUDIO_DIR = path.join(process.cwd(), "storage", "uploads", "audio");

/** 8 ký tự hex từ văn bản đã chuẩn hóa và giọng. */
export function contentHash(text: string, voice: string): string {
  return createHash("sha1").update(`${voice}\n${text}`).digest("hex").slice(0, 8);
}

/** Ghi tệp mp3 của một mục; trả về đường dẫn để lưu vào cột `audio`/`example_audio`. */
export async function saveAudioFile(kind: AudioKind, id: number, text: string, voice: string, bytes: Buffer): Promise<string> {
  const name = audioFileName(kind, id, contentHash(text, voice));
  await mkdir(AUDIO_DIR, { recursive: true });
  await writeFile(path.join(AUDIO_DIR, name), bytes);
  return audioUrlPath(name);
}

/** Xóa tệp ứng với đường dẫn đã lưu (bỏ qua nếu không phải đường dẫn mp3 hợp lệ hoặc tệp không còn). */
export async function removeAudioFile(storedPath: string | null | undefined): Promise<void> {
  const name = audioNameFromUrl(storedPath);
  if (name) await rm(path.join(AUDIO_DIR, name), { force: true });
}

/** Tệp đã có trên đĩa chưa (để chạy lại thì bỏ qua mục đã có). */
export async function audioFileExists(storedPath: string | null | undefined): Promise<boolean> {
  const name = audioNameFromUrl(storedPath);
  if (!name) return false;
  try {
    return (await stat(path.join(AUDIO_DIR, name))).isFile();
  } catch {
    return false;
  }
}

export type AudioFile = { bytes: Buffer; size: number; mtimeMs: number };

/** Đọc tệp theo tên; tên sai hoặc không có tệp thì null (không bao giờ đi ra ngoài thư mục audio). */
export async function readAudioFile(name: string): Promise<AudioFile | null> {
  if (!isAudioFileName(name)) return null;
  const file = path.join(AUDIO_DIR, name);
  try {
    const [bytes, info] = await Promise.all([readFile(file), stat(file)]);
    return { bytes, size: info.size, mtimeMs: info.mtimeMs };
  } catch {
    return null;
  }
}
