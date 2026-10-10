import { examItemsSchema, examWeakUnitsSchema, isExtraQuestionType, submitExamInputSchema, type ExamResult, type ExamWeakTopic } from "@/lib/schemas";
import type { Prisma } from "@/generated/prisma/client";
import { parseLessonStepConfig } from "@/lib/schemas";
import { buildPlaySteps, type PlayStep, type PlayWord } from "@/lib/rules/lesson-play";
import { EXAM_PASS_PERCENT, EXAM_QUESTION_COUNT, gradeExam, retakeState, selectExamItems, weakTopics, passScore, type ExamCandidate, type ExamItem } from "@/lib/rules/level-test";
import { extraQuestionTexts } from "@/lib/rules/play-texts";
import { LEVEL_UP_REWARD, levelBadgeCode } from "@/lib/rules/rewards";
import { clipMap } from "./audio/clips";
import { getVoiceMp3Enabled } from "./app-settings";
import { db } from "./db";
import { requireLearner, type Learner } from "./learners";
import { getAudioMap, getPlayExtras, wordSelect } from "./lesson-play";
import { requireOpenExamGate } from "./map";
import { awardReward } from "./rewards";

// Bài thi lên cấp. Mọi hàm đi qua `requireOpenExamGate` (hồ sơ thuộc tài khoản, đúng cấp bé đang học, cổng đã mở) nên gõ thẳng URL hay gọi thẳng server action khi cổng khóa đều bị chặn.
// Bộ 20 câu chọn một lần khi bắt đầu và lưu ở `exam_attempts.items`; tải lại trang ra đúng bộ câu cũ.

/** Chưa thi lại được: lần thi trước chưa đạt và bé chưa hoàn thành bài nào của chủ đề gợi ý. */
export class ExamNotReadyError extends Error {
  constructor() {
    super("Bé cần ôn một chủ đề gợi ý trước khi thi lại");
    this.name = "ExamNotReadyError";
  }
}

/** Lượt thi không thuộc hồ sơ này, không tồn tại, hoặc cấp chưa có đủ câu để thi. */
export class ExamAccessError extends Error {
  constructor(message = "Không tìm thấy lượt thi") {
    super(message);
    this.name = "ExamAccessError";
  }
}

export type ExamIntro = {
  kind: "intro";
  level: { number: number; name: string };
  next: { number: number; name: string; place: string } | null;
  unitCount: number;
  questionCount: number;
  passPercent: number;
  /** Điểm lần thi gần nhất nếu lần đó chưa đạt (bé đã ôn xong và được thi lại). */
  lastScore: { score: number; total: number } | null;
  /** Tên 5 đảo Tiểu học (cấp 1–5) cho chuỗi đảo ở màn lên cấp. */
  islands: { number: number; name: string }[];
};

/** Chưa đạt và chưa ôn: hiện kết quả lần trước kèm 3 chủ đề nên ôn (Screen37). */
export type ExamReview = { kind: "review"; result: ExamResult };

export type ExamPage = ExamIntro | ExamReview;

export type ExamPlay = {
  attemptId: number;
  level: { number: number; name: string };
  next: { number: number; name: string } | null;
  /** Các câu thi theo thứ tự (mã `s<stepId>`). */
  steps: PlayStep[];
  /** Chủ đề của từng câu (nhãn “Trái cây · Fruits” của khung câu hỏi), theo mã câu. */
  units: Record<string, { title: string; titleVi: string }>;
  audio: Record<string, string>;
};

const EXAM_QUESTION_TYPES = ["fill_blank", "sentence_order", "phonics", "dictation"] as const;

async function loadLevel(levelNumber: number) {
  const level = await db.level.findUnique({ where: { number: levelNumber }, select: { id: true, number: true, name: true } });
  if (!level) throw new ExamAccessError("Không có cấp này");
  return level;
}

function ensureExam(levelId: number, levelNumber: number) {
  return db.exam.upsert({
    where: { kind_levelId: { kind: "level_test", levelId } },
    create: { title: `Bài thi lên cấp ${levelNumber}`, kind: "level_test", levelId, questionCount: EXAM_QUESTION_COUNT, passPercent: EXAM_PASS_PERCENT },
    update: {},
    select: { id: true, questionCount: true, passPercent: true },
  });
}

