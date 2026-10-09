"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin-gate";
import { saveExtraQuestion } from "@/server/admin/question-types";
import type { AdminResult } from "@/server/admin/result";

// Server action của màn Câu hỏi dạng mới: gọi `requireAdmin()` ở dòng đầu (không dựa vào layout), rồi `saveExtraQuestion` (kiểm Zod).

export async function saveExtraQuestionAction(input: unknown): Promise<AdminResult> {
  await requireAdmin();
  try {
    const result = await saveExtraQuestion(input);
    if (result.ok) {
      revalidatePath("/admin/question-types");
      revalidatePath("/admin/builder");
      revalidatePath("/admin");
    }
    return result;
  } catch (error) {
    console.error("save extra question:", error);
    return { ok: false, message: "Chưa lưu được. Thử lại nhé." };
  }
}
