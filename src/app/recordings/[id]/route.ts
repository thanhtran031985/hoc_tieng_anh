import { NextResponse } from "next/server";
import { parseByteRange } from "@/lib/rules/tts";
import { isParentGateOpen } from "@/server/parent-gate";
import { readRecordingFile } from "@/server/recordings";
import { getSessionUser } from "@/server/session";

// Phục vụ bản ghi âm giọng bé (lưu ở storage/recordings/, ngoài public/). Bản ghi âm không bao giờ công khai: phải đăng nhập,
// bản ghi phải thuộc một hồ sơ của tài khoản này (gia đình khác nhận 404) và cổng bố mẹ đang mở. Có Range để tua được.
const HEADERS = { "Accept-Ranges": "bytes", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } as const;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return new NextResponse("Cần đăng nhập", { status: 401 });
  if (!(await isParentGateOpen(user.id))) return new NextResponse("Cần mở khóa khu bố mẹ", { status: 403 });
  const { id } = await params;
  const file = /^\d+$/.test(id) ? await readRecordingFile(user.id, Number(id)) : null;
  if (!file) return new NextResponse("Không tìm thấy", { status: 404 });

  const range = parseByteRange(request.headers.get("range"), file.size);
  if (range === "unsatisfiable") return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${file.size}` } });
  if (range) {
    const part = file.bytes.subarray(range.start, range.end + 1);
    return new NextResponse(new Uint8Array(part), { status: 206, headers: { ...HEADERS, "Content-Type": file.contentType, "Content-Range": `bytes ${range.start}-${range.end}/${file.size}`, "Content-Length": String(part.length) } });
  }
  return new NextResponse(new Uint8Array(file.bytes), { headers: { ...HEADERS, "Content-Type": file.contentType, "Content-Length": String(file.size) } });
}
