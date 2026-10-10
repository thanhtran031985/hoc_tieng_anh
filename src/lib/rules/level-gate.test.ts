import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EXAM_LAST_LEVEL, hasLevelExam, levelGateState, placeWord } from "./level-gate.ts";

const unit = (id: number, lessonCount: number, doneCount: number) => ({ id, titleVi: `Vùng ${id}`, lessonCount, doneCount });

describe("levelGateState", () => {
  it("còn vùng chưa xong thì cổng khóa và đếm đúng số vùng còn lại", () => {
    const gate = levelGateState([unit(1, 5, 5), unit(2, 5, 5), unit(3, 5, 5), unit(4, 5, 2)]);
    assert.equal(gate.status, "locked");
    assert.equal(gate.left, 1);
    assert.deepEqual(gate.units.map((u) => u.done), [true, true, true, false]);
    assert.equal(gate.units[3].remaining, 3);
  });

  it("xong mọi bài thường của mọi vùng thì cổng mở", () => {
    const gate = levelGateState([unit(1, 5, 5), unit(2, 6, 6), unit(3, 3, 3), unit(4, 4, 4)]);
    assert.equal(gate.status, "open");
    assert.equal(gate.left, 0);
  });

  it("cấp chưa có vùng nào thì cổng khóa", () => {
    const gate = levelGateState([]);
    assert.equal(gate.status, "locked");
    assert.equal(gate.left, 0);
  });

  it("vùng không có bài thường được coi là xong, không giữ cổng khóa mãi", () => {
    assert.equal(levelGateState([unit(1, 0, 0), unit(2, 4, 4)]).status, "open");
  });

  it("số bài đã xong vượt số bài không làm số còn thiếu âm", () => {
    assert.equal(levelGateState([unit(1, 3, 5)]).units[0].remaining, 0);
  });
});

describe("hasLevelExam", () => {
  it("chỉ cấp 1–4 có bài thi lên cấp", () => {
    assert.equal(EXAM_LAST_LEVEL, 4);
    for (const n of [1, 2, 3, 4]) assert.equal(hasLevelExam(n), true);
    for (const n of [0, 5, 6, 10]) assert.equal(hasLevelExam(n), false);
  });
});

describe("placeWord", () => {
  it("cấp 1–5 là đảo, cấp 6–10 là thành phố", () => {
    assert.equal(placeWord(4), "đảo");
    assert.equal(placeWord(5), "đảo");
    assert.equal(placeWord(6), "thành phố");
  });
});
