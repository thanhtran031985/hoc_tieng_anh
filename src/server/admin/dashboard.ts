import { APP_TIME_ZONE } from "@/lib/rules/dates";
import { MIN_LESSONS_PER_UNIT, pickWarnings, sumByLevel, type DashboardWarning } from "@/lib/rules/admin-dashboard";
import { db } from "../db";

// Số liệu Bảng điều khiển quản trị (Adult08). Chỉ đọc; trang gọi `requireAdmin()` trước khi gọi vào đây.

export type LevelRow = {
  number: number;
  name: string;
  stage: string;
  topics: number;
  words: number;
  withImage: number;
  withAudio: number;
  lessons: number;
  questions: number;
};

export type PlannedUnit = { levelNumber: number; title: string; titleVi: string; source: string | null; targetWords: number };

export type DashboardData = {
  /** Kho nội dung chưa có từ, bài, câu hỏi hay chủ đề nào. */
  isEmpty: boolean;
  /** "21:10 · 3/10/2026" theo giờ Việt Nam. */
  updatedAt: string;
  totals: {
    words: number;
    wordsWithImage: number;
    lessonsPublished: number;
    lessonsDraft: number;
    questions: number;
    questionsThisWeek: number;
    unitsPublished: number;
    unitsDraft: number;
    unitsPlanned: number;
  };
  /** Theo cấp 1–10 (vị trí 0 là cấp 1), cho biểu đồ cột. */
  perLevel: { words: number[]; lessons: number[]; questions: number[] };
  levels: LevelRow[];
  warnings: DashboardWarning[];
  plannedByLevel: number[];
  planned: PlannedUnit[];
  plannedTargetWords: number;
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const EXAMPLE_COUNT = 4;
const updatedFormat = new Intl.DateTimeFormat("vi-VN", { timeZone: APP_TIME_ZONE, hour: "2-digit", minute: "2-digit", day: "numeric", month: "numeric", year: "numeric", hour12: false });

function formatUpdated(now: Date): string {
  const part = (type: Intl.DateTimeFormatPartTypes) => updatedFormat.formatToParts(now).find((p) => p.type === type)?.value ?? "";
  return `${part("hour")}:${part("minute")} · ${part("day")}/${part("month")}/${part("year")}`;
}

function targetWordCount(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

/** Từ chưa có đủ tiếng: thiếu tệp của từ hoặc của câu ví dụ. */
const NO_FULL_AUDIO = { OR: [{ audio: null }, { exampleAudio: null }] };

export async function getDashboard(now: Date = new Date()): Promise<DashboardData> {
  const [levels, units, wordsAll, wordsImage, wordsAudio, questionsAll, noImageTotal, noAudioTotal, noImageExamples, noAudioExamples, noImageByLevel, noAudioByLevel, noExplanation, questionsNew, lessonsDraft] =
    await Promise.all([
      db.level.findMany({ orderBy: { number: "asc" }, select: { id: true, number: true, name: true, stage: { select: { name: true } } } }),
      db.unit.findMany({ select: { levelId: true, title: true, titleVi: true, source: true, targetWords: true, status: true, sortOrder: true, _count: { select: { lessons: true } }, lessons: { select: { status: true } } } }),
      db.word.groupBy({ by: ["levelId"], _count: { _all: true } }),
      db.word.groupBy({ by: ["levelId"], where: { image: { not: null } }, _count: { _all: true } }),
      db.word.groupBy({ by: ["levelId"], where: { audio: { not: null }, exampleAudio: { not: null } }, _count: { _all: true } }),
      db.question.groupBy({ by: ["levelId"], _count: { _all: true } }),
      db.word.count({ where: { image: null } }),
      db.word.count({ where: NO_FULL_AUDIO }),
      db.word.findMany({ where: { image: null }, orderBy: { id: "asc" }, take: EXAMPLE_COUNT, select: { word: true } }),
      db.word.findMany({ where: NO_FULL_AUDIO, orderBy: { id: "asc" }, take: EXAMPLE_COUNT, select: { word: true } }),
      db.word.groupBy({ by: ["levelId"], where: { image: null }, _count: { _all: true } }),
      db.word.groupBy({ by: ["levelId"], where: NO_FULL_AUDIO, _count: { _all: true } }),
      db.question.count({ where: { OR: [{ explanation: null }, { explanation: "" }] } }),
      db.question.count({ where: { createdAt: { gte: new Date(now.getTime() - WEEK_MS) } } }),
      db.lesson.count({ where: { status: "draft" } }),
    ]);

  const numberOf = new Map(levels.map((l) => [l.id, l.number]));
  const byLevel = (rows: { levelId: number; _count: { _all: number } }[]) => sumByLevel(rows.map((r) => ({ levelNumber: numberOf.get(r.levelId) ?? 0, count: r._count._all })));

  const words = byLevel(wordsAll);
  const withImage = byLevel(wordsImage);
  const withAudio = byLevel(wordsAudio);
  const questions = byLevel(questionsAll);

  // Chủ đề khung (planned) chưa có bài; các chủ đề còn lại cho số bài theo cấp và cảnh báo "chưa đủ bài".
  const realUnits = units.filter((u) => u.status !== "planned");
  const plannedUnits = units.filter((u) => u.status === "planned");
  const topics = sumByLevel(realUnits.map((u) => ({ levelNumber: numberOf.get(u.levelId) ?? 0, count: 1 })));
  const lessons = sumByLevel(units.map((u) => ({ levelNumber: numberOf.get(u.levelId) ?? 0, count: u._count.lessons })));
  const plannedByLevel = sumByLevel(plannedUnits.map((u) => ({ levelNumber: numberOf.get(u.levelId) ?? 0, count: 1 })));

  const planned: PlannedUnit[] = [...plannedUnits]
    .sort((a, b) => (numberOf.get(a.levelId) ?? 0) - (numberOf.get(b.levelId) ?? 0) || a.sortOrder - b.sortOrder)
    .map((u) => ({ levelNumber: numberOf.get(u.levelId) ?? 0, title: u.title, titleVi: u.titleVi, source: u.source, targetWords: targetWordCount(u.targetWords) }));

  const thinUnits = realUnits
    .filter((u) => u._count.lessons < MIN_LESSONS_PER_UNIT)
    .map((u) => ({ levelNumber: numberOf.get(u.levelId) ?? 0, title: u.title, lessons: u._count.lessons }))
    .sort((a, b) => a.lessons - b.lessons || b.levelNumber - a.levelNumber);

  const warnings = pickWarnings({
    wordsNoImage: { count: noImageTotal, examples: noImageExamples.map((w) => w.word), byLevel: byLevel(noImageByLevel) },
    wordsNoAudio: { count: noAudioTotal, examples: noAudioExamples.map((w) => w.word), byLevel: byLevel(noAudioByLevel) },
    thinUnits,
    questionsNoExplanation: noExplanation,
    draftLessons: lessonsDraft,
  });

  const lessonStatus = (status: "published" | "draft") => units.reduce((sum, u) => sum + u.lessons.filter((l) => l.status === status).length, 0);
  const total = (list: number[]) => list.reduce((a, b) => a + b, 0);

  const totals = {
    words: total(words),
    wordsWithImage: total(withImage),
    lessonsPublished: lessonStatus("published"),
    lessonsDraft: lessonStatus("draft"),
    questions: total(questions),
    questionsThisWeek: questionsNew,
    unitsPublished: realUnits.filter((u) => u.status === "published").length,
    unitsDraft: realUnits.filter((u) => u.status === "draft").length,
    unitsPlanned: plannedUnits.length,
  };

  return {
    isEmpty: totals.words === 0 && total(lessons) === 0 && totals.questions === 0 && units.length === 0,
    updatedAt: formatUpdated(now),
    totals,
    perLevel: { words, lessons, questions },
    levels: levels.map((l, i) => ({
      number: l.number,
      name: l.name,
      stage: l.stage.name,
      topics: topics[i],
      words: words[i],
      withImage: withImage[i],
      withAudio: withAudio[i],
      lessons: lessons[i],
      questions: questions[i],
    })),
    warnings,
    plannedByLevel,
    planned,
    plannedTargetWords: planned.reduce((sum, u) => sum + u.targetWords, 0),
  };
}
