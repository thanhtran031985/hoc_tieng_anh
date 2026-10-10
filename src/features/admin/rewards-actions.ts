"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin-gate";
import { saveBadge, saveSticker } from "@/server/admin/rewards";
import type { AdminResult } from "@/server/admin/result";

// Server action của Danh mục phần thưởng (Adult21): gọi `requireAdmin()` ở dòng đầu (không dựa vào layout), rồi hàm lưu (kiểm Zod).

async function run(save: (input: unknown) => Promise<AdminResult>, input: unknown, label: string): Promise<AdminResult> {
  await requireAdmin();
  try {
    const result = await save(input);
    if (result.ok) {
      revalidatePath("/admin/rewards");
      // Bộ sưu tập của bé đọc danh mục (bản nháp không hiện): làm mới để thay đổi có hiệu lực ngay.
      revalidatePath("/collection");
    }
    return result;
  } catch (error) {
    console.error(`save ${label}:`, error);
    return { ok: false, message: "Chưa lưu được. Thử lại nhé." };
  }
}

export async function saveStickerAction(input: unknown): Promise<AdminResult> {
  return run(saveSticker, input, "sticker");
}

export async function saveBadgeAction(input: unknown): Promise<AdminResult> {
  return run(saveBadge, input, "badge");
}
