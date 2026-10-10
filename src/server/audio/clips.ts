import { TTS_MAX_CHARS, audioKey, audioNameFromUrl, spokenText } from "@/lib/rules/tts";
import { db } from "../db";
import { audioFileExists, saveAudioFile, removeAudioFile } from "./files";
import { TtsTextError, TtsUnavailableError, currentVoice, synthesizeMp3 } from "./tts";

// Giọng đọc mp3 theo từng câu (bảng `audio_clips`, task 19). Dùng cho chữ không thuộc từ vựng: câu của sắp xếp câu, nghe-gõ, điền từ, đọc hiểu…
// Trình học gộp bảng này vào bảng “chữ → mp3” của bài (cùng cơ chế với từ và câu ví dụ), nên mọi bước tự dùng mp3 mà không đổi gì ở màn.

const usable = (text: string) => text.length > 0 && text.length <= TTS_MAX_CHARS;

/** Bảo đảm mỗi chữ có một dòng trong `audio_clips` (chưa có tệp thì để trống). Trả về số dòng mới tạo. */
export async function ensureClips(texts: readonly string[]): Promise<number> {
  const unique = new Map<string, string>();
  for (const raw of texts) {
    const text = spokenText(raw);
    if (usable(text) && !unique.has(audioKey(text))) unique.set(audioKey(text), text);
  }
  if (unique.size === 0) return 0;
  const result = await db.audioClip.createMany({ data: [...unique].map(([textKey, text]) => ({ textKey, text })), skipDuplicates: true });
  return result.count;
}

/** Bảng “chữ (audioKey) → đường dẫn mp3” của các chữ đã có tệp. Đưa thẳng vào `configureSpeech`. */
export async function clipMap(texts: readonly string[]): Promise<Record<string, string>> {
  const keys = [...new Set(texts.map((t) => audioKey(t)).filter((k) => k.length > 0 && k.length <= TTS_MAX_CHARS))];
  if (keys.length === 0) return {};
  const rows = await db.audioClip.findMany({ where: { textKey: { in: keys }, file: { not: null } }, select: { textKey: true, file: true } });
  const map: Record<string, string> = {};
  for (const row of rows) if (audioNameFromUrl(row.file)) map[row.textKey] = row.file as string;
  return map;
}

export type ClipResult = { id: number; text: string; status: "made" | "skipped" | "error"; message?: string };

/**
 * Tạo mp3 cho các dòng còn thiếu tệp (hoặc tất cả khi `force`). Lỗi của một câu không làm hỏng cả lượt;
 * máy chưa có công cụ tạo giọng đọc thì dừng và báo lỗi chung. `onItem` được gọi sau mỗi câu để in tiến độ.
 */
export async function generateClips(options: { force?: boolean; limit?: number; onItem?: (item: ClipResult) => void } = {}): Promise<{ ok: true; items: ClipResult[] } | { ok: false; message: string }> {
  const { force = false, limit, onItem } = options;
  const rows = await db.audioClip.findMany({ where: force ? {} : { OR: [{ file: null }] }, orderBy: { id: "asc" }, take: limit, select: { id: true, text: true, file: true } });
  const voice = currentVoice();
  const items: ClipResult[] = [];
  const push = (item: ClipResult) => {
    items.push(item);
    onItem?.(item);
  };
  for (const row of rows) {
    if (!force && (await audioFileExists(row.file))) {
      push({ id: row.id, text: row.text, status: "skipped" });
      continue;
    }
    try {
      const bytes = await synthesizeMp3(row.text, voice);
      const stored = await saveAudioFile("question", row.id, row.text, voice, bytes);
      await db.audioClip.update({ where: { id: row.id }, data: { file: stored } });
      if (row.file && row.file !== stored) await removeAudioFile(row.file);
      push({ id: row.id, text: row.text, status: "made" });
    } catch (error) {
      if (error instanceof TtsUnavailableError) return { ok: false, message: error.message };
      push({ id: row.id, text: row.text, status: "error", message: error instanceof TtsTextError ? error.message : "Chưa tạo được giọng đọc." });
      if (!(error instanceof TtsTextError)) console.error("tạo giọng đọc câu:", error);
    }
  }
  return { ok: true, items };
}

/** Những dòng ghi tệp nhưng tệp đã mất trên đĩa được đặt lại là chưa có (để lần tạo sau làm lại). Trả về số dòng đã sửa. */
export async function resetMissingClips(): Promise<number> {
  const rows = await db.audioClip.findMany({ where: { file: { not: null } }, select: { id: true, file: true } });
  let fixed = 0;
  for (const row of rows) {
    if (!(await audioFileExists(row.file))) {
      await db.audioClip.update({ where: { id: row.id }, data: { file: null } });
      fixed += 1;
    }
  }
  return fixed;
}
