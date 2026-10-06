import { db } from "./db";
import { requireLearner } from "./learners";

// Dữ liệu cho Sổ từ của bé: các từ đã học (có thẻ ôn tập) kèm mức thuộc (= số hộp) và chủ đề.
// Đi qua `requireLearner` nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập.

export type NotebookWord = {
  id: number;
  word: string;
  ipa: string | null;
  meaningVi: string;
  exampleEn: string | null;
  exampleVi: string | null;
  image: string | null;
  /** Mức thuộc 1–5 = số hộp ôn tập. */
  mastery: number;
  /** Các chủ đề có từ này trong bài học của chủ đề (một từ có thể thuộc nhiều chủ đề). */
  unitIds: number[];
};

export type NotebookTopic = { id: number; title: string; titleVi: string; count: number };

export type Notebook = {
  levelNumber: number;
  /** Sắp theo mức thuộc thấp lên trước, rồi theo chữ. */
  words: NotebookWord[];
  topics: NotebookTopic[];
};

export async function getNotebook(userId: number, learnerId: number): Promise<Notebook> {
  const learner = await requireLearner(userId, learnerId);
  const cards = await db.reviewCard.findMany({
    where: { learnerId, wordId: { not: null } },
    select: {
      box: true,
      word: { select: { id: true, word: true, ipa: true, meaningVi: true, exampleEn: true, exampleVi: true, image: true } },
    },
  });
  const learned = cards.flatMap((c) => (c.word ? [{ ...c.word, mastery: Math.min(5, Math.max(1, c.box)) }] : []));
  const wordIds = learned.map((w) => w.id);

  // Chủ đề của từ: qua các bước của bài học (từ → bài → chủ đề), chỉ chủ đề đã xuất bản.
  const steps = wordIds.length
    ? await db.lessonStep.findMany({
        where: { wordId: { in: wordIds }, lesson: { status: "published", unit: { status: "published" } } },
        distinct: ["wordId", "lessonId"],
        select: { wordId: true, lesson: { select: { unit: { select: { id: true, title: true, titleVi: true, sortOrder: true, level: { select: { number: true } } } } } } },
      })
    : [];
  const unitsOfWord = new Map<number, Set<number>>();
  const units = new Map<number, { id: number; title: string; titleVi: string; order: number }>();
  for (const step of steps) {
    if (step.wordId === null) continue;
    const unit = step.lesson.unit;
    (unitsOfWord.get(step.wordId) ?? unitsOfWord.set(step.wordId, new Set()).get(step.wordId)!).add(unit.id);
    units.set(unit.id, { id: unit.id, title: unit.title, titleVi: unit.titleVi, order: unit.level.number * 1000 + unit.sortOrder });
  }

  const words: NotebookWord[] = learned
    .map((w) => ({ ...w, unitIds: [...(unitsOfWord.get(w.id) ?? [])] }))
    .sort((a, b) => a.mastery - b.mastery || a.word.localeCompare(b.word, "en"));
  const topics: NotebookTopic[] = [...units.values()]
    .sort((a, b) => a.order - b.order)
    .map((u) => ({ id: u.id, title: u.title, titleVi: u.titleVi, count: words.filter((w) => w.unitIds.includes(u.id)).length }))
    .filter((t) => t.count > 0);

  return { levelNumber: learner.currentLevel?.number ?? 1, words, topics };
}
