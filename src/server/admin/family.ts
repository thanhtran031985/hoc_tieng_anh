import { canPublishFamily, canSaveFamily, familyIssues } from "@/lib/rules/word-family";
import { familyBankSearchSchema, familyEditorInputSchema, generateFamilyAudioSchema, parseExplorerSentences, parseFamilyDecoys, saveFamilySchema, type ExplorerSentence } from "@/lib/schemas";
import { audioFileExists, removeAudioFile, saveAudioFile } from "../audio/files";
import { TtsTextError, TtsUnavailableError, currentVoice, isTtsAvailable, synthesizeMp3 } from "../audio/tts";
import { db } from "../db";
import { fail, firstIssue, type AdminResult } from "./result";

// Soạn Họ vần (Adult23): bảng các họ, đọc dữ liệu soạn của một họ, gợi ý từ trong kho, lưu (Nháp / Xuất bản có kiểm điều kiện) và tạo giọng đọc
// đoạn văn vui. Hàm ghi kiểm Zod ở đây; server action (`features/admin/family-actions.ts`) gọi `requireAdmin()` trước khi vào.

export type FamilyLevel = { id: number; number: number; name: string };

export type FamilyListRow = { id: number; pattern: string; soundIpa: string; level: number; same: number; traps: number; status: "draft" | "published" };
export type FamilyListData = { rows: FamilyListRow[]; levels: FamilyLevel[] };

export async function getFamilyList(): Promise<FamilyListData> {
  const [families, levels] = await Promise.all([
    db.wordFamily.findMany({
      orderBy: [{ level: { number: "asc" } }, { pattern: "asc" }],
      select: { id: true, pattern: true, soundIpa: true, status: true, level: { select: { number: true } }, members: { select: { sameSound: true } } },
    }),
    db.level.findMany({ orderBy: { number: "asc" }, select: { id: true, number: true, name: true } }),
  ]);
  return {
    rows: families.map((f) => ({
      id: f.id,
      pattern: f.pattern,
      soundIpa: f.soundIpa,
      level: f.level.number,
      same: f.members.filter((m) => m.sameSound).length,
      traps: f.members.filter((m) => !m.sameSound).length,
      status: f.status === "published" ? "published" : "draft",
    })),
    levels,
  };
}

export type FamilyEditorWord = { wordId: number; word: string; ipa: string | null; partOfSpeech: string | null; meaningVi: string; image: string | null; sameSound: boolean };

export type FamilyEditorData = {
  /** Null là họ mới chưa lưu. */
  id: number | null;
  pattern: string;
  soundIpa: string;
  levelId: number;
  buildRime: string | null;
  decoys: string[];
  trapNote: string;
  members: FamilyEditorWord[];
  sentences: ExplorerSentence[];
  /** Âm thanh của cả đoạn văn vui (chưa có thì null). */
  readingAudio: string | null;
  status: "draft" | "published";
  levels: FamilyLevel[];
  ttsAvailable: boolean;
};

const bankSelect = { id: true, word: true, ipa: true, partOfSpeech: true, meaningVi: true, image: true } as const;

/** Dữ liệu soạn của một họ (kể cả bản Nháp), hoặc khung trống của họ mới; họ không còn thì null. */
export async function getFamilyEditor(input: unknown): Promise<FamilyEditorData | null> {
  const parsed = familyEditorInputSchema.safeParse(input);
  if (!parsed.success) return null;
  const { familyId } = parsed.data;
  const [levels, ttsAvailable] = await Promise.all([db.level.findMany({ orderBy: { number: "asc" }, select: { id: true, number: true, name: true } }), isTtsAvailable()]);
  if (familyId === null) {
    if (levels.length === 0) return null;
    return { id: null, pattern: "", soundIpa: "", levelId: levels[0].id, buildRime: null, decoys: [], trapNote: "", members: [], sentences: [], readingAudio: null, status: "draft", levels, ttsAvailable };
  }
  const [family, reading] = await Promise.all([
    db.wordFamily.findUnique({ where: { id: familyId }, include: { members: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }], include: { word: { select: bankSelect } } } } }),
    db.wordReading.findUnique({ where: { ownerType_ownerId: { ownerType: "family", ownerId: familyId } } }),
  ]);
  if (!family) return null;
  return {
    id: family.id,
    pattern: family.pattern,
    soundIpa: family.soundIpa,
    levelId: family.levelId,
    buildRime: family.buildRime,
    decoys: parseFamilyDecoys(family.decoys) ?? [],
    trapNote: family.trapNote,
    members: family.members.map((m) => ({ wordId: m.wordId, word: m.word.word, ipa: m.word.ipa, partOfSpeech: m.word.partOfSpeech, meaningVi: m.word.meaningVi, image: m.word.image, sameSound: m.sameSound })),
    sentences: parseExplorerSentences(reading?.sentences) ?? [],
    readingAudio: reading?.audio ?? null,
    status: family.status === "published" && (reading === null || reading.status === "published") ? "published" : "draft",
    levels,
    ttsAvailable,
  };
}

