import { parseSaved, type SavedLesson } from "@/features/lesson/resume";

// Giữ tiến độ dở của phiên ôn hôm nay trên máy (localStorage), khóa theo hồ sơ và ngày: sang ngày mới thì phiên khác.
// Cùng dạng dữ liệu với bài học nên dùng lại `parseSaved` (kiểm bước còn khớp).

export { parseSaved };
export type SavedReview = SavedLesson;

const storageKey = (learnerId: number, day: string) => `edu:review:${learnerId}:${day}`;

export function readSavedRaw(learnerId: number, day: string): string | null {
  try {
    return window.localStorage.getItem(storageKey(learnerId, day));
  } catch {
    return null;
  }
}

export function saveProgress(learnerId: number, day: string, saved: Omit<SavedReview, "v">): void {
  try {
    window.localStorage.setItem(storageKey(learnerId, day), JSON.stringify({ v: 1, ...saved }));
  } catch {
    // Không lưu được thì thôi, phiên ôn vẫn chạy.
  }
}

export function clearProgress(learnerId: number, day: string): void {
  try {
    window.localStorage.removeItem(storageKey(learnerId, day));
  } catch {
    // Bỏ qua.
  }
}
