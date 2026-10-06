"use server";

import { revalidatePath } from "next/cache";
import type { PlayWord } from "@/lib/rules/lesson-play";
import { requireAdmin } from "@/server/admin-gate";
import { getUnitWords, saveLesson } from "@/server/admin/builder";
import type { AdminResult } from "@/server/admin/result";

// Server action của màn Soạn bài học: gọi `requireAdmin()` ở dòng đầu (không dựa vào layout), rồi hàm ở server/admin/builder.ts (kiểm Zod).

export async function saveLessonAction(input: unknown): Promise<AdminResult> {
  await requireAdmin();
  try {
    const result = await saveLesson(input);
    if (result.ok) {
      revalidatePath("/admin/builder", "layout");
      revalidatePath("/admin/tree");
      revalidatePath("/admin");
    }
    return result;
  } catch (error) {
    console.error("save lesson:", error);
    return { ok: false, message: "Chưa lưu được. Thử lại nhé." };
  }
}

/** Từ của một chủ đề để gợi ý (chỉ đọc); `null` nếu không tìm thấy. */
export async function getUnitWordsAction(input: unknown): Promise<PlayWord[] | null> {
  await requireAdmin();
  try {
    return await getUnitWords(input);
  } catch (error) {
    console.error("unit words:", error);
    return null;
  }
}
