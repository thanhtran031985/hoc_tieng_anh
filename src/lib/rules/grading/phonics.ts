// Chấm Ghép âm (Screen23). Ô chữ so theo chữ (không theo chỉ số) vì từ có thể lặp ô. Hàm thuần.

export type SlotMark = "ok" | "bad" | "empty";

export type PhonicsGrade = { correct: boolean; marks: SlotMark[]; prefix: number };

/** `placed`: chữ đã đặt vào từng ô trống (null nếu ô còn trống). */
export function gradePhonics(placed: readonly (string | null)[], answer: readonly string[]): PhonicsGrade {
  const marks = answer.map((expected, i): SlotMark => (placed[i] == null ? "empty" : placed[i] === expected ? "ok" : "bad"));
  let prefix = 0;
  while (prefix < marks.length && marks[prefix] === "ok") prefix++;
  return { correct: marks.every((m) => m === "ok"), marks, prefix };
}

type TileLike = { text: string; used: boolean };

/** Ô chữ chưa dùng đầu tiên bắt đầu bằng chữ bé vừa gõ; -1 nếu không có. */
export function tileForKey(tiles: readonly TileLike[], key: string): number {
  return tiles.findIndex((t) => !t.used && t.text.toLowerCase().startsWith(key.toLowerCase()));
}

/** Ô chữ chưa dùng đúng bằng chữ cần đặt vào ô trống kế tiếp (gợi ý); -1 nếu không có. */
export function tileForSlot(tiles: readonly TileLike[], expected: string): number {
  return tiles.findIndex((t) => !t.used && t.text === expected);
}
