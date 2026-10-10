import { today } from "@/lib/rules/dates";
import { viewBranches, type ExplorerContent, type ExplorerViewBranch } from "@/lib/rules/word-explorer";
import { buildTiles, canBuild, type FamilyView } from "@/lib/rules/word-family";
import { wordLabEntryInputSchema } from "@/lib/schemas";
import { getVoiceMp3Enabled } from "./app-settings";
import { db } from "./db";
import { requireLearner } from "./learners";
import { getExplorerView } from "./word-explorer";
import { getFamilyView } from "./word-family";

// Khung liên kết qua lại (WordLinks, task 26): nạp từng bậc của đường dẫn (Khám phá của từ, Họ vần, Ghép chữ đầu) khi bé đi tới.
// Mọi hàm đi qua `requireLearner`: chỉ hồ sơ thuộc tài khoản đang đăng nhập đọc được. Chỉ nội dung đã xuất bản; không ghi gì.

export type LabWord = { id: number; word: string; ipa: string | null; meaningVi: string; image: string | null; exampleEn: string | null; exampleVi: string | null };

/** Họ vần đã xuất bản mà một từ thuộc về (từ cùng âm của họ), để hiện nút “Họ vần của bird: -ir”. */
export type WordFamilyLink = { id: number; pattern: string };

/** Dữ liệu một bậc của đường dẫn, kèm bảng “chữ → mp3” của riêng bậc đó. */
export type LabData =
  | { v: "wx"; word: LabWord; branches: ExplorerViewBranch[]; reading: ExplorerContent["reading"]; glossary: Record<string, string>; family: WordFamilyLink | null; audio: Record<string, string> }
  | { v: "fam"; family: FamilyView; audio: Record<string, string> }
  | { v: "build"; family: FamilyView; tiles: string[]; first: number | null; audio: Record<string, string> };

/** Họ vần đã xuất bản của nhiều từ cùng lúc (cho Sổ từ): mỗi từ một họ, nhỏ mã nhất nếu có nhiều. */
export async function familiesOfWords(wordIds: readonly number[]): Promise<Map<number, WordFamilyLink>> {
  const ids = [...new Set(wordIds)];
  const result = new Map<number, WordFamilyLink>();
  if (ids.length === 0) return result;
  const rows = await db.wordFamilyMember.findMany({ where: { wordId: { in: ids }, sameSound: true, family: { status: "published" } }, orderBy: { familyId: "asc" }, select: { wordId: true, family: { select: { id: true, pattern: true } } } });
  for (const row of rows) if (!result.has(row.wordId)) result.set(row.wordId, row.family);
  return result;
}

/** Họ vần đã xuất bản của một từ (nhỏ mã nhất nếu có nhiều), null nếu từ không thuộc họ nào. */
export async function familyOfWord(wordId: number): Promise<WordFamilyLink | null> {
  const row = await db.wordFamilyMember.findFirst({ where: { wordId, sameSound: true, family: { status: "published" } }, orderBy: { familyId: "asc" }, select: { family: { select: { id: true, pattern: true } } } });
  return row?.family ?? null;
}

/**
 * Nạp một bậc của đường dẫn. Trả null khi mục không có hoặc chưa xuất bản (Khám phá chưa xuất bản, họ Nháp, họ chưa đủ từ để ghép).
 * Đầu vào đã qua Zod; `first` của Ghép chữ đầu là mã từ cần ghép đầu tiên. Công tắc “Giọng mp3” tắt thì bảng mp3 rỗng (dùng giọng trình duyệt).
 */
export async function getWordLabEntry(userId: number, learnerId: number, input: unknown): Promise<LabData | null> {
  const data = await loadEntry(userId, learnerId, input);
  return data && !(await getVoiceMp3Enabled()) ? { ...data, audio: {} } : data;
}

async function loadEntry(userId: number, learnerId: number, input: unknown): Promise<LabData | null> {
  const parsed = wordLabEntryInputSchema.safeParse(input);
  if (!parsed.success) return null;
  const learner = await requireLearner(userId, learnerId);
  const day = today().toISOString().slice(0, 10);
  const entry = parsed.data;

  if (entry.v === "wx") {
    const view = await getExplorerView(userId, learnerId, entry.wordId);
    if (!view) return null;
    return {
      v: "wx",
      word: view.word,
      branches: viewBranches(view.content, `${learner.id}:explore:${entry.wordId}:${day}`),
      reading: view.content.reading,
      glossary: view.content.glossary,
      family: await familyOfWord(entry.wordId),
      audio: view.audio,
    };
  }

  const screen = await getFamilyView(userId, learnerId, entry.familyId);
  if (!screen) return null;
  if (entry.v === "fam") return { v: "fam", family: screen.view, audio: screen.audio };
  if (!canBuild(screen.view.build)) return null;
  const firstWord = screen.view.members.find((m) => m.wordId === entry.first)?.word ?? null;
  return { v: "build", family: screen.view, tiles: buildTiles(screen.view.build, screen.seed, firstWord), first: entry.first, audio: screen.audio };
}
