"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin-gate";
import type { AdminResult } from "@/server/admin/result";
import { createStory, generateStoryAudio, saveStory, type GenerateStoryAudioResult, type SaveStoryResult } from "@/server/admin/stories";

// Server action của màn Soạn truyện tranh: gọi `requireAdmin()` ở dòng đầu (không dựa vào layout), rồi hàm ghi ở server/admin/stories (kiểm Zod).

export async function createStoryAction(input: unknown): Promise<AdminResult> {
  await requireAdmin();
  try {
    const result = await createStory(input);
    if (result.ok) revalidatePath("/admin/stories");
    return result;
  } catch (error) {
    console.error("create story:", error);
    return { ok: false, message: "Chưa tạo được truyện. Thử lại nhé." };
  }
}

export async function saveStoryAction(input: unknown): Promise<SaveStoryResult> {
  await requireAdmin();
  try {
    const result = await saveStory(input);
    if (result.ok) {
      revalidatePath("/admin/stories");
      revalidatePath("/admin/builder");
    }
    return result;
  } catch (error) {
    console.error("save story:", error);
    return { ok: false, message: "Chưa lưu được. Thử lại nhé." };
  }
}

/** Tạo giọng đọc tự động cho một lượt trang (tối đa 5 trang mỗi lần gọi). */
export async function generateStoryAudioAction(input: unknown): Promise<GenerateStoryAudioResult> {
  await requireAdmin();
  try {
    const result = await generateStoryAudio(input);
    if (result.ok) revalidatePath("/admin/stories");
    return result;
  } catch (error) {
    console.error("generate story audio:", error);
    return { ok: false, message: "Chưa tạo được giọng đọc. Thử lại nhé." };
  }
}