type FinishedAttempt = Prisma.ExamAttemptGetPayload<{ include: { exam: { select: { passPercent: true } } } }>;

function lastFinished(learnerId: number, examId: number): Promise<FinishedAttempt | null> {
  return db.examAttempt.findFirst({
    where: { learnerId, examId, status: { in: ["passed", "retry"] } },
    orderBy: [{ submittedAt: "desc" }, { id: "desc" }],
    include: { exam: { select: { passPercent: true } } },
  });
}

/** Thi lại được chưa: lần trước chưa đạt thì cần một bài (loại bài thường) của chủ đề gợi ý hoàn thành SAU lần thi đó. Điều kiện này kiểm ở server. */
async function retakeOf(learnerId: number, last: FinishedAttempt | null) {
  if (!last || last.status !== "retry" || !last.submittedAt) return "free" as const;
  const weakUnitIds = (examWeakUnitsSchema.safeParse(last.weakUnits).data ?? []).map((w) => w.unitId);
  if (weakUnitIds.length === 0) return "free" as const;
  const done = await db.lessonAttempt.findMany({
    where: { learnerId, finishedAt: { gt: last.submittedAt }, lesson: { kind: "lesson", unitId: { in: weakUnitIds } } },
    select: { lesson: { select: { unitId: true } } },
  });
  return retakeState(weakUnitIds, done.map((d) => d.lesson.unitId));
}

/** Màn đầu của `/exam/<cấp>`: giới thiệu (được thi) hoặc kết quả lần trước kèm chủ đề cần ôn (chưa được thi lại). */
export async function getExamPage(userId: number, learnerId: number, levelNumber: number): Promise<ExamPage> {
  const { level, next } = await requireOpenExamGate(userId, learnerId, levelNumber);
  const lv = await loadLevel(level.number);
  const exam = await ensureExam(lv.id, lv.number);
  const last = await lastFinished(learnerId, exam.id);
  if (last && (await retakeOf(learnerId, last)) === "needs_review") return { kind: "review", result: await resultOf(learnerId, last, level, next ? { number: level.number + 1, name: next.name } : null, null) };
  const [unitCount, islands] = await Promise.all([
    db.unit.count({ where: { levelId: lv.id, status: "published" } }),
    db.level.findMany({ where: { number: { lte: 5 } }, orderBy: { number: "asc" }, select: { number: true, name: true } }),
  ]);
  return {
    kind: "intro",
    level,
    next: next ? { number: level.number + 1, name: next.name, place: next.place } : null,
    unitCount,
    questionCount: exam.questionCount,
    passPercent: exam.passPercent,
    lastScore: last?.status === "retry" && last.score !== null ? { score: last.score, total: last.total } : null,
    islands,
  };
}

/** Bắt đầu (hoặc tiếp tục lượt đang làm dở) và trả bộ câu để chơi. */
export async function startExam(userId: number, learnerId: number, levelNumber: number): Promise<ExamPlay> {
  const learner = await requireLearner(userId, learnerId);
  const page = await getExamPage(userId, learnerId, levelNumber);
  if (page.kind === "review") throw new ExamNotReadyError();
  const lv = await loadLevel(levelNumber);
  const exam = await ensureExam(lv.id, lv.number);

  let attempt = await db.examAttempt.findFirst({ where: { learnerId, examId: exam.id, status: "in_progress" }, orderBy: { id: "desc" } });
  if (!attempt) attempt = await createAttempt(learner, exam.id, lv);
  const items = examItemsSchema.parse(attempt.items);
  const built = await buildExamSteps(learner, lv, attempt.id, items);
  if (built.steps.length === 0) throw new ExamAccessError("Cấp này chưa có câu để thi");
  return { attemptId: attempt.id, level: page.level, next: page.next ? { number: page.next.number, name: page.next.name } : null, ...built };
}

