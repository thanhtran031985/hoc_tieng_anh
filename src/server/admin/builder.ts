import { estimateMinutes, isBuilderActivity, isQuestionActivity, rainLevelProblem, type BuilderActivity } from "@/lib/rules/admin-builder";
import { extraQuestionSummary } from "@/lib/rules/admin-question-types";
import { questionSummary } from "@/lib/rules/admin-questions";
import { lessonPublishBlock } from "@/lib/rules/admin-tree";
import type { PlayWord, StoryPlay } from "@/lib/rules/lesson-play";
import type { ExplorerContent } from "@/lib/rules/word-explorer";
import type { FamilyView } from "@/lib/rules/word-family";
import { lessonIdSchema, saveLessonSchema, unitWordsSchema } from "@/lib/schemas/admin-builder";
import { lessonStepConfigSchemas } from "@/lib/schemas/lesson-step-config";
import { EXTRA_QUESTION_TYPES, isExtraQuestionType } from "@/lib/schemas/question-extra";
import { db } from "../db";
import { getStoriesPlay } from "../story-play";
import { loadExplorerContents } from "../word-explorer";
import { loadFamilies } from "../word-family";
import { fail, firstIssue, type AdminResult } from "./result";

// Soạn bài học (Adult12): danh sách bài, đọc một bài kèm gợi ý từ và câu hỏi, và lưu bài (tên, trạng thái, danh sách bước).
// Hàm ghi kiểm Zod ở đây; server action (`features/admin/builder-actions.ts`) gọi `requireAdmin()` trước khi vào.

const wordSelect = { id: true, word: true, ipa: true, meaningVi: true, exampleEn: true, exampleVi: true, image: true } as const;

export type LessonListRow = { id: number; title: string; unit: string; level: number; steps: number; minutes: number; status: "draft" | "published" };

