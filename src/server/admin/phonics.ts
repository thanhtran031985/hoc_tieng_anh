import { createHash } from "node:crypto";
import { PHONICS_KINDS, checkPhonicsUpload, phonicsPhonemes, type PhonicsExample, type PhonicsKind } from "@/lib/rules/phonics";
import { audioNameFromUrl } from "@/lib/rules/tts";
import { generatePhonicsSchema, type GeneratePhonicsResult, type PhonicsItemResult } from "@/lib/schemas/admin-phonics";
import { getVoiceMp3Enabled } from "../app-settings";
import { audioFileExists, removeAudioFile, saveAudioFile } from "../audio/files";
import { TtsTextError, TtsUnavailableError, currentVoice, isTtsAvailable, synthesizePhonemeMp3 } from "../audio/tts";
import { db } from "../db";
import { fail, type AdminResult } from "./result";

// Âm phonics ở khu quản trị (Adult20). Hàm ghi: nơi gọi (server action, route handler) phải đã kiểm quyền quản trị.

export type PhonicsRow = {
  id: number;
  grapheme: string;
  ipa: string;
  kind: PhonicsKind;
  examples: PhonicsExample[];
  audio: string | null;
  audioMs: number | null;
  audioAuto: boolean;
  sortOrder: number;
};

export type PhonicsData = {
  rows: PhonicsRow[];
  /** Công tắc “Giọng mp3” đang bật (nút “Tạo âm thanh” chỉ sáng khi bật). */
  mp3Enabled: boolean;
  /** Máy chủ này tạo được giọng đọc (đã cài công cụ). */
  ttsAvailable: boolean;
};

function examplesOf(value: unknown): PhonicsExample[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((e) => (e && typeof e === "object" && typeof (e as PhonicsExample).word === "string" ? [{ word: (e as PhonicsExample).word, part: String((e as PhonicsExample).part ?? "") }] : []));
}

export async function getPhonics(): Promise<PhonicsData> {
  const [rows, mp3Enabled, ttsAvailable] = await Promise.all([db.phonicsSound.findMany({ orderBy: { sortOrder: "asc" } }), getVoiceMp3Enabled(), isTtsAvailable()]);
  return {
    rows: rows
      .filter((r) => PHONICS_KINDS.includes(r.kind))
      .map((r) => ({
        id: r.id,
        grapheme: r.grapheme,
        ipa: r.ipa,
        kind: r.kind,
        examples: examplesOf(r.examples),
        audio: audioNameFromUrl(r.audio) ? r.audio : null,
        audioMs: r.audioMs,
        audioAuto: r.audioAuto,
        sortOrder: r.sortOrder,
      })),
    mp3Enabled,
    ttsAvailable,
  };
}

/** Lưu tệp ghi âm tải lên cho một âm: kiểm loại, dung lượng, độ dài theo nội dung; thay tệp cũ (nếu có). */
export async function savePhonicsUpload(id: number, file: { name: string; bytes: Uint8Array }): Promise<AdminResult> {
  if (!Number.isInteger(id) || id < 1) return fail("Không tìm thấy âm này.");
  const row = await db.phonicsSound.findUnique({ where: { id }, select: { id: true, audio: true } });
  if (!row) return fail("Không tìm thấy âm này nữa.");
  const check = checkPhonicsUpload(file.name, file.bytes);
  if (!check.ok) return fail(check.message, "file");

  const bytes = Buffer.from(file.bytes);
  const stored = await saveAudioFile("phonics", id, createHash("sha1").update(bytes).digest("hex"), "upload", bytes, check.info.format);
  await db.phonicsSound.update({ where: { id }, data: { audio: stored, audioMs: Math.round(check.info.seconds * 1000), audioAuto: false } });
  if (row.audio && row.audio !== stored) await removeAudioFile(row.audio);
  return { ok: true, id };
}

/** Tạo âm thanh tự động cho một lượt âm. Lỗi của một âm không làm hỏng cả lượt. */
export async function generatePhonicsAudio(input: unknown): Promise<GeneratePhonicsResult> {
  const parsed = generatePhonicsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ." };
  if (!(await getVoiceMp3Enabled())) return { ok: false, message: "Hãy bật “Giọng mp3” trước khi tạo âm thanh." };

  const { ids, force } = parsed.data;
  const rows = await db.phonicsSound.findMany({ where: { id: { in: ids } }, select: { id: true, grapheme: true, ipa: true, audio: true } });
  const byId = new Map(rows.map((r) => [r.id, r]));
  const voice = currentVoice();
  const items: PhonicsItemResult[] = [];

  for (const id of ids) {
    const row = byId.get(id);
    if (!row) {
      items.push({ id, grapheme: `#${id}`, status: "error", message: "Không tìm thấy âm này nữa." });
      continue;
    }
    if (!force && (await audioFileExists(row.audio))) {
      items.push({ id, grapheme: row.grapheme, status: "skipped" });
      continue;
    }
    try {
      const phonemes = phonicsPhonemes(row.ipa);
      const made = await synthesizePhonemeMp3(phonemes, voice);
      const stored = await saveAudioFile("phonics", id, phonemes, voice, made.bytes);
      await db.phonicsSound.update({ where: { id }, data: { audio: stored, audioMs: made.ms, audioAuto: true } });
      if (row.audio && row.audio !== stored) await removeAudioFile(row.audio);
      items.push({ id, grapheme: row.grapheme, status: "made" });
    } catch (error) {
      if (error instanceof TtsUnavailableError) return { ok: false, message: error.message };
      items.push({ id, grapheme: row.grapheme, status: "error", message: error instanceof TtsTextError ? error.message : "Chưa tạo được âm thanh cho âm này." });
      if (!(error instanceof TtsTextError)) console.error("tạo âm phonics:", error);
    }
  }
  return { ok: true, items };
}