export type BankWord = { wordId: number; word: string; ipa: string | null; partOfSpeech: string | null; meaningVi: string; image: string | null };
const BANK_LIMIT = 60;

/** Từ trong kho có chứa vần (và chữ bé gõ nếu có), mỗi chữ một từ, tối đa 60 từ. Rỗng nếu đầu vào sai. */
export async function searchBankWords(input: unknown): Promise<BankWord[]> {
  const parsed = familyBankSearchSchema.safeParse(input);
  if (!parsed.success) return [];
  const { pattern, query } = parsed.data;
  const rows = await db.word.findMany({
    where: { word: { contains: pattern }, ...(query ? { AND: [{ word: { contains: query } }] } : {}) },
    orderBy: [{ levelId: "asc" }, { word: "asc" }, { id: "asc" }],
    select: bankSelect,
    take: BANK_LIMIT * 3,
  });
  const seen = new Set<string>();
  const out: BankWord[] = [];
  for (const r of rows) {
    const key = r.word.toLowerCase();
    // Chỉ lấy từ có chữ đúng bằng một từ (không cụm), mỗi chữ một lần.
    if (seen.has(key) || /\s/.test(r.word.trim())) continue;
    seen.add(key);
    out.push({ wordId: r.id, word: r.word, ipa: r.ipa, partOfSpeech: r.partOfSpeech, meaningVi: r.meaningVi, image: r.image });
    if (out.length >= BANK_LIMIT) break;
  }
  return out;
}

/**
 * Lưu một họ vần (mới hoặc đã có). Lỗi dữ liệu (vần có ký tự lạ, IPA thiếu /…/, chữ đầu nhiễu trùng từ thật) chặn cả lưu Nháp;
 * Xuất bản còn cần đủ ≥ 3 từ cùng âm, lời giải thích bẫy, đoạn văn có bản dịch và giọng đọc. Đổi chữ đoạn văn thì tệp giọng đọc cũ bị bỏ.
 */
