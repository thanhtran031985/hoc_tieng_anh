"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin-gate";
import { assignImage } from "@/server/admin/media";
import type { AdminResult } from "@/server/admin/result";

// Server action của Thư viện hình và âm thanh: gọi `requireAdmin()` ở dòng đầu (không dựa vào layout). Tải tệp lên đi qua route handler
// `/admin/media/upload` (kiểm quyền riêng, không bị giới hạn 1 MB của server action).

export async function assignImageAction(input: unknown): Promise<AdminResult> {
  await requireAdmin();
  try {
    const result = await assignImage(input);
    if (result.ok) {
      revalidatePath("/admin/media");
      revalidatePath("/admin");
    }
    return result;
  } catch (error) {
    console.error("assign image:", error);
    return { ok: false, message: "Chưa lưu được. Thử lại nhé." };
  }
}
