import { NextResponse } from "next/server";
import { getAdminOrNull } from "@/server/admin-gate";
import { buildTemplate } from "@/server/admin/excel";

// Tải tệp mẫu .xlsx (GET ?kind=vocab|questions). Chỉ role admin và cổng bố mẹ đang mở.
export async function GET(request: Request) {
  if (!(await getAdminOrNull())) return NextResponse.json({ ok: false, message: "Cần mở khóa khu quản trị bằng tài khoản quản trị." }, { status: 403 });
  const kind = new URL(request.url).searchParams.get("kind");
  if (kind !== "vocab" && kind !== "questions") return NextResponse.json({ ok: false, message: "Loại tệp mẫu chưa đúng." }, { status: 400 });
  const bytes = await buildTemplate(kind);
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="mau-${kind === "vocab" ? "tu-vung" : "cau-hoi"}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
