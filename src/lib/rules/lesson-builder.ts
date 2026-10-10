// Tạo bài học tự động từ danh sách từ của một chủ đề (hàm thuần, không đụng database). Dùng ở seed (task 05) và nhập Excel (task 12).
// Import tương đối có đuôi .ts để Node chạy thẳng được (seed, test).
import { lessonStepConfigSchemas, type ActivityType } from "../schemas/lesson-step-config.ts";
import { BUBBLE_LANES, MIN_GAME_ROUNDS, isRainLevel, type GameActivity } from "./games.ts";
import { seededRandom, shuffled } from "./random.ts";

// Bản 2 (task 19): ngoài 5 dạng bài GĐ1, mỗi bài thường còn có các dạng bài mới (ghép âm, sắp xếp câu, điền từ, nghe-gõ, luyện nói, đọc hiểu)
// lấy từ câu hỏi của chủ đề và một mini game ở cuối bài. Chỉ chạy khi truyền `levelNumber`; không truyền thì giữ nguyên bản 1 (nhập Excel).

/** Các dạng bài lấy nội dung từ câu hỏi của chủ đề, theo thứ tự đứng trong bài. */
export const EXTRA_KINDS = ["phonics", "sentence_order", "fill_blank", "dictation", "speaking", "short_reading"] as const;
export type ExtraKind = (typeof EXTRA_KINDS)[number];

/** Cấp được dùng từng dạng (task.md): ghép âm cấp 1–3; nghe-gõ từ cấp 2 (nghe-gõ câu từ cấp 3); đọc hiểu từ cấp 3. */
export const EXTRA_LEVELS: Record<ExtraKind, readonly [min: number, max: number]> = {
  phonics: [1, 3],
  sentence_order: [1, 4],
  fill_blank: [1, 4],
  dictation: [2, 4],
  speaking: [1, 4],
  short_reading: [3, 4],
};

/** Khóa các câu hỏi của chủ đề theo dạng (đúng thứ tự trong tệp nội dung). */
export type UnitExtras = Partial<Record<ExtraKind, readonly string[]>>;

/** Trò chơi xoay vòng giữa các bài của một chủ đề: cấp 1–2 thiên về bong bóng, đập chuột, đua xe; từ cấp 3 thêm mưa từ vựng. */
export const GAME_ROTATION = {
  low: ["word_bubbles", "whack_letters", "race"],
  high: ["word_rain", "word_bubbles", "whack_letters", "race"],
} as const satisfies Record<string, readonly GameActivity[]>;

/** Mọi dạng bài mới của bản 2: bước thuộc các dạng này mới được thêm vào bài đã có tiến độ học. */
export const NEW_ACTIVITY_TYPES: readonly string[] = [...EXTRA_KINDS, "story", "word_rain", "word_bubbles", "whack_letters", "race"];

/** Khóa của bước truyện: `story:<slug>`; seed đổi slug thành `config.storyId` khi ghi vào database. */
export const storyKey = (slug: string) => `story:${slug}`;

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
  /** Khóa của câu hỏi gắn vào bước (dạng bài mới); null với các bước còn lại. */
  questionKey?: string | null;
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
  /** Số từ của từng bài thường (nhập chủ đề bằng Excel, task 12); phải cộng đúng bằng số từ, nếu không thì chia theo `splitLessonSizes`. */
  lessonSizes?: readonly number[];
  /** Cấp của chủ đề (1–10). Có thì dùng bản 2: trộn dạng bài mới và trò chơi vào các bài thường. */
  levelNumber?: number;
  /** Khóa các câu hỏi của chủ đề theo dạng (chỉ dùng ở bản 2). */
  extras?: UnitExtras;
  /** Truyện tranh của chủ đề (slug), chỉ dùng ở bản 2: mỗi truyện thành một bước `story` ở cuối các bài thường, trước trò chơi. */
  stories?: readonly string[];
};

/** Mỗi bài tối đa 8 từ (5–8 từ; vài trường hợp lẻ như 9 từ chia 5 + 4). */
export const MAX_WORDS_PER_LESSON = 8;
/** Trận trùm có tối đa chừng này bước để không quá dài. */
export const MAX_BOSS_STEPS = 12;
/** Số lựa chọn tối đa mỗi câu (cùng giới hạn với schema bước). */
const MAX_OPTIONS = 3;
const MIN_PAIRS = 3;
const MAX_PAIRS = 6;
/** Bài có ít nhất chừng này từ có hình mới có trò chơi lật thẻ. */
const MIN_MEMORY_WORDS = 4;

/** Chia n từ thành các bài gần bằng nhau, mỗi bài tối đa 8 từ (13 → 7 + 6). Trả về số từ mỗi bài. */
export function splitLessonSizes(wordCount: number): number[] {
  if (wordCount <= 0) return [];
  const lessonCount = Math.ceil(wordCount / MAX_WORDS_PER_LESSON);
  const base = Math.floor(wordCount / lessonCount);
  const extra = wordCount % lessonCount;
  return Array.from({ length: lessonCount }, (_, i) => base + (i < extra ? 1 : 0));
}

function makeStep(activityType: ActivityType, word: string | null, config: Record<string, unknown>, questionKey: string | null = null): BuiltStep {
  // Qua Zod để cấu hình luôn đúng schema và có đủ giá trị mặc định.
  return { activityType, word, config: lessonStepConfigSchemas[activityType].parse(config), questionKey };
}

