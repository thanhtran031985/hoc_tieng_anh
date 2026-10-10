"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireParentGate } from "@/server/parent-gate";
import { deleteRecording } from "@/server/recordings";

// Server action của trang Bài viết & ghi âm: phải đang đăng nhập và đã mở khóa khu bố mẹ; chỉ xóa được bản ghi của con trong gia đình mình.

const deleteSchema = z.object({ id: z.number().int().positive() });

export type WorksActionResult = { ok: true } | { ok: false; message: string };

export async function deleteRecordingAction(input: unknown): Promise<WorksActionResult> {
  const user = await requireParentGate();
  const parsed = deleteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Bản ghi âm này không hợp lệ." };
  try {
    const done = await deleteRecording(user.id, parsed.data.id);
    if (!done) return { ok: false, message: "Không tìm thấy bản ghi âm này (có thể đã xóa rồi)." };
    revalidatePath("/parent/works");
    return { ok: true };
  } catch (error) {
    console.error("delete recording:", error);
    return { ok: false, message: "Chưa xóa được. Bố mẹ thử lại nhé." };
  }
}
