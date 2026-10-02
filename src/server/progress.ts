import { answerLogInputSchema, lessonResultSchema, reviewCardInputSchema } from "@/lib/schemas";
import { db } from "./db";
import { requireLearner } from "./learners";

// Kết quả học của học sinh. Mọi hàm nhận `userId` (tài khoản đang đăng nhập) và đi qua `requireLearner`
// trước khi đọc hoặc ghi, nên một tài khoản không bao giờ chạm được vào dữ liệu của hồ sơ không thuộc mình.

export class AttemptAccessError extends Error {
  constructor() {
    super("Không tìm thấy lượt học");
    this.name = "AttemptAccessError";
  }
}

// ---- Bài học ----

export async function getLessonProgress(userId: number, learnerId: number, lessonId: number) {
  await requireLearner(userId, learnerId);
  return db.lessonProgress.findUnique({ where: { learnerId_lessonId: { learnerId, lessonId } } });
}

export async function listLessonProgress(userId: number, learnerId: number) {
  await requireLearner(userId, learnerId);
  return db.lessonProgress.findMany({ where: { learnerId } });
}

/** Bắt đầu một lần học bài (chỉ bài đã xuất bản). */
export async function startLessonAttempt(userId: number, learnerId: number, lessonId: number) {
  await requireLearner(userId, learnerId);
  const lesson = await db.lesson.findFirst({ where: { id: lessonId, status: "published" }, select: { id: true } });
  if (!lesson) throw new Error("Không tìm thấy bài học");
  return db.lessonAttempt.create({ data: { learnerId, lessonId } });
}

/** Kết thúc lượt học: ghi kết quả, cập nhật kết quả tốt nhất của bài (số sao cao nhất, số lần học). */
export async function finishLessonAttempt(userId: number, learnerId: number, attemptId: number, input: unknown) {
  await requireLearner(userId, learnerId);
  const result = lessonResultSchema.parse(input);
  const attempt = await db.lessonAttempt.findFirst({ where: { id: attemptId, learnerId } });
  if (!attempt) throw new AttemptAccessError();
  if (attempt.finishedAt) throw new Error("Lượt học đã kết thúc");

  const now = new Date();
  return db.$transaction(async (tx) => {
    const finished = await tx.lessonAttempt.update({ where: { id: attemptId }, data: { ...result, finishedAt: now } });
    const key = { learnerId_lessonId: { learnerId, lessonId: attempt.lessonId } };
    const current = await tx.lessonProgress.findUnique({ where: key });
    const progress = await tx.lessonProgress.upsert({
      where: key,
      create: { learnerId, lessonId: attempt.lessonId, bestStars: result.stars, attempts: 1, completedAt: now },
      update: { bestStars: Math.max(current?.bestStars ?? 0, result.stars), attempts: { increment: 1 }, completedAt: current?.completedAt ?? now },
    });
    return { attempt: finished, progress };
  });
}

// ---- Câu trả lời ----

export async function logAnswer(userId: number, learnerId: number, input: unknown) {
  await requireLearner(userId, learnerId);
  const data = answerLogInputSchema.parse(input);
  if (data.attemptId !== undefined) {
    const attempt = await db.lessonAttempt.findFirst({ where: { id: data.attemptId, learnerId }, select: { id: true } });
    if (!attempt) throw new AttemptAccessError();
  }
  return db.answerLog.create({
    data: {
      learnerId,
      source: data.source,
      questionId: data.questionId ?? null,
      wordId: data.wordId ?? null,
      attemptId: data.attemptId ?? null,
      isCorrect: data.isCorrect,
      answer: data.answer ?? undefined,
      timeMs: data.timeMs ?? null,
    },
  });
}

// ---- Ôn tập lặp lại ----

/** Tạo hoặc cập nhật thẻ ôn tập của một từ hoặc một câu hỏi (mỗi bé một thẻ cho mỗi từ/câu hỏi). */
export async function upsertReviewCard(userId: number, learnerId: number, input: unknown) {
  await requireLearner(userId, learnerId);
  const data = reviewCardInputSchema.parse(input);
  const where = data.wordId !== undefined ? { learnerId_wordId: { learnerId, wordId: data.wordId } } : { learnerId_questionId: { learnerId, questionId: data.questionId! } };
  const fields = { box: data.box, dueOn: data.dueOn, correctCount: data.correctCount, wrongCount: data.wrongCount, lastReviewedAt: new Date() };
  return db.reviewCard.upsert({
    where,
    create: { learnerId, wordId: data.wordId ?? null, questionId: data.questionId ?? null, ...fields },
    update: fields,
  });
}

/** Các thẻ đến hạn ôn tới hết ngày `today`, thẻ cũ nhất trước. */
export async function listDueReviewCards(userId: number, learnerId: number, today: Date) {
  await requireLearner(userId, learnerId);
  return db.reviewCard.findMany({ where: { learnerId, dueOn: { lte: today } }, orderBy: { dueOn: "asc" } });
}

// ---- Phiên học ----

export async function startStudySession(userId: number, learnerId: number) {
  await requireLearner(userId, learnerId);
  return db.studySession.create({ data: { learnerId } });
}

/** Kết thúc phiên học và tính số phút (làm tròn lên, tối thiểu 1 phút nếu phiên có kéo dài). */
export async function endStudySession(userId: number, learnerId: number, sessionId: number) {
  await requireLearner(userId, learnerId);
  const session = await db.studySession.findFirst({ where: { id: sessionId, learnerId } });
  if (!session) throw new AttemptAccessError();
  if (session.endedAt) return session;
  const endedAt = new Date();
  const minutes = Math.max(1, Math.ceil((endedAt.getTime() - session.startedAt.getTime()) / 60000));
  return db.studySession.update({ where: { id: sessionId }, data: { endedAt, minutes } });
}
