import { NextResponse } from "next/server";
import { getAdminOrNull } from "@/server/admin-gate";
import { buildExport } from "@/server/admin/excel";

// Xuất dữ liệu ra .xlsx hoặc .csv (GET ?kind=&level=&status=&format=&columns=a,b,c). Chỉ role admin và cổng bố mẹ đang mở.
export async function GET(request: Request) {
  if (!(await getAdminOrNull())) return NextResponse.json({ ok: false, message: "Cần mở khóa khu quản trị bằng tài khoản quản trị." }, { status: 403 });
  const params = new URL(request.url).searchParams;
  const result = await buildExport({
    kind: params.get("kind"),
    level: params.get("level") ?? "all",
    status: params.get("status") ?? "all",
    format: params.get("format") ?? "xlsx",
    columns: (params.get("columns") ?? "").split(",").filter(Boolean),
  });
  if ("message" in result) return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
  return new NextResponse(new Uint8Array(result.bytes), {
    headers: { "Content-Type": result.contentType, "Content-Disposition": `attachment; filename="${result.fileName}"`, "Cache-Control": "no-store" },
  });
}
