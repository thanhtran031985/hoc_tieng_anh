import { APP_TIME_ZONE } from "@/lib/rules/dates";
import { computeLessonStates, levelStatus, manualLessonIds, type MapLesson } from "@/lib/rules/unlock";
import { unlockInputSchema, type UnlockTarget } from "@/lib/schemas";
import { db } from "./db";
import { requireLearner } from "./learners";
import { getManualUnlocks } from "./manual-unlock";

// Tiến độ của con và mở khóa thủ công cho bố mẹ (Adult17). Mọi hàm nhận `userId` (tài khoản đã mở khóa khu bố mẹ) và chỉ làm việc với
// hồ sơ thuộc tài khoản đó (`requireLearner`).

export type ProgressState = "done" | "current" | "locked" | "manual";

export type ProgressLesson = { id: number; kind: "lesson" | "unit_test"; title: string; ordinal: number | null; state: ProgressState; stars: number };

export type ProgressUnit = {
  id: number;
  title: string;
  titleVi: string;
  state: ProgressState;
  doneCount: number;
  lessonCount: number;
  /** Còn bài khóa chưa được mở thủ công (có thể “Mở cả chủ đề”). */
  canUnlock: boolean;
  lessons: ProgressLesson[];
};

export type ProgressLevel = {
  id: number;
  number: number;
  name: string;
  /** Trạng thái của cấp: đã qua, đang học, mở thủ công hoặc khóa (xem `levelStatus`). */
  state: "past" | "current" | "manual" | "locked";
  hasContent: boolean;
  canUnlock: boolean;
  units: ProgressUnit[];
};

export type UnlockHistoryItem = { id: number; kind: "level" | "unit" | "lesson"; label: string; by: string; when: string };

export type ProgressData = {
  kid: { id: number; name: string; grade: number | null; levelNumber: number; levelName: string };
  levels: ProgressLevel[];
  totals: { done: number; locked: number };
  history: UnlockHistoryItem[];
};

