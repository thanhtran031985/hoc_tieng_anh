// Chấm và hỗ trợ bài Đọc hiểu ngắn (Screen29, task 16). Hàm thuần.

export const READING_MIN_SENTENCES = 3;
export const READING_MAX_SENTENCES = 6;
export const READING_MIN_QUESTIONS = 2;
export const READING_MAX_QUESTIONS = 3;
export const READING_CHOICES = 3;

/** Tách đoạn văn thành từng câu (theo . ! ?, giữ dấu câu ở cuối câu). */
export function splitPassage(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter((part) => part.length > 0);
}

/** Đáp án `choices[selected]` có đúng không (so theo chỉ số). */
export const isCorrect = (selected: number | null, correct: number): boolean => selected !== null && selected === correct;

/** Đáp án sai đầu tiên chưa bị làm mờ và không phải đáp án bé đang chọn (gợi ý làm mờ một đáp án); null nếu hết. */
export function dimTarget(count: number, correct: number, dimmed: readonly number[], selected: number | null): number | null {
  for (let i = 0; i < count; i++) if (i !== correct && i !== selected && !dimmed.includes(i)) return i;
  return null;
}

/** Câu hỏi kế tiếp chưa trả lời, tính từ `from` theo hướng `step` (+1 xuống, -1 lên); đứng nguyên nếu không còn. */
export function neighbourQuestion(done: readonly boolean[], from: number, step: 1 | -1): number {
  const next = from + step;
  return next >= 0 && next < done.length ? next : from;
}

/** Câu hỏi chưa trả lời đầu tiên, ưu tiên từ sau `from`; -1 nếu xong hết. */
export function nextUndone(done: readonly boolean[], from: number): number {
  for (let k = 1; k <= done.length; k++) {
    const i = (from + k) % done.length;
    if (!done[i]) return i;
  }
  return -1;
}
