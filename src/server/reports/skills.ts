import { addDays, dayStartInstant, today } from "@/lib/rules/dates";
import { mistakeNote, skillComparison, splitPeriods, topMistakes, type SkillRow } from "@/lib/stats/skills";
import { db } from "../db";
import { requireLearner } from "../learners";

// Kỹ năng của một bé cho bố mẹ (Adult03). Mọi truy cập đi qua `requireLearner` nên chỉ đọc được hồ sơ thuộc tài khoản đang đăng nhập.

export type SkillRange = 7 | 30;
export const SKILL_RANGES: readonly SkillRange[] = [7, 30];

export type MistakeItem = { wordId: number; word: string; ipa: string | null; meaningVi: string; wrong: number; total: number; note: string };

export type SkillsData = {
  kid: { id: number; name: string };
  days: SkillRange;
  /** Có ít nhất một câu trả lời trong kỳ này hoặc kỳ trước. */
  hasData: boolean;
  /** Số câu đã trả lời trong kỳ này. */
  answered: number;
  rows: SkillRow[];
  mistakes: MistakeItem[];
};

/** Đổi tham số `?days=` thành khoảng hợp lệ (mặc định 7 ngày). */
export const parseRange = (value: string | string[] | undefined): SkillRange => ((Array.isArray(value) ? value[0] : value) === "30" ? 30 : 7);

export async function getSkills(userId: number, learnerId: number, days: SkillRange): Promise<SkillsData> {
  const learner = await requireLearner(userId, learnerId);
  const day = today();
  const from = dayStartInstant(addDays(day, -(2 * days - 1)));
  const raw = await db.answerLog.findMany({
    where: { learnerId, createdAt: { gte: from } },
    select: { isCorrect: true, createdAt: true, wordId: true, question: { select: { skill: true } } },
  });
  const logs = raw.map((l) => ({ skill: l.question?.skill ?? null, isCorrect: l.isCorrect, createdAt: l.createdAt, wordId: l.wordId }));
  const { current } = splitPeriods(logs, day, days);

  const top = topMistakes(current, 10);
  const words = top.length ? await db.word.findMany({ where: { id: { in: top.map((m) => m.wordId) } }, select: { id: true, word: true, ipa: true, meaningVi: true } }) : [];
  const byId = new Map(words.map((w) => [w.id, w]));
  const mistakes: MistakeItem[] = top.flatMap((m) => {
    const w = byId.get(m.wordId);
    return w ? [{ wordId: m.wordId, word: w.word, ipa: w.ipa, meaningVi: w.meaningVi, wrong: m.wrong, total: m.total, note: mistakeNote(m) }] : [];
  });

  return { kid: { id: learner.id, name: learner.name }, days, hasData: logs.length > 0, answered: current.length, rows: skillComparison(logs, day, days), mistakes };
}
