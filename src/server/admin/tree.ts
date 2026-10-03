import { addLessonSchema, addUnitSchema, deleteNodeSchema, reorderSchema, targetWordsSchema, updateLessonSchema, updateLevelSchema, updateStageSchema, updateUnitSchema } from "@/lib/schemas/admin-tree";
import { lessonPublishBlock, sameIdSet, slugify, uniqueSlug, unitPublishBlock } from "@/lib/rules/admin-tree";
import { db } from "../db";
import { fail, firstIssue, type AdminResult } from "./result";

// Cây lộ trình quản trị (Adult09): đọc cả cây Chặng → Cấp → Chủ đề → Bài học và các thao tác sửa, thêm, xóa, sắp xếp.
// Mọi hàm ghi kiểm Zod ở đây; server action (`features/admin/tree-actions.ts`) gọi `requireAdmin()` trước khi vào.

export type TreeLesson = { id: number; title: string; status: "draft" | "published"; minutes: number; steps: number; words: number; questions: number };
export type TreeUnit = {
  id: number;
  title: string;
  titleVi: string;
  source: string | null;
  status: "planned" | "draft" | "published";
  /** Số từ mục tiêu trong khung chương trình. */
  targetWords: number;
  lessons: TreeLesson[];
};
export type TreeLevel = { id: number; number: number; name: string; units: TreeUnit[] };
export type TreeStage = { id: number; name: string; levels: TreeLevel[] };
export type TreeData = { stages: TreeStage[] };

export type TreeResult = AdminResult;

export async function getTree(): Promise<TreeData> {
  const stages = await db.stage.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      levels: {
        orderBy: { number: "asc" },
        select: {
          id: true,
          number: true,
          name: true,
          units: {
            orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            select: {
              id: true,
              title: true,
              titleVi: true,
              source: true,
              status: true,
              targetWords: true,
              lessons: {
                orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
                select: { id: true, title: true, status: true, minutes: true, steps: { select: { wordId: true, questionId: true } } },
              },
            },
          },
        },
      },
    },
  });

  const distinct = (values: (number | null)[]) => new Set(values.filter((v): v is number => v !== null)).size;
  return {
    stages: stages.map((stage) => ({
      id: stage.id,
      name: stage.name,
      levels: stage.levels.map((level) => ({
        id: level.id,
        number: level.number,
        name: level.name,
        units: level.units.map((unit) => ({
          id: unit.id,
          title: unit.title,
          titleVi: unit.titleVi,
          source: unit.source,
          status: unit.status,
          targetWords: Array.isArray(unit.targetWords) ? unit.targetWords.length : 0,
          lessons: unit.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            status: lesson.status === "published" ? "published" : "draft",
            minutes: lesson.minutes,
            steps: lesson.steps.length,
            words: distinct(lesson.steps.map((s) => s.wordId)),
            questions: distinct(lesson.steps.map((s) => s.questionId)),
          })),
        })),
      })),
    })),
  };
}

export type TargetWordRow = { n: number; word: string; inBank: boolean; bankLevel: number | null };

/** Từ mục tiêu của một chủ đề khung kèm trạng thái "đã có trong ngân hàng từ" (khớp không phân biệt hoa thường). */
export async function getTargetWords(input: unknown): Promise<TargetWordRow[] | null> {
  const parsed = targetWordsSchema.safeParse(input);
  if (!parsed.success) return null;
  const unit = await db.unit.findUnique({ where: { id: parsed.data.unitId }, select: { targetWords: true } });
  if (!unit) return null;
  const targets = Array.isArray(unit.targetWords) ? unit.targetWords.filter((w): w is string => typeof w === "string") : [];
  if (targets.length === 0) return [];
  const found = await db.word.findMany({ where: { word: { in: targets } }, select: { word: true, level: { select: { number: true } } }, orderBy: { id: "asc" } });
  const bank = new Map<string, number>();
  for (const w of found) if (!bank.has(w.word.toLowerCase())) bank.set(w.word.toLowerCase(), w.level.number);
  return targets.map((word, i) => ({ n: i + 1, word, inBank: bank.has(word.toLowerCase()), bankLevel: bank.get(word.toLowerCase()) ?? null }));
}

