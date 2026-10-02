import { applyStartLevelInputSchema, completePlacementInputSchema, type PlacementResult, type PlacementTopic } from "@/lib/schemas";
import { isThcsGrade } from "@/lib/learner-rules";
import { PLACEMENT_QUESTIONS, startLevel, suggestLevel } from "@/lib/rules/placement";
import { seededRandom, shuffled } from "@/lib/rules/random";
import { db } from "./db";
import { requireLearner } from "./learners";

// Bài xếp lớp (Tiểu học). Mọi hàm đi qua `requireLearner` nên chỉ đọc/ghi được hồ sơ thuộc tài khoản đang đăng nhập.
// Kết quả ghi vào `learners.current_level_id` (khi bé chọn cấp bắt đầu) và `answer_logs` nguồn "exam"; không đổi database.

/** Cấp Tiểu học (1–5): bài xếp lớp THCS thuộc GĐ3. */
const MAX_PRIMARY_LEVEL = 5;
const OPTIONS = 4;
const MIN_WORDS_PER_LEVEL = OPTIONS;
const MAX_TOPICS = 5;

export class PlacementClosedError extends Error {
  constructor() {
    super("Bé đã bắt đầu học nên không xếp lớp lại được");
    this.name = "PlacementClosedError";
  }
}

export type PlacementWord = { id: number; word: string; image: string };

export type PlacementQuestion = {
  id: string;
  level: number;
  target: PlacementWord;
  /** Hình đáp án (gồm cả đáp án đúng), đã xáo. */
  options: PlacementWord[];
};

export type PlacementLevel = { number: number; name: string; label: string };

export type PlacementSetup = {
  learnerName: string;
  grade: number;
  /** Cấp cao nhất có đủ từ có hình để hỏi. */
  maxLevel: number;
  /** Cấp bắt đầu theo lớp (đã kẹp vào các cấp có nội dung). */
  gradeLevel: PlacementLevel;
  /** Các cấp Tiểu học đã có nội dung, để bé chọn cấp khác. */
  levels: PlacementLevel[];
  /** Bài xếp lớp làm được (Tiểu học, đủ câu hỏi). Không thì hiện trạng thái trống và cho bắt đầu theo lớp. */
  supported: boolean;
  /** Kho câu hỏi theo cấp; client chọn câu kế theo cấp hiện tại. */
  pools: Record<number, PlacementQuestion[]>;
};

const labelOf = (number: number, name: string) => `Cấp ${number} · ${name}`;

/** Bé còn đổi cấp bắt đầu được: chưa xong bài học nào và chưa làm bài xếp lớp. */
async function placementOpen(learnerId: number): Promise<boolean> {
  const [progress, taken] = await Promise.all([
    db.lessonProgress.count({ where: { learnerId } }),
    db.answerLog.count({ where: { learnerId, source: "exam" } }),
  ]);
  return progress === 0 && taken === 0;
}

/** Dữ liệu cho bài xếp lớp; null nếu bé không còn xếp lớp được (đã học hoặc đã làm rồi). */
export async function getPlacementSetup(userId: number, learnerId: number): Promise<PlacementSetup | null> {
  const learner = await requireLearner(userId, learnerId);
  if (!(await placementOpen(learnerId))) return null;

  const grade = learner.schoolGrade ?? learner.currentLevel?.number ?? 1;
  const levelRows = await db.level.findMany({
    where: { number: { lte: MAX_PRIMARY_LEVEL }, units: { some: { status: "published" } } },
    orderBy: { number: "asc" },
    select: { number: true, name: true },
  });
  const levels: PlacementLevel[] = levelRows.map((l) => ({ ...l, label: labelOf(l.number, l.name) }));
  const topLevel = levels.length > 0 ? levels[levels.length - 1].number : 1;
  const gradeNumber = startLevel(Math.min(grade, MAX_PRIMARY_LEVEL * 2), topLevel);
  const gradeLevel = levels.find((l) => l.number === gradeNumber) ?? levels[0] ?? { number: 1, name: "", label: labelOf(1, "") };

  // Từ có hình của các chủ đề đã xuất bản, theo cấp.
  const steps = levels.length
    ? await db.lessonStep.findMany({
        where: {
          activityType: "word_card",
          wordId: { not: null },
          word: { image: { not: null } },
          lesson: { status: "published", unit: { status: "published", level: { number: { in: levels.map((l) => l.number) } } } },
        },
        orderBy: [{ lessonId: "asc" }, { sortOrder: "asc" }],
        select: { word: { select: { id: true, word: true, image: true } }, lesson: { select: { unit: { select: { level: { select: { number: true } } } } } } },
      })
    : [];
  const wordsByLevel = new Map<number, Map<number, PlacementWord>>();
  for (const step of steps) {
    if (!step.word || !step.word.image) continue;
    const level = step.lesson.unit.level.number;
    const bucket = wordsByLevel.get(level) ?? wordsByLevel.set(level, new Map()).get(level)!;
    bucket.set(step.word.id, { id: step.word.id, word: step.word.word, image: step.word.image });
  }

  const pools: Record<number, PlacementQuestion[]> = {};
  for (const { number } of levels) {
    const words = [...(wordsByLevel.get(number)?.values() ?? [])];
    if (words.length < MIN_WORDS_PER_LEVEL) continue;
    const random = seededRandom(`${learnerId}:placement:${number}`);
    pools[number] = shuffled(words, random)
      .slice(0, PLACEMENT_QUESTIONS)
      .map((target) => ({
        id: `L${number}-${target.id}`,
        level: number,
        target,
        options: shuffled([target, ...shuffled(words.filter((w) => w.id !== target.id), random).slice(0, OPTIONS - 1)], random),
      }));
  }
  const maxLevel = Math.max(0, ...Object.keys(pools).map(Number));
  const supported = !isThcsGrade(grade) && pools[gradeLevel.number] !== undefined && maxLevel > 0;

  return { learnerName: learner.name, grade, maxLevel: maxLevel || topLevel, gradeLevel, levels, supported, pools };
}

