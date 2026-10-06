import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { accuracy, newStars, rewardFor, starsFor } from "./lesson-score.ts";

const items = (correct: number, wrong: number) => [...Array(correct).fill({ firstTryCorrect: true }), ...Array(wrong).fill({ firstTryCorrect: false })];

describe("starsFor", () => {
  it("3 sao từ 90% đúng ngay lần đầu", () => {
    assert.equal(starsFor(items(10, 0)), 3);
    assert.equal(starsFor(items(9, 1)), 3);
  });
  it("2 sao từ 70% đến dưới 90%", () => {
    assert.equal(starsFor(items(8, 2)), 2);
    assert.equal(starsFor(items(7, 3)), 2);
  });
  it("còn lại 1 sao, luôn có ít nhất 1 sao", () => {
    assert.equal(starsFor(items(6, 4)), 1);
    assert.equal(starsFor(items(0, 5)), 1);
  });
  it("bài không có mục chấm (chỉ thẻ từ) được 3 sao", () => {
    assert.equal(starsFor([]), 3);
    assert.equal(accuracy([]), 1);
  });
  it("ngưỡng tính đúng ở biên với số mục lẻ", () => {
    assert.equal(starsFor(items(17, 3)), 2); // 85%
    assert.equal(starsFor(items(18, 2)), 3); // 90%
    assert.equal(starsFor(items(7, 3)), 2); // 70%
    assert.equal(starsFor(items(13, 7)), 1); // 65%
  });
});

describe("rewardFor", () => {
  it("Tiểu học (cấp 1–5): 10 xu + 5 xu mỗi sao, không có XP", () => {
    assert.deepEqual(rewardFor(1, 1), { coins: 15, xp: 0 });
    assert.deepEqual(rewardFor(3, 4), { coins: 25, xp: 0 });
    assert.deepEqual(rewardFor(2, 5), { coins: 20, xp: 0 });
  });
  it("THCS (cấp 6 trở lên): 20 XP + 10 XP mỗi sao, không có xu", () => {
    assert.deepEqual(rewardFor(3, 6), { coins: 0, xp: 50 });
    assert.deepEqual(rewardFor(1, 10), { coins: 0, xp: 30 });
  });
});

describe("newStars", () => {
  it("chỉ cộng phần sao vượt kết quả tốt nhất cũ", () => {
    assert.equal(newStars(3, 0), 3);
    assert.equal(newStars(3, 2), 1);
    assert.equal(newStars(2, 3), 0);
    assert.equal(newStars(1, 1), 0);
  });
});