async function examCandidates(levelId: number): Promise<ExamCandidate[]> {
  const rows = await db.lessonStep.findMany({
    where: {
      lesson: { status: "published", kind: "lesson", unit: { levelId, status: "published" } },
      OR: [
        { activityType: { in: ["listen_choose_picture", "choose_word_for_picture"] }, wordId: { not: null }, word: { image: { not: null } } },
        { activityType: { in: [...EXAM_QUESTION_TYPES] }, questionId: { not: null }, question: { status: "published" } },
      ],
    },
    orderBy: { id: "asc" },
    select: { id: true, activityType: true, wordId: true, questionId: true, lesson: { select: { unitId: true } } },
  });
  return rows.map((r) => ({ stepId: r.id, unitId: r.lesson.unitId, kind: r.activityType, key: r.questionId !== null ? `q${r.questionId}` : `w${r.wordId}` }));
}

async function createAttempt(learner: Learner, examId: number, level: { id: number; number: number; name: string }) {
  const seed = `${learner.id}:${examId}:${Date.now()}`;
  const picked = selectExamItems(await examCandidates(level.id), seed);
  if (picked.length === 0) throw new ExamAccessError("Cấp này chưa có câu để thi");
  const created = await db.examAttempt.create({ data: { examId, learnerId: learner.id, total: picked.length, items: picked } });
  // Bước nào không dựng được thành câu hỏi (hiếm: thiếu hình, thiếu từ nhiễu) thì bỏ khỏi bộ câu để không thành câu “không thể đúng”.
  const built = await buildExamSteps(learner, level, created.id, picked);
  const ok = new Set(built.steps.map((s) => s.id));
  const kept = picked.filter((i) => ok.has(`s${i.stepId}`));
  if (kept.length === 0) {
    await db.examAttempt.delete({ where: { id: created.id } });
    throw new ExamAccessError("Cấp này chưa có câu để thi");
  }
  if (kept.length === picked.length) return created;
  return db.examAttempt.update({ where: { id: created.id }, data: { items: kept, total: kept.length } });
}

/** Dựng các câu thi từ bộ câu đã lưu. Đáp án nhiễu và thứ tự xáo theo hạt giống của lượt thi nên tải lại trang vẫn ra đúng bộ cũ. */
async function buildExamSteps(learner: Learner, level: { id: number; number: number }, attemptId: number, items: readonly ExamItem[]): Promise<Pick<ExamPlay, "steps" | "units" | "audio">> {
  const rows = await db.lessonStep.findMany({
    where: { id: { in: items.map((i) => i.stepId) }, lesson: { status: "published", kind: "lesson", unit: { levelId: level.id, status: "published" } } },
    select: {
      id: true,
      activityType: true,
      config: true,
      word: { select: wordSelect },
      question: { select: { id: true, type: true, prompt: true, options: true, answer: true, status: true } },
      lesson: { select: { unit: { select: { title: true, titleVi: true } } } },
    },
  });
  const byId = new Map(rows.map((r) => [r.id, r]));
  const ordered = items.flatMap((i) => (byId.has(i.stepId) ? [byId.get(i.stepId)!] : []));

  const cards = await db.lessonStep.findMany({
    where: { activityType: "word_card", wordId: { not: null }, lesson: { status: "published", kind: "lesson", unit: { levelId: level.id, status: "published" } } },
    select: { word: { select: wordSelect } },
  });
  const seen = new Set<number>();
  const levelWords: PlayWord[] = cards.flatMap((c) => (c.word && !seen.has(c.word.id) && seen.add(c.word.id) ? [c.word] : []));

  const questions = ordered.flatMap((r) => (r.question && r.question.status === "published" ? [r.question] : []));
  const steps = buildPlaySteps(
    ordered.map((r) => ({ id: r.id, activityType: r.activityType, config: parseLessonStepConfig(r.activityType, r.config), word: r.word, question: r.question && r.question.status === "published" ? r.question : null })),
    levelWords,
    `exam:${attemptId}`,
    { ...(await getPlayExtras(questions, [], learner.settings.speechScoring)), levelNumber: level.number },
  );
  const units: ExamPlay["units"] = {};
  for (const r of ordered) units[`s${r.id}`] = r.lesson.unit;

  const clipTexts = questions.flatMap((q) => (isExtraQuestionType(q.type) ? extraQuestionTexts(q.type, q.prompt, q.options, q.answer) : []));
  const audio = (await getVoiceMp3Enabled()) ? { ...(await getAudioMap([...ordered.flatMap((r) => (r.word ? [r.word.id] : [])), ...levelWords.map((w) => w.id)])), ...(await clipMap(clipTexts)) } : {};
  return { steps, units, audio };
}

