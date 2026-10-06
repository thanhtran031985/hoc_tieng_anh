import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isLowCoverage, peakLevel, percent, pickWarnings, sumByLevel, type WarningInput } from "./admin-dashboard.ts";

const zeros = () => Array.from({ length: 10 }, () => 0);

describe("percent và isLowCoverage", () => {
  it("làm tròn, chặn ở 100, tổng 0 là null", () => {
    assert.equal(percent(1, 3), 33);
    assert.equal(percent(2, 3), 67);
    assert.equal(percent(5, 4), 100);
    assert.equal(percent(0, 0), null);
  });

  it("dưới 90% là thấp; đúng 90% và chưa có số thì không", () => {
    assert.equal(isLowCoverage(89), true);
    assert.equal(isLowCoverage(90), false);
    assert.equal(isLowCoverage(null), false);
  });
});

describe("sumByLevel", () => {
  it("cộng theo cấp thành mảng 10 phần tử và bỏ cấp ngoài 1–10", () => {
    const result = sumByLevel([
      { levelNumber: 1, count: 2 },
      { levelNumber: 1, count: 3 },
      { levelNumber: 10, count: 4 },
      { levelNumber: 0, count: 9 },
      { levelNumber: 11, count: 9 },
    ]);
    assert.equal(result.length, 10);
    assert.equal(result[0], 5);
    assert.equal(result[9], 4);
    assert.equal(result.reduce((a, b) => a + b, 0), 9);
  });
});

describe("peakLevel", () => {
  it("lấy cấp lớn nhất, hòa thì cấp thấp hơn, toàn 0 là null", () => {
    assert.equal(peakLevel([0, 0, 5, 1, 5, 0, 0, 0, 0, 0]), 3);
    assert.equal(peakLevel(zeros()), null);
  });
});

describe("pickWarnings", () => {
  const empty: WarningInput = {
    wordsNoImage: { count: 0, examples: [], byLevel: zeros() },
    wordsNoAudio: { count: 0, examples: [], byLevel: zeros() },
    thinUnits: [],
    questionsNoExplanation: 0,
    draftLessons: 0,
  };

  it("kho đủ nội dung thì không có cảnh báo", () => {
    assert.deepEqual(pickWarnings(empty), []);
  });

  it("từ thiếu hình là cảnh báo, kèm cấp nhiều nhất và ví dụ; thiếu âm thanh chỉ là thông tin", () => {
    const list = pickWarnings({
      ...empty,
      wordsNoImage: { count: 37, examples: ["gravity"], byLevel: [0, 0, 0, 0, 0, 0, 1, 20, 10, 6] },
      wordsNoAudio: { count: 52, examples: ["father"], byLevel: zeros() },
    });
    assert.deepEqual(list.map((w) => [w.kind, w.tone]), [["image", "alert"], ["audio", "info"]]);
    assert.equal(list[0].title, "37 từ chưa có hình");
    assert.equal(list[0].detail, "Nhiều nhất ở cấp 8");
    assert.deepEqual(list[0].examples, ["gravity"]);
  });

  it("chủ đề chưa đủ bài chỉ liệt kê 3 chủ đề đầu rồi gộp phần còn lại", () => {
    const thinUnits = [1, 2, 3, 4, 5].map((n) => ({ levelNumber: n, title: `U${n}`, lessons: 1 }));
    const [warning] = pickWarnings({ ...empty, thinUnits });
    assert.equal(warning.title, "5 chủ đề chưa đủ 4 bài học");
    assert.equal(warning.detail, "Cấp 1 · U1 (1 bài) · Cấp 2 · U2 (1 bài) · Cấp 3 · U3 (1 bài) · và 2 chủ đề nữa");
  });
});
