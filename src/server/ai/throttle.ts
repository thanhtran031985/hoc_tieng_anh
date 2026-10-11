// Giới hạn số lượt gọi AI mỗi phút cho từng quản trị viên (cửa sổ trượt, đếm trong bộ nhớ của tiến trình) để không cạn hạn mức miễn phí.
// Chỉ import tương đối có đuôi .ts để Node chạy test thẳng được.
import { AI_CALLS_PER_MINUTE } from "../../lib/rules/ai-suggest.ts";

export type Throttle = {
  /** Xin một lượt: được thì ghi lại và trả `{ ok: true }`; hết lượt thì trả số giây phải chờ. */
  take(key: string, now?: number): { ok: true } | { ok: false; retryAfterSeconds: number };
};

export function createThrottle(max: number, windowMs: number): Throttle {
  const hits = new Map<string, number[]>();
  return {
    take(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= max) {
        hits.set(key, recent);
        return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)) };
      }
      recent.push(now);
      hits.set(key, recent);
      return { ok: true };
    },
  };
}

const globalForAi = globalThis as unknown as { aiThrottle?: Throttle };

/** Bộ đếm dùng chung cả tiến trình (giữ qua lần nạp lại của chế độ dev). */
export const aiThrottle: Throttle = (globalForAi.aiThrottle ??= createThrottle(AI_CALLS_PER_MINUTE, 60_000));
