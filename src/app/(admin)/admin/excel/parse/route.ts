import { NextResponse } from "next/server";
import { MAX_IMPORT_BYTES } from "@/lib/rules/admin-excel";
import { getAdminOrNull } from "@/server/admin-gate";
import { parseImport } from "@/server/admin/excel";
import { parseTopicImport } from "@/server/admin/excel-topic";

// Đọc tệp .xlsx đã chọn để xem trước (POST multipart: `file`, `kind` = vocab | questions | topic). Chưa lưu gì; mọi kiểm tra chạy ở server.
export async function POST(request: Request) {
  if (!(await getAdminOrNull())) return NextResponse.json({ ok: false, message: "Cần mở khóa khu quản trị bằng tài khoản quản trị." }, { status: 403 });
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Không đọc được tệp tải lên." }, { status: 400 });
  }
  const file = form.get("file");
  const kind = form.get("kind");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, message: "Chưa chọn tệp." }, { status: 400 });
  if (kind !== "vocab" && kind !== "questions" && kind !== "topic") return NextResponse.json({ ok: false, message: "Loại dữ liệu chưa đúng." }, { status: 400 });
  if (file.size > MAX_IMPORT_BYTES) return NextResponse.json({ ok: false, message: `Tệp lớn hơn ${MAX_IMPORT_BYTES / 1024 / 1024} MB.` }, { status: 422 });
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = kind === "topic" ? await parseTopicImport(bytes) : await parseImport(bytes, kind);
    return NextResponse.json(result, { status: result.ok ? 200 : 422 });
  } catch (error) {
    console.error("parse import:", error);
    return NextResponse.json({ ok: false, message: "Chưa đọc được tệp. Thử lại nhé." }, { status: 500 });
  }
}
