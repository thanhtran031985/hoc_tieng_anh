import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { stageForLevel } from "./mascot-stage.ts";

describe("stageForLevel", () => {
  it("cấp 1–5 ứng với dáng 1–5", () => {
    assert.deepEqual([1, 2, 3, 4, 5].map(stageForLevel), [1, 2, 3, 4, 5]);
  });

  it("cấp 6–10 giữ dáng 5", () => {
    for (const n of [6, 7, 8, 9, 10]) assert.equal(stageForLevel(n), 5);
  });

  it("giá trị ngoài khoảng hoặc không hợp lệ lấy dáng gần nhất", () => {
    assert.equal(stageForLevel(0), 1);
    assert.equal(stageForLevel(-3), 1);
    assert.equal(stageForLevel(Number.NaN), 1);
    assert.equal(stageForLevel(3.9), 3);
  });
});
