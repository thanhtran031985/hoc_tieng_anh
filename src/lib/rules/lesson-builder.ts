// Tạo bài học tự động từ danh sách từ của một chủ đề (hàm thuần, không đụng database). Dùng ở seed (task 05) và nhập Excel (task 12).
// Import tương đối có đuôi .ts để Node chạy thẳng được (seed, test).
import { lessonStepConfigSchemas, type ActivityType } from "../schemas/lesson-step-config.ts";

export type BuilderWord = {
  /** Từ tiếng Anh, dùng để khớp với bản ghi `words` khi ghi vào DB. */
  word: string;
  /** Từ đã có hình minh họa. Từ chưa có hình bị bỏ khỏi các dạng bài cần hình. */
  hasPicture: boolean;
};

export type BuiltStep = {
  activityType: ActivityType;
  /** Từ của bước; null với `match_pairs` (nối các từ có hình của chính bài đó, số cặp ở config). */
  word: string | null;
  config: Record<string, unknown>;
};

export type BuiltLesson = {
  title: string;
  kind: "lesson" | "unit_test";
  steps: BuiltStep[];
};

export type BuildOptions = {
  /** Tên chủ đề, dùng cho tên trận trùm. */
  unitTitle?: string;
  /** Hạt giống để trộn từ trong trận trùm; cùng hạt giống cho cùng kết quả. Mặc định là chuỗi các từ. */
  seed?: string;
};

/** Mỗi bài tối đa 8 từ (5–8 từ; vài trường hợp lẻ như 9 từ chia 5 + 4). */
export const MAX_WORDS_PER_LESSON = 8;
/** Trận trùm có tối đa chừng này bước để không quá dài. */
export const MAX_BOSS_STEPS = 12;
/** Số lựa chọn tối đa mỗi câu (cùng giới hạn với schema bước). */
const MAX_OPTIONS = 3;
const MIN_PAIRS = 3;
const MAX_PAIRS = 6;

/** Chia n từ thành các bài gần bằng nhau, mỗi bài tối đa 8 từ (13 → 7 + 6). Trả về số từ mỗi bài. */
export function splitLessonSizes(wordCount: number): number[] {
  if (wordCount <= 0) return [];
  const lessonCount = Math.ceil(wordCount / MAX_WORDS_PER_LESSON);
  const base = Math.floor(wordCount / lessonCount);
  const extra = wordCount % lessonCount;
  return Array.from({ length: lessonCount }, (_, i) => base + (i < extra ? 1 : 0));
}

function makeStep(activityType: ActivityType, word: string | null, config: Record<string, unknown>): BuiltStep {
  // Qua Zod để cấu hình luôn đúng schema và có đủ giá trị mặc định.
  return { activityType, word, config: lessonStepConfigSchemas[activityType].parse(config) };
}

/** Bộ sinh số ngẫu nhiên có hạt giống (mulberry32), để seed chạy lại ra cùng kết quả. */
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Tạo các bài của một chủ đề: các bài thường rồi một trận trùm.
 * Mỗi bài thường: thẻ từ cho từng từ → nghe và chọn hình → nối từ với hình → chọn từ đúng cho hình.
 * Trận trùm (`unit_test`): trộn từ cả chủ đề, xen nghe-chọn-hình và chọn-từ-cho-hình.
 * Số lựa chọn mỗi câu không vượt quá số từ (có hình) của chủ đề; ít hơn 2 thì bỏ dạng đó.
 * Chủ đề không có từ nào thì trả về mảng rỗng; không có từ nào có hình thì không có trận trùm.
 */
export function buildLessons(words: readonly BuilderWord[], options: BuildOptions = {}): BuiltLesson[] {
  if (words.length === 0) return [];

  const pictureCount = words.filter((w) => w.hasPicture).length;
  // Nghe và chọn hình: các lựa chọn đều là hình nên chỉ lấy từ các từ có hình. Chọn từ cho hình: lựa chọn là từ, lấy từ cả chủ đề.
  const pictureOptionCount = Math.min(MAX_OPTIONS, pictureCount);
  const wordOptionCount = Math.min(MAX_OPTIONS, words.length);
  const canListen = pictureOptionCount >= 2;
  const canChoose = pictureCount >= 1 && wordOptionCount >= 2;

  const listenStep = (word: string) => makeStep("listen_choose_picture", word, { optionCount: pictureOptionCount });
  const chooseStep = (word: string) => makeStep("choose_word_for_picture", word, { optionCount: wordOptionCount });

  const lessons: BuiltLesson[] = [];
  let offset = 0;
  for (const [index, size] of splitLessonSizes(words.length).entries()) {
    const group = words.slice(offset, offset + size);
    offset += size;
    const withPicture = group.filter((w) => w.hasPicture);

    const steps: BuiltStep[] = group.map((w) => makeStep("word_card", w.word, {}));
    if (canListen) steps.push(...withPicture.map((w) => listenStep(w.word)));
    if (withPicture.length >= MIN_PAIRS) {
      steps.push(makeStep("match_pairs", null, { pairCount: Math.min(withPicture.length, MAX_PAIRS) }));
    }
    if (canChoose) steps.push(...withPicture.map((w) => chooseStep(w.word)));

    lessons.push({ title: `Bài ${index + 1}`, kind: "lesson", steps });
  }

  if (canListen || canChoose) {
    const random = seededRandom(options.seed ?? words.map((w) => w.word).join("|"));
    const bossWords = shuffled(
      words.filter((w) => w.hasPicture),
      random,
    );
    const bossSteps: BuiltStep[] = [];
    for (const [i, w] of bossWords.entries()) {
      // Xen hai dạng; nếu một dạng không dùng được thì dùng dạng còn lại.
      const useListen = canListen && (i % 2 === 0 || !canChoose);
      bossSteps.push(useListen ? listenStep(w.word) : chooseStep(w.word));
    }
    lessons.push({
      title: options.unitTitle ? `Trận trùm: ${options.unitTitle}` : "Trận trùm",
      kind: "unit_test",
      steps: bossSteps.slice(0, MAX_BOSS_STEPS),
    });
  }

  return lessons;
}
