import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { saveGameRecordSchema } from "./game-record.ts";

const ok = { game: "race", lessonId: 5, correct: 6, total: 8, sequence: [1, 0, 1, 1, 1, 0, 1, 1, 1, 1] };

describe("saveGameRecordSchema", () => {
  it("nhận thành tích hợp lệ của 4 trò", () => {
    for (const game of ["rain", "bubbles", "whack", "race"]) assert.equal(saveGameRecordSchema.safeParse({ ...ok, game }).success, true);
  });
  it("từ chối trò lạ, số âm, đúng nhiều hơn tổng, dãy có giá trị lạ hoặc quá dài", () => {
    assert.equal(saveGameRecordSchema.safeParse({ ...ok, game: "memory" }).success, false);
    assert.equal(saveGameRecordSchema.safeParse({ ...ok, lessonId: 0 }).success, false);
    assert.equal(saveGameRecordSchema.safeParse({ ...ok, correct: -1 }).success, false);
    assert.equal(saveGameRecordSchema.safeParse({ ...ok, correct: 9, total: 8 }).success, false);
    assert.equal(saveGameRecordSchema.safeParse({ ...ok, sequence: [1, 2] }).success, false);
    assert.equal(saveGameRecordSchema.safeParse({ ...ok, sequence: Array(61).fill(1) }).success, false);
    assert.equal(saveGameRecordSchema.safeParse({ ...ok, total: 0 }).success, false);
  });
});
