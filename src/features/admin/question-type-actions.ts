"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin-gate";
import { generateQuestionAudio, saveExtraQuestion, type QuestionAudioResult } from "@/server/admin/question-types";
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

/** Tạo giọng đọc tự động cho âm thanh mẫu của một câu luyện nói đã lưu. */
export async function generateQuestionAudioAction(input: unknown): Promise<QuestionAudioResult> {
  await requireAdmin();
  const questionId = typeof input === "object" && input !== null ? Number((input as { questionId?: unknown }).questionId) : NaN;
  try {
    const result = await generateQuestionAudio(questionId, true);
    if (result.ok) revalidatePath("/admin/question-types");
    return result;
  } catch (error) {
    console.error("generate question audio:", error);
    return { ok: false, message: "Chưa tạo được giọng đọc. Thử lại nhé." };
  }
}
