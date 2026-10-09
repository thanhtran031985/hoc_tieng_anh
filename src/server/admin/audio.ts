import { audioTargets, type AudioTarget } from "@/lib/rules/tts";
import { generateAudioSchema, type AudioItemResult, type GenerateAudioResult } from "@/lib/schemas/admin-audio";
import { getVoiceMp3Enabled } from "../app-settings";
import { audioFileExists, removeAudioFile, saveAudioFile } from "../audio/files";
import { TtsTextError, TtsUnavailableError, currentVoice, synthesizeMp3 } from "../audio/tts";
import { db } from "../db";

// Tạo giọng đọc mp3 cho từ vựng (Adult10, Adult13). Hàm ghi: nơi gọi (server action) phải đã gọi `requireAdmin()`.

/** Tạo (hoặc tạo lại) tệp mp3 của từ và câu ví dụ cho một lượt từ. Lỗi của một từ không làm hỏng cả lượt. */
export async function generateWordAudio(input: unknown): Promise<GenerateAudioResult> {
  const parsed = generateAudioSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ." };
  if (!(await getVoiceMp3Enabled())) return { ok: false, message: "Hãy bật “Giọng mp3” trước khi tạo giọng đọc." };

  const { wordIds, force } = parsed.data;
  const words = await db.word.findMany({ where: { id: { in: wordIds } }, select: { id: true, word: true, audio: true, exampleEn: true, exampleAudio: true } });
  const byId = new Map(words.map((w) => [w.id, w]));
  const voice = currentVoice();
  const items: AudioItemResult[] = [];

  for (const id of wordIds) {
    const w = byId.get(id);
    if (!w) {
      items.push({ id, word: `#${id}`, status: "error", message: "Không tìm thấy từ này nữa." });
      continue;
    }
    // Chỗ đã ghi đường dẫn nhưng mất tệp trên đĩa cũng tính là thiếu.
    const current = {
      ...w,
      audio: (await audioFileExists(w.audio)) ? w.audio : null,
      exampleAudio: (await audioFileExists(w.exampleAudio)) ? w.exampleAudio : null,
    };
    const targets = audioTargets(current, force);
    if (targets.length === 0) {
      items.push({ id, word: w.word, status: "skipped" });
      continue;
    }
    try {
      for (const target of targets) await makeOne(w.id, w, target, voice);
      items.push({ id, word: w.word, status: "made" });
    } catch (error) {
      if (error instanceof TtsUnavailableError) return { ok: false, message: error.message };
      items.push({ id, word: w.word, status: "error", message: error instanceof TtsTextError ? error.message : "Chưa tạo được giọng đọc cho từ này." });
      if (!(error instanceof TtsTextError)) console.error("tạo giọng đọc:", error);
    }
  }
  return { ok: true, items };
}

async function makeOne(id: number, w: { audio: string | null; exampleAudio: string | null }, target: AudioTarget, voice: string): Promise<void> {
  const bytes = await synthesizeMp3(target.text, voice);
  const stored = await saveAudioFile(target.kind, id, target.text, voice, bytes);
  const old = w[target.field];
  await db.word.update({ where: { id }, data: { [target.field]: stored } });
  if (old && old !== stored) await removeAudioFile(old);
}
