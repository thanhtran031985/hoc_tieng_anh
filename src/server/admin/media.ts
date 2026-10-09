import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { MEDIA_MAX_BYTES, contentTypeOf, isAssignablePath, isStoredFileName, sniffImage, storedFileName, uploadPath, wordFromFileName } from "@/lib/rules/admin-media";
import { hasFullAudio } from "@/lib/rules/tts";
import { getVoiceMp3Enabled } from "../app-settings";
import { isTtsAvailable } from "../audio/tts";
import { db } from "../db";
import { fail, firstIssue, type AdminResult } from "./result";

// Thư viện hình và âm thanh (Adult13). Hình tải lên lưu ở `storage/uploads/` (ngoài `public/`), phục vụ qua route handler `/uploads/<tên>`
// có kiểm tra đăng nhập. Hàm ghi ở đây kiểm dữ liệu; route handler và server action gọi `getAdminOrNull()` / `requireAdmin()` trước.

export const UPLOAD_DIR = path.join(process.cwd(), "storage", "uploads");

export type LibraryWord = { id: number; word: string; level: number; image: string | null; audio: string | null; exampleEn: string; exampleAudio: string | null; usedIn: number };
export type LibraryUpload = { path: string; size: number; createdAt: string };
export type MediaLibrary = {
  words: LibraryWord[];
  unassigned: LibraryUpload[];
  imageCount: number;
  /** Số từ đã có đủ tiếng (cả từ lẫn câu ví dụ). */
  audioCount: number;
  /** Công tắc “Giọng mp3” (toàn hệ thống) đang bật. */
  mp3Enabled: boolean;
  /** Máy chủ này tạo được giọng đọc (đã cài công cụ). */
  ttsAvailable: boolean;
};

export async function getLibrary(): Promise<MediaLibrary> {
  const [words, steps, media, mp3Enabled, ttsAvailable] = await Promise.all([
    db.word.findMany({ orderBy: [{ level: { number: "asc" } }, { word: "asc" }], select: { id: true, word: true, image: true, audio: true, exampleEn: true, exampleAudio: true, level: { select: { number: true } } } }),
    db.lessonStep.findMany({ where: { wordId: { not: null } }, distinct: ["wordId", "lessonId"], select: { wordId: true } }),
    db.media.findMany({ where: { type: "image" }, orderBy: { id: "desc" }, select: { path: true, size: true, createdAt: true } }),
    getVoiceMp3Enabled(),
    isTtsAvailable(),
  ]);
  const used = new Map<number, number>();
  for (const s of steps) if (s.wordId !== null) used.set(s.wordId, (used.get(s.wordId) ?? 0) + 1);
  const attached = new Set(words.flatMap((w) => (w.image ? [w.image] : [])));
  return {
    words: words.map((w) => ({ id: w.id, word: w.word, level: w.level.number, image: w.image, audio: w.audio, exampleEn: w.exampleEn ?? "", exampleAudio: w.exampleAudio, usedIn: used.get(w.id) ?? 0 })),
    unassigned: media.filter((m) => !attached.has(m.path)).map((m) => ({ path: m.path, size: m.size, createdAt: m.createdAt.toISOString() })),
    imageCount: words.filter((w) => w.image).length,
    audioCount: words.filter(hasFullAudio).length,
    mp3Enabled,
    ttsAvailable,
  };
}

