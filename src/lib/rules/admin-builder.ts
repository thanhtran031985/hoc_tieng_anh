// Luật của màn Soạn bài học (task 12, Adult12): mô tả bước, thời lượng tự tính, thống kê và chỗ chèn bước mới. Hàm thuần.
import { MAX_LESSON_MINUTES, MIN_LESSON_MINUTES } from "./admin-tree.ts";

/** Dạng bài (activity_type) của giai đoạn 1 mà màn soạn bài thêm được. */
export type BuilderActivity =
  | "word_card"
  | "listen_choose_picture"
  | "choose_word_for_picture"
  | "match_pairs"
  | "memory_game"
  | "phonics"
  | "sentence_order"
  | "dictation"
  | "fill_blank";

/** Dạng bài lấy toàn bộ nội dung từ câu hỏi gắn vào bước (task 15): bước phải có `questionId`. */
export const QUESTION_ACTIVITIES: readonly BuilderActivity[] = ["phonics", "sentence_order", "dictation", "fill_blank"];
export const isQuestionActivity = (type: string): boolean => (QUESTION_ACTIVITIES as readonly string[]).includes(type);

export const ACTIVITY_INFO: Record<BuilderActivity, { label: string; icon: "cards" | "speaker" | "image" | "plusbox" | "gem" | "music" | "grammar" | "keyboard" | "pen"; seconds: number; needsWord: boolean }> = {
  word_card: { label: "Giới thiệu từ", icon: "cards", seconds: 20, needsWord: true },
  listen_choose_picture: { label: "Nghe và chọn hình", icon: "speaker", seconds: 25, needsWord: true },
  choose_word_for_picture: { label: "Chọn từ đúng cho hình", icon: "image", seconds: 25, needsWord: true },
  match_pairs: { label: "Nối từ với hình", icon: "plusbox", seconds: 60, needsWord: false },
  memory_game: { label: "Lật thẻ ghép cặp", icon: "gem", seconds: 90, needsWord: false },
  phonics: { label: "Ghép âm thành từ", icon: "music", seconds: 40, needsWord: false },
  sentence_order: { label: "Sắp xếp câu", icon: "grammar", seconds: 45, needsWord: false },
  dictation: { label: "Nghe và gõ", icon: "keyboard", seconds: 40, needsWord: false },
  fill_blank: { label: "Điền từ vào chỗ trống", icon: "pen", seconds: 30, needsWord: false },
};

export const MAX_STEPS = 60;

/** Một bước của bài ở màn soạn (đã lưu thì có `id`). */
export type BuilderStep = { key: string; id?: number; activityType: BuilderActivity; wordId: number | null; questionId: number | null; config: Record<string, unknown> | null };

export const isBuilderActivity = (type: string): type is BuilderActivity => type in ACTIVITY_INFO;

/** Bước là câu hỏi hoặc trò chơi (mọi bước trừ thẻ từ). */
export const isActivityStep = (step: Pick<BuilderStep, "activityType">) => step.activityType !== "word_card";

/** Thời lượng ước tính (phút, làm tròn, trong khoảng cho phép của một bài). */
export function estimateMinutes(steps: readonly Pick<BuilderStep, "activityType">[]): number {
  const seconds = steps.reduce((sum, s) => sum + (ACTIVITY_INFO[s.activityType]?.seconds ?? 0), 0);
  return Math.min(MAX_LESSON_MINUTES, Math.max(MIN_LESSON_MINUTES, Math.round(seconds / 60)));
}

export function lessonStats(steps: readonly Pick<BuilderStep, "activityType" | "wordId">[]): { words: number; activities: number } {
  const words = new Set(steps.filter((s) => s.activityType === "word_card" && s.wordId !== null).map((s) => s.wordId));
  return { words: words.size, activities: steps.filter(isActivityStep).length };
}

/** Vị trí chèn bước mới: cuối bài, nhưng trước trò chơi lật thẻ nếu nó đang kết thúc bài. */
export function insertIndex(steps: readonly Pick<BuilderStep, "activityType">[]): number {
  const last = steps[steps.length - 1];
  return last?.activityType === "memory_game" ? steps.length - 1 : steps.length;
}
