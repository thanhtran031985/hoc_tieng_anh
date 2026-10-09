"use server";

import { revalidatePath } from "next/cache";
import { PHONICS_SEED, phonicsSeedFields } from "@/lib/rules/phonics-data";
import type { GeneratePhonicsResult } from "@/lib/schemas";
import { requireAdmin } from "@/server/admin-gate";
import { generatePhonicsAudio } from "@/server/admin/phonics";
import type { AdminResult } from "@/server/admin/result";
import { db } from "@/server/db";

// Server action của màn Âm phonics (Adult20): gọi `requireAdmin()` ở dòng đầu (không dựa vào layout).
// Tải tệp ghi âm lên đi qua route handler `/admin/phonics/upload` (kiểm quyền riêng, không bị giới hạn 1 MB của server action).

/** Tạo âm thanh tự động cho một lượt âm (tối đa 5 âm mỗi lần gọi). */
export async function generatePhonicsAction(input: unknown): Promise<GeneratePhonicsResult> {
  await requireAdmin();
  try {
    const result = await generatePhonicsAudio(input);
    if (result.ok && result.items.some((i) => i.status === "made")) revalidatePath("/admin/phonics");
    return result;
  } catch (error) {
    console.error("generate phonics:", error);
    return { ok: false, message: "Chưa tạo được âm thanh. Thử lại nhé." };
  }
}

/** Nhập bộ 36 âm mẫu khi bảng còn trống (chạy lại không trùng, không đụng tệp âm thanh đã có). */
export async function importPhonicsSampleAction(): Promise<AdminResult> {
  await requireAdmin();
  try {
    for (const [index, row] of PHONICS_SEED.entries()) {
      const fields = phonicsSeedFields(row, index);
      await db.phonicsSound.upsert({ where: { grapheme: row[0] }, create: { grapheme: row[0], status: "published", ...fields }, update: fields });
    }
    revalidatePath("/admin/phonics");
    return { ok: true };
  } catch (error) {
    console.error("import phonics:", error);
    return { ok: false, message: "Chưa nhập được bộ âm mẫu. Thử lại nhé." };
  }
}
