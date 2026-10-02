// Bài xếp lớp thích ứng cho Tiểu học (PRD C4, Phần F), hàm thuần không đụng database.
// Bắt đầu ở cấp theo lớp, đúng 3 câu liên tiếp thì lên một cấp, sai 2 câu liên tiếp thì xuống một cấp; xong 12 câu thì đề xuất cấp.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).

export const PLACEMENT_QUESTIONS = 12;
/** Số câu đúng liên tiếp để lên một cấp. */
export const PROMOTE_RUN = 3;
/** Số câu sai liên tiếp để xuống một cấp ("Tớ chưa biết" tính là sai). */
export const DEMOTE_RUN = 2;
/** Cấp được đề xuất phải đúng từ mức này. */
export const PASS_RATIO = 0.7;
/** Cấp chỉ được xét khi bé có ít nhất chừng này câu ở cấp đó. */
export const MIN_ANSWERS_FOR_LEVEL = 2;

export type PlacementAnswer = { level: number; correct: boolean };

export type PlacementState = {
  /** Cấp của câu hỏi kế tiếp. */
  level: number;
  rightRun: number;
  wrongRun: number;
  answers: PlacementAnswer[];
};

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/** Cấp bắt đầu: bằng lớp, nhưng không vượt cấp cao nhất đã có nội dung. */
export function startLevel(grade: number, maxLevel: number): number {
  return clamp(Math.round(grade), 1, Math.max(1, maxLevel));
}

export function createPlacement(grade: number, maxLevel: number): PlacementState {
  return { level: startLevel(grade, maxLevel), rightRun: 0, wrongRun: 0, answers: [] };
}

/** Trạng thái sau một câu trả lời. Đổi cấp thì đếm lại chuỗi từ 0; ở cấp biên thì chuỗi cũng được đếm lại. */
export function answerPlacement(state: PlacementState, correct: boolean, maxLevel: number): PlacementState {
  const answers = [...state.answers, { level: state.level, correct }];
  let rightRun = correct ? state.rightRun + 1 : 0;
  let wrongRun = correct ? 0 : state.wrongRun + 1;
  let level = state.level;
  if (rightRun >= PROMOTE_RUN) {
    level = Math.min(Math.max(1, maxLevel), level + 1);
    rightRun = 0;
  } else if (wrongRun >= DEMOTE_RUN) {
    level = Math.max(1, level - 1);
    wrongRun = 0;
  }
  return { level, rightRun, wrongRun, answers };
}

export const isPlacementDone = (state: PlacementState) => state.answers.length >= PLACEMENT_QUESTIONS;

/**
 * Cấp đề xuất: cấp cao nhất bé làm đúng từ 70% (xét cấp có ít nhất 2 câu). Không cấp nào đạt thì cấp thấp nhất bé đã gặp.
 * Không có câu nào thì trả về `fallback`.
 */
export function suggestLevel(answers: readonly PlacementAnswer[], maxLevel: number, fallback: number): number {
  if (answers.length === 0) return clamp(fallback, 1, Math.max(1, maxLevel));
  const byLevel = new Map<number, { total: number; right: number }>();
  for (const a of answers) {
    const entry = byLevel.get(a.level) ?? { total: 0, right: 0 };
    entry.total += 1;
    if (a.correct) entry.right += 1;
    byLevel.set(a.level, entry);
  }
  let best = 0;
  for (const [level, { total, right }] of byLevel) {
    if (total >= MIN_ANSWERS_FOR_LEVEL && right / total >= PASS_RATIO && level > best) best = level;
  }
  if (best === 0) best = Math.min(...byLevel.keys());
  return clamp(best, 1, Math.max(1, maxLevel));
}

const joinList = (items: readonly string[]) => (items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} và ${items[items.length - 1]}`);

/** Nhận xét ngắn ở màn kết quả (không nói điểm hay số câu đúng). */
export function placementComment(name: string, strong: readonly string[], weak: readonly string[], levelLabel: string): string {
  if (strong.length > 0 && weak.length > 0) {
    return `${name} nhận ra ${joinList(strong)} rất nhanh. ${joinList(weak)} còn hơi mới — mình bắt đầu ở ${levelLabel} để học thật chắc nhé!`;
  }
  if (strong.length > 0) return `${name} nhận ra ${joinList(strong)} rất nhanh! Mình bắt đầu ở ${levelLabel} để học tiếp nhé!`;
  return `Mọi thứ còn khá mới với ${name}. Mình bắt đầu ở ${levelLabel} để học thật chắc nhé!`;
}
