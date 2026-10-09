// Chấm Điền từ (Screen28). Hàm thuần.
import { normalizeAnswer } from "./text.ts";

/** Dấu chỗ trống trong câu. */
export const BLANK = "___";

/** Tách câu quanh ô trống; null nếu câu không có đúng một ô trống. */
export function splitBlank(text: string): { before: string; after: string } | null {
  const parts = text.split(BLANK);
  return parts.length === 2 ? { before: parts[0], after: parts[1] } : null;
}

/** Câu hoàn chỉnh khi điền `word` vào ô trống (để đọc to). */
export function fillSentence(text: string, word: string): string {
  const parts = splitBlank(text);
  return parts ? `${parts.before}${word}${parts.after}`.replace(/\s+/g, " ").trim() : text;
}

/** Chữ bé gõ thẳng vào ô có khớp thẻ nào không: trả chỉ số thẻ (không phân biệt hoa/thường), -1 nếu không. */
export function matchCard(input: string, cards: readonly string[]): number {
  const opts = { ignoreCase: true, ignoreEndPunct: true };
  const value = normalizeAnswer(input, opts);
  return value ? cards.findIndex((c) => normalizeAnswer(c, opts) === value) : -1;
}

/** Thẻ sai đầu tiên chưa bị làm mờ và không phải thẻ đang chọn (gợi ý làm mờ một thẻ sai mỗi lần); null nếu hết. */
export function nextToDim(cards: readonly string[], correct: number, dimmed: readonly number[], selected: number | null): number | null {
  const i = cards.findIndex((_, idx) => idx !== correct && idx !== selected && !dimmed.includes(idx));
  return i < 0 ? null : i;
}
