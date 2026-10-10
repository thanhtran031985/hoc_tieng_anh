// Cổng thi lên cấp ở cuối đường đảo (PRD Phần F), hàm thuần không đụng database.
//
// - Cổng mở khi MỌI chủ đề (vùng) của cấp đã xong các bài thường (mỗi bài ≥ 1 sao). Trận trùm không bắt buộc (khớp `unlock.ts`: trùm không chặn chủ đề kế).
// - Cấp chưa có chủ đề nào thì cổng vẫn khóa.
// - Bài thi lên cấp có ở cấp 1–5 (cấp 5 → 6 chỉ mở màn chúc mừng, cấp 6 ghi “Sắp có”); cấp trên không có cổng.

/** Cấp cuối cùng có bài thi lên cấp (các cấp sau thuộc giai đoạn sau). */
export const EXAM_LAST_LEVEL = 5;

export type GateUnitInput = { id: number; titleVi: string; lessonCount: number; doneCount: number };

export type GateUnit = { id: number; titleVi: string; done: boolean; /** Số bài thường còn thiếu (chưa được sao nào). */ remaining: number };

export type LevelGateState = {
  status: "locked" | "open";
  /** Số vùng chưa xong. */
  left: number;
  units: GateUnit[];
};

/** Cấp này có bài thi lên cấp không. */
export const hasLevelExam = (levelNumber: number) => levelNumber >= 1 && levelNumber <= EXAM_LAST_LEVEL;

export function levelGateState(units: readonly GateUnitInput[]): LevelGateState {
  const rows: GateUnit[] = units.map((u) => {
    const remaining = Math.max(0, u.lessonCount - u.doneCount);
    return { id: u.id, titleVi: u.titleVi, done: remaining === 0, remaining };
  });
  const left = rows.filter((r) => !r.done).length;
  return { status: rows.length > 0 && left === 0 ? "open" : "locked", left, units: rows };
}

/** Cấp kế tiếp gọi là “đảo” (cấp 1–5) hay “thành phố” (cấp 6–10), cùng cách gọi với tên màn bản đồ. */
export const placeWord = (levelNumber: number) => (levelNumber <= 5 ? "đảo" : "thành phố");