export async function getLessonList(): Promise<LessonListRow[]> {
  const lessons = await db.lesson.findMany({
    where: { kind: "lesson" },
    orderBy: [{ unit: { level: { number: "asc" } } }, { unit: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    select: { id: true, title: true, minutes: true, status: true, unit: { select: { title: true, level: { select: { number: true } } } }, _count: { select: { steps: true } } },
  });
  return lessons.map((l) => ({ id: l.id, title: l.title, unit: l.unit.title, level: l.unit.level.number, steps: l._count.steps, minutes: l.minutes, status: l.status === "published" ? "published" : "draft" }));
}

/** Câu hỏi để gắn vào bài. `data` có với 4 dạng bài mới và đọc hiểu (nội dung nằm trong câu hỏi) để Xem như học sinh dựng được bước. */
export type BuilderQuestion = { id: number; type: string; summary: string; difficulty: number; wordId: number | null; data?: { prompt: unknown; options: unknown; answer: unknown } };

export type BuilderData = {
  lesson: { id: number; title: string; status: "draft" | "published"; minutes: number; unitId: number; unitTitle: string; levelId: number; levelNumber: number; levelName: string };
  steps: { id: number; activityType: BuilderActivity; wordId: number | null; questionId: number | null; config: Record<string, unknown> | null }[];
  /** Các chủ đề của cấp, để đổi nguồn gợi ý. */
  units: { id: number; title: string }[];
  /** Từ của chủ đề đang gợi ý. */
  suggestions: PlayWord[];
  /** Từ đang dùng trong các bước và từ gắn với câu hỏi của cấp (có thể nằm ngoài chủ đề). */
  stepWords: PlayWord[];
  questions: BuilderQuestion[];
  /** Truyện tranh đã xuất bản của cấp, để thêm thành một bước `story`. */
  stories: StoryPlay[];
  /** Mã các từ đã có Khám phá (nháp hoặc đã xuất bản): từ có trong đây mới thêm được bước “Khám phá từ”. */
  explorerWordIds: number[];
  /** Nội dung Khám phá (kể cả bản nháp) của các từ đang có bước “Khám phá từ”, để Xem như học sinh dựng được bước. */
  explorers: { wordId: number; content: ExplorerContent }[];
  /** Họ vần đã xuất bản của các cấp từ cấp của bài trở xuống, để thêm thành một bước `word_family` (mọi từ coi như đã học để xem thử). */
  families: FamilyView[];
};

/** Từ của một chủ đề (theo bảng `topics` trùng tên chủ đề). */
export async function getUnitWords(input: unknown): Promise<PlayWord[] | null> {
  const parsed = unitWordsSchema.safeParse(input);
  if (!parsed.success) return null;
  const unit = await db.unit.findUnique({ where: { id: parsed.data.unitId }, select: { title: true } });
  if (!unit) return null;
  return db.word.findMany({ where: { topics: { some: { topic: { name: unit.title } } } }, orderBy: { id: "asc" }, select: wordSelect });
}

export async function getBuilder(input: unknown): Promise<BuilderData | null> {
  const parsed = lessonIdSchema.safeParse(input);
  if (!parsed.success) return null;
  const lesson = await db.lesson.findUnique({
    where: { id: parsed.data.lessonId },
    select: {
      id: true,
      title: true,
      status: true,
      minutes: true,
      kind: true,
      unit: { select: { id: true, title: true, level: { select: { id: true, number: true, name: true, units: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { id: true, title: true } } } } } },
      steps: { orderBy: { sortOrder: "asc" }, select: { id: true, activityType: true, wordId: true, questionId: true, config: true, word: { select: wordSelect } } },
    },
  });
  if (!lesson || lesson.kind !== "lesson") return null;
  const { unit } = lesson;

  const [suggestions, questions, storyRows] = await Promise.all([
    getUnitWords({ unitId: unit.id }),
    db.question.findMany({
      where: { levelId: unit.level.id, type: { in: ["listen_choose_picture", "match_pairs", "choose_word_for_picture", ...EXTRA_QUESTION_TYPES] } },
      orderBy: { id: "asc" },
      select: { id: true, type: true, options: true, answer: true, difficulty: true, prompt: true },
    }),
    db.story.findMany({ where: { levelId: unit.level.id, status: "published" }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { id: true } }),
  ]);
  const stories = [...(await getStoriesPlay(storyRows.map((r) => r.id))).values()];
  const familyRows = await db.wordFamily.findMany({ where: { status: "published", level: { number: { lte: unit.level.number } } }, orderBy: [{ level: { number: "asc" } }, { pattern: "asc" }], select: { id: true } });
  const families = [...(await loadFamilies(familyRows.map((f) => f.id), "all")).values()];
  const explorerWordIds = (await db.wordQuestion.findMany({ distinct: ["wordId"], select: { wordId: true } })).map((r) => r.wordId);
  const explorers = [...(await loadExplorerContents(lesson.steps.flatMap((s) => (s.activityType === "word_explorer" && s.wordId !== null ? [s.wordId] : [])), "any")).entries()].map(([wordId, content]) => ({ wordId, content }));

  const seen = new Set<number>();
  const fromSteps = lesson.steps.flatMap((s) => (s.word && !seen.has(s.word.id) && seen.add(s.word.id) ? [s.word] : []));
  const questionWordIds = [...new Set(questions.flatMap((q) => (typeof (q.prompt as { wordId?: unknown } | null)?.wordId === "number" ? [(q.prompt as { wordId: number }).wordId] : [])))].filter((id) => !seen.has(id));
  const fromQuestions = questionWordIds.length ? await db.word.findMany({ where: { id: { in: questionWordIds } }, select: wordSelect }) : [];
  const stepWords = [...fromSteps, ...fromQuestions];
  return {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      status: lesson.status === "published" ? "published" : "draft",
      minutes: lesson.minutes,
      unitId: unit.id,
      unitTitle: unit.title,
      levelId: unit.level.id,
      levelNumber: unit.level.number,
      levelName: unit.level.name,
    },
    steps: lesson.steps
      .filter((s) => isBuilderActivity(s.activityType))
      .map((s) => ({ id: s.id, activityType: s.activityType as BuilderActivity, wordId: s.wordId, questionId: s.questionId, config: (s.config as Record<string, unknown> | null) ?? null })),
    units: unit.level.units,
    suggestions: suggestions ?? [],
    stepWords,
    questions: questions.map((q) => ({
      id: q.id,
      type: q.type,
      summary: isExtraQuestionType(q.type) ? extraQuestionSummary(q.type, q.prompt) : questionSummary(q.type, q.options, q.answer),
      difficulty: q.difficulty,
      wordId: typeof (q.prompt as { wordId?: unknown } | null)?.wordId === "number" ? (q.prompt as { wordId: number }).wordId : null,
      ...(isExtraQuestionType(q.type) ? { data: { prompt: q.prompt, options: q.options, answer: q.answer } } : {}),
    })),
    stories,
    explorerWordIds,
    explorers,
    families,
  };
}

