"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin-gate";
import { saveQuestion } from "@/server/admin/questions";
import type { AdminResult } from "@/server/admin/result";

// Server action của Ngân hàng câu hỏi: gọi `requireAdmin()` ở dòng đầu (không dựa vào layout), rồi `saveQuestion` (kiểm Zod).

export async function saveQuestionAction(input: unknown): Promise<AdminResult> {
  await requireAdmin();
  try {
    const result = await saveQuestion(input);
    if (result.ok) {
      revalidatePath("/admin/questions");
      revalidatePath("/admin");
    }
    return result;
  } catch (error) {
    console.error("save question:", error);
    return { ok: false, message: "Chưa lưu được. Thử lại nhé." };
  }
}
