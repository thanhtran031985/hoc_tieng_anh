import { NextResponse } from "next/server";
import { getAdminOrNull } from "@/server/admin-gate";
import { buildTemplate } from "@/server/admin/excel";
import { buildTopicTemplate } from "@/server/admin/excel-topic";

const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const FILE_NAMES = { vocab: "mau-tu-vung", questions: "mau-cau-hoi", topic: "mau-chu-de-moi" } as const;

// Tải tệp mẫu .xlsx (GET ?kind=vocab|questions|topic; kind=topic có thể kèm &unitId= để điền sẵn từ chủ đề khung). Chỉ role admin và cổng bố mẹ đang mở.
export async function GET(request: Request) {
  if (!(await getAdminOrNull())) return NextResponse.json({ ok: false, message: "Cần mở khóa khu quản trị bằng tài khoản quản trị." }, { status: 403 });
  const params = new URL(request.url).searchParams;
  const kind = params.get("kind");
  if (kind !== "vocab" && kind !== "questions" && kind !== "topic") return NextResponse.json({ ok: false, message: "Loại tệp mẫu chưa đúng." }, { status: 400 });

  let bytes: Buffer | null;
  let fileName: string = FILE_NAMES[kind];
  if (kind === "topic") {
    const raw = params.get("unitId");
    const unitId = raw === null ? undefined : Number(raw);
    if (unitId !== undefined && !Number.isInteger(unitId)) return NextResponse.json({ ok: false, message: "Mã chủ đề chưa đúng." }, { status: 400 });
    bytes = await buildTopicTemplate(unitId);
    if (!bytes) return NextResponse.json({ ok: false, message: "Không tìm thấy chủ đề này." }, { status: 404 });
    if (unitId !== undefined) fileName = `chu-de-${unitId}-tu-muc-tieu`;
  } else {
    bytes = await buildTemplate(kind);
  }
  return new NextResponse(new Uint8Array(bytes), {
    headers: { "Content-Type": XLSX, "Content-Disposition": `attachment; filename="${fileName}.xlsx"`, "Cache-Control": "no-store" },
  });
}
