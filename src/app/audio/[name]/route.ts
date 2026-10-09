import { NextResponse } from "next/server";
import { audioMimeOf, parseByteRange } from "@/lib/rules/tts";
import { readAudioFile } from "@/server/audio/files";
import { getSessionUser } from "@/server/session";

// Phục vụ giọng đọc mp3 (lưu ở storage/uploads/audio/, ngoài public/). Cần đăng nhập; tên tệp chỉ nhận dạng
// `word-12-ab12cd34.mp3` nên không đi ra ngoài thư mục. Tên chứa mã băm nội dung nên cache được lâu; có ETag và Range
// (Safari cần Range để phát âm thanh).
const HEADERS = {
  "Accept-Ranges": "bytes",
  "Cache-Control": "private, max-age=31536000, immutable",
  "X-Content-Type-Options": "nosniff",
} as const;

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!(await getSessionUser())) return new NextResponse("Cần đăng nhập", { status: 401 });
  const { name } = await params;
  const file = await readAudioFile(name);
  if (!file) return new NextResponse("Không tìm thấy", { status: 404 });

  const etag = `"${file.size.toString(16)}-${Math.floor(file.mtimeMs).toString(16)}"`;
  if (request.headers.get("if-none-match") === etag) return new NextResponse(null, { status: 304, headers: { ETag: etag, "Cache-Control": HEADERS["Cache-Control"] } });

  const range = parseByteRange(request.headers.get("range"), file.size);
  if (range === "unsatisfiable") return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${file.size}` } });
  if (range) {
    const part = file.bytes.subarray(range.start, range.end + 1);
    return new NextResponse(new Uint8Array(part), {
      status: 206,
      headers: { ...HEADERS, "Content-Type": audioMimeOf(name), ETag: etag, "Content-Range": `bytes ${range.start}-${range.end}/${file.size}`, "Content-Length": String(part.length) },
    });
  }
  return new NextResponse(new Uint8Array(file.bytes), { headers: { ...HEADERS, "Content-Type": audioMimeOf(name), ETag: etag, "Content-Length": String(file.size) } });
}
