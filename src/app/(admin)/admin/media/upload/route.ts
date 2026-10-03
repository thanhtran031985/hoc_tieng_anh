import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminOrNull } from "@/server/admin-gate";
import { saveUpload } from "@/server/admin/media";

// Tải một hình lên thư viện (POST multipart: `file`, tùy chọn `wordId`). Chỉ role admin và cổng bố mẹ đang mở.
// Giới hạn dung lượng và kiểu tệp kiểm ở `saveUpload` (nhận dạng theo nội dung, không tin đuôi tệp).
export async function POST(request: Request) {
  if (!(await getAdminOrNull())) return NextResponse.json({ ok: false, message: "Cần mở khóa khu quản trị bằng tài khoản quản trị." }, { status: 403 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Không đọc được tệp tải lên." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, message: "Chưa chọn tệp." }, { status: 400 });
  const rawWordId = form.get("wordId");
  const wordId = typeof rawWordId === "string" && /^\d+$/.test(rawWordId) ? Number(rawWordId) : undefined;

  try {
    const result = await saveUpload({ name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) }, wordId);
    if (result.ok) {
      revalidatePath("/admin/media");
      revalidatePath("/admin");
    }
    return NextResponse.json(result, { status: result.ok ? 200 : 422 });
  } catch (error) {
    console.error("upload:", error);
    return NextResponse.json({ ok: false, message: "Chưa lưu được tệp. Thử lại nhé." }, { status: 500 });
  }
}
