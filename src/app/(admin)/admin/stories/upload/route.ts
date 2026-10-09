import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminOrNull } from "@/server/admin-gate";
import { saveStoryAudioUpload, saveStoryImageUpload } from "@/server/admin/stories";

// Tải tệp lên cho truyện tranh (POST multipart): `kind=audio` (kèm `pageId`) là âm thanh đọc của một trang, `kind=image` là tranh.
// Chỉ role admin và cổng bố mẹ đang mở. Loại tệp, dung lượng và độ dài kiểm ở server/admin/stories (nhận dạng theo nội dung, không tin đuôi tệp).
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
  if (!(file instanceof File)) return NextResponse.json({ ok: false, field: "file", message: "Chọn một tệp để tải lên." }, { status: 400 });
  const payload = { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) };

  try {
    if (kind === "image") {
      const result = await saveStoryImageUpload(payload);
      return NextResponse.json(result, { status: result.ok ? 200 : 422 });
    }
    if (kind === "audio") {
      const rawId = form.get("pageId");
      if (typeof rawId !== "string" || !/^\d+$/.test(rawId)) return NextResponse.json({ ok: false, message: "Hãy lưu truyện trước khi tải âm thanh lên." }, { status: 400 });
      const result = await saveStoryAudioUpload(Number(rawId), payload);
      if (result.ok) revalidatePath("/admin/stories");
      return NextResponse.json(result, { status: result.ok ? 200 : 422 });
    }
    return NextResponse.json({ ok: false, message: "Loại tệp tải lên không hợp lệ." }, { status: 400 });
  } catch (error) {
    console.error("story upload:", error);
    return NextResponse.json({ ok: false, message: "Chưa lưu được tệp. Thử lại nhé." }, { status: 500 });
  }
}