export async function updateStage(input: unknown): Promise<TreeResult> {
  const parsed = updateStageSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { id, name } = parsed.data;
  if (await db.stage.findFirst({ where: { name, NOT: { id } }, select: { id: true } })) return fail("Đã có chặng cùng tên.", "name");
  const result = await db.stage.updateMany({ where: { id }, data: { name } });
  return result.count ? { ok: true } : fail("Không tìm thấy chặng này nữa.");
}

export async function updateLevel(input: unknown): Promise<TreeResult> {
  const parsed = updateLevelSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const result = await db.level.updateMany({ where: { id: parsed.data.id }, data: { name: parsed.data.name } });
  return result.count ? { ok: true } : fail("Không tìm thấy cấp này nữa.");
}

async function nextSort(where: { levelId: number } | { unitId: number }, kind: "unit" | "lesson"): Promise<number> {
  const last =
    kind === "unit"
      ? await db.unit.aggregate({ where: where as { levelId: number }, _max: { sortOrder: true } })
      : await db.lesson.aggregate({ where: where as { unitId: number }, _max: { sortOrder: true } });
  return (last._max.sortOrder ?? 0) + 1;
}

export async function updateUnit(input: unknown): Promise<TreeResult> {
  const parsed = updateUnitSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { id, levelId, status, source, ...names } = parsed.data;
  const unit = await db.unit.findUnique({ where: { id }, select: { levelId: true, status: true, _count: { select: { lessons: true } } } });
  if (!unit) return fail("Không tìm thấy chủ đề này nữa.");
  if (unit.status === "planned") return fail("Chủ đề trong khung chương trình chưa có bài nên chưa sửa ở đây.");
  if (status === "published") {
    const block = unitPublishBlock(unit._count.lessons);
    if (block) return fail(block, "status");
  }
  if (!(await db.level.findUnique({ where: { id: levelId }, select: { id: true } }))) return fail("Không tìm thấy cấp này.", "levelId");

  const data: { title: string; titleVi: string; source: string | null; status: "draft" | "published"; levelId?: number; slug?: string; sortOrder?: number } = { ...names, source: source || null, status };
  if (levelId !== unit.levelId) {
    // Sang cấp khác: khóa chủ đề phải không trùng trong cấp mới, và đứng cuối danh sách.
    const siblings = await db.unit.findMany({ where: { levelId }, select: { slug: true, title: true } });
    if (siblings.some((s) => s.title.toLowerCase() === names.title.toLowerCase())) return fail("Cấp này đã có chủ đề cùng tên.", "levelId");
    data.levelId = levelId;
    data.slug = uniqueSlug(slugify(names.title), new Set(siblings.map((s) => s.slug)));
    data.sortOrder = await nextSort({ levelId }, "unit");
  }
  await db.unit.update({ where: { id }, data });
  return { ok: true };
}

export async function updateLesson(input: unknown): Promise<TreeResult> {
  const parsed = updateLessonSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { id, ...data } = parsed.data;
  const lesson = await db.lesson.findUnique({ where: { id }, select: { id: true, steps: { select: { activityType: true } } } });
  if (!lesson) return fail("Không tìm thấy bài học này nữa.");
  if (data.status === "published") {
    const block = lessonPublishBlock(lesson.steps.length, lesson.steps.filter((s) => s.activityType !== "word_card").length);
    if (block) return fail(block, "status");
  }
  await db.lesson.update({ where: { id }, data });
  return { ok: true };
}

export async function addUnit(input: unknown): Promise<TreeResult> {
  const parsed = addUnitSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { levelId, title, titleVi } = parsed.data;
  if (!(await db.level.findUnique({ where: { id: levelId }, select: { id: true } }))) return fail("Không tìm thấy cấp này.");
  const siblings = await db.unit.findMany({ where: { levelId }, select: { slug: true, title: true } });
  if (siblings.some((s) => s.title.toLowerCase() === title.toLowerCase())) return fail("Đã có chủ đề cùng tên trong cấp này.", "title");
  const unit = await db.unit.create({
    data: { levelId, title, titleVi, slug: uniqueSlug(slugify(title), new Set(siblings.map((s) => s.slug))), sortOrder: await nextSort({ levelId }, "unit"), status: "draft" },
    select: { id: true },
  });
  return { ok: true, id: unit.id };
}

