// Sổ từ bổ sung (task 23): đếm từ đã thuộc, lọc theo cấp và chủ đề, phân trang 12 thẻ, chia trang in. Hàm thuần.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).

/** Mức thuộc từ mức này trở lên là “đã thuộc” (Nhớ tốt = hộp 4, Thuộc lòng = hộp 5). */
export const MASTERED_FROM = 4;
/** Số thẻ mỗi trang của lưới Sổ từ (6 cột × 2 hàng). */
export const NOTEBOOK_PAGE_SIZE = 12;
/** Số từ mỗi trang A4 khi in (đúng bản thiết kế: 8 dòng, mỗi dòng có ô 3 dòng kẻ để tập viết). */
export const PRINT_ROWS_PER_PAGE = 8;

export type NotebookWordLike = {
  word: string;
  /** Mức thuộc 1–5 = số hộp ôn tập. */
  mastery: number;
  /** Cấp thấp nhất trong các chủ đề có từ này; null nếu từ chưa thuộc chủ đề nào. */
  levelNumber: number | null;
  /** Mọi cấp có từ này (một từ có thể nằm ở nhiều chủ đề). */
  levelNumbers: readonly number[];
  unitIds: readonly number[];
};

export const isMastered = (mastery: number): boolean => mastery >= MASTERED_FROM;
export const countMastered = (words: readonly { mastery: number }[]): number => words.filter((w) => isMastered(w.mastery)).length;

export type WordFilter = { level: number | null; topic: number | null };

/** Từ thuộc cấp `level` (null = mọi cấp) và chủ đề `topic` (null = mọi chủ đề). */
export function filterWords<T extends NotebookWordLike>(words: readonly T[], filter: WordFilter): T[] {
  return words.filter((w) => (filter.level === null || w.levelNumbers.includes(filter.level)) && (filter.topic === null || w.unitIds.includes(filter.topic)));
}

/** Xếp từ mức thấp lên trước, cùng mức thì cấp cao trước, rồi theo chữ cái. */
export function sortWords<T extends NotebookWordLike>(words: readonly T[]): T[] {
  return [...words].sort((a, b) => a.mastery - b.mastery || (b.levelNumber ?? 0) - (a.levelNumber ?? 0) || a.word.localeCompare(b.word, "en"));
}

export type TopicLike = { id: number; levelNumber: number };

/** Các chủ đề hiện trong bộ lọc Chủ đề: đổi theo cấp đang chọn, kèm số từ (chủ đề không còn từ nào thì bỏ). */
export function topicsForLevel<T extends TopicLike>(topics: readonly T[], words: readonly NotebookWordLike[], level: number | null): (T & { count: number })[] {
  return topics
    .filter((t) => level === null || t.levelNumber === level)
    .map((t) => ({ ...t, count: words.filter((w) => w.unitIds.includes(t.id)).length }))
    .filter((t) => t.count > 0);
}

export const pageCount = (total: number, size: number = NOTEBOOK_PAGE_SIZE): number => Math.max(1, Math.ceil(total / size));

/** Một trang của danh sách; trang ngoài khoảng được kẹp lại (đổi bộ lọc làm danh sách ngắn đi). */
export function paginate<T>(items: readonly T[], page: number, size: number = NOTEBOOK_PAGE_SIZE): { items: T[]; page: number; pages: number } {
  const pages = pageCount(items.length, size);
  const current = Math.min(pages - 1, Math.max(0, Math.trunc(page)));
  return { items: items.slice(current * size, current * size + size), page: current, pages };
}

/** Chia danh sách từ thành các trang in A4: mỗi trang tối đa `PRINT_ROWS_PER_PAGE` từ, không có trang trống. */
export function chunkForPrint<T>(words: readonly T[], perPage: number = PRINT_ROWS_PER_PAGE): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < words.length; i += perPage) pages.push(words.slice(i, i + perPage));
  return pages;
}

/** Từ đứng trước / sau `index` trong danh sách đã lọc (thẻ phóng to ← →); ngoài khoảng thì null. */
export const neighbour = <T>(items: readonly T[], index: number, step: -1 | 1): T | null => items[index + step] ?? null;
