import { createHash } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { REC_KEEP, REC_MAX_BYTES, REC_MAX_MS, REC_MIME, isRecordingFileName, recordingsToDrop, sniffRecording } from "@/lib/rules/recording";
import { db } from "./db";
import { requireLearner } from "./learners";

// Bản ghi âm giọng bé (task 17). Tệp ở `storage/recordings/<learnerId>/` (ngoài `public/`), chỉ trả về qua route `/recordings/[id]`
// sau khi kiểm tài khoản đang đăng nhập đúng là của gia đình bé và cổng bố mẹ đang mở. Mỗi (bé, câu) giữ tối đa 3 bản gần nhất.

export const RECORDINGS_DIR = path.join(process.cwd(), "storage", "recordings");

const dirOf = (learnerId: number) => path.join(RECORDINGS_DIR, String(learnerId));

export const saveRecordingInputSchema = z.object({
  questionId: z.number().int().positive(),
  durationMs: z.number().int().min(0).max(REC_MAX_MS + 2000),
  stars: z.number().int().min(1).max(3),
  transcript: z.string().trim().max(500).nullable(),
  scored: z.boolean(),
});

export type SaveRecordingResult = { ok: true; id: number } | { ok: false; message: string };

/**
 * Lưu một bản ghi âm của hồ sơ. `requireLearner` bảo đảm hồ sơ thuộc tài khoản đang đăng nhập; loại tệp nhận dạng theo chữ ký, tối đa 1 MB.
 * Lưu xong giữ 3 bản mới nhất của câu này, xóa bản cũ cả dòng lẫn tệp.
 */
export async function saveRecording(userId: number, learnerId: number, input: unknown, file: { bytes: Uint8Array }): Promise<SaveRecordingResult> {
  await requireLearner(userId, learnerId);
  const parsed = saveRecordingInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Bản ghi âm chưa hợp lệ." };
  if (file.bytes.byteLength === 0 || file.bytes.byteLength > REC_MAX_BYTES) return { ok: false, message: "Bản ghi âm rỗng hoặc quá lớn." };
  const ext = sniffRecording(file.bytes);
  if (!ext) return { ok: false, message: "Tệp không phải bản ghi âm hợp lệ." };

  const question = await db.question.findUnique({ where: { id: parsed.data.questionId }, select: { id: true, type: true, prompt: true } });
  const sentence = (question?.prompt as { text?: unknown } | null | undefined)?.text;
  if (!question || question.type !== "speaking" || typeof sentence !== "string") return { ok: false, message: "Không tìm thấy câu luyện nói này." };

  const row = await db.recording.create({
    data: { learnerId, questionId: question.id, sentence: sentence.slice(0, 255), file: "", durationMs: parsed.data.durationMs, stars: parsed.data.stars, transcript: parsed.data.transcript, scored: parsed.data.scored },
    select: { id: true },
  });
  const bytes = Buffer.from(file.bytes);
  const name = `rec-${row.id}-${createHash("sha1").update(bytes).digest("hex").slice(0, 8)}.${ext}`;
  await mkdir(dirOf(learnerId), { recursive: true });
  await writeFile(path.join(dirOf(learnerId), name), bytes);
  await db.recording.update({ where: { id: row.id }, data: { file: name } });

  const same = await db.recording.findMany({ where: { learnerId, questionId: question.id }, select: { id: true, createdAt: true, file: true } });
  const drop = new Set(recordingsToDrop(same, REC_KEEP));
  for (const old of same.filter((r) => drop.has(r.id))) {
    await db.recording.delete({ where: { id: old.id } });
    await removeFile(learnerId, old.file);
  }
  return { ok: true, id: row.id };
}

async function removeFile(learnerId: number, name: string): Promise<void> {
  if (isRecordingFileName(name)) await rm(path.join(dirOf(learnerId), name), { force: true });
}

export type RecordingRow = {
  id: number;
  sentence: string;
  durationMs: number;
  stars: 1 | 2 | 3;
  transcript: string | null;
  scored: boolean;
  createdAt: string;
};

/** Các bản ghi âm của một bé (mới nhất trước). Kiểm hồ sơ thuộc tài khoản qua `requireLearner`. */
export async function listRecordings(userId: number, learnerId: number): Promise<RecordingRow[]> {
  await requireLearner(userId, learnerId);
  const rows = await db.recording.findMany({ where: { learnerId }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 200 });
  return rows.map((r) => ({
    id: r.id,
    sentence: r.sentence,
    durationMs: r.durationMs,
    stars: Math.min(3, Math.max(1, r.stars)) as 1 | 2 | 3,
    transcript: r.transcript,
    scored: r.scored,
    createdAt: r.createdAt.toISOString(),
  }));
}

/** Xóa một bản ghi (dòng và tệp). Chỉ xóa được bản của bé thuộc tài khoản đang đăng nhập. */
export async function deleteRecording(userId: number, recordingId: number): Promise<boolean> {
  if (!Number.isInteger(recordingId) || recordingId < 1) return false;
  const row = await db.recording.findFirst({ where: { id: recordingId, learner: { userId } }, select: { id: true, learnerId: true, file: true } });
  if (!row) return false;
  await db.recording.delete({ where: { id: row.id } });
  await removeFile(row.learnerId, row.file);
  return true;
}

export type RecordingFile = { bytes: Buffer; contentType: string; size: number; mtimeMs: number };

/** Nội dung bản ghi cho route phục vụ tệp; không phải của tài khoản này hoặc tệp mất thì null. */
export async function readRecordingFile(userId: number, recordingId: number): Promise<RecordingFile | null> {
  if (!Number.isInteger(recordingId) || recordingId < 1) return null;
  const row = await db.recording.findFirst({ where: { id: recordingId, learner: { userId } }, select: { learnerId: true, file: true } });
  if (!row || !isRecordingFileName(row.file)) return null;
  const full = path.join(dirOf(row.learnerId), row.file);
  try {
    const [bytes, info] = await Promise.all([readFile(full), stat(full)]);
    return { bytes, contentType: REC_MIME[row.file.split(".").pop() as keyof typeof REC_MIME] ?? "audio/webm", size: bytes.length, mtimeMs: info.mtimeMs };
  } catch {
    return null;
  }
}