export async function saveFamily(input: unknown): Promise<AdminResult> {
  const parsed = saveFamilySchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { id, pattern, soundIpa, levelId, buildRime, decoys, trapNote, members, sentences, status } = parsed.data;

  if (!(await db.level.findUnique({ where: { id: levelId }, select: { id: true } }))) return fail("Cấp này không còn nữa. Hãy tải lại trang.", "level");
  const words = members.length ? await db.word.findMany({ where: { id: { in: members.map((m) => m.wordId) } }, select: { id: true, word: true, ipa: true } }) : [];
  const wordOf = new Map(words.map((w) => [w.id, w]));
  if (members.some((m) => !wordOf.has(m.wordId))) return fail("Có từ không còn trong kho từ vựng. Hãy tải lại trang.", "members");

  const same = await db.wordFamily.findUnique({ where: { pattern_soundIpa: { pattern, soundIpa } }, select: { id: true } });
  if (same && same.id !== id) return fail(`Đã có họ vần “-${pattern}” với âm ${soundIpa}. Hãy mở họ đó để sửa.`, "pattern");

  const existing = id === undefined ? null : await db.wordFamily.findUnique({ where: { id }, select: { id: true } });
  if (id !== undefined && !existing) return fail("Họ vần này không còn nữa. Hãy tải lại trang.");
  const oldReading = id === undefined ? null : await db.wordReading.findUnique({ where: { ownerType_ownerId: { ownerType: "family", ownerId: id } } });
  const oldText = (parseExplorerSentences(oldReading?.sentences) ?? []).map((s) => s.en).join("\n");
  const keepAudio = oldReading?.audio && sentences.length > 0 && sentences.map((s) => s.en).join("\n") === oldText ? oldReading.audio : null;

  const issues = familyIssues({
    pattern,
    soundIpa,
    buildRime,
    decoys,
    trapNote,
    members: members.map((m) => ({ wordId: m.wordId, word: wordOf.get(m.wordId)!.word, sameSound: m.sameSound, ipa: wordOf.get(m.wordId)!.ipa })),
    reading: sentences.length > 0 ? { sentences, audio: keepAudio } : null,
  });
  if (!canSaveFamily(issues)) {
    const blocking = issues.find((i) => i.scope === "save")!;
    return fail(blocking.message, blocking.field);
  }
  if (status === "published" && !canPublishFamily(issues)) return fail(`Chưa xuất bản được: ${issues[0].message}${issues.length > 1 ? ` (còn ${issues.length - 1} việc nữa)` : ""} Lưu Nháp trước, xong rồi xuất bản.`, "status");

  const data = { pattern, soundIpa, levelId, buildRime, decoys, trapNote, status } as const;
  const savedId = await db.$transaction(async (tx) => {
    const familyId = id === undefined ? (await tx.wordFamily.create({ data, select: { id: true } })).id : (await tx.wordFamily.update({ where: { id }, data, select: { id: true } })).id;
    const keep = members.map((m) => m.wordId);
    await tx.wordFamilyMember.deleteMany({ where: { familyId, wordId: { notIn: keep.length ? keep : [0] } } });
    // Dời thứ tự cũ ra xa trước để đổi chỗ các từ không vướng thứ tự.
    await tx.wordFamilyMember.updateMany({ where: { familyId }, data: { sortOrder: { increment: 1000 } } });
    for (const [i, m] of members.entries()) {
      await tx.wordFamilyMember.upsert({
        where: { familyId_wordId: { familyId, wordId: m.wordId } },
        create: { familyId, wordId: m.wordId, sameSound: m.sameSound, sortOrder: i + 1 },
        update: { sameSound: m.sameSound, sortOrder: i + 1 },
      });
    }
    if (sentences.length === 0) await tx.wordReading.deleteMany({ where: { ownerType: "family", ownerId: familyId } });
    else {
      await tx.wordReading.upsert({
        where: { ownerType_ownerId: { ownerType: "family", ownerId: familyId } },
        create: { ownerType: "family", ownerId: familyId, sentences, audio: keepAudio, status },
        update: { sentences, audio: keepAudio, status },
      });
    }
    return familyId;
  });
  if (oldReading?.audio && oldReading.audio !== keepAudio) await removeAudioFile(oldReading.audio);
  return { ok: true, id: savedId };
}

export type GenerateFamilyAudioResult = { ok: true; made: boolean } | { ok: false; message: string };

/**
 * Tạo giọng đọc tự động cho đoạn văn vui của một họ (cả đoạn là một tệp). Chỉ tạo khi họ đã lưu và có câu; đã có tệp thì bỏ qua trừ khi `force`.
 * Không cần công tắc “Giọng mp3” (xuất bản bắt buộc có âm thanh).
 */
export async function generateFamilyAudio(input: unknown): Promise<GenerateFamilyAudioResult> {
  const parsed = generateFamilyAudioSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ." };
  const { familyId, force } = parsed.data;
  const reading = await db.wordReading.findUnique({ where: { ownerType_ownerId: { ownerType: "family", ownerId: familyId } } });
  const sentences = parseExplorerSentences(reading?.sentences) ?? [];
  if (!reading || sentences.length === 0) return { ok: false, message: "Họ này chưa có câu nào để đọc. Lưu đoạn văn trước." };
  if (!force && (await audioFileExists(reading.audio))) return { ok: true, made: false };
  try {
    const voice = currentVoice();
    const text = sentences.map((s) => s.en).join(" ");
    // Mã đoạn văn (`word_readings.id`) là duy nhất giữa Khám phá của từ và Họ vần nên dùng chung loại tệp “explorer” không đụng tên.
    const stored = await saveAudioFile("explorer", reading.id, text, voice, await synthesizeMp3(text, voice));
    await db.wordReading.update({ where: { id: reading.id }, data: { audio: stored } });
    if (reading.audio && reading.audio !== stored) await removeAudioFile(reading.audio);
    return { ok: true, made: true };
  } catch (error) {
    if (error instanceof TtsUnavailableError || error instanceof TtsTextError) return { ok: false, message: error.message };
    console.error("tạo giọng đọc Họ vần:", error);
    return { ok: false, message: "Chưa tạo được giọng đọc. Thử lại nhé." };
  }
}
