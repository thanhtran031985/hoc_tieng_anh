import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildReviewSteps, maxReviewItems, rewardForReview, wordResults, type DueWord } from "./review-play.ts";
import type { PlayWord } from "./lesson-play.ts";

const word = (id: number, image = true): DueWord => ({
  id,
  word: `w${id}`,
  ipa: null,
  meaningVi: `từ ${id}`,
  exampleEn: null,
  exampleVi: null,
  image: image ? `/media/pictures/w${id}.svg` : null,
  box: 1,
});
const pool: PlayWord[] = [word(101), word(102), word(103), word(104)];

describe("buildReviewSteps", () => {
  it("ít từ: mỗi từ một câu lẻ, xen kẽ nghe-chọn-hình và chọn-từ, id r1…", () => {
    const steps = buildReviewSteps([word(1), word(2), word(3)], pool, "s", 15);
    assert.deepEqual(
      steps.map((s) => [s.id, s.kind]),
      [
        ["r1", "listen_choose_picture"],
        ["r2", "choose_word_for_picture"],
        ["r3", "listen_choose_picture"],
      ],
    );
    for (const s of steps) {
      if (s.kind === "match_pairs" || s.kind === "word_card" || s.kind === "memory_game") continue;
      assert.ok(s.options.some((o) => o.id === s.target.id));
      assert.equal(new Set(s.options.map((o) => o.id)).size, s.options.length);
    }
  });

  it("từ 6 trở lên: 4 từ cuối ghép nối cặp, mỗi từ đúng một lần", () => {
    const due = [1, 2, 3, 4, 5, 6, 7].map((i) => word(i));
    const steps = buildReviewSteps(due, pool, "s", 15);
    const match = steps.find((s) => s.kind === "match_pairs");
    assert.ok(match && match.kind === "match_pairs");
    assert.deepEqual(match.pairs.map((p) => p.id), [4, 5, 6, 7]);
    const covered = steps.flatMap((s) => (s.kind === "match_pairs" ? s.pairs.map((p) => p.id) : s.kind === "word_card" || s.kind === "memory_game" ? [] : [s.target.id]));
    assert.deepEqual(covered.sort(), [1, 2, 3, 4, 5, 6, 7]);
  });

  it("bỏ từ không có hình, cắt theo giới hạn, cùng seed cho cùng kết quả", () => {
    const due = [word(1, false), ...[2, 3, 4, 5, 6, 7, 8, 9].map((i) => word(i))];
    const a = buildReviewSteps(due, pool, "x", 5);
    const b = buildReviewSteps(due, pool, "x", 5);
    assert.deepEqual(a, b);
    const ids = a.flatMap((s) => (s.kind === "match_pairs" ? s.pairs.map((p) => p.id) : s.kind === "word_card" || s.kind === "memory_game" ? [] : [s.target.id]));
    assert.equal(ids.length, 5);
    assert.ok(!ids.includes(1));
  });

  it("không đủ từ nhiễu cho câu lẻ thì bỏ câu đó", () => {
    assert.deepEqual(buildReviewSteps([word(1)], [], "s", 15), []);
  });
});

describe("rewardForReview và wordResults", () => {
  it("Tiểu học 1 sao + 1 xu mỗi từ, THCS 1 sao + 2 XP mỗi từ", () => {
    assert.deepEqual(rewardForReview(12, 2), { stars: 12, coins: 12, xp: 0 });
    assert.deepEqual(rewardForReview(5, 7), { stars: 5, coins: 0, xp: 10 });
    assert.deepEqual(rewardForReview(0, 1), { stars: 0, coins: 0, xp: 0 });
    assert.equal(maxReviewItems(3), 15);
    assert.equal(maxReviewItems(6), 20);
  });

  it("từ nhớ khi mọi mục của từ đúng ngay lần đầu", () => {
    const results = wordResults([
      { wordId: 1, firstTryCorrect: true },
      { wordId: 2, firstTryCorrect: false },
      { wordId: 1, firstTryCorrect: true },
      { wordId: 3, firstTryCorrect: true },
      { wordId: 3, firstTryCorrect: false },
    ]);
    assert.deepEqual(results, [
      { wordId: 1, right: true },
      { wordId: 2, right: false },
      { wordId: 3, right: false },
    ]);
  });
});
