"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin-gate";
import type { AdminResult } from "@/server/admin/result";
import { saveWord } from "@/server/admin/vocab";

// Server action của Ngân hàng từ vựng: gọi `requireAdmin()` ở dòng đầu (không dựa vào layout), rồi `saveWord` (kiểm Zod).

export async function saveWordAction(input: unknown): Promise<AdminResult> {
  await requireAdmin();
  try {
    const result = await saveWord(input);
    if (result.ok) {
      revalidatePath("/admin/vocab");
      revalidatePath("/admin");
    }
    return result;
  } catch (error) {
    console.error("save word:", error);
    return { ok: false, message: "Chưa lưu được. Thử lại nhé." };
  }
}
