// Ghi âm giọng bé (task 17): chọn định dạng, phân loại lỗi micro, kiểm tệp tải lên và giữ 3 bản gần nhất. Hàm thuần.

/** Ghi âm tối đa 10 giây (token `duration-rec-max`); hết thì tự dừng. */
export const REC_MAX_MS = 10_000;
/** Giữ tối đa chừng này bản ghi âm gần nhất cho mỗi câu của mỗi bé. */
export const REC_KEEP = 3;
/** Bản ghi quá 1 MB bị từ chối (10 giây webm/opus chỉ vài chục KB). */
export const REC_MAX_BYTES = 1024 * 1024;

const MIME_PREFERENCE = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"] as const;

/** Định dạng ghi âm trình duyệt hỗ trợ, theo thứ tự ưu tiên; null nếu không có (không ghi âm được). */
export function pickRecorderMime(isSupported: (mime: string) => boolean): string | null {
  return MIME_PREFERENCE.find((m) => isSupported(m)) ?? null;
}

export type RecExt = "webm" | "ogg" | "mp4";

/** Đuôi tệp theo kiểu MIME của MediaRecorder. */
export function recordingExt(mime: string): RecExt {
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("mp4")) return "mp4";
  return "webm";
}

export const REC_MIME: Record<RecExt, string> = { webm: "audio/webm", ogg: "audio/ogg", mp4: "audio/mp4" };

export type MicProblem = "denied" | "nomic" | "error";

/** Phân loại lỗi `getUserMedia`: chưa cho phép micro, máy không có micro, hay lỗi khác. */
export function micProblem(error: unknown): MicProblem {
  const name = typeof error === "object" && error !== null && "name" in error ? String((error as { name: unknown }).name) : "";
  if (name === "NotAllowedError" || name === "SecurityError" || name === "PermissionDeniedError") return "denied";
  if (name === "NotFoundError" || name === "DevicesNotFoundError" || name === "OverconstrainedError") return "nomic";
  return "error";
}

/** Nhận dạng tệp ghi âm theo chữ ký (không tin kiểu MIME client gửi): webm/matroska, ogg hoặc mp4; không nhận ra thì null. */
export function sniffRecording(bytes: Uint8Array): RecExt | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) return "webm";
  if (bytes[0] === 0x4f && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) return "ogg";
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) return "mp4";
  return null;
}

/** Mã các bản ghi cần xóa để còn tối đa `keep` bản mới nhất; `rows` có thể xếp tùy ý (mới nhất = `createdAt` lớn nhất, đồng thời thì `id` lớn nhất). */
export function recordingsToDrop(rows: readonly { id: number; createdAt: Date }[], keep: number = REC_KEEP): number[] {
  return [...rows]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id - a.id)
    .slice(keep)
    .map((r) => r.id);
}

/** Tên tệp bản ghi hợp lệ: `rec-<id>-<8 hex>.<đuôi>`; chặn mọi đường dẫn lạ. */
export const isRecordingFileName = (name: string): boolean => /^rec-[0-9]{1,10}-[0-9a-f]{8}\.(?:webm|ogg|mp4)$/.test(name);

/** Giây dạng m:ss cho thời lượng bản ghi (làm tròn). */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