/** Chia `items` cho `count` bài theo vòng: bài `index` nhận các mục có vị trí chia dư `index` (mỗi mục dùng đúng một lần). */
export function distribute<T>(items: readonly T[], count: number, index: number): T[] {
  return count > 0 ? items.filter((_, i) => i % count === index) : [];
}

/** Dạng câu hỏi nào dùng được ở cấp này. */
export const extraAllowed = (kind: ExtraKind, levelNumber: number): boolean => levelNumber >= EXTRA_LEVELS[kind][0] && levelNumber <= EXTRA_LEVELS[kind][1];

/**
 * Trò chơi cuối bài `lessonIndex` (từ 0) của chủ đề, hoặc null nếu chủ đề chưa đủ từ cho trò nào.
 * Xoay vòng theo thứ tự bài; trò không đủ điều kiện (ít từ có hình, Mưa từ vựng ngoài cấp 3–5) thì nhường trò kế tiếp.
 */
export function planGame(levelNumber: number, lessonIndex: number, words: readonly BuilderWord[]): GameActivity | null {
  const rotation = levelNumber >= 3 ? GAME_ROTATION.high : GAME_ROTATION.low;
  const pictured = words.filter((w) => w.hasPicture).length;
  const typable = words.filter((w) => /^[a-z]+$/i.test(w.word)).length;
  const can = (game: GameActivity): boolean =>
    game === "word_rain" ? isRainLevel(levelNumber) && typable >= MIN_GAME_ROUNDS : game === "word_bubbles" ? pictured >= BUBBLE_LANES : pictured >= MIN_GAME_ROUNDS;
  for (let i = 0; i < rotation.length; i++) {
    const game = rotation[(lessonIndex + i) % rotation.length];
    if (can(game)) return game;
  }
  return null;
}

/** Các bước dạng mới và trò chơi của bài thường `index` trong `count` bài thường (bản 2). */
function versionTwoSteps(options: BuildOptions, words: readonly BuilderWord[], index: number, count: number): BuiltStep[] {
  const levelNumber = options.levelNumber ?? 0;
  const steps: BuiltStep[] = [];
  for (const kind of EXTRA_KINDS) {
    if (!extraAllowed(kind, levelNumber)) continue;
    for (const key of distribute(options.extras?.[kind] ?? [], count, index)) steps.push(makeStep(kind, null, {}, key));
  }
  // Truyện làm phần thưởng cuối chủ đề: truyện thứ k vào bài thường thứ (count-1-k) tính từ cuối, vòng lại nếu nhiều truyện hơn bài.
  (options.stories ?? []).forEach((slug, k) => {
    if (count - 1 - (k % count) === index) steps.push({ activityType: "story", word: null, config: {}, questionKey: storyKey(slug) });
  });
  const game = planGame(levelNumber, index, words);
  if (game) steps.push(makeStep(game, null, {}));
  return steps;
}

const identityOf = (step: { activityType: string; questionKey?: string | null }) => `${step.activityType}|${step.questionKey ?? ""}`;

/**
 * Bài đã có tiến độ học thì không dựng lại: chỉ thêm các bước dạng mới / trò chơi chưa có ở cuối bài, không xóa hay đổi bước cũ
 * (nhờ vậy sao và kết quả đã có vẫn nguyên). Trả về các bước cần thêm theo thứ tự.
 */
export function planAppend(existing: readonly { activityType: string; questionKey?: string | null }[], built: readonly BuiltStep[]): BuiltStep[] {
  const have = new Set(existing.map(identityOf));
  return built.filter((step) => NEW_ACTIVITY_TYPES.includes(step.activityType) && !have.has(identityOf(step)));
}

/**
 * Tạo các bài của một chủ đề: các bài thường rồi một trận trùm.
 * Mỗi bài thường: thẻ từ cho từng từ → nghe và chọn hình → nối từ với hình → lật thẻ ghép cặp → chọn từ đúng cho hình.
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
  const customSizes = options.lessonSizes && options.lessonSizes.every((n) => n > 0) && options.lessonSizes.reduce((a, b) => a + b, 0) === words.length ? options.lessonSizes : null;
  const sizeList = customSizes ?? splitLessonSizes(words.length);
  for (const [index, size] of sizeList.entries()) {
    const group = words.slice(offset, offset + size);
    offset += size;
    const withPicture = group.filter((w) => w.hasPicture);

    const steps: BuiltStep[] = group.map((w) => makeStep("word_card", w.word, {}));
    if (canListen) steps.push(...withPicture.map((w) => listenStep(w.word)));
    if (withPicture.length >= MIN_PAIRS) {
      steps.push(makeStep("match_pairs", null, { pairCount: Math.min(withPicture.length, MAX_PAIRS) }));
    }
    if (withPicture.length >= MIN_MEMORY_WORDS) {
      // Thiếu từ có hình trong bài thì trình học lấy thêm từ cùng chủ đề cho đủ cặp.
      steps.push(makeStep("memory_game", null, { pairCount: Math.min(pictureCount, MAX_PAIRS) }));
    }
    if (canChoose) steps.push(...withPicture.map((w) => chooseStep(w.word)));
    if (options.levelNumber !== undefined) steps.push(...versionTwoSteps(options, words, index, sizeList.length));

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
