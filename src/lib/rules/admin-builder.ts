// Luật của màn Soạn bài học (task 12, Adult12): mô tả bước, thời lượng tự tính, thống kê và chỗ chèn bước mới. Hàm thuần.
import { MAX_LESSON_MINUTES, MIN_LESSON_MINUTES } from "./admin-tree.ts";
import { MIN_GAME_ROUNDS, RAIN_LEVEL_MAX, RAIN_LEVEL_MIN, BUBBLE_LANES, isGameActivity, isRainLevel } from "./games.ts";

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
  | "fill_blank"
  | "story"
  | "short_reading"
  | "speaking"
  | "word_rain"
  | "word_bubbles"
  | "whack_letters"
  | "race"
  | "word_explorer";

/** Dạng bài lấy toàn bộ nội dung từ câu hỏi gắn vào bước (task 15): bước phải có `questionId`. */
export const QUESTION_ACTIVITIES: readonly BuilderActivity[] = ["phonics", "sentence_order", "dictation", "fill_blank", "short_reading", "speaking"];
export const isQuestionActivity = (type: string): boolean => (QUESTION_ACTIVITIES as readonly string[]).includes(type);

export const ACTIVITY_INFO: Record<BuilderActivity, { label: string; icon: "cards" | "speaker" | "image" | "plusbox" | "gem" | "music" | "grammar" | "keyboard" | "pen" | "book" | "notebook" | "mic" | "snow" | "wand" | "target" | "flag" | "branch"; seconds: number; needsWord: boolean }> = {
  word_card: { label: "Giới thiệu từ", icon: "cards", seconds: 20, needsWord: true },
  listen_choose_picture: { label: "Nghe và chọn hình", icon: "speaker", seconds: 25, needsWord: true },
  choose_word_for_picture: { label: "Chọn từ đúng cho hình", icon: "image", seconds: 25, needsWord: true },
  match_pairs: { label: "Nối từ với hình", icon: "plusbox", seconds: 60, needsWord: false },
  memory_game: { label: "Lật thẻ ghép cặp", icon: "gem", seconds: 90, needsWord: false },
  phonics: { label: "Ghép âm thành từ", icon: "music", seconds: 40, needsWord: false },
  sentence_order: { label: "Sắp xếp câu", icon: "grammar", seconds: 45, needsWord: false },
  dictation: { label: "Nghe và gõ", icon: "keyboard", seconds: 40, needsWord: false },
  fill_blank: { label: "Điền từ vào chỗ trống", icon: "pen", seconds: 30, needsWord: false },
  story: { label: "Truyện tranh", icon: "book", seconds: 150, needsWord: false },
  short_reading: { label: "Đọc hiểu ngắn", icon: "notebook", seconds: 90, needsWord: false },
  speaking: { label: "Luyện nói", icon: "mic", seconds: 40, needsWord: false },
  word_rain: { label: "Mưa từ vựng", icon: "snow", seconds: 120, needsWord: false },
  word_bubbles: { label: "Bong bóng từ vựng", icon: "wand", seconds: 90, needsWord: false },
  whack_letters: { label: "Đập chuột chữ cái", icon: "target", seconds: 100, needsWord: false },
  race: { label: "Đua xe trả lời", icon: "flag", seconds: 120, needsWord: false },
  word_explorer: { label: "Khám phá từ", icon: "branch", seconds: 180, needsWord: true },
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

/**
 * Vị trí chèn bước mới: cuối bài, nhưng trước trò chơi (lật thẻ hoặc mini game) nếu nó đang kết thúc bài.
 * Bước mới chính là một trò chơi thì thêm vào cuối (các trò chơi đứng cuối bài theo thứ tự thêm).
 */
export function insertIndex(steps: readonly Pick<BuilderStep, "activityType">[], adding?: BuilderActivity): number {
  if (adding && (adding === "memory_game" || isGameActivity(adding))) return steps.length;
  const last = steps[steps.length - 1];
  return last && (last.activityType === "memory_game" || isGameActivity(last.activityType)) ? steps.length - 1 : steps.length;
}

const hasPicture = (w: { image: string | null }) => w.image !== null;

/** Mưa từ vựng chỉ có ở bài cấp 3–5: trả lời lỗi (hoặc null nếu cấp phù hợp). */
export const rainLevelProblem = (levelNumber: number): string | null => (isRainLevel(levelNumber) ? null : `Mưa từ vựng chỉ dành cho bài cấp ${RAIN_LEVEL_MIN}–${RAIN_LEVEL_MAX} (bài này ở cấp ${levelNumber}).`);

/**
 * Lỗi của các mini game trong bài (hoặc null): Mưa từ vựng chỉ ở bài cấp 3–5; mỗi trò cần đủ từ có hình / từ một chữ trong bài và chủ đề.
 * `words` là các từ của bài và của chủ đề (không cần trùng).
 */
export function gameStepProblem(steps: readonly Pick<BuilderStep, "activityType">[], levelNumber: number, words: readonly { id: number; word: string; image: string | null }[]): string | null {
  const unique = [...new Map(words.map((w) => [w.id, w])).values()];
  const pictured = unique.filter(hasPicture).length;
  const typable = unique.filter((w) => /^[a-z]+$/i.test(w.word)).length;
  for (const { activityType } of steps) {
    if (activityType === "word_rain") {
      const level = rainLevelProblem(levelNumber);
      if (level) return level;
      if (typable < MIN_GAME_ROUNDS) return `Mưa từ vựng cần ít nhất ${MIN_GAME_ROUNDS} từ một chữ trong bài hoặc chủ đề (đang có ${typable}).`;
    } else if (activityType === "word_bubbles" && pictured < BUBBLE_LANES) {
      return `Bong bóng từ vựng cần ít nhất ${BUBBLE_LANES} từ có hình trong bài hoặc chủ đề (đang có ${pictured}).`;
    } else if ((activityType === "whack_letters" || activityType === "race") && pictured < MIN_GAME_ROUNDS) {
      return `${ACTIVITY_INFO[activityType].label} cần ít nhất ${MIN_GAME_ROUNDS} từ có hình trong bài hoặc chủ đề (đang có ${pictured}).`;
    }
  }
  return null;
}
