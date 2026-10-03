import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { estimateMinutes, insertIndex, isActivityStep, lessonStats } from "./admin-builder.ts";

const step = (activityType: "word_card" | "listen_choose_picture" | "choose_word_for_picture" | "match_pairs" | "memory_game", wordId: number | null = null) => ({ activityType, wordId });

describe("estimateMinutes", () => {
  it("cộng theo từng dạng bài, làm tròn, không dưới 5 và không quá 30 phút", () => {
    assert.equal(estimateMinutes([]), 5);
    assert.equal(estimateMinutes(Array.from({ length: 30 }, () => step("word_card", 1))), 10);
    assert.equal(estimateMinutes(Array.from({ length: 200 }, () => step("memory_game"))), 30);
  });
});

describe("lessonStats và isActivityStep", () => {
  it("đếm từ khác nhau ở thẻ từ và các bước hoạt động", () => {
    const steps = [step("word_card", 1), step("word_card", 1), step("word_card", 2), step("listen_choose_picture", 1), step("match_pairs")];
    assert.deepEqual(lessonStats(steps), { words: 2, activities: 2 });
    assert.equal(isActivityStep(step("word_card", 1)), false);
    assert.equal(isActivityStep(step("memory_game")), true);
  });
});

describe("insertIndex", () => {
  it("chèn cuối bài, trước trò chơi lật thẻ nếu nó ở cuối", () => {
    assert.equal(insertIndex([]), 0);
    assert.equal(insertIndex([step("word_card", 1), step("listen_choose_picture", 1)]), 2);
    assert.equal(insertIndex([step("word_card", 1), step("memory_game")]), 1);
  });
});