/**
 * Nộp bài: chấm theo bộ câu đã lưu (client chỉ gửi kết quả từng câu), ghi lượt thi một lần và nếu đạt thì lên cấp
 * (`current_level_id`, +50 sao, +100 xu, huy hiệu “Qua đảo …”) trong cùng giao dịch. Nộp lại cùng lượt trả về kết quả đã lưu, không thưởng thêm.
 */
export async function submitExam(userId: number, learnerId: number, input: unknown): Promise<ExamResult> {
  const learner = await requireLearner(userId, learnerId);
  const data = submitExamInputSchema.parse(input);
  const attempt = await db.examAttempt.findFirst({
    where: { id: data.attemptId, learnerId },
    include: { exam: { select: { passPercent: true, level: { select: { id: true, number: true, name: true } } } } },
  });
  if (!attempt) throw new ExamAccessError();
  const { level } = attempt.exam;
  const { next } = await requireOpenExamGate(userId, learnerId, level.number);
  const nextLevel = next ? await db.level.findUnique({ where: { number: level.number + 1 }, select: { id: true, number: true, name: true } }) : null;
  const nextInfo = nextLevel ? { number: nextLevel.number, name: nextLevel.name } : null;

  if (attempt.status !== "in_progress") {
    return resultOf(learnerId, { ...attempt, exam: { passPercent: attempt.exam.passPercent } }, level, nextInfo, attempt.status === "passed" ? { stars: LEVEL_UP_REWARD.stars, coins: LEVEL_UP_REWARD.coins, badge: null } : null);
  }

  const items = examItemsSchema.parse(attempt.items);
  const stepRows = await db.lessonStep.findMany({ where: { id: { in: items.map((i) => i.stepId) } }, select: { id: true, wordId: true, questionId: true } });
  const stepById = new Map(stepRows.map((s) => [s.id, s]));

  // Câu đúng = mục của đúng câu đó (khớp từ hoặc câu hỏi của bước) đều đúng ngay lần đầu và tính điểm; mục lạ bị bỏ qua.
  const correctSteps = new Set<number>();
  const seenSteps = new Set<number>();
  const accepted: { wordId: number | null; questionId: number | undefined; isCorrect: boolean; picks: string[] }[] = [];
  for (const result of data.results) {
    const step = stepById.get(result.stepId);
    if (!step || seenSteps.has(result.stepId)) continue;
    seenSteps.add(result.stepId);
    const mine = result.items.filter((i) => (i.questionId !== undefined ? i.questionId === step.questionId : i.wordId !== null && i.wordId === step.wordId));
    if (mine.length > 0 && mine.every((i) => i.firstTryCorrect && i.scored)) correctSteps.add(result.stepId);
    for (const i of mine) accepted.push({ wordId: i.wordId, questionId: i.questionId, isCorrect: i.firstTryCorrect, picks: i.picks });
  }

  const grade = gradeExam(items, correctSteps, attempt.exam.passPercent);
  const wordIdByStep = new Map(stepRows.map((s) => [s.id, s.wordId]));
  const weak = weakTopics(items, grade.answers, wordIdByStep);
  const now = new Date();

  const outcome = await db.$transaction(async (tx) => {
    // Chỉ một lần nộp thắng: lần nộp song song thứ hai không cập nhật được dòng nào.
    const claimed = await tx.examAttempt.updateMany({
      where: { id: attempt.id, status: "in_progress" },
      data: { status: grade.passed ? "passed" : "retry", submittedAt: now, score: grade.score, answers: grade.answers, weakUnits: weak },
    });
    if (claimed.count === 0) return null;
    if (accepted.length > 0) {
      await tx.answerLog.createMany({
        data: accepted.map((a) => ({
          learnerId,
          source: "exam" as const,
          wordId: a.wordId,
          questionId: a.questionId,
          isCorrect: a.isCorrect,
          answer: a.picks.length === 0 ? undefined : a.questionId !== undefined ? { text: a.picks.join(" | ").slice(0, 500) } : { selected: a.picks },
        })),
      });
    }
    if (!grade.passed) return { badge: null };
    const badge = await awardReward(tx, learnerId, levelBadgeCode(level.number));
    await tx.learner.update({
      where: { id: learnerId },
      data: {
        stars: { increment: LEVEL_UP_REWARD.stars },
        coins: { increment: LEVEL_UP_REWARD.coins },
        // Chỉ nâng cấp khi bé đang ở đúng cấp vừa thi (không kéo lùi bé đã ở cấp cao hơn).
        ...(nextLevel && learner.currentLevel?.number === level.number ? { currentLevelId: nextLevel.id } : {}),
      },
    });
    return { badge };
  });

  const stored = await db.examAttempt.findUniqueOrThrow({ where: { id: attempt.id }, include: { exam: { select: { passPercent: true } } } });
  const levelUp = stored.status === "passed" ? { stars: LEVEL_UP_REWARD.stars, coins: LEVEL_UP_REWARD.coins, badge: outcome?.badge ?? null } : null;
  return resultOf(learnerId, stored, level, nextInfo, levelUp);
}

