import { buildAudioMap } from "@/lib/rules/tts";
import { splitSentence } from "@/lib/rules/sentence-words";
import type { PlayWord } from "@/lib/rules/lesson-play";
import { isPlayable, type ExplorerContent, type ExplorerContentBranch } from "@/lib/rules/word-explorer";
import { parseExplorerAnswers, parseExplorerDistractors, parseExplorerSentences } from "@/lib/schemas";
import { db } from "./db";
import { requireLearner } from "./learners";

// Khám phá từ (task 25): nội dung đã xuất bản của một từ (4–6 nhánh câu hỏi + đoạn văn). Nội dung học không phải dữ liệu riêng của bé,
// nhưng các hàm đọc cho bé vẫn đi qua `requireLearner` để chỉ tài khoản đang đăng nhập dùng được.

const wordFields = { id: true, word: true, ipa: true, meaningVi: true, exampleEn: true, exampleVi: true, image: true } as const;

/**
 * Nội dung Khám phá của các từ, theo mã từ. `published`: chỉ từ mà mọi nhánh và đoạn văn đều đã xuất bản (bản Nháp không bao giờ tới bé).
 * Từ có dữ liệu hỏng (JSON sai dạng) bị bỏ qua thay vì làm vỡ cả bài.
 */
export async function loadExplorerContents(wordIds: readonly number[], mode: "published" | "any" = "published"): Promise<Map<number, ExplorerContent>> {
  const ids = [...new Set(wordIds)];
  const result = new Map<number, ExplorerContent>();
  if (ids.length === 0) return result;
  const [rows, readings] = await Promise.all([
    db.wordQuestion.findMany({ where: { wordId: { in: ids } }, orderBy: [{ wordId: "asc" }, { sortOrder: "asc" }] }),
    db.wordReading.findMany({ where: { ownerType: "word", ownerId: { in: ids } } }),
  ]);
  const readingOf = new Map(readings.map((r) => [r.ownerId, r]));

  const drafts: { wordId: number; content: Omit<ExplorerContent, "glossary"> }[] = [];
  for (const wordId of ids) {
    const mine = rows.filter((r) => r.wordId === wordId);
    const reading = readingOf.get(wordId);
    if (mine.length === 0 || !reading) continue;
    if (mode === "published" && (reading.status !== "published" || mine.some((r) => r.status !== "published"))) continue;
    const sentences = parseExplorerSentences(reading.sentences);
    if (!sentences) continue;
    const branches: ExplorerContentBranch[] = [];
    let broken = false;
    mine.forEach((r, i) => {
      const answers = parseExplorerAnswers(r.answers);
      const distractors = parseExplorerDistractors(r.distractors);
      const sentence = sentences[i];
      if (!answers || !distractors || !sentence) {
        broken = true;
        return;
      }
      branches.push({ id: r.id, kind: r.kind as ExplorerContentBranch["kind"], questionEn: r.questionEn, questionVi: r.questionVi, answers, distractors, sentence });
    });
    if (broken) continue;
    drafts.push({ wordId, content: { branches, reading: { sentences, audio: reading.audio } } });
  }

  const glossary = await glossaryFor(drafts.map((d) => d.content));
  for (const { wordId, content } of drafts) {
    const full: ExplorerContent = { ...content, glossary: glossary.get(content) ?? {} };
    if (mode === "any" || isPlayable(full)) result.set(wordId, full);
  }
  return result;
}

/**
 * Nghĩa ngắn theo chữ thường cho các chữ trong đoạn văn: tra ngân hàng từ vựng, rồi đáp án một chữ (nghĩa do người soạn nhập) ghi đè.
 */
