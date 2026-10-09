// Chấm Nghe và gõ (Screen27): so với các đáp án chấp nhận, chỉ ra chữ nào chưa đúng, gợi ý chữ đầu. Hàm thuần.
import { matchesAny, normalizeAnswer, type CompareOptions } from "./text.ts";

export type CharMark = { char: string; state: "ok" | "bad" | "missing" };

/** Đáp án gần nhất với chữ bé gõ (ít ký tự lệch nhất); dùng để tô chữ sai. */
export function closestAnswer(input: string, accepted: readonly string[], options: CompareOptions): string {
  const value = normalizeAnswer(input, options);
  let best = accepted[0] ?? "";
  let bestScore = Infinity;
  for (const a of accepted) {
    const target = normalizeAnswer(a, options);
    let score = Math.abs(target.length - value.length);
    for (let i = 0; i < Math.min(target.length, value.length); i++) if (target[i] !== value[i]) score++;
    if (score < bestScore) {
      bestScore = score;
      best = a;
    }
  }
  return best;
}

/** Từng ký tự bé gõ: đúng chỗ (ok) hoặc sai (bad); ký tự đáp án còn thiếu hiện `_` (missing). */
export function diffChars(input: string, target: string, options: CompareOptions): CharMark[] {
  const a = normalizeAnswer(input, options);
  const b = normalizeAnswer(target, options);
  const marks: CharMark[] = [];
  for (let i = 0; i < a.length; i++) marks.push({ char: a[i], state: a[i] === b[i] ? "ok" : "bad" });
  for (let i = a.length; i < b.length; i++) marks.push({ char: "_", state: "missing" });
  return marks;
}

export type DictationGrade = { correct: boolean; marks: CharMark[] };

export function gradeDictation(input: string, accepted: readonly string[], options: CompareOptions): DictationGrade {
  const correct = matchesAny(input, accepted, options);
  const closest = closestAnswer(input, accepted, options);
  return { correct, marks: diffChars(input, correct ? input : closest, options) };
}

/** Từ ngắn (một từ, tối đa 8 chữ cái): gõ mỗi chữ một ô. Còn lại: gõ một dòng. */
export const SHORT_WORD_MAX = 8;
export const isShortWord = (text: string): boolean => /^[A-Za-z]+$/.test(text.trim()) && text.trim().length <= SHORT_WORD_MAX;

/** Gợi ý chữ đầu của đáp án chuẩn (đáp án thứ nhất). */
export function firstLetterHint(accepted: readonly string[]): string {
  return (accepted[0] ?? "").trim().charAt(0);
}
