import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminOrNull } from "@/server/admin-gate";
import { saveQuestionAudioUpload } from "@/server/admin/question-types";

// Tải âm thanh mẫu lên cho một câu luyện nói đã lưu (POST multipart: `file`, `questionId`). Chỉ role admin và cổng bố mẹ đang mở.
// Loại tệp, dung lượng và độ dài kiểm ở `saveQuestionAudioUpload` (nhận dạng theo nội dung, không tin đuôi tệp).
export async function POST(request: Request) {
  if (!(await getAdminOrNull())) return NextResponse.json({ ok: false, message: "Cần mở khóa khu quản trị bằng tài khoản quản trị." }, { status: 403 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Không đọc được tệp tải lên." }, { status: 400 });
  }
  const file = form.get("file");
  const rawId = form.get("questionId");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, field: "file", message: "Chọn một tệp .mp3 hoặc .wav." }, { status: 400 });
  if (typeof rawId !== "string" || !/^\d+$/.test(rawId)) return NextResponse.json({ ok: false, message: "Hãy lưu câu hỏi trước khi tải âm thanh lên." }, { status: 400 });

  try {
    const result = await saveQuestionAudioUpload(Number(rawId), { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) });
    if (result.ok) revalidatePath("/admin/question-types");
    return NextResponse.json(result, { status: result.ok ? 200 : 422 });
  } catch (error) {
    console.error("question audio upload:", error);
    return NextResponse.json({ ok: false, message: "Chưa lưu được tệp. Thử lại nhé." }, { status: 500 });
  }
}