/**
 * Ghi kết quả bài xếp lớp: tính lại cấp đề xuất từ các câu trả lời (cấp lấy từ cấp của từ trong database, không tin số client),
 * nhãn chủ đề vững/sẽ học, và nhật ký câu trả lời nguồn "exam" (chỉ ghi lần đầu; gửi lại thì trả kết quả như cũ).
 */
export async function completePlacement(userId: number, learnerId: number, input: unknown): Promise<PlacementResult> {
  const learner = await requireLearner(userId, learnerId);
  const data = completePlacementInputSchema.parse(input);
  const hasProgress = (await db.lessonProgress.count({ where: { learnerId } })) > 0;
  if (hasProgress) throw new PlacementClosedError();

  const wordIds = [...new Set(data.answers.map((a) => a.wordId))];
  const words = await db.word.findMany({ where: { id: { in: wordIds } }, select: { id: true, level: { select: { number: true } } } });
  const levelOfWord = new Map(words.map((w) => [w.id, w.level.number]));
  const answers = data.answers.flatMap((a) => (levelOfWord.has(a.wordId) ? [{ wordId: a.wordId, level: levelOfWord.get(a.wordId)!, correct: a.correct }] : []));
  if (answers.length === 0) throw new Error("Không có câu trả lời hợp lệ");

  const topLevelRow = await db.level.findFirst({ where: { number: { lte: MAX_PRIMARY_LEVEL }, units: { some: { status: "published" } } }, orderBy: { number: "desc" }, select: { number: true } });
  const topLevel = topLevelRow?.number ?? 1;
  const grade = learner.schoolGrade ?? learner.currentLevel?.number ?? 1;
  const suggestedLevel = suggestLevel(answers, topLevel, startLevel(grade, topLevel));

  // Chủ đề của từng từ đã hỏi (chủ đề đầu tiên chứa từ đó).
  const steps = await db.lessonStep.findMany({
    where: { activityType: "word_card", wordId: { in: answers.map((a) => a.wordId) }, lesson: { status: "published", unit: { status: "published" } } },
    select: { wordId: true, lesson: { select: { unit: { select: { id: true, titleVi: true, sortOrder: true, level: { select: { number: true } } } } } } },
  });
  const unitOfWord = new Map<number, { id: number; title: string; order: number }>();
  for (const s of steps) {
    if (s.wordId === null) continue;
    const u = s.lesson.unit;
    const order = u.level.number * 1000 + u.sortOrder;
    const known = unitOfWord.get(s.wordId);
    if (!known || order < known.order) unitOfWord.set(s.wordId, { id: u.id, title: u.titleVi, order });
  }
  const perUnit = new Map<number, { title: string; order: number; ok: boolean }>();
  for (const a of answers) {
    const unit = unitOfWord.get(a.wordId);
    if (!unit) continue;
    const entry = perUnit.get(unit.id) ?? { title: unit.title, order: unit.order, ok: true };
    entry.ok = entry.ok && a.correct;
    perUnit.set(unit.id, entry);
  }
  const topics: PlacementTopic[] = [...perUnit.values()]
    .sort((a, b) => a.order - b.order)
    .slice(0, MAX_TOPICS)
    .map(({ title, ok }) => ({ title, ok }));

  if ((await db.answerLog.count({ where: { learnerId, source: "exam" } })) === 0) {
    await db.answerLog.createMany({ data: answers.map((a) => ({ learnerId, source: "exam" as const, wordId: a.wordId, isCorrect: a.correct })) });
  }
  return { suggestedLevel, topics, minutes: Math.max(1, Math.ceil(data.durationMs / 60000)) };
}

/** Đặt cấp bắt đầu của bé (cấp Tiểu học đã có nội dung). Chỉ khi bé chưa xong bài học nào. */
export async function applyStartLevel(userId: number, learnerId: number, input: unknown): Promise<void> {
  await requireLearner(userId, learnerId);
  const { level: number } = applyStartLevelInputSchema.parse(input);
  if ((await db.lessonProgress.count({ where: { learnerId } })) > 0) throw new PlacementClosedError();
  const level = await db.level.findFirst({ where: { number, units: { some: { status: "published" } } }, select: { id: true } });
  if (!level || number > MAX_PRIMARY_LEVEL) throw new Error("Cấp này chưa có nội dung");
  await db.learner.update({ where: { id: learnerId }, data: { currentLevelId: level.id } });
}
