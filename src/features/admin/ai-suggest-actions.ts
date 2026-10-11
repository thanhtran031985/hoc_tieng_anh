"use server";

import { requireAdmin } from "@/server/admin-gate";
import { suggestExplorer, suggestFamily } from "@/server/admin/ai-suggest";
import type { SuggestResult, SuggestedExplorer, SuggestedFamily } from "@/lib/schemas";

// Server action của nút “Gợi ý bằng AI” (task 29): gọi `requireAdmin()` ở dòng đầu (không dựa vào layout), rồi hàm ở server (kiểm Zod,
// giới hạn lượt theo quản trị viên). Chỉ trả gợi ý để điền vào form, không ghi gì vào database.

const FAILED = { ok: false, message: "Chưa gợi ý được. Thử lại nhé." } as const;

export async function suggestExplorerAction(input: unknown): Promise<SuggestResult<SuggestedExplorer>> {
  const admin = await requireAdmin();
  try {
    return await suggestExplorer(input, admin.id);
  } catch (error) {
    console.error("gợi ý Khám phá bằng AI:", error);
    return FAILED;
  }
}

export async function suggestFamilyAction(input: unknown): Promise<SuggestResult<SuggestedFamily>> {
  const admin = await requireAdmin();
  try {
    return await suggestFamily(input, admin.id);
  } catch (error) {
    console.error("gợi ý Họ vần bằng AI:", error);
    return FAILED;
  }
}