/** Kiểm và lưu tệp hình vào `storage/uploads/` + thư viện (chưa gắn cho từ nào). Dùng chung cho hình của từ và tranh trang truyện. */
export async function storeImageUpload(file: { name: string; bytes: Uint8Array }): Promise<{ ok: true; path: string; size: number } | { ok: false; message: string }> {
  if (file.bytes.byteLength === 0) return { ok: false, message: `“${file.name}” là tệp rỗng.` };
  if (file.bytes.byteLength > MEDIA_MAX_BYTES) return { ok: false, message: `“${file.name}” lớn hơn ${MEDIA_MAX_BYTES / 1024 / 1024} MB.` };
  const kind = sniffImage(file.bytes);
  if (!kind) return { ok: false, message: `“${file.name}” không phải hình PNG, JPEG, WebP hoặc SVG hợp lệ.` };

  const name = storedFileName(file.name, kind, createHash("sha1").update(file.bytes).digest("hex"));
  const filePath = path.join(UPLOAD_DIR, name);
  await mkdir(UPLOAD_DIR, { recursive: true });
  if (!(await stat(filePath).then(() => true, () => false))) await writeFile(filePath, file.bytes);
  const publicPath = uploadPath(name);
  await db.media.upsert({ where: { path: publicPath }, create: { path: publicPath, type: "image", size: file.bytes.byteLength, alt: wordFromFileName(file.name) || null }, update: {} });
  return { ok: true, path: publicPath, size: file.bytes.byteLength };
}

export type UploadResult =
  | { ok: true; path: string; size: number; assigned: { id: number; word: string } | null; note: string | null }
  | { ok: false; message: string };

/**
 * Lưu một hình tải lên: chỉ nhận ảnh (PNG, JPEG, WebP, SVG an toàn, nhận dạng theo nội dung) tối đa 2 MB.
 * Có `wordId` thì gắn hình vào từ đó; không có thì tên tệp trùng một từ chưa có hình sẽ tự gắn.
 */
export async function saveUpload(file: { name: string; bytes: Uint8Array }, wordId?: number): Promise<UploadResult> {
  const stored = await storeImageUpload(file);
  if (!stored.ok) return stored;
  const publicPath = stored.path;

  if (wordId !== undefined) {
    const result = await db.word.updateMany({ where: { id: wordId }, data: { image: publicPath } });
    if (!result.count) return { ok: false, message: "Không tìm thấy từ này nữa." };
    const word = await db.word.findUnique({ where: { id: wordId }, select: { id: true, word: true } });
    return { ok: true, path: publicPath, size: file.bytes.byteLength, assigned: word, note: null };
  }

  const guess = wordFromFileName(file.name);
  const match = guess ? await db.word.findFirst({ where: { word: guess }, select: { id: true, word: true, image: true } }) : null;
  if (!match) return { ok: true, path: publicPath, size: file.bytes.byteLength, assigned: null, note: "Chưa có từ trùng tên tệp. Gán hình cho từ ở bên dưới." };
  if (match.image && match.image !== publicPath) return { ok: true, path: publicPath, size: file.bytes.byteLength, assigned: null, note: `“${match.word}” đã có hình. Bấm “Thay hình” ở thẻ của từ để đổi.` };
  await db.word.update({ where: { id: match.id }, data: { image: publicPath } });
  return { ok: true, path: publicPath, size: file.bytes.byteLength, assigned: { id: match.id, word: match.word }, note: null };
}

const assignSchema = z.object({
  wordId: z.number().int().positive(),
  path: z.string().max(255).refine(isAssignablePath, "Đường dẫn hình không hợp lệ."),
});

/** Gán một hình (mẫu đi kèm hoặc đã tải lên) cho một từ. */
export async function assignImage(input: unknown): Promise<AdminResult> {
  const parsed = assignSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { wordId, path: imagePath } = parsed.data;
  if (imagePath.startsWith("/uploads/") && !(await db.media.findUnique({ where: { path: imagePath }, select: { id: true } }))) return fail("Không tìm thấy hình này trong thư viện.", "path");
  const result = await db.word.updateMany({ where: { id: wordId }, data: { image: imagePath } });
  return result.count ? { ok: true } : fail("Không tìm thấy từ này nữa.", "wordId");
}

/** Nội dung và kiểu của một hình đã tải lên để phục vụ lại; tên không hợp lệ hoặc không có tệp thì null. */
export async function readUpload(name: string): Promise<{ bytes: Buffer; contentType: string } | null> {
  const contentType = contentTypeOf(name);
  if (!isStoredFileName(name) || !contentType) return null;
  try {
    return { bytes: await readFile(path.join(UPLOAD_DIR, name)), contentType };
  } catch {
    return null;
  }
}