/** Lưu bài: tên, trạng thái và danh sách bước theo thứ tự. Bước đã lưu giữ nguyên id, bước bị bỏ thì xóa, bước mới thì tạo. Thời lượng tự tính theo các bước. */
export async function saveLesson(input: unknown): Promise<AdminResult> {
  const parsed = saveLessonSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { id, title, status, steps } = parsed.data;

  const lesson = await db.lesson.findUnique({ where: { id }, select: { id: true, unit: { select: { level: { select: { number: true } } } }, steps: { select: { id: true } } } });
  if (!lesson) return fail("Không tìm thấy bài học này nữa.");
  const existing = new Set(lesson.steps.map((s) => s.id));
  if (steps.some((s) => s.id !== undefined && !existing.has(s.id))) return fail("Danh sách bước đã thay đổi. Hãy tải lại trang rồi soạn lại.", "steps");

  if (status === "published") {
    const block = lessonPublishBlock(steps.length, steps.filter((s) => s.activityType !== "word_card").length);
    if (block) return fail(block, "steps");
  }

  // Mưa từ vựng chỉ có ở bài cấp 3–5 (task 18).
  const rainProblem = steps.some((s) => s.activityType === "word_rain") ? rainLevelProblem(lesson.unit.level.number) : null;
  if (rainProblem) return fail(rainProblem, "steps");

  // Dạng bài lấy nội dung từ câu hỏi (task 15) phải gắn đúng một câu hỏi cùng dạng.
  const needQuestion = steps.filter((s) => isQuestionActivity(s.activityType));
  if (needQuestion.some((s) => s.questionId === null)) return fail("Bước ghép âm, sắp xếp câu, nghe và gõ, điền từ cần gắn một câu hỏi cùng dạng.", "steps");
  if (needQuestion.length) {
    const types = await db.question.findMany({ where: { id: { in: needQuestion.map((s) => s.questionId!) } }, select: { id: true, type: true } });
    const typeOf = new Map(types.map((q) => [q.id, q.type]));
    if (needQuestion.some((s) => typeOf.get(s.questionId!) !== s.activityType)) return fail("Có bước gắn câu hỏi khác dạng. Hãy tải lại trang rồi soạn lại.", "steps");
  }

  // Xuất bản bài thì các từ có bước “Khám phá từ” phải đã xuất bản Khám phá (bản nháp không tới bé nên bước sẽ bị bỏ qua).
  const explorerWordIds = [...new Set(steps.flatMap((s) => (s.activityType === "word_explorer" && s.wordId !== null ? [s.wordId] : [])))];
  if (status === "published" && explorerWordIds.length) {
    const ready = await loadExplorerContents(explorerWordIds);
    const missing = explorerWordIds.filter((wordId) => !ready.has(wordId));
    if (missing.length) {
      const names = (await db.word.findMany({ where: { id: { in: missing } }, select: { word: true } })).map((w) => w.word).join(", ");
      return fail(`Từ “${names}” chưa xuất bản Khám phá nên bước “Khám phá từ” chưa dùng được. Xuất bản Khám phá ở Ngân hàng từ vựng hoặc lưu bài ở dạng nháp.`, "steps");
    }
  }

  // Bước Họ vần cần `config.familyId` trỏ tới một họ có thật; xuất bản bài thì họ đó phải đã xuất bản (bản Nháp không tới bé nên bước sẽ bị bỏ qua).
  const familySteps = steps.filter((s) => s.activityType === "word_family" || s.activityType === "build_family");
  const familyIds = [...new Set(familySteps.map((s) => (s.config as { familyId?: unknown } | null)?.familyId))];
  if (familyIds.some((fid) => typeof fid !== "number" || !Number.isInteger(fid) || fid < 1)) return fail("Bước Họ vần / Ghép chữ đầu chưa chọn họ. Hãy thêm lại từ danh sách Họ vần.", "steps");
  if (familyIds.length) {
    const rows = await db.wordFamily.findMany({ where: { id: { in: familyIds as number[] } }, select: { pattern: true, status: true } });
    if (rows.length !== familyIds.length) return fail("Có họ vần không còn nữa. Hãy tải lại trang.", "steps");
    const draft = rows.filter((r) => r.status !== "published");
    if (status === "published" && draft.length) return fail(`Họ vần “-${draft.map((r) => r.pattern).join(", -")}” chưa xuất bản nên bước Họ vần hoặc Ghép chữ đầu chưa dùng được. Xuất bản ở Quản trị › Họ vần hoặc lưu bài ở dạng nháp.`, "steps");
  }

  // Bước truyện cần `config.storyId` trỏ tới một truyện có thật.
  const storyIds = [...new Set(steps.filter((s) => s.activityType === "story").map((s) => (s.config as { storyId?: unknown } | null)?.storyId))];
  if (steps.some((s) => s.activityType === "story") && storyIds.some((id) => typeof id !== "number" || !Number.isInteger(id) || id < 1)) return fail("Bước truyện chưa chọn truyện. Hãy thêm lại từ danh sách Truyện.", "steps");
  if (storyIds.length && (await db.story.count({ where: { id: { in: storyIds as number[] } } })) !== storyIds.length) return fail("Có truyện không còn nữa. Hãy tải lại trang.", "steps");

  const wordIds = [...new Set(steps.flatMap((s) => (s.wordId === null ? [] : [s.wordId])))];
  const questionIds = [...new Set(steps.flatMap((s) => (s.questionId === null ? [] : [s.questionId])))];
  const [words, questions] = await Promise.all([
    wordIds.length ? db.word.count({ where: { id: { in: wordIds } } }) : 0,
    questionIds.length ? db.question.count({ where: { id: { in: questionIds } } }) : 0,
  ]);
  if (words !== wordIds.length || questions !== questionIds.length) return fail("Có từ hoặc câu hỏi không còn trong ngân hàng. Hãy tải lại trang.", "steps");

  const keep = new Set(steps.flatMap((s) => (s.id === undefined ? [] : [s.id])));
  const configOf = (type: BuilderActivity, config: Record<string, unknown> | null) => {
    const result = lessonStepConfigSchemas[type].safeParse(config ?? {});
    return (result.success ? result.data : lessonStepConfigSchemas[type].parse({})) as object;
  };

  await db.$transaction(async (tx) => {
    const removed = [...existing].filter((stepId) => !keep.has(stepId));
    if (removed.length) await tx.lessonStep.deleteMany({ where: { id: { in: removed } } });
    for (const [index, step] of steps.entries()) {
      const data = { sortOrder: index + 1, activityType: step.activityType, wordId: step.wordId, questionId: step.questionId, config: configOf(step.activityType, step.config) };
      if (step.id === undefined) await tx.lessonStep.create({ data: { lessonId: id, ...data } });
      else await tx.lessonStep.update({ where: { id: step.id }, data });
    }
    await tx.lesson.update({ where: { id }, data: { title, status, minutes: estimateMinutes(steps) } });
  });
  return { ok: true, id };
}
