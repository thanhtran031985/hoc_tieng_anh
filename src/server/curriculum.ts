import { parseLessonStepConfig, parseQuestionData } from "@/lib/schemas";
import { db } from "./db";

// Đọc lộ trình: chặng → cấp → chủ đề → bài → bước. Dữ liệu này dùng chung, không thuộc riêng học sinh nào,
// nên các hàm ở đây không cần `userId`. Học sinh chỉ thấy nội dung đã xuất bản (`publishedOnly`, mặc định bật).

type Options = { publishedOnly?: boolean };

const statusFilter = ({ publishedOnly = true }: Options) => (publishedOnly ? { status: "published" as const } : {});

/** 4 chặng, mỗi chặng kèm các cấp theo thứ tự. */
export function listStages() {
  return db.stage.findMany({
    orderBy: { sortOrder: "asc" },
    include: { levels: { orderBy: { number: "asc" } } },
  });
}

/** 10 cấp (số và tên) theo thứ tự. */
export function listLevels() {
  return db.level.findMany({ select: { number: true, name: true }, orderBy: { number: "asc" } });
}

export function getLevelByNumber(number: number) {
  return db.level.findUnique({ where: { number } });
}

export function listUnits(levelId: number, options: Options = {}) {
  return db.unit.findMany({ where: { levelId, ...statusFilter(options) }, orderBy: { sortOrder: "asc" } });
}

export function listLessons(unitId: number, options: Options = {}) {
  return db.lesson.findMany({ where: { unitId, ...statusFilter(options) }, orderBy: { sortOrder: "asc" } });
}

/** Bài học kèm các bước theo thứ tự; mỗi bước có cấu hình và câu hỏi đã kiểm bằng Zod (null nếu dữ liệu sai). */
export async function getLessonWithSteps(lessonId: number, options: Options = {}) {
  const lesson = await db.lesson.findFirst({
    where: { id: lessonId, ...statusFilter(options) },
    include: { steps: { orderBy: { sortOrder: "asc" }, include: { word: true, question: true } } },
  });
  if (!lesson) return null;
  return {
    ...lesson,
    steps: lesson.steps.map((step) => ({
      ...step,
      config: parseLessonStepConfig(step.activityType, step.config),
      questionData: step.question
        ? parseQuestionData(step.question.type, { prompt: step.question.prompt, options: step.question.options, answer: step.question.answer })
        : null,
    })),
  };
}