/** Kết quả đã lưu của một lượt thi: số câu, chủ đề cần ôn (tên, từ hay sai, bài còn thiếu sao nhất) và phần thưởng nếu vừa đạt. */
async function resultOf(learnerId: number, attempt: FinishedAttempt, level: { number: number; name: string }, next: { number: number; name: string } | null, levelUp: ExamResult["levelUp"]): Promise<ExamResult> {
  const score = attempt.score ?? 0;
  const need = passScore(attempt.total, attempt.exam.passPercent);
  const stored = examWeakUnitsSchema.safeParse(attempt.weakUnits).data ?? [];
  const items = examItemsSchema.safeParse(attempt.items).data ?? [];
  const unitIds = stored.map((w) => w.unitId);
  const wordIds = [...new Set(stored.flatMap((w) => w.wordIds))];
  const [units, words, lessons] = await Promise.all([
    unitIds.length ? db.unit.findMany({ where: { id: { in: unitIds } }, select: { id: true, title: true, titleVi: true } }) : [],
    wordIds.length ? db.word.findMany({ where: { id: { in: wordIds } }, select: { id: true, word: true, meaningVi: true } }) : [],
    unitIds.length
      ? db.lesson.findMany({
          where: { unitId: { in: unitIds }, kind: "lesson", status: "published" },
          orderBy: { sortOrder: "asc" },
          select: { id: true, unitId: true, progress: { where: { learnerId }, select: { bestStars: true } } },
        })
      : [],
  ]);
  const unitById = new Map(units.map((u) => [u.id, u]));
  const wordById = new Map(words.map((w) => [w.id, w]));
  const totalByUnit = new Map<number, number>();
  for (const i of items) totalByUnit.set(i.unitId, (totalByUnit.get(i.unitId) ?? 0) + 1);

  const weak: ExamWeakTopic[] = stored.flatMap((w) => {
    const unit = unitById.get(w.unitId);
    if (!unit) return [];
    // Bài ôn: bài còn thiếu sao nhất của chủ đề (bằng nhau thì bài đứng trước).
    const mine = lessons.filter((l) => l.unitId === w.unitId);
    const review = mine.reduce<{ id: number; stars: number } | null>((best, l) => {
      const stars = l.progress[0]?.bestStars ?? 0;
      return best === null || stars < best.stars ? { id: l.id, stars } : best;
    }, null);
    const total = totalByUnit.get(w.unitId) ?? w.total;
    return [{ unitId: unit.id, title: unit.title, titleVi: unit.titleVi, correct: Math.max(0, total - w.wrong), total, words: w.wordIds.flatMap((id) => (wordById.has(id) ? [{ word: wordById.get(id)!.word, meaningVi: wordById.get(id)!.meaningVi }] : [])), reviewLessonId: review?.id ?? null }];
  });

  return { attemptId: attempt.id, passed: attempt.status === "passed", score, total: attempt.total, passScore: need, percent: attempt.total === 0 ? 0 : Math.round((100 * score) / attempt.total), level, next, weak, levelUp };
}