export async function addLesson(input: unknown): Promise<TreeResult> {
  const parsed = addLessonSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { unitId, title } = parsed.data;
  const unit = await db.unit.findUnique({ where: { id: unitId }, select: { status: true, lessons: { select: { title: true } } } });
  if (!unit) return fail("Không tìm thấy chủ đề này nữa.");
  if (unit.lessons.some((l) => l.title.toLowerCase() === title.toLowerCase())) return fail("Đã có bài cùng tên trong chủ đề này.", "title");
  const sortOrder = await nextSort({ unitId }, "lesson");
  const lesson = await db.$transaction(async (tx) => {
    // Chủ đề khung có bài đầu tiên thì thành chủ đề nháp.
    if (unit.status === "planned") await tx.unit.update({ where: { id: unitId }, data: { status: "draft" } });
    return tx.lesson.create({ data: { unitId, title, sortOrder, status: "draft" }, select: { id: true } });
  });
  return { ok: true, id: lesson.id };
}

/** Lưu thứ tự mới của một nhóm anh em: danh sách id phải đúng bằng tập hiện có trong nhóm. */
export async function reorder(input: unknown): Promise<TreeResult> {
  const parsed = reorderSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { kind, parentId, ids } = parsed.data;
  const current =
    kind === "unit"
      ? await db.unit.findMany({ where: { levelId: parentId }, select: { id: true } })
      : await db.lesson.findMany({ where: { unitId: parentId }, select: { id: true } });
  if (!sameIdSet(ids, current.map((row) => row.id))) return fail("Danh sách đã thay đổi. Hãy tải lại trang rồi sắp xếp lại.");
  await db.$transaction(
    ids.map((id, index) => (kind === "unit" ? db.unit.update({ where: { id }, data: { sortOrder: index + 1 } }) : db.lesson.update({ where: { id }, data: { sortOrder: index + 1 } }))),
  );
  return { ok: true };
}

/** Xóa hẳn một chủ đề hoặc bài học. Từ chối nếu đã có học sinh học (giữ tiến độ) hoặc là chủ đề của khung chương trình. */
export async function deleteNode(input: unknown): Promise<TreeResult> {
  const parsed = deleteNodeSchema.safeParse(input);
  if (!parsed.success) return firstIssue(parsed.error);
  const { kind, id } = parsed.data;
  const inUse = "Đã có học sinh học mục này nên chưa xóa được. Hãy chuyển về Nháp để ẩn khỏi học sinh.";

  if (kind === "lesson") {
    const lesson = await db.lesson.findUnique({ where: { id }, select: { unitId: true, _count: { select: { progress: true, attempts: true } } } });
    if (!lesson) return fail("Không tìm thấy bài học này nữa.");
    if (lesson._count.progress + lesson._count.attempts > 0) return fail(inUse);
    await db.$transaction(async (tx) => {
      await tx.lesson.delete({ where: { id } });
      // Chủ đề đang xuất bản mà hết bài thì về Nháp (không có chủ đề trống đã xuất bản).
      if ((await tx.lesson.count({ where: { unitId: lesson.unitId } })) === 0) await tx.unit.updateMany({ where: { id: lesson.unitId, status: "published" }, data: { status: "draft" } });
    });
    return { ok: true };
  }

  const unit = await db.unit.findUnique({ where: { id }, select: { status: true, lessons: { select: { _count: { select: { progress: true, attempts: true } } } } } });
  if (!unit) return fail("Không tìm thấy chủ đề này nữa.");
  if (unit.status === "planned") return fail("Chủ đề trong khung chương trình không xóa ở đây.");
  if (unit.lessons.some((l) => l._count.progress + l._count.attempts > 0)) return fail(inUse);
  await db.unit.delete({ where: { id } });
  return { ok: true };
}
