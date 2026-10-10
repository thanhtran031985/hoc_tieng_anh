// Bài thi lên cấp (PRD Phần F), hàm thuần không đụng database.
//
// - Mỗi lượt thi gồm 20 câu lấy từ các bước câu hỏi của mọi chủ đề của cấp: cân bằng giữa các chủ đề (xoay vòng), không trùng từ/câu hỏi, trộn dạng bài.
// - Câu tính điểm khi đúng ngay lần đầu; đạt khi đúng từ 80% (16/20). Câu sai vẫn được làm lại trong lúc thi để học nhưng không tính điểm.
// - Chưa đạt: ghi lại tối đa 3 chủ đề sai nhiều nhất; muốn thi lại, bé phải hoàn thành ít nhất một bài của một chủ đề trong số đó sau lần thi ấy.
import { seededRandom, shuffled } from "./random.ts";

export const EXAM_QUESTION_COUNT = 20;
export const EXAM_PASS_PERCENT = 80;
/** Số chủ đề gợi ý ôn khi chưa đạt. */
export const EXAM_MAX_WEAK = 3;

/** Dạng bước dùng được làm câu thi: mỗi bước chấm đúng một mục, không cần micro, không phải trò chơi hay truyện. */
export const EXAM_STEP_KINDS = ["listen_choose_picture", "choose_word_for_picture", "fill_blank", "sentence_order", "phonics", "dictation"] as const;

export const isExamStepKind = (kind: string): boolean => (EXAM_STEP_KINDS as readonly string[]).includes(kind);

/** Số câu đúng ngay lần đầu tối thiểu để đạt (làm tròn lên: 80% của 20 câu là 16). */
export const passScore = (total: number, percent: number = EXAM_PASS_PERCENT): number => Math.ceil((total * percent) / 100);

export type ExamCandidate = {
  /** Mã bước bài học (`lesson_steps.id`). */
  stepId: number;
  unitId: number;
  kind: string;
  /** Khóa để không chọn hai câu cùng từ hoặc cùng câu hỏi: `w<id>` hay `q<id>`. */
  key: string;
};

export type ExamItem = { stepId: number; unitId: number };

/** Xếp xen kẽ theo dạng bài (mỗi lượt lấy một câu của mỗi dạng) để các câu đầu của chủ đề đã trộn dạng. */
function interleaveByKind(list: readonly ExamCandidate[], random: () => number): ExamCandidate[] {
  const groups = new Map<string, ExamCandidate[]>();
  for (const c of list) groups.set(c.kind, [...(groups.get(c.kind) ?? []), c]);
  const queues = shuffled([...groups.keys()].sort(), random).map((kind) => groups.get(kind)!);
  const out: ExamCandidate[] = [];
  while (queues.some((q) => q.length > 0)) for (const q of queues) if (q.length > 0) out.push(q.shift()!);
  return out;
}

/**
 * Chọn `count` câu cho một lượt thi, cùng hạt giống cho cùng kết quả. Các chủ đề được xoay vòng nên số câu mỗi chủ đề chênh nhau tối đa 1
 * (chủ đề thiếu câu thì nhường chỗ cho chủ đề khác); chỉ trả ít hơn `count` khi cả cấp không đủ câu khác nhau.
 */
export function selectExamItems(candidates: readonly ExamCandidate[], seed: string, count: number = EXAM_QUESTION_COUNT): ExamItem[] {
  const random = seededRandom(seed);
  const byUnit = new Map<number, ExamCandidate[]>();
  for (const c of candidates) if (isExamStepKind(c.kind)) byUnit.set(c.unitId, [...(byUnit.get(c.unitId) ?? []), c]);
  const unitIds = shuffled([...byUnit.keys()].sort((a, b) => a - b), random);
  const queues = unitIds.map((id) => interleaveByKind(shuffled(byUnit.get(id)!, random), random));

  const used = new Set<string>();
  const picked: ExamCandidate[] = [];
  let progressed = true;
  while (picked.length < count && progressed) {
    progressed = false;
    for (const queue of queues) {
      if (picked.length >= count) break;
      while (queue.length > 0) {
        const next = queue.shift()!;
        if (used.has(next.key)) continue;
        used.add(next.key);
        picked.push(next);
        progressed = true;
        break;
      }
    }
  }
  return shuffled(picked, random).map(({ stepId, unitId }) => ({ stepId, unitId }));
}

export type ExamAnswer = { stepId: number; correct: boolean };

export type ExamGrade = { score: number; total: number; passScore: number; percent: number; passed: boolean; answers: ExamAnswer[] };

/** Chấm theo bộ câu đã chọn: câu không có kết quả nộp lên coi là chưa đúng. */
export function gradeExam(items: readonly ExamItem[], correctSteps: ReadonlySet<number>, percent: number = EXAM_PASS_PERCENT): ExamGrade {
  const answers = items.map((i) => ({ stepId: i.stepId, correct: correctSteps.has(i.stepId) }));
  const score = answers.filter((a) => a.correct).length;
  const total = items.length;
  const need = passScore(total, percent);
  return { score, total, passScore: need, percent: total === 0 ? 0 : Math.round((100 * score) / total), passed: total > 0 && score >= need, answers };
}

export type WeakTopic = { unitId: number; wrong: number; total: number; wordIds: number[] };

/**
 * Tối đa `max` chủ đề sai nhiều nhất (chỉ chủ đề có câu sai): nhiều câu sai trước, rồi tỷ lệ sai cao hơn, rồi theo mã chủ đề.
 * `wordIdByStep`: từ của câu (nếu có), để gợi ý tối đa 3 từ hay sai mỗi chủ đề.
 */
export function weakTopics(items: readonly ExamItem[], answers: readonly ExamAnswer[], wordIdByStep: ReadonlyMap<number, number | null>, max: number = EXAM_MAX_WEAK): WeakTopic[] {
  const correct = new Map(answers.map((a) => [a.stepId, a.correct]));
  const byUnit = new Map<number, WeakTopic>();
  for (const item of items) {
    const topic = byUnit.get(item.unitId) ?? { unitId: item.unitId, wrong: 0, total: 0, wordIds: [] };
    topic.total += 1;
    if (!correct.get(item.stepId)) {
      topic.wrong += 1;
      const wordId = wordIdByStep.get(item.stepId) ?? null;
      if (wordId !== null && !topic.wordIds.includes(wordId) && topic.wordIds.length < 3) topic.wordIds.push(wordId);
    }
    byUnit.set(item.unitId, topic);
  }
  return [...byUnit.values()]
    .filter((t) => t.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong || b.wrong / b.total - a.wrong / a.total || a.unitId - b.unitId)
    .slice(0, max);
}

export type RetakeState = "free" | "needs_review";

/**
 * Thi lại được ngay hay phải ôn trước. `lastWeakUnitIds`: chủ đề gợi ý của lần thi gần nhất nếu lần đó chưa đạt (rỗng/null nếu chưa thi hay đã đạt);
 * `reviewedUnitIds`: chủ đề có bài bé hoàn thành SAU lần thi đó (server tra từ `lesson_attempts.finished_at`).
 */
export function retakeState(lastWeakUnitIds: readonly number[] | null, reviewedUnitIds: readonly number[]): RetakeState {
  if (!lastWeakUnitIds || lastWeakUnitIds.length === 0) return "free";
  return lastWeakUnitIds.some((id) => reviewedUnitIds.includes(id)) ? "free" : "needs_review";
}
