import { sortWords } from "@/lib/rules/notebook";
import { db } from "./db";
import { requireLearner } from "./learners";
import { wordsWithExplorer } from "./word-explorer";

// Dữ liệu cho Sổ từ của bé: các từ đã học (có thẻ ôn tập) kèm mức thuộc (= số hộp), cấp và chủ đề.
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
  /** Cấp thấp nhất trong các chủ đề có từ này (null nếu từ chưa thuộc chủ đề nào) và mọi cấp có từ này. */
  levelNumber: number | null;
  levelNumbers: number[];
  /** Từ có Khám phá đã xuất bản: thẻ phóng to hiện tab Khám phá. */
  hasExplorer: boolean;
};

export type NotebookTopic = { id: number; title: string; titleVi: string; levelNumber: number; count: number };
export type NotebookLevel = { number: number; name: string; count: number };

export type Notebook = {
  /** Cấp hiện tại của bé. */
  levelNumber: number;
  levelName: string;
  /** Lớp ở trường (cho đầu trang bản in), null nếu chưa khai báo. */
  schoolGrade: number | null;
  /** Sắp theo mức thuộc thấp lên trước, rồi cấp cao trước, rồi chữ. */
  words: NotebookWord[];
  topics: NotebookTopic[];
  /** Các cấp có từ trong sổ, theo thứ tự cấp. */
  levels: NotebookLevel[];
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

  // Chủ đề và cấp của từ: qua các bước của bài học (từ → bài → chủ đề → cấp), chỉ chủ đề đã xuất bản.
  const steps = wordIds.length
    ? await db.lessonStep.findMany({
        where: { wordId: { in: wordIds }, lesson: { status: "published", unit: { status: "published" } } },
        distinct: ["wordId", "lessonId"],
        select: { wordId: true, lesson: { select: { unit: { select: { id: true, title: true, titleVi: true, sortOrder: true, level: { select: { number: true, name: true } } } } } } },
      })
    : [];
  const unitsOfWord = new Map<number, Set<number>>();
  const units = new Map<number, { id: number; title: string; titleVi: string; levelNumber: number; order: number }>();
  const levelNames = new Map<number, string>();
  for (const step of steps) {
    if (step.wordId === null) continue;
    const unit = step.lesson.unit;
    (unitsOfWord.get(step.wordId) ?? unitsOfWord.set(step.wordId, new Set()).get(step.wordId)!).add(unit.id);
    units.set(unit.id, { id: unit.id, title: unit.title, titleVi: unit.titleVi, levelNumber: unit.level.number, order: unit.level.number * 1000 + unit.sortOrder });
    levelNames.set(unit.level.number, unit.level.name);
  }

  const withExplorer = await wordsWithExplorer(wordIds);
  const words: NotebookWord[] = sortWords(
    learned.map((w) => {
      const unitIds = [...(unitsOfWord.get(w.id) ?? [])];
      const levelNumbers = [...new Set(unitIds.map((id) => units.get(id)!.levelNumber))].sort((a, b) => a - b);
      return { ...w, unitIds, levelNumbers, levelNumber: levelNumbers[0] ?? null, hasExplorer: withExplorer.has(w.id) };
    }),
  );
  const topics: NotebookTopic[] = [...units.values()]
    .sort((a, b) => a.order - b.order)
    .map((u) => ({ id: u.id, title: u.title, titleVi: u.titleVi, levelNumber: u.levelNumber, count: words.filter((w) => w.unitIds.includes(u.id)).length }))
    .filter((t) => t.count > 0);
  const levels: NotebookLevel[] = [...levelNames.entries()]
    .sort(([a], [b]) => a - b)
    .map(([number, name]) => ({ number, name, count: words.filter((w) => w.levelNumbers.includes(number)).length }))
    .filter((l) => l.count > 0);

  return { levelNumber: learner.currentLevel?.number ?? 1, levelName: learner.currentLevel?.name ?? "", schoolGrade: learner.schoolGrade, words, topics, levels };
}
