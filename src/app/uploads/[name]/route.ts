import { NextResponse } from "next/server";
import { readUpload } from "@/server/admin/media";
import { getSessionUser } from "@/server/session";

// Phục vụ hình đã tải lên (lưu ở storage/uploads/, ngoài public/). Cần đăng nhập; tên tệp chỉ nhận dạng đã chuẩn hóa nên không đi ra ngoài thư mục.
// CSP sandbox + nosniff để SVG mở trực tiếp cũng không chạy được mã.
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!(await getSessionUser())) return new NextResponse("Cần đăng nhập", { status: 401 });
  const file = await readUpload((await params).name);
  if (!file) return new NextResponse("Không tìm thấy", { status: 404 });
  return new NextResponse(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
