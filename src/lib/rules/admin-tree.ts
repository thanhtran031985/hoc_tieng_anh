// Luật của Cây lộ trình quản trị (task 12, Adult09): tạo khóa chủ đề, điều kiện xuất bản và sắp xếp lại thứ tự. Hàm thuần.
import { MIN_LESSONS_PER_UNIT } from "./admin-dashboard.ts";

export const MIN_LESSON_MINUTES = 5;
export const MAX_LESSON_MINUTES = 30;

const SLUG_MAX = 100;

/** Khóa kebab-case từ tên chủ đề (bỏ dấu tiếng Việt); tên không còn chữ nào thì dùng "topic". */
export function slugify(text: string): string {
  const base = text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX)
    .replace(/-+$/g, "");
  return base || "topic";
}

/** Thêm hậu tố -2, -3… cho đến khi không trùng với khóa đã có trong cấp. */
export function uniqueSlug(base: string, taken: ReadonlySet<string>): string {
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) {
    const suffix = `-${n}`;
    const candidate = `${base.slice(0, SLUG_MAX - suffix.length)}${suffix}`;
    if (!taken.has(candidate)) return candidate;
  }
}

/** Bài chưa có bước nào thì chưa xuất bản được. (Luật đầy đủ ≥ 3 bước và ≥ 1 câu hỏi thêm ở bước Soạn bài học.) */
export function lessonPublishBlock(stepCount: number): string | null {
  return stepCount > 0 ? null : "Bài chưa có bước nào nên chưa xuất bản được. Mở Soạn bài học để thêm bước.";
}

/** Chủ đề trống thì chưa xuất bản được. */
export function unitPublishBlock(lessonCount: number): string | null {
  return lessonCount > 0 ? null : "Chủ đề chưa có bài học nào nên chưa xuất bản được.";
}

/** Số bài còn thiếu so với mức tối thiểu của một chủ đề (0 nếu đủ). */
export function missingLessons(lessonCount: number): number {
  return Math.max(0, MIN_LESSONS_PER_UNIT - lessonCount);
}

/** Hai danh sách id có cùng tập phần tử (không trùng) không? Dùng kiểm danh sách sắp xếp lại khớp với nhóm trong database. */
export function sameIdSet(a: readonly number[], b: readonly number[]): boolean {
  if (a.length !== b.length || new Set(a).size !== a.length) return false;
  const set = new Set(b);
  return set.size === b.length && a.every((id) => set.has(id));
}

/** Dời một phần tử lên (-1) hoặc xuống (+1) một vị trí; ở đầu/cuối nhóm hoặc không tìm thấy thì trả null. */
export function moveItem<T>(items: readonly T[], item: T, delta: -1 | 1): T[] | null {
  const from = items.indexOf(item);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= items.length) return null;
  const next = [...items];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

/** Thả `item` vào trước hoặc sau `over`. Thả lên chính nó hoặc không tìm thấy thì trả null. */
export function dropItem<T>(items: readonly T[], item: T, over: T, after: boolean): T[] | null {
  if (item === over || !items.includes(item) || !items.includes(over)) return null;
  const rest = items.filter((x) => x !== item);
  rest.splice(rest.indexOf(over) + (after ? 1 : 0), 0, item);
  return rest.every((x, i) => x === items[i]) ? null : rest;
}
