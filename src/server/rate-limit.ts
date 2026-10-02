// Giới hạn số lần thử sai (đăng nhập, PIN), đếm trong bộ nhớ của tiến trình.
// Đủ cho chạy trên một máy; nếu hosting chạy nhiều tiến trình thì cần chuyển bộ đếm sang database.

type Entry = { count: number; resetAt: number };

const globalForLimit = globalThis as unknown as { failureStore?: Map<string, Entry> };
const store = (globalForLimit.failureStore ??= new Map<string, Entry>());

function current(key: string, now: number): Entry | undefined {
  const entry = store.get(key);
  if (entry && entry.resetAt <= now) {
    store.delete(key);
    return undefined;
  }
  return entry;
}

/** Đã sai quá `max` lần trong khoảng thời gian chưa? */
export function isLimited(key: string, max: number, now = Date.now()): boolean {
  return (current(key, now)?.count ?? 0) >= max;
}

/** Ghi một lần sai; khoảng đếm bắt đầu từ lần sai đầu tiên và kéo dài `windowMs`. */
export function recordFailure(key: string, windowMs: number, now = Date.now()): void {
  const entry = current(key, now);
  if (entry) entry.count += 1;
  else store.set(key, { count: 1, resetAt: now + windowMs });
}

/** Xóa bộ đếm khi nhập đúng. */
export function resetFailures(key: string): void {
  store.delete(key);
}

export const LOGIN_LIMIT = { max: 5, windowMs: 15 * 60 * 1000 };
export const PIN_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
