import { audioKey } from "@/lib/rules/tts";
import { saveWordSchema } from "@/lib/schemas/admin-vocab";
import { getVoiceMp3Enabled } from "../app-settings";
import { removeAudioFile } from "../audio/files";
import { isTtsAvailable } from "../audio/tts";
import { db } from "../db";
import { fail, firstIssue, type AdminResult } from "./result";

// Ngân hàng từ vựng quản trị (Adult10): đọc cả ngân hàng và lưu một từ (thêm mới hoặc sửa).
// Hàm ghi kiểm Zod ở đây; server action (`features/admin/vocab-actions.ts`) gọi `requireAdmin()` trước khi vào.

export type VocabRow = {
  id: number;
  word: string;
  ipa: string;
  /** Mã loại từ (noun, verb…). */
  pos: string;
  meaning: string;
  exampleEn: string;
  exampleVi: string;
  levelId: number;
  level: number;
  topics: string[];
  image: string | null;
  audio: string | null;
  exampleAudio: string | null;
  /** Khám phá từ (task 25): số nhánh và trạng thái (đã xuất bản khi mọi nhánh đã xuất bản); null là chưa có. */
  explorer: { count: number; status: "draft" | "published" } | null;
};

export type VocabData = {
  rows: VocabRow[];
  levels: { id: number; number: number; name: string }[];
  /** Chủ đề chọn được theo cấp (id cấp → tên chủ đề), lấy từ cây lộ trình. */
  topicsByLevel: Record<number, string[]>;
  /** Công tắc “Giọng mp3” đang bật (nút “Tạo giọng đọc tự động” chỉ sáng khi bật). */
  mp3Enabled: boolean;
  /** Máy chủ này tạo được giọng đọc (đã cài công cụ). */
  ttsAvailable: boolean;
};

export async function getVocab(): Promise<VocabData> {
  const [words, levels, units, mp3Enabled, ttsAvailable, explorerRows] = await Promise.all([
    db.word.findMany({
      orderBy: [{ level: { number: "asc" } }, { id: "asc" }],
      select: {
        id: true,
        word: true,
        ipa: true,
        partOfSpeech: true,
        meaningVi: true,
        exampleEn: true,
        exampleVi: true,
        image: true,
        audio: true,
        exampleAudio: true,
        levelId: true,
        level: { select: { number: true } },
        topics: { select: { topic: { select: { name: true } } } },
      },
    }),
    db.level.findMany({ orderBy: { number: "asc" }, select: { id: true, number: true, name: true } }),
    db.unit.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { levelId: true, title: true } }),
    getVoiceMp3Enabled(),
    isTtsAvailable(),
    db.wordQuestion.groupBy({ by: ["wordId", "status"], _count: { _all: true } }),
  ]);
  const explorerOf = new Map<number, { count: number; published: number }>();
  for (const r of explorerRows) {
    const cur = explorerOf.get(r.wordId) ?? { count: 0, published: 0 };
    cur.count += r._count._all;
    if (r.status === "published") cur.published += r._count._all;
    explorerOf.set(r.wordId, cur);
  }
  const topicsByLevel: Record<number, string[]> = {};
  for (const level of levels) topicsByLevel[level.id] = [];
  for (const unit of units) topicsByLevel[unit.levelId]?.push(unit.title);
  return {
    rows: words.map((w) => ({
      id: w.id,
      word: w.word,
      ipa: w.ipa ?? "",
      pos: w.partOfSpeech ?? "",
      meaning: w.meaningVi,
      exampleEn: w.exampleEn ?? "",
      exampleVi: w.exampleVi ?? "",
      levelId: w.levelId,
      level: w.level.number,
      topics: w.topics.map((t) => t.topic.name),
      image: w.image,
      audio: w.audio,
      exampleAudio: w.exampleAudio,
      explorer: explorerOf.has(w.id) ? { count: explorerOf.get(w.id)!.count, status: explorerOf.get(w.id)!.published === explorerOf.get(w.id)!.count ? "published" : "draft" } : null,
    })),
    levels,
    topicsByLevel,
    mp3Enabled,
    ttsAvailable,
  };
}

export async function saveWord(input: unknown): Promise<AdminResult> {
  const parsed = saveWordSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { id, topic, ...data } = parsed.data;

  const existing = id ? await db.word.findUnique({ where: { id }, select: { id: true } }) : null;
  if (id && !existing) return fail("Không tìm thấy từ này nữa.");
  if (!(await db.level.findUnique({ where: { id: data.levelId }, select: { id: true } }))) return fail("Không tìm thấy cấp này.", "levelId");

  // Trùng từ (không phân biệt hoa thường nhờ collation utf8mb4_unicode_ci), trừ chính từ đang sửa.
  const same = await db.word.findFirst({ where: { word: data.word, ...(id ? { NOT: { id } } : {}) }, select: { id: true } });
  if (same) return fail(`“${data.word}” đã có trong ngân hàng. Mở từ cũ để sửa thay vì thêm mới.`, "word");

  // Chủ đề: lấy tên và nghĩa từ chủ đề cùng tên trong cấp (cây lộ trình), hoặc dùng chủ đề đã có sẵn.
  let topicId: number | null | undefined;
  if (typeof topic === "string") {
    const unit = await db.unit.findFirst({ where: { levelId: data.levelId, title: topic }, select: { title: true, titleVi: true } });
    if (unit) {
      topicId = (await db.topic.upsert({ where: { name: unit.title }, create: { name: unit.title, nameVi: unit.titleVi }, update: {}, select: { id: true } })).id;
    } else {
      const known = await db.topic.findUnique({ where: { name: topic }, select: { id: true } });
      if (!known) return fail("Không tìm thấy chủ đề này trong cấp đã chọn.", "topic");
      topicId = known.id;
    }
  } else if (topic === null) {
    topicId = null;
  }

  // Đổi chữ của từ hoặc câu ví dụ thì tệp mp3 cũ không còn đúng: bỏ tệp để bé không nghe nhầm.
  const staleAudio: string[] = [];
  const audioReset: { audio?: null; exampleAudio?: null } = {};
  if (id) {
    const before = await db.word.findUnique({ where: { id }, select: { word: true, exampleEn: true, audio: true, exampleAudio: true } });
    if (before?.audio && audioKey(before.word) !== audioKey(data.word)) {
      staleAudio.push(before.audio);
      audioReset.audio = null;
    }
    if (before?.exampleAudio && audioKey(before.exampleEn ?? "") !== audioKey(data.exampleEn ?? "")) {
      staleAudio.push(before.exampleAudio);
      audioReset.exampleAudio = null;
    }
  }

  const saved = await db.$transaction(async (tx) => {
    const row = id ? await tx.word.update({ where: { id }, data: { ...data, ...audioReset }, select: { id: true } }) : await tx.word.create({ data, select: { id: true } });
    if (topicId !== undefined) {
      await tx.wordTopic.deleteMany({ where: { wordId: row.id } });
      if (topicId !== null) await tx.wordTopic.create({ data: { wordId: row.id, topicId } });
    }
    return row;
  });
  for (const path of staleAudio) await removeAudioFile(path);
  return { ok: true, id: saved.id };
}
