// Dựng bộ câu hỏi của một bài học từ các bước đã lưu (hàm thuần, không đụng database).
// Bước chỉ lưu dạng bài và từ; đáp án nhiễu chọn ở đây từ các từ cùng chủ đề, xáo theo hạt giống để tải lại trang vẫn ra đúng bộ cũ.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import { seededRandom, shuffled } from "./random.ts";

export type PlayWord = {
  id: number;
  word: string;
  ipa: string | null;
  meaningVi: string;
  exampleEn: string | null;
  exampleVi: string | null;
  /** Đường dẫn hình minh họa; null nếu từ chưa có hình. */
  image: string | null;
};

/** Một bước đã lưu, cấu hình đã qua Zod (thiếu thì mặc định). */
export type StoredStep = {
  id: number;
  activityType: string;
  config: { showExample?: boolean; autoPlay?: boolean; optionCount?: number; pairCount?: number } | null;
  word: PlayWord | null;
};

export type PlayStep =
  | { id: string; kind: "word_card"; word: PlayWord; showExample: boolean; ordinal: number; total: number }
  | { id: string; kind: "listen_choose_picture"; target: PlayWord; options: PlayWord[]; autoPlay: boolean }
  | { id: string; kind: "choose_word_for_picture"; target: PlayWord; options: PlayWord[] }
  | { id: string; kind: "match_pairs"; pairs: PlayWord[] };

export type PlayStepKind = PlayStep["kind"];

const DEFAULT_OPTIONS = 3;
const DEFAULT_PAIRS = 4;
const MIN_PAIRS = 2;

const hasPicture = (w: PlayWord | null): w is PlayWord => w !== null && w.image !== null;

function uniqueById(words: readonly PlayWord[]): PlayWord[] {
  const seen = new Set<number>();
  return words.filter((w) => !seen.has(w.id) && seen.add(w.id));
}

/**
 * Các bước của bài, theo thứ tự đã lưu, kèm đáp án nhiễu. Bước không dựng được (thiếu hình, không đủ từ nhiễu, dạng bài lạ) bị bỏ qua.
 * `unitWords`: các từ của cả chủ đề, làm nguồn đáp án nhiễu.
 */
export function buildPlaySteps(steps: readonly StoredStep[], unitWords: readonly PlayWord[], seed: string): PlayStep[] {
  const random = seededRandom(seed);
  const cardWords = steps.filter((s) => s.activityType === "word_card" && s.word !== null);
  const lessonPictureWords = uniqueById(cardWords.flatMap((s) => (hasPicture(s.word) ? [s.word] : [])));
  const pictureWords = unitWords.filter(hasPicture);

  const play: PlayStep[] = [];
  let cardOrdinal = 0;
  for (const step of steps) {
    const id = `s${step.id}`;
    const config = step.config ?? {};
    switch (step.activityType) {
      case "word_card": {
        if (!step.word) break;
        cardOrdinal += 1;
        play.push({ id, kind: "word_card", word: step.word, showExample: config.showExample ?? true, ordinal: cardOrdinal, total: cardWords.length });
        break;
      }
      case "listen_choose_picture":
      case "choose_word_for_picture": {
        const target = step.word;
        if (!hasPicture(target)) break;
        const listen = step.activityType === "listen_choose_picture";
        // Nghe và chọn hình: các lựa chọn là hình nên chỉ lấy từ có hình. Chọn từ cho hình: lựa chọn là chữ, lấy từ cả chủ đề.
        const pool = (listen ? pictureWords : unitWords).filter((w) => w.id !== target.id);
        const count = config.optionCount ?? DEFAULT_OPTIONS;
        const options = shuffled([target, ...shuffled(pool, random).slice(0, count - 1)], random);
        if (options.length < 2) break;
        play.push(
          listen
            ? { id, kind: "listen_choose_picture", target, options, autoPlay: config.autoPlay ?? true }
            : { id, kind: "choose_word_for_picture", target, options },
        );
        break;
      }
      case "match_pairs": {
        const pairs = lessonPictureWords.slice(0, config.pairCount ?? DEFAULT_PAIRS);
        if (pairs.length < MIN_PAIRS) break;
        play.push({ id, kind: "match_pairs", pairs });
        break;
      }
      default:
        break;
    }
  }
  return play;
}
