// Điều chỉnh độ khó trong bài (PRD Phần F), hàm thuần không đụng database.
//
// - 3 câu đúng ngay lần đầu liên tiếp → câu chọn kế thêm 1 đáp án nhiễu (tối đa 4 lựa chọn, vì phím tắt chỉ có 1–4).
// - 2 câu sai liên tiếp → câu chọn kế bớt 1 đáp án nhiễu (còn tối thiểu 2 lựa chọn) và từ được đọc chậm hơn.
// - Hết chuỗi (đúng hay sai xen kẽ) thì về mặc định. Không phạt: chỉ đổi độ khó của câu sau, không trừ điểm.
// - Chỉ tính từ kết quả của chính bài đang học, nên mở lại bài hay tải lại trang vẫn ra cùng độ khó. Bài thi lên cấp không dùng (đề công bằng cho mọi bé).

export const ADAPT = {
  /** Số câu đúng liên tiếp để thêm đáp án nhiễu. */
  upStreak: 3,
  /** Số câu sai liên tiếp để bớt đáp án nhiễu và đọc chậm. */
  downStreak: 2,
  minOptions: 2,
  maxOptions: 4,
  /** Tốc độ đọc khi đọc chậm (giọng mặc định là 0.82). */
  slowRate: 0.6,
} as const;

/** Phần của kết quả một mục mà việc điều chỉnh cần. */
export type AdaptItem = { firstTryCorrect: boolean; scored: boolean };

export type Performance = { correctStreak: number; wrongStreak: number };

export type Difficulty = {
  /** Thêm 1 đáp án nhiễu vào câu chọn kế. */
  extraOption: boolean;
  /** Bớt 1 đáp án nhiễu khỏi câu chọn kế. */
  fewerOption: boolean;
  /** Đọc chậm từ cần nghe. */
  slow: boolean;
};

export const NORMAL_DIFFICULTY: Difficulty = { extraOption: false, fewerOption: false, slow: false };

/** Một bước đúng khi mọi mục tính điểm của nó đúng ngay lần đầu; bước không có mục tính điểm (thẻ từ, làm lại) là trung tính (undefined). */
export function stepVerdict(items: readonly AdaptItem[]): boolean | undefined {
  const scored = items.filter((i) => i.scored);
  return scored.length === 0 ? undefined : scored.every((i) => i.firstTryCorrect);
}

/** Chuỗi đúng hoặc sai liên tiếp tính ngược từ bước vừa xong; bước trung tính không làm đứt chuỗi. */
export function performanceOf(results: readonly { items: readonly AdaptItem[] }[]): Performance {
  let correctStreak = 0;
  let wrongStreak = 0;
  let current: boolean | undefined;
  for (let i = results.length - 1; i >= 0; i--) {
    const verdict = stepVerdict(results[i].items);
    if (verdict === undefined) continue;
    if (current === undefined) current = verdict;
    if (verdict !== current) break;
    if (verdict) correctStreak += 1;
    else wrongStreak += 1;
  }
  return { correctStreak, wrongStreak };
}

export function difficultyFor(performance: Performance): Difficulty {
  if (performance.wrongStreak >= ADAPT.downStreak) return { extraOption: false, fewerOption: true, slow: true };
  if (performance.correctStreak >= ADAPT.upStreak) return { extraOption: true, fewerOption: false, slow: false };
  return NORMAL_DIFFICULTY;
}

/**
 * Áp độ khó lên các lựa chọn của một câu chọn: thêm một từ nhiễu dự phòng (`spare`) vào cuối, hoặc bỏ bớt một đáp án sai (từ cuối lên);
 * đáp án đúng không bao giờ bị bỏ và vị trí các lựa chọn còn lại giữ nguyên.
 */
export function adaptOptions<T extends { id: number }>(options: readonly T[], target: { id: number }, spare: readonly T[], difficulty: Difficulty): T[] {
  const list = [...options];
  if (difficulty.fewerOption && list.length > ADAPT.minOptions) {
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].id !== target.id) {
        list.splice(i, 1);
        break;
      }
    }
    return list;
  }
  if (difficulty.extraOption && list.length < ADAPT.maxOptions) {
    const extra = spare.find((w) => w.id !== target.id && !list.some((o) => o.id === w.id));
    if (extra) list.push(extra);
  }
  return list;
}
