// Dựng phiên Ôn tập hôm nay từ các thẻ đến hạn (hàm thuần, không đụng database).
// Mỗi từ vào đúng một câu: các từ cuối ghép thành một bước nối cặp, còn lại xen kẽ nghe-chọn-hình và chọn-từ-cho-hình.
// Import tương đối có đuôi .ts để Node chạy thẳng được (test).
import type { PlayStep, PlayWord } from "./lesson-play.ts";
import { seededRandom, shuffled } from "./random.ts";
import { isPrimaryLevel } from "./lesson-score.ts";

/** Số mục tối đa một phiên: Tiểu học 15, THCS 20 (PRD C11). */
export const MAX_REVIEW_ITEMS_PRIMARY = 15;
export const MAX_REVIEW_ITEMS_SECONDARY = 20;

/** Từ ít hơn mức này thì không ghép nối cặp (cần ít nhất 2 cặp còn lại là câu lẻ). */
const MATCH_MIN_WORDS = 6;
const MATCH_PAIRS = 4;
const OPTION_COUNT = 3;

export const maxReviewItems = (levelNumber: number) => (isPrimaryLevel(levelNumber) ? MAX_REVIEW_ITEMS_PRIMARY : MAX_REVIEW_ITEMS_SECONDARY);

export type DueWord = PlayWord & { box: number };

/**
 * Các bước của phiên ôn. `due` đã sắp theo thứ tự ưu tiên (hộp thấp, hạn cũ trước); `pool` là các từ có hình khác làm đáp án nhiễu.
 * Id bước là `r1`, `r2`… để không lẫn với id số của bài học. Từ không có hình bị bỏ qua (cả ba dạng đều cần hình).
 */
export function buildReviewSteps(due: readonly DueWord[], pool: readonly PlayWord[], seed: string, limit: number): PlayStep[] {
  const random = seededRandom(seed);
  const words = due.filter((w) => w.image !== null).slice(0, limit);
  const matchWords = words.length >= MATCH_MIN_WORDS ? words.slice(-MATCH_PAIRS) : [];
  const singles = matchWords.length > 0 ? words.slice(0, -MATCH_PAIRS) : words;

  const distractors = (target: PlayWord, onlyPictures: boolean) =>
    shuffled(
      [...words, ...pool].filter((w, i, all) => w.id !== target.id && (!onlyPictures || w.image !== null) && all.findIndex((x) => x.id === w.id) === i),
      random,
    ).slice(0, OPTION_COUNT - 1);

  const steps: PlayStep[] = [];
  singles.forEach((target, index) => {
    const options = shuffled([target, ...distractors(target, true)], random);
    if (options.length < 2) return;
    steps.push(
      index % 2 === 0
        ? { id: "", kind: "listen_choose_picture", target, options, autoPlay: true }
        : { id: "", kind: "choose_word_for_picture", target, options },
    );
  });
  // Câu nối cặp đặt giữa phiên cho đỡ đơn điệu.
  if (matchWords.length > 0) steps.splice(Math.floor(steps.length / 2), 0, { id: "", kind: "match_pairs", pairs: matchWords });
  return steps.map((s, i) => ({ ...s, id: `r${i + 1}` }));
}

export type ReviewReward = { stars: number; coins: number; xp: number };

/** Thưởng sau phiên ôn: mỗi từ 1 sao (thiết kế); Tiểu học thêm 1 xu mỗi từ, THCS thêm 2 XP mỗi từ (PRD Phần F). */
export function rewardForReview(words: number, levelNumber: number): ReviewReward {
  const n = Math.max(0, Math.trunc(words));
  return isPrimaryLevel(levelNumber) ? { stars: n, coins: n, xp: 0 } : { stars: n, coins: 0, xp: 2 * n };
}

export type ReviewWordResult = { wordId: number; right: boolean };

/** Gộp kết quả các mục thành kết quả theo từ: từ "nhớ" khi mọi mục của từ đúng ngay lần đầu. */
export function wordResults(items: readonly { wordId: number; firstTryCorrect: boolean }[]): ReviewWordResult[] {
  const byWord = new Map<number, boolean>();
  for (const item of items) byWord.set(item.wordId, (byWord.get(item.wordId) ?? true) && item.firstTryCorrect);
  return [...byWord].map(([wordId, right]) => ({ wordId, right }));
}
