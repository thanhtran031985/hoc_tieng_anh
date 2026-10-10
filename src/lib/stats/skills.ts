// Kỹ năng của con cho bố mẹ (task 24, Adult03): tỷ lệ đúng theo 7 kỹ năng, so với kỳ liền trước, và các từ bé hay sai. Hàm thuần.
// Kỹ năng của một câu lấy từ `questions.skill`; nhật ký chỉ có từ (không có câu hỏi) tính là từ vựng.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { addDays, dateOnly } from "../rules/dates.ts";

export const SKILL_ORDER = ["listening", "speaking", "reading", "writing", "vocabulary", "grammar", "pronunciation"] as const;
export type SkillKey = (typeof SKILL_ORDER)[number];

export const SKILL_LABELS: Record<SkillKey, string> = {
  listening: "Nghe",
  speaking: "Nói",
  reading: "Đọc",
  writing: "Viết",
  vocabulary: "Từ vựng",
  grammar: "Ngữ pháp",
  pronunciation: "Phát âm",
};

/** Mô tả ngắn của kỹ năng, dùng trong lời “hay sai ở …”. */
export const SKILL_AREA: Record<SkillKey, string> = {
  listening: "phần nghe",
  speaking: "phần nói",
  reading: "phần đọc",
  writing: "phần viết",
  vocabulary: "phần từ vựng",
  grammar: "phần ngữ pháp",
  pronunciation: "phần phát âm",
};

export type AnswerLogLike = {
  /** `questions.skill` của câu trả lời; null khi nhật ký chỉ gắn với từ (không có câu hỏi). */
  skill: string | null;
  isCorrect: boolean;
  createdAt: Date;
  wordId: number | null;
};

/** Kỹ năng hợp lệ của một dòng nhật ký (lạ hoặc thiếu thì là từ vựng). */
export function skillOf(skill: string | null): SkillKey {
  return (SKILL_ORDER as readonly string[]).includes(skill ?? "") ? (skill as SkillKey) : "vocabulary";
}

export type SkillScore = { skill: SkillKey; label: string; total: number; correct: number; percent: number | null };

const percentOf = (correct: number, total: number) => (total === 0 ? null : Math.round((correct / total) * 100));

/** Tỷ lệ đúng theo từng kỹ năng, đủ 7 kỹ năng theo thứ tự cố định (kỹ năng chưa có câu nào có `percent` null). */
export function accuracyBySkill(logs: readonly AnswerLogLike[]): SkillScore[] {
  const sums = new Map<SkillKey, { total: number; correct: number }>(SKILL_ORDER.map((s) => [s, { total: 0, correct: 0 }]));
  for (const log of logs) {
    const sum = sums.get(skillOf(log.skill))!;
    sum.total += 1;
    if (log.isCorrect) sum.correct += 1;
  }
  return SKILL_ORDER.map((skill) => {
    const { total, correct } = sums.get(skill)!;
    return { skill, label: SKILL_LABELS[skill], total, correct, percent: percentOf(correct, total) };
  });
}

/** Chia nhật ký thành kỳ hiện tại (`days` ngày kết thúc ở `today`) và kỳ liền trước cùng độ dài. Ngày theo lịch ở múi giờ ứng dụng. */
export function splitPeriods<T extends { createdAt: Date }>(logs: readonly T[], today: Date, days: number): { current: T[]; previous: T[] } {
  const currentFrom = addDays(today, -(days - 1)).getTime();
  const previousFrom = addDays(today, -(2 * days - 1)).getTime();
  const current: T[] = [];
  const previous: T[] = [];
  for (const log of logs) {
    const day = dateOnly(log.createdAt).getTime();
    if (day >= currentFrom && day <= today.getTime()) current.push(log);
    else if (day >= previousFrom && day < currentFrom) previous.push(log);
  }
  return { current, previous };
}

export type SkillRow = SkillScore & {
  /** Tỷ lệ đúng kỳ trước (vạch tham chiếu); null khi kỳ trước chưa có câu nào. */
  prevPercent: number | null;
  /** Thay đổi so với kỳ trước (điểm phần trăm); null khi một trong hai kỳ chưa có số liệu. */
  delta: number | null;
};

/** Bảng 7 kỹ năng của kỳ `days` ngày so với kỳ liền trước. */
export function skillComparison(logs: readonly AnswerLogLike[], today: Date, days: number): SkillRow[] {
  const { current, previous } = splitPeriods(logs, today, days);
  const before = new Map(accuracyBySkill(previous).map((s) => [s.skill, s.percent]));
  return accuracyBySkill(current).map((s) => {
    const prevPercent = before.get(s.skill) ?? null;
    return { ...s, prevPercent, delta: s.percent !== null && prevPercent !== null ? s.percent - prevPercent : null };
  });
}

export type MistakeWord = {
  wordId: number;
  wrong: number;
  total: number;
  /** Kỹ năng có nhiều câu sai nhất của từ này. */
  worstSkill: SkillKey;
};

/** Các từ sai nhiều nhất (ít nhất 1 lần sai): sai nhiều lên trước, rồi tỷ lệ sai cao, rồi số thứ tự từ. */
export function topMistakes(logs: readonly AnswerLogLike[], limit = 10): MistakeWord[] {
  const byWord = new Map<number, { wrong: number; total: number; skills: Map<SkillKey, number> }>();
  for (const log of logs) {
    if (log.wordId === null) continue;
    const entry = byWord.get(log.wordId) ?? { wrong: 0, total: 0, skills: new Map<SkillKey, number>() };
    entry.total += 1;
    if (!log.isCorrect) {
      entry.wrong += 1;
      const skill = skillOf(log.skill);
      entry.skills.set(skill, (entry.skills.get(skill) ?? 0) + 1);
    }
    byWord.set(log.wordId, entry);
  }
  return [...byWord.entries()]
    .filter(([, e]) => e.wrong > 0)
    .map(([wordId, e]) => {
      const worst = [...e.skills.entries()].sort((a, b) => b[1] - a[1] || SKILL_ORDER.indexOf(a[0]) - SKILL_ORDER.indexOf(b[0]))[0][0];
      return { wordId, wrong: e.wrong, total: e.total, worstSkill: worst };
    })
    .sort((a, b) => b.wrong - a.wrong || b.wrong / b.total - a.wrong / a.total || a.wordId - b.wordId)
    .slice(0, limit);
}

/** “Hay sai ở phần nghe · sai 3/5 lần” */
export function mistakeNote(m: Pick<MistakeWord, "wrong" | "total" | "worstSkill">): string {
  return `Hay sai ở ${SKILL_AREA[m.worstSkill]} · sai ${m.wrong}/${m.total} lần`;
}
