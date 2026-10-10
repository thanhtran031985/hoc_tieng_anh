"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin-gate";
import type { AdminResult } from "@/server/admin/result";
import { generateExplorerAudio, getExplorerEditor, saveExplorer, type ExplorerEditorData, type GenerateExplorerAudioResult } from "@/server/admin/word-explorer";

// Server action của Soạn Khám phá từ (Adult22): gọi `requireAdmin()` ở dòng đầu (không dựa vào layout), rồi hàm ở server (kiểm Zod).

export async function getExplorerEditorAction(input: unknown): Promise<ExplorerEditorData | null> {
  await requireAdmin();
  try {
    return await getExplorerEditor(input);
  } catch (error) {
    console.error("đọc Khám phá để soạn:", error);
    return null;
  }
}

export async function saveExplorerAction(input: unknown): Promise<AdminResult> {
  await requireAdmin();
  try {
    const result = await saveExplorer(input);
    if (result.ok) revalidatePath("/admin/vocab");
    return result;
  } catch (error) {
    console.error("lưu Khám phá:", error);
    return { ok: false, message: "Chưa lưu được. Thử lại nhé." };
  }
}

export async function generateExplorerAudioAction(input: unknown): Promise<GenerateExplorerAudioResult> {
  await requireAdmin();
  try {
    return await generateExplorerAudio(input);
  } catch (error) {
    console.error("tạo giọng đọc Khám phá:", error);
    return { ok: false, message: "Chưa tạo được giọng đọc. Thử lại nhé." };
  }
}
