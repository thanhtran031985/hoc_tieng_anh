"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin-gate";
import { generateFamilyAudio, getFamilyEditor, saveFamily, searchBankWords, type BankWord, type FamilyEditorData, type GenerateFamilyAudioResult } from "@/server/admin/family";
import type { AdminResult } from "@/server/admin/result";

// Server action của Soạn Họ vần (Adult23): gọi `requireAdmin()` ở dòng đầu (không dựa vào layout), rồi hàm ở server (kiểm Zod).

export async function getFamilyEditorAction(input: unknown): Promise<FamilyEditorData | null> {
  await requireAdmin();
  try {
    return await getFamilyEditor(input);
  } catch (error) {
    console.error("đọc Họ vần để soạn:", error);
    return null;
  }
}

export async function searchFamilyBankAction(input: unknown): Promise<BankWord[]> {
  await requireAdmin();
  try {
    return await searchBankWords(input);
  } catch (error) {
    console.error("gợi ý từ cho Họ vần:", error);
    return [];
  }
}

export async function saveFamilyAction(input: unknown): Promise<AdminResult> {
  await requireAdmin();
  try {
    const result = await saveFamily(input);
    if (result.ok) {
      revalidatePath("/admin/families");
      revalidatePath("/admin/builder");
    }
    return result;
  } catch (error) {
    console.error("lưu Họ vần:", error);
    return { ok: false, message: "Chưa lưu được. Thử lại nhé." };
  }
}

export async function generateFamilyAudioAction(input: unknown): Promise<GenerateFamilyAudioResult> {
  await requireAdmin();
  try {
    return await generateFamilyAudio(input);
  } catch (error) {
    console.error("tạo giọng đọc Họ vần:", error);
    return { ok: false, message: "Chưa tạo được giọng đọc. Thử lại nhé." };
  }
}
