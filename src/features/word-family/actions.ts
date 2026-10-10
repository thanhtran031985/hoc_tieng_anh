"use server";

import { requireActiveLearner } from "@/server/active-learner";
import { familyIdInputSchema } from "@/lib/schemas";
import type { FamilyView } from "@/lib/rules/word-family";
import type { SpeechAccent } from "@/lib/speech";
import { requireUser } from "@/server/session";
import { getVoiceMp3Enabled } from "@/server/app-settings";
import { getFamilyView } from "@/server/word-family";
import { getWordLabEntry, type LabData } from "@/server/word-lab";

export type LabEntryResult = { ok: true; data: LabData } | { ok: false; message: string; missing: boolean };

/**
 * Nạp một bậc của khung liên kết (Khám phá của từ, Họ vần, Ghép chữ đầu). Đi qua `getWordLabEntry` (kiểm hồ sơ thuộc tài khoản đang đăng nhập);
 * mục chưa có hoặc chưa xuất bản trả `missing` để khung nói nhẹ nhàng rồi ở lại bậc hiện tại. Không ghi gì, không tính sao hay xu.
 */
export async function getWordLabEntryAction(input: unknown): Promise<LabEntryResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  try {
    const data = await getWordLabEntry(user.id, learner.id, input);
    if (!data) return { ok: false, message: "Mục này chưa có hoặc chưa mở được.", missing: true };
    return { ok: true, data };
  } catch {
    return { ok: false, message: "Chưa mở được. Mình thử lại nhé!", missing: false };
  }
}

export type FamilyCompact = { family: FamilyView; audio: Record<string, string>; accent: SpeechAccent };
export type FamilyCompactResult = { ok: true; data: FamilyCompact } | { ok: false; message: string; missing: boolean };

/**
 * Họ vần thu gọn cho tab Họ vần trong thẻ từ của Sổ từ. Đi qua `getFamilyView` (kiểm hồ sơ thuộc tài khoản đang đăng nhập);
 * họ chưa xuất bản trả `missing` để tab ẩn kèm dòng giải thích.
 */
export async function getFamilyCompactAction(input: unknown): Promise<FamilyCompactResult> {
  const user = await requireUser();
  const learner = await requireActiveLearner();
  const parsed = familyIdInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Họ vần này chưa hợp lệ.", missing: false };
  try {
    const screen = await getFamilyView(user.id, learner.id, parsed.data.familyId);
    if (!screen) return { ok: false, message: "Họ vần này chưa có.", missing: true };
    return { ok: true, data: { family: screen.view, audio: (await getVoiceMp3Enabled()) ? screen.audio : {}, accent: learner.settings.voice.accent } };
  } catch {
    return { ok: false, message: "Chưa mở được Họ vần. Mình thử lại nhé!", missing: false };
  }
}
