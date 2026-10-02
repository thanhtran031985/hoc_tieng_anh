import { restoreSession, type Session } from "@/lib/rules/lesson-session";

// Giữ tiến độ dở của một bài trên máy (localStorage) để bé thoát giữa chừng rồi học tiếp từ câu đang làm.
// Mọi thao tác bọc try/catch: cửa sổ ẩn danh hoặc bị chặn lưu trữ thì bài vẫn học được, chỉ không giữ được chỗ.

export type SavedLesson = {
  v: 1;
  session: Session;
  /** Tổng thời gian đang học (ms), mỗi bước tối đa vài phút để lúc bỏ máy không bị tính. */
  activeMs: number;
};

const storageKey = (learnerId: number, lessonId: number) => `edu:lesson:${learnerId}:${lessonId}`;

export function readSavedRaw(learnerId: number, lessonId: number): string | null {
  try {
    return window.localStorage.getItem(storageKey(learnerId, lessonId));
  } catch {
    return null;
  }
}

/** Dữ liệu đã lưu nếu còn khớp bài (các bước không đổi), không thì null. */
export function parseSaved(raw: string | null, validBaseIds: ReadonlySet<string>): SavedLesson | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<SavedLesson>;
    if (data.v !== 1 || typeof data.activeMs !== "number" || !Number.isFinite(data.activeMs) || data.activeMs < 0) return null;
    const session = restoreSession(data.session, validBaseIds);
    return session ? { v: 1, session, activeMs: data.activeMs } : null;
  } catch {
    return null;
  }
}

export function saveProgress(learnerId: number, lessonId: number, saved: Omit<SavedLesson, "v">): void {
  try {
    window.localStorage.setItem(storageKey(learnerId, lessonId), JSON.stringify({ v: 1, ...saved }));
  } catch {
    // Không lưu được thì thôi, bài vẫn chạy.
  }
}

export function clearProgress(learnerId: number, lessonId: number): void {
  try {
    window.localStorage.removeItem(storageKey(learnerId, lessonId));
  } catch {
    // Bỏ qua.
  }
}
