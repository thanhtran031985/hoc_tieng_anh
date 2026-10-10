import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ADAPT, NORMAL_DIFFICULTY, adaptOptions, difficultyFor, performanceOf, stepVerdict } from "./adaptive.ts";

const right = { firstTryCorrect: true, scored: true };
const wrong = { firstTryCorrect: false, scored: true };
const step = (...items: { firstTryCorrect: boolean; scored: boolean }[]) => ({ items });
const word = (id: number) => ({ id, word: `w${id}` });

describe("stepVerdict", () => {
  it("đúng khi mọi mục tính điểm đúng ngay lần đầu, sai khi có mục sai", () => {
    assert.equal(stepVerdict([right, right]), true);
    assert.equal(stepVerdict([right, wrong]), false);
  });

  it("bước không có mục tính điểm (thẻ từ, làm lại) là trung tính", () => {
    assert.equal(stepVerdict([]), undefined);
    assert.equal(stepVerdict([{ firstTryCorrect: false, scored: false }]), undefined);
  });
});

describe("performanceOf", () => {
  it("đếm chuỗi đúng liên tiếp tính ngược từ câu vừa xong", () => {
    assert.deepEqual(performanceOf([step(wrong), step(right), step(right), step(right)]), { correctStreak: 3, wrongStreak: 0 });
  });

  it("đếm chuỗi sai liên tiếp", () => {
    assert.deepEqual(performanceOf([step(right), step(wrong), step(wrong)]), { correctStreak: 0, wrongStreak: 2 });
  });

  it("đúng sai xen kẽ thì chuỗi chỉ còn 1", () => {
    assert.deepEqual(performanceOf([step(right), step(wrong), step(right)]), { correctStreak: 1, wrongStreak: 0 });
  });

  it("bước trung tính không làm đứt chuỗi", () => {
    assert.deepEqual(performanceOf([step(right), step(), step(right), step(), step(right)]), { correctStreak: 3, wrongStreak: 0 });
  });

  it("chưa có kết quả nào", () => {
    assert.deepEqual(performanceOf([]), { correctStreak: 0, wrongStreak: 0 });
  });
});

describe("difficultyFor", () => {
  it("3 câu đúng liên tiếp thì thêm đáp án nhiễu", () => {
    assert.deepEqual(difficultyFor({ correctStreak: ADAPT.upStreak, wrongStreak: 0 }), { extraOption: true, fewerOption: false, slow: false });
    assert.deepEqual(difficultyFor({ correctStreak: 2, wrongStreak: 0 }), NORMAL_DIFFICULTY);
  });

  it("2 câu sai liên tiếp thì bớt đáp án và đọc chậm", () => {
    assert.deepEqual(difficultyFor({ correctStreak: 0, wrongStreak: ADAPT.downStreak }), { extraOption: false, fewerOption: true, slow: true });
    assert.deepEqual(difficultyFor({ correctStreak: 0, wrongStreak: 1 }), NORMAL_DIFFICULTY);
  });

  it("hết chuỗi thì về mặc định: sai 2 câu rồi đúng 1 câu", () => {
    const afterWrongs = performanceOf([step(wrong), step(wrong)]);
    assert.equal(difficultyFor(afterWrongs).fewerOption, true);
    const recovered = performanceOf([step(wrong), step(wrong), step(right)]);
    assert.deepEqual(difficultyFor(recovered), NORMAL_DIFFICULTY);
  });

  it("3 câu đúng rồi 1 câu sai thì về mặc định", () => {
    assert.deepEqual(difficultyFor(performanceOf([step(right), step(right), step(right), step(wrong)])), NORMAL_DIFFICULTY);
  });
});

describe("adaptOptions", () => {
  const options = [word(1), word(2), word(3)];
  const spare = [word(4), word(5)];
  const target = word(2);

  it("mặc định giữ nguyên", () => {
    assert.deepEqual(adaptOptions(options, target, spare, NORMAL_DIFFICULTY), options);
  });

  it("thêm 1 đáp án nhiễu dự phòng vào cuối, giữ nguyên thứ tự các lựa chọn cũ", () => {
    const out = adaptOptions(options, target, spare, { extraOption: true, fewerOption: false, slow: false });
    assert.deepEqual(out.map((o) => o.id), [1, 2, 3, 4]);
  });

  it("đã đủ 4 lựa chọn thì không thêm; không có từ dự phòng thì không thêm", () => {
    const four = [...options, word(9)];
    assert.equal(adaptOptions(four, target, spare, { extraOption: true, fewerOption: false, slow: false }).length, 4);
    assert.equal(adaptOptions(options, target, [], { extraOption: true, fewerOption: false, slow: false }).length, 3);
  });

  it("từ dự phòng trùng lựa chọn có sẵn hoặc trùng đáp án đúng thì bỏ qua", () => {
    const out = adaptOptions(options, target, [word(1), word(2), word(7)], { extraOption: true, fewerOption: false, slow: false });
    assert.deepEqual(out.map((o) => o.id), [1, 2, 3, 7]);
  });

  it("bớt 1 đáp án sai (từ cuối lên), không bao giờ bỏ đáp án đúng", () => {
    const out = adaptOptions(options, target, spare, { extraOption: false, fewerOption: true, slow: true });
    assert.deepEqual(out.map((o) => o.id), [1, 2]);
    const last = adaptOptions([word(1), word(3), word(2)], target, spare, { extraOption: false, fewerOption: true, slow: true });
    assert.deepEqual(last.map((o) => o.id), [1, 2]);
  });

  it("chỉ còn 2 lựa chọn thì không bớt nữa", () => {
    const two = [word(1), word(2)];
    assert.deepEqual(adaptOptions(two, target, spare, { extraOption: false, fewerOption: true, slow: true }), two);
  });

  it("không đổi mảng gốc", () => {
    const copy = [...options];
    adaptOptions(options, target, spare, { extraOption: true, fewerOption: false, slow: false });
    assert.deepEqual(options, copy);
  });
});
