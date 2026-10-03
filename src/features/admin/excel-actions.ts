"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin-gate";
import { importQuestions, importVocab, type ImportResult } from "@/server/admin/excel";

// Server action của Nhập Excel: gọi `requireAdmin()` ở dòng đầu, rồi kiểm lại TẤT CẢ dòng ở server (không tin kết quả kiểm ở trình duyệt).

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/vocab");
  revalidatePath("/admin/questions");
  revalidatePath("/admin/media");
}

export async function importVocabAction(input: unknown): Promise<ImportResult> {
  await requireAdmin();
  try {
    const result = await importVocab(input);
    if (result.ok) refresh();
    return result;
  } catch (error) {
    console.error("import vocab:", error);
    return { ok: false, message: "Chưa lưu được. Dữ liệu chưa bị thay đổi, thử lại nhé." };
  }
}

export async function importQuestionsAction(input: unknown): Promise<ImportResult> {
  await requireAdmin();
  try {
    const result = await importQuestions(input);
    if (result.ok) refresh();
    return result;
  } catch (error) {
    console.error("import questions:", error);
    return { ok: false, message: "Chưa lưu được. Dữ liệu chưa bị thay đổi, thử lại nhé." };
  }
}
