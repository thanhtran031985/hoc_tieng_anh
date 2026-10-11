import { cleanExplorer, cleanFamily, explorerPrompt, familyPrompt, libraryPictureKeys, EXPLORER_RESPONSE_SCHEMA, FAMILY_RESPONSE_SCHEMA } from "@/lib/rules/ai-suggest";
import { suggestExplorerInputSchema, suggestFamilyInputSchema, type SuggestResult, type SuggestedExplorer, type SuggestedFamily } from "@/lib/schemas/ai-suggest";
import { AiBusyError, AiFailedError, AiUnavailableError, generateJson, isAiAvailable } from "../ai/gemini";
import { aiThrottle } from "../ai/throttle";
import { db } from "../db";
import { searchBankWords } from "./family";
import { listLibraryPictures } from "./pictures";
import { allowedTokensUpToLevel } from "./vocab-by-level";

// AI gợi ý khi soạn Khám phá từ (Adult22) và Họ vần (Adult23), task 29. Chỉ ĐIỀN GỢI Ý vào form: không lưu, không xuất bản.
// Chỉ gửi cho AI từ vựng, nghĩa, cấp, tên hình và từ trong kho (nội dung công khai của dự án); không gửi gì về học sinh hay tài khoản.
// Server action (`features/admin/ai-suggest-actions.ts`) gọi `requireAdmin()` rồi truyền mã quản trị viên để giới hạn số lượt.

const fail = (message: string): { ok: false; message: string } => ({ ok: false, message });

/** Đổi lỗi gọi AI thành thông báo cho người soạn; lỗi lạ ném tiếp để action ghi log. */
function describe(error: unknown): { ok: false; message: string } {
  if (error instanceof AiUnavailableError || error instanceof AiBusyError || error instanceof AiFailedError) return fail(error.message);
  throw error;
}

function allowCall(adminId: number): { ok: false; message: string } | null {
  if (!isAiAvailable()) return fail(new AiUnavailableError().message);
  const turn = aiThrottle.take(`admin:${adminId}`);
  return turn.ok ? null : fail(`Bạn gọi AI hơi nhiều. Chờ khoảng ${turn.retryAfterSeconds} giây rồi thử lại nhé.`);
}

/** Gợi ý các nhánh Khám phá cho một từ. Chữ ngoài cấp thì gọi lại đúng một lần, kèm danh sách chữ cần tránh. */
export async function suggestExplorer(input: unknown, adminId: number): Promise<SuggestResult<SuggestedExplorer>> {
  const parsed = suggestExplorerInputSchema.safeParse(input);
  if (!parsed.success) return fail("Dữ liệu chưa hợp lệ.");
  const blocked = allowCall(adminId);
  if (blocked) return blocked;

  const word = await db.word.findUnique({ where: { id: parsed.data.wordId }, select: { word: true, ipa: true, meaningVi: true, image: true, level: { select: { number: true } } } });
  if (!word) return fail("Không tìm thấy từ này nữa.");
  const pictureKeys = libraryPictureKeys(await listLibraryPictures());
  const allowed = await allowedTokensUpToLevel(word.level.number);
  const ctx = { word: word.word, meaningVi: word.meaningVi, wordImage: word.image, pictureKeys: new Set(pictureKeys), allowed };
  const base = { word: word.word, ipa: word.ipa, meaningVi: word.meaningVi, level: word.level.number, pictureKeys, set: parsed.data.set };

  try {
    let best = cleanExplorer(await generateJson(explorerPrompt(base), { schema: EXPLORER_RESPONSE_SCHEMA }), ctx);
    if (best && best.outOfLevel.length > 0) {
      try {
        const again = cleanExplorer(await generateJson(explorerPrompt({ ...base, avoid: best.outOfLevel }), { schema: EXPLORER_RESPONSE_SCHEMA }), ctx);
        if (again && again.outOfLevel.length < best.outOfLevel.length) best = again;
      } catch (error) {
        describe(error); // lần gọi lại hỏng thì giữ kết quả đầu (lỗi lạ vẫn ném)
      }
    }
    if (!best) return fail("AI chưa trả về nhánh nào dùng được. Thử lại nhé.");
    return { ok: true, data: best.data };
  } catch (error) {
    return describe(error);
  }
}

const MIN_CANDIDATES = 3;

/** Gợi ý một họ vần từ các từ có thật trong kho chứa vần đó. */
export async function suggestFamily(input: unknown, adminId: number): Promise<SuggestResult<SuggestedFamily>> {
  const parsed = suggestFamilyInputSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Vần chưa hợp lệ.");
  const { pattern } = parsed.data;
  if (!isAiAvailable()) return fail(new AiUnavailableError().message);

  const candidates = await searchBankWords({ pattern, query: "" });
  if (candidates.length < MIN_CANDIDATES) return fail(`Kho từ vựng mới có ${candidates.length} từ chứa vần “${pattern}” (cần ít nhất ${MIN_CANDIDATES}). Hãy thêm từ vào kho trước.`);
  const blocked = allowCall(adminId);
  if (blocked) return blocked;

  const levels = await db.word.findMany({ where: { id: { in: candidates.map((c) => c.wordId) } }, select: { id: true, level: { select: { number: true } } } });
  const levelOf = new Map(levels.map((w) => [w.id, w.level.number]));
  try {
    const raw = await generateJson(familyPrompt({ pattern, candidates: candidates.map((c) => ({ word: c.word, ipa: c.ipa, level: levelOf.get(c.wordId) ?? 1 })) }), { schema: FAMILY_RESPONSE_SCHEMA });
    const data = cleanFamily(raw, { pattern, candidates });
    if (!data) return fail("AI chưa trả về họ vần nào dùng được. Thử lại nhé.");
    return { ok: true, data };
  } catch (error) {
    return describe(error);
  }
}
