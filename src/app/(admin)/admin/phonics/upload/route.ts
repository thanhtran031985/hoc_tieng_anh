import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminOrNull } from "@/server/admin-gate";
import { savePhonicsUpload } from "@/server/admin/phonics";

// Tải tệp ghi âm lên cho một âm phonics (POST multipart: `file`, `id`). Chỉ role admin và cổng bố mẹ đang mở.
// Loại tệp, dung lượng (≤ 1 MB) và độ dài (0,3–2 giây) kiểm ở `savePhonicsUpload`, nhận dạng theo nội dung (không tin đuôi tệp).
export async function POST(request: Request) {
  if (!(await getAdminOrNull())) return NextResponse.json({ ok: false, message: "Cần mở khóa khu quản trị bằng tài khoản quản trị." }, { status: 403 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Không đọc được tệp tải lên." }, { status: 400 });
  }
  const file = form.get("file");
  const rawId = form.get("id");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, field: "file", message: "Chọn một tệp .mp3 hoặc .wav." }, { status: 400 });
  if (typeof rawId !== "string" || !/^\d+$/.test(rawId)) return NextResponse.json({ ok: false, message: "Không tìm thấy âm này." }, { status: 400 });

  try {
    const result = await savePhonicsUpload(Number(rawId), { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) });
    if (result.ok) revalidatePath("/admin/phonics");
    return NextResponse.json(result, { status: result.ok ? 200 : 422 });
  } catch (error) {
    console.error("phonics upload:", error);
    return NextResponse.json({ ok: false, message: "Chưa lưu được tệp. Thử lại nhé." }, { status: 500 });
  }
}
