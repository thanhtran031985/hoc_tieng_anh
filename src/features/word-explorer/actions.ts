"use server";

import { today } from "@/lib/rules/dates";
import { viewBranches, type ExplorerViewBranch } from "@/lib/rules/word-explorer";
import { explorerWordInputSchema } from "@/lib/schemas";
import { requireActiveLearner } from "@/server/active-learner";
import { requireUser } from "@/server/session";
import { getExplorerView } from "@/server/word-explorer";
import type { ExplorerWord } from "./ExplorerPlayer";

export type ExplorerCompact = { word: ExplorerWord; branches: ExplorerViewBranch[] };
export type ExplorerCompactResult = { ok: true; data: ExplorerCompact } | { ok: false; message: string; missing: boolean };

/**
 * Sơ đồ thu gọn của một từ cho tab Khám phá trong thẻ từ của Sổ từ. Đi qua `getExplorerView` (kiểm hồ sơ thuộc tài khoản đang đăng nhập);
 * từ chưa có Khám phá đã xuất bản trả `missing` để tab ẩn kèm dòng giải thích.
 */
export async function getExplorerCompactAction(input: unknown): Promise<ExplorerCompactResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const parsed = explorerWordInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Từ này chưa hợp lệ.", missing: false };
  try {
    const view = await getExplorerView(user.id, learner.id, parsed.data.wordId);
    if (!view) return { ok: false, message: "Từ này chưa có Khám phá.", missing: true };
    const seed = `${learner.id}:zoom:${parsed.data.wordId}:${today().toISOString().slice(0, 10)}`;
    return { ok: true, data: { word: view.word, branches: viewBranches(view.content, seed) } };
  } catch {
    return { ok: false, message: "Chưa mở được Khám phá. Mình thử lại nhé!", missing: false };
  }
}
