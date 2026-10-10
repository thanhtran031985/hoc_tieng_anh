import { today } from "@/lib/rules/dates";
import { buildInfo, type FamilyMemberView, type FamilyTrapView, type FamilyView } from "@/lib/rules/word-family";
import { parseExplorerSentences, parseFamilyDecoys } from "@/lib/schemas";
import { db } from "./db";
import { requireLearner } from "./learners";
import { audioOfWords, glossaryFor, wordsWithExplorer } from "./word-explorer";

// Họ vần (task 26): họ đã xuất bản kèm các từ cùng âm, từ Bẫy chính tả và đoạn văn vui. Nội dung học không phải dữ liệu riêng của bé,
// nhưng các hàm đọc cho bé vẫn đi qua `requireLearner` để chỉ tài khoản đang đăng nhập dùng được. Họ Nháp không bao giờ tới bé.

const memberWordSelect = { id: true, word: true, ipa: true, partOfSpeech: true, meaningVi: true, image: true } as const;

/**
 * Các họ vần đã xuất bản theo mã họ. `learnedWordIds`: các từ bé đã học (thẻ ôn tập, hoặc từ của bài đang học) để đánh dấu thẻ “Sắp học”;
 * `"all"` coi mọi từ là đã học (Xem như học sinh ở trang soạn).
 * Họ có dữ liệu hỏng (decoys sai dạng) bị bỏ qua thay vì làm vỡ cả màn.
 */
export async function loadFamilies(familyIds: readonly number[], learnedWordIds: ReadonlySet<number> | "all"): Promise<Map<number, FamilyView>> {
  const ids = [...new Set(familyIds)];
  const result = new Map<number, FamilyView>();
  if (ids.length === 0) return result;

  const [rows, readings] = await Promise.all([
    db.wordFamily.findMany({
      where: { id: { in: ids }, status: "published" },
      include: { members: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }], include: { word: { select: memberWordSelect } } } },
    }),
    db.wordReading.findMany({ where: { ownerType: "family", ownerId: { in: ids }, status: "published" } }),
  ]);
  const readingOf = new Map(readings.map((r) => [r.ownerId, r]));
  const explorers = await wordsWithExplorer(rows.flatMap((f) => f.members.map((m) => m.wordId)));

  const drafts = rows.flatMap((family) => {
    const decoys = parseFamilyDecoys(family.decoys);
    if (!decoys) return [];
    const sameSound = family.members.filter((m) => m.sameSound);
    const build = buildInfo(
      sameSound.map((m) => ({ wordId: m.wordId, word: m.word.word, sameSound: true })),
      family.pattern,
      family.buildRime,
      decoys,
    );
    const buildable = new Set(build.words.map((w) => w.wordId));
    const members: FamilyMemberView[] = sameSound.map((m) => ({
      wordId: m.wordId,
      word: m.word.word,
      ipa: m.word.ipa,
      partOfSpeech: m.word.partOfSpeech,
      meaningVi: m.word.meaningVi,
      image: m.word.image,
      learned: learnedWordIds === "all" || learnedWordIds.has(m.wordId),
      hasExplorer: explorers.has(m.wordId),
      buildable: buildable.has(m.wordId),
    }));
    const traps: FamilyTrapView[] = family.members
      .filter((m) => !m.sameSound)
      .map((m) => ({ wordId: m.wordId, word: m.word.word, ipa: m.word.ipa, partOfSpeech: m.word.partOfSpeech, meaningVi: m.word.meaningVi }));
    const reading = readingOf.get(family.id);
    const sentences = reading ? parseExplorerSentences(reading.sentences) : null;
    return [{ family, members, traps, build, reading: reading && sentences ? { sentences, audio: reading.audio } : null }];
  });

  const contents = drafts.map((d) => ({ branches: [], reading: d.reading ?? { sentences: [], audio: null } }));
  const glossary = await glossaryFor(contents);
  drafts.forEach((d, i) => {
    result.set(d.family.id, {
      id: d.family.id,
      pattern: d.family.pattern,
      soundIpa: d.family.soundIpa,
      members: d.members,
      traps: d.traps,
      trapNote: d.family.trapNote,
      reading: d.reading,
      glossary: glossary.get(contents[i]) ?? {},
      build: d.build,
    });
  });
  return result;
}

/** Mã các từ của họ (cùng âm và Bẫy), để nạp mp3. */
export const familyWordIds = (view: FamilyView): number[] => [...view.members.map((m) => m.wordId), ...view.traps.map((t) => t.wordId)];

/** Các từ trong `wordIds` mà hồ sơ này đã học (có thẻ ôn tập). */
export async function learnedWordIdsOf(learnerId: number, wordIds: readonly number[]): Promise<Set<number>> {
  const ids = [...new Set(wordIds)];
  if (ids.length === 0) return new Set();
  const cards = await db.reviewCard.findMany({ where: { learnerId, wordId: { in: ids } }, select: { wordId: true } });
  return new Set(cards.flatMap((c) => (c.wordId === null ? [] : [c.wordId])));
}

export type FamilyScreen = { view: FamilyView; /** Bảng “chữ → mp3” của các từ trong họ. */ audio: Record<string, string>; seed: string };

/**
 * Họ vần đã xuất bản cho bé tự khám phá (Sổ từ, liên kết qua lại); họ Nháp hoặc không có thì null. Chỉ cần hồ sơ thuộc tài khoản đang đăng nhập.
 * Không ghi gì, không tính sao hay xu.
 */
export async function getFamilyView(userId: number, learnerId: number, familyId: number, extraLearnedWordIds: readonly number[] = []): Promise<FamilyScreen | null> {
  await requireLearner(userId, learnerId);
  const members = await db.wordFamilyMember.findMany({ where: { familyId }, select: { wordId: true } });
  const learned = await learnedWordIdsOf(learnerId, members.map((m) => m.wordId));
  for (const id of extraLearnedWordIds) learned.add(id);
  const view = (await loadFamilies([familyId], learned)).get(familyId);
  if (!view) return null;
  return { view, audio: await audioOfWords(familyWordIds(view)), seed: `${learnerId}:family:${familyId}:${today().toISOString().slice(0, 10)}` };
}