async function glossaryFor(contents: readonly Omit<ExplorerContent, "glossary">[]): Promise<Map<Omit<ExplorerContent, "glossary">, Record<string, string>>> {
  const tokensOf = (c: Omit<ExplorerContent, "glossary">) => new Set(c.reading.sentences.flatMap((s) => splitSentence(s.en).flatMap((t) => (t.word ? [t.word] : []))));
  const all = new Set(contents.flatMap((c) => [...tokensOf(c)]));
  const rows = all.size ? await db.word.findMany({ where: { word: { in: [...all] } }, select: { word: true, meaningVi: true }, orderBy: { id: "asc" } }) : [];
  const meaning = new Map<string, string>();
  for (const r of rows) if (!meaning.has(r.word.toLowerCase())) meaning.set(r.word.toLowerCase(), r.meaningVi);

  const out = new Map<Omit<ExplorerContent, "glossary">, Record<string, string>>();
  for (const c of contents) {
    const glossary: Record<string, string> = {};
    for (const token of tokensOf(c)) {
      const m = meaning.get(token);
      if (m) glossary[token] = m;
    }
    for (const branch of c.branches) {
      for (const a of branch.answers) if (a.textVi && !/\s/.test(a.text.trim())) glossary[a.text.trim().toLowerCase()] = a.textVi;
    }
    out.set(c, glossary);
  }
  return out;
}

export type ExplorerView = {
  word: PlayWord;
  content: ExplorerContent;
  /** Bảng “chữ → mp3” của từ và câu ví dụ, cho `SpeechConfig`. */
  audio: Record<string, string>;
};

/** Bảng mp3 của một từ (từ và câu ví dụ), đúng như bảng của bài học. */
async function audioOf(wordId: number): Promise<Record<string, string>> {
  const rows = await db.word.findMany({ where: { id: wordId, OR: [{ audio: { not: null } }, { exampleAudio: { not: null } }] }, select: { word: true, audio: true, exampleEn: true, exampleAudio: true } });
  return buildAudioMap(rows);
}

/**
 * Khám phá của một từ cho bé tự khám phá (Sổ từ) hoặc in: chỉ bản đã xuất bản, ngược lại null. Nội dung học không phải dữ liệu riêng của bé
 * (bài học cũng cho mọi bé xem) nên chỉ cần hồ sơ thuộc tài khoản đang đăng nhập. Không ghi gì, không tính sao hay xu.
 */
export async function getExplorerView(userId: number, learnerId: number, wordId: number): Promise<ExplorerView | null> {
  await requireLearner(userId, learnerId);
  return loadExplorerView(wordId);
}

/** Dựng Khám phá đã xuất bản của một từ (không kiểm quyền: chỉ gọi sau khi đã kiểm). */
export async function loadExplorerView(wordId: number): Promise<ExplorerView | null> {
  const [word, contents] = await Promise.all([db.word.findUnique({ where: { id: wordId }, select: wordFields }), loadExplorerContents([wordId])]);
  const content = contents.get(wordId);
  if (!word || !content) return null;
  return { word, content, audio: await audioOf(wordId) };
}

export type ExplorerPrint = {
  learnerName: string;
  grade: number | null;
  /** “Cấp 3 · Lá xanh”: cấp của từ. */
  levelLabel: string;
  topicLabel: string;
  word: PlayWord;
  /** Khám phá đã xuất bản; null khi từ chưa có để in. */
  content: ExplorerContent | null;
};

/** Dữ liệu bản in Khám phá (Screen49) của một từ, cho hồ sơ thuộc tài khoản đang đăng nhập. Từ không có thì null. */
export async function getExplorerPrint(userId: number, learnerId: number, wordId: number): Promise<ExplorerPrint | null> {
  const learner = await requireLearner(userId, learnerId);
  const [word, contents] = await Promise.all([
    db.word.findUnique({ where: { id: wordId }, select: { ...wordFields, level: { select: { number: true, name: true } }, topics: { take: 1, orderBy: { topicId: "asc" }, select: { topic: { select: { nameVi: true } } } } } }),
    loadExplorerContents([wordId]),
  ]);
  if (!word) return null;
  const { level, topics, ...fields } = word;
  return {
    learnerName: learner.name,
    grade: learner.schoolGrade,
    levelLabel: `Cấp ${level.number} · ${level.name}`,
    topicLabel: topics[0]?.topic.nameVi ?? "—",
    word: fields,
    content: contents.get(wordId) ?? null,
  };
}

/** Các từ trong `wordIds` có Khám phá đã xuất bản (cho Sổ từ và ôn tập). */
export async function wordsWithExplorer(wordIds: readonly number[]): Promise<Set<number>> {
  return new Set((await loadExplorerContents(wordIds)).keys());
}

