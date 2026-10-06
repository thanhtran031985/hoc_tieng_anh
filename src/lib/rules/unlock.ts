// Mở khóa chặng và trùm trên bản đồ (PRD Phần F), hàm thuần không đụng database.
//
// - Các bài thường (`lesson`) của một cấp xếp thành một chuỗi theo (thứ tự chủ đề, thứ tự bài).
//   Bài đầu luôn mở; bài sau mở khi bài trước đạt từ 1 sao.
// - Trận trùm (`unit_test`) của chủ đề mở khi xong mọi bài thường của chủ đề đó. Trùm KHÔNG chặn chủ đề kế.
// - Các loại bài khác (`level_test`, `review`) không nằm trên bản đồ đảo.

export type MapLessonKind = "lesson" | "unit_test" | "level_test" | "review";

/** Một bài của cấp, đã xếp theo (thứ tự chủ đề, thứ tự bài). */
export type MapLesson = { id: number; unitId: number; kind: MapLessonKind };

export type LessonNodeState = "done" | "current" | "locked";
export type BossNodeState = "locked" | "open" | "beaten";
export type LevelStatus = "past" | "current" | "locked";

export type LessonNode = { id: number; unitId: number; kind: "lesson"; state: LessonNodeState; stars: number };
export type BossNode = { id: number; unitId: number; kind: "unit_test"; state: BossNodeState; stars: number };
export type MapNode = LessonNode | BossNode;

export type UnitState = "locked" | "current" | "done";

export type UnitSummary = {
  unitId: number;
  /** Số bài thường của chủ đề (không tính trùm). */
  lessonCount: number;
  doneCount: number;
  /** Tổng sao đã có ở các bài thường và tối đa có thể có (3 mỗi bài). */
  stars: number;
  maxStars: number;
  state: UnitState;
  boss: { id: number; state: BossNodeState; stars: number } | null;
};

const MAX_STARS = 3;

const clampStars = (value: number | undefined) => Math.max(0, Math.min(MAX_STARS, Math.trunc(value ?? 0)));

/** Trạng thái của từng chặng và trùm trên bản đồ, theo đúng thứ tự đầu vào (bỏ qua bài không thuộc bản đồ). */
export function computeLessonStates(lessons: readonly MapLesson[], bestStars: ReadonlyMap<number, number>): MapNode[] {
  const perUnit = new Map<number, { total: number; done: number }>();
  for (const lesson of lessons) {
    if (lesson.kind !== "lesson") continue;
    const count = perUnit.get(lesson.unitId) ?? { total: 0, done: 0 };
    count.total += 1;
    if (clampStars(bestStars.get(lesson.id)) >= 1) count.done += 1;
    perUnit.set(lesson.unitId, count);
  }

  const nodes: MapNode[] = [];
  let currentTaken = false;
  for (const lesson of lessons) {
    const stars = clampStars(bestStars.get(lesson.id));
    if (lesson.kind === "lesson") {
      let state: LessonNodeState = "locked";
      if (stars >= 1) state = "done";
      else if (!currentTaken) {
        state = "current";
        currentTaken = true;
      }
      nodes.push({ id: lesson.id, unitId: lesson.unitId, kind: "lesson", state, stars });
    } else if (lesson.kind === "unit_test") {
      const count = perUnit.get(lesson.unitId);
      const unlocked = count !== undefined && count.total > 0 && count.done === count.total;
      const state: BossNodeState = stars >= 1 ? "beaten" : unlocked ? "open" : "locked";
      nodes.push({ id: lesson.id, unitId: lesson.unitId, kind: "unit_test", state, stars });
    }
  }
  return nodes;
}

/** Tổng hợp theo chủ đề (vùng) cho nhãn vùng trên bản đồ và thẻ tiến độ ở trang chủ, theo thứ tự chủ đề xuất hiện. */
export function summarizeUnits(nodes: readonly MapNode[]): UnitSummary[] {
  const byUnit = new Map<number, UnitSummary>();
  for (const node of nodes) {
    let summary = byUnit.get(node.unitId);
    if (!summary) {
      summary = { unitId: node.unitId, lessonCount: 0, doneCount: 0, stars: 0, maxStars: 0, state: "locked", boss: null };
      byUnit.set(node.unitId, summary);
    }
    if (node.kind === "lesson") {
      summary.lessonCount += 1;
      summary.maxStars += MAX_STARS;
      summary.stars += node.stars;
      if (node.state === "done") summary.doneCount += 1;
      if (node.state === "current" && summary.state === "locked") summary.state = "current";
    } else {
      summary.boss = { id: node.id, state: node.state, stars: node.stars };
    }
  }
  for (const summary of byUnit.values()) {
    if (summary.lessonCount > 0 && summary.doneCount === summary.lessonCount) summary.state = "done";
    else if (summary.doneCount > 0 && summary.state === "locked") summary.state = "current";
  }
  return [...byUnit.values()];
}

/**
 * Bài tiếp theo cho nút "Học tiếp": chặng đang học; hết chặng thì trùm đang mở chưa thắng; xong hết thì null.
 */
export function findNextLesson(nodes: readonly MapNode[]): MapNode | null {
  return nodes.find((n) => n.kind === "lesson" && n.state === "current") ?? nodes.find((n) => n.kind === "unit_test" && n.state === "open") ?? null;
}

/**
 * Cấp trên bản tổng quan so với cấp hiện tại của bé: nhỏ hơn là đã qua, bằng là đang học, lớn hơn là còn khóa.
 * Chưa có cấp hiện tại (bé chưa khai báo lớp) thì bắt đầu ở cấp 1.
 */
export function levelStatus(levelNumber: number, currentLevelNumber: number | null): LevelStatus {
  const current = currentLevelNumber ?? 1;
  if (levelNumber < current) return "past";
  if (levelNumber === current) return "current";
  return "locked";
}