const dateFormat = new Intl.DateTimeFormat("vi-VN", { timeZone: APP_TIME_ZONE, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
const HISTORY_LIMIT = 20;

export async function getProgressTree(userId: number, learnerId: number): Promise<ProgressData> {
  const learner = await requireLearner(userId, learnerId);
  const currentLevel = learner.currentLevel?.number ?? 1;
  const [levels, progress, manual] = await Promise.all([
    db.level.findMany({
      orderBy: { number: "asc" },
      select: {
        id: true,
        number: true,
        name: true,
        units: {
          where: { status: "published" },
          orderBy: { sortOrder: "asc" },
          select: { id: true, title: true, titleVi: true, lessons: { where: { status: "published", kind: { in: ["lesson", "unit_test"] } }, orderBy: { sortOrder: "asc" }, select: { id: true, kind: true, title: true } } },
        },
      },
    }),
    db.lessonProgress.findMany({ where: { learnerId }, select: { lessonId: true, bestStars: true } }),
    getManualUnlocks(learnerId),
  ]);
  const bestStars = new Map(progress.map((p) => [p.lessonId, p.bestStars]));

  let done = 0;
  let locked = 0;
  const out: ProgressLevel[] = levels.map((level) => {
    const mapLessons: MapLesson[] = level.units.flatMap((u) => u.lessons.map((l) => ({ id: l.id, unitId: u.id, kind: l.kind as MapLesson["kind"] })));
    const opened = manualLessonIds(mapLessons, level.id, manual);
    const natural = computeLessonStates(mapLessons, bestStars);
    const base = new Map(natural.map((n) => [n.id, n]));
    const status = levelStatus(level.number, currentLevel);
    // Cấp còn khóa theo quy tắc thường: mọi bài khóa trừ bài được mở thủ công.
    const gated = status === "locked" && !manual.levels.has(level.id);

    const units: ProgressUnit[] = level.units.map((unit) => {
      let ordinal = 0;
      const lessons: ProgressLesson[] = unit.lessons.flatMap((l) => {
        const node = base.get(l.id);
        if (!node) return [];
        const stars = node.stars;
        const finished = node.kind === "lesson" ? node.state === "done" : node.state === "beaten";
        const playable = node.kind === "lesson" ? node.state === "current" : node.state === "open";
        // Đã xong; đang chơi được theo quy tắc thường; được bố mẹ mở thủ công; còn lại là khóa.
        const state: ProgressState = finished ? "done" : playable && !gated ? "current" : opened.has(l.id) ? "manual" : "locked";
        return [{ id: l.id, kind: node.kind, title: l.title, ordinal: node.kind === "lesson" ? ++ordinal : null, state, stars }];
      });
      const normal = lessons.filter((l) => l.kind === "lesson");
      const doneCount = normal.filter((l) => l.state === "done").length;
      const allDone = normal.length > 0 && doneCount === normal.length;
      const wholeOpen = manual.units.has(unit.id) || manual.levels.has(level.id);
      const state: ProgressState = allDone ? "done" : wholeOpen ? "manual" : lessons.some((l) => l.state === "current") ? "current" : "locked";
      return {
        id: unit.id,
        title: unit.title,
        titleVi: unit.titleVi,
        state,
        doneCount,
        lessonCount: normal.length,
        canUnlock: lessons.some((l) => l.state === "locked"),
        lessons,
      };
    });
    for (const u of units) for (const l of u.lessons) {
      if (l.kind === "lesson" && l.state === "done") done += 1;
      if (l.kind === "lesson" && l.state === "locked") locked += 1;
    }
    const state: ProgressLevel["state"] = status === "past" ? "past" : status === "current" ? "current" : manual.accessLevels.has(level.id) ? "manual" : "locked";
    return { id: level.id, number: level.number, name: level.name, state, hasContent: units.length > 0, canUnlock: state === "locked" && units.length > 0, units };
  });

  // Lịch sử: tên mục được mở (cấp, chủ đề hoặc bài) và người mở.
  const rows = await db.manualUnlock.findMany({ where: { learnerId }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: HISTORY_LIMIT, select: { id: true, targetType: true, targetId: true, createdAt: true, user: { select: { name: true } } } });
  const ids = (type: string) => rows.filter((r) => r.targetType === type).map((r) => r.targetId);
  const [lv, un, ls] = await Promise.all([
    db.level.findMany({ where: { id: { in: ids("level") } }, select: { id: true, number: true, name: true } }),
    db.unit.findMany({ where: { id: { in: ids("unit") } }, select: { id: true, titleVi: true } }),
    db.lesson.findMany({ where: { id: { in: ids("lesson") } }, select: { id: true, title: true, unit: { select: { titleVi: true } } } }),
  ]);
  const label = (r: (typeof rows)[number]): string => {
    if (r.targetType === "level") {
      const x = lv.find((l) => l.id === r.targetId);
      return x ? `cả cấp ${x.number} · ${x.name}` : "một cấp đã xóa";
    }
    if (r.targetType === "unit") {
      const x = un.find((u) => u.id === r.targetId);
      return x ? `chủ đề “${x.titleVi}”` : "một chủ đề đã xóa";
    }
    const x = ls.find((l) => l.id === r.targetId);
    return x ? `“${x.title} · ${x.unit.titleVi}”` : "một bài đã xóa";
  };
  const history: UnlockHistoryItem[] = rows.map((r) => ({ id: r.id, kind: r.targetType, label: label(r), by: r.user.name, when: dateFormat.format(r.createdAt) }));

  const currentInfo = levels.find((l) => l.number === currentLevel);
  return {
    kid: { id: learner.id, name: learner.name, grade: learner.schoolGrade, levelNumber: currentLevel, levelName: currentInfo?.name ?? learner.currentLevel?.name ?? "" },
    levels: out,
    totals: { done, locked },
    history,
  };
}

export type UnlockResult = { ok: true; added: number } | { ok: false; message: string };

/**
 * Mở khóa thủ công các mục đã chọn cho một bé của tài khoản đang đăng nhập. Mỗi mục phải tồn tại và đã xuất bản (cấp có chủ đề đã xuất bản);
 * mục đã mở trước đó bị bỏ qua (không nhân đôi). Trả về số mục mới được mở.
 */
export async function unlockTargets(userId: number, input: unknown): Promise<UnlockResult> {
  const parsed = unlockInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Thông tin chưa hợp lệ." };
  const { learnerId, targets } = parsed.data;
  await requireLearner(userId, learnerId);

  const unique = [...new Map(targets.map((t) => [`${t.type}:${t.id}`, t])).values()];
  const idsOf = (type: UnlockTarget["type"]) => unique.filter((t) => t.type === type).map((t) => t.id);
  const [levels, units, lessons] = await Promise.all([
    db.level.findMany({ where: { id: { in: idsOf("level") }, units: { some: { status: "published" } } }, select: { id: true } }),
    db.unit.findMany({ where: { id: { in: idsOf("unit") }, status: "published" }, select: { id: true } }),
    db.lesson.findMany({ where: { id: { in: idsOf("lesson") }, status: "published", kind: { in: ["lesson", "unit_test"] }, unit: { status: "published" } }, select: { id: true } }),
  ]);
  const valid = new Set([...levels.map((l) => `level:${l.id}`), ...units.map((u) => `unit:${u.id}`), ...lessons.map((l) => `lesson:${l.id}`)]);
  if (unique.some((t) => !valid.has(`${t.type}:${t.id}`))) return { ok: false, message: "Có mục không còn tồn tại hoặc chưa mở cho học. Tải lại trang rồi chọn lại nhé." };

  const created = await db.manualUnlock.createMany({ data: unique.map((t) => ({ learnerId, targetType: t.type, targetId: t.id, unlockedBy: userId })), skipDuplicates: true });
  return { ok: true, added: created.count };
}
