// Chấm Sắp xếp câu (Screen26). So theo chữ (không theo chỉ số thẻ) vì câu có thể lặp từ. Hàm thuần.

/** Chữ để so: không phân biệt hoa/thường, bỏ dấu câu cuối ("Book." = "book"). */
export const wordKey = (word: string): string => word.replace(/[‘’]/g, "'").replace(/[.,!?;:]+$/, "").toLowerCase();

export type PositionMark = "ok" | "bad";

export type OrderGrade = {
  correct: boolean;
  /** Đúng/sai từng vị trí đã xếp. */
  marks: PositionMark[];
  /** Số thẻ đầu liền nhau đã đúng chỗ. */
  prefix: number;
};

function gradeOne(placed: readonly string[], answer: readonly string[]): OrderGrade {
  const marks = placed.map((w, i): PositionMark => (answer[i] !== undefined && wordKey(w) === wordKey(answer[i]) ? "ok" : "bad"));
  let prefix = 0;
  while (prefix < marks.length && marks[prefix] === "ok") prefix++;
  return { correct: placed.length === answer.length && marks.every((m) => m === "ok"), marks, prefix };
}

/**
 * Chấm một câu đã xếp so với đáp án chính và các cách sắp xếp khác (cùng các từ, khác thứ tự). Đúng một trong các cách là đúng;
 * chưa đúng thì lấy cách khớp nhiều nhất từ đầu câu để tô các thẻ sai và gợi ý thẻ kế tiếp.
 */
export function gradeOrder(placed: readonly string[], answer: readonly string[], alternatives: readonly (readonly string[])[] = []): OrderGrade & { answer: readonly string[] } {
  let best: OrderGrade & { answer: readonly string[] } = { ...gradeOne(placed, answer), answer };
  for (const alt of alternatives) {
    const g = gradeOne(placed, alt);
    if (g.correct || (!best.correct && g.prefix > best.prefix)) best = { ...g, answer: alt };
  }
  return best;
}

/** Hai cách xếp dùng đúng cùng các từ (không tính thứ tự, hoa/thường, dấu câu cuối). */
export function sameWords(a: readonly string[], b: readonly string[]): boolean {
  const key = (list: readonly string[]) => list.map(wordKey).sort().join("|");
  return a.length === b.length && key(a) === key(b);
}

/** Thẻ đúng kế tiếp sau phần đầu đã đúng: chỉ số trong `bank` (các thẻ chưa đặt), -1 nếu hết. */
export function nextCorrectCard(bank: readonly { word: string }[], answer: readonly string[], prefix: number): number {
  const need = answer[prefix];
  return need === undefined ? -1 : bank.findIndex((c) => wordKey(c.word) === wordKey(need));
}
