import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { answerPlacement, createPlacement, isPlacementDone, pickQuestion, placementComment, startLevel, suggestLevel, type PlacementState } from "./placement.ts";

const run = (grade: number, maxLevel: number, answers: string): PlacementState => {
  let state = createPlacement(grade, maxLevel);
  for (const c of answers) state = answerPlacement(state, c === "o", maxLevel);
  return state;
};

describe("startLevel", () => {
  it("bằng lớp, kẹp vào [1, cấp cao nhất có nội dung]", () => {
    assert.equal(startLevel(3, 4), 3);
    assert.equal(startLevel(7, 4), 4);
    assert.equal(startLevel(0, 4), 1);
  });
});

describe("answerPlacement", () => {
  it("đúng 3 câu liên tiếp thì lên một cấp, đếm lại từ 0", () => {
    const s = run(2, 4, "ooo");
    assert.equal(s.level, 3);
    assert.equal(s.rightRun, 0);
    assert.equal(run(2, 4, "ooxoo").level, 2);
  });

  it("sai 2 câu liên tiếp thì xuống một cấp; sai cách quãng thì không", () => {
    assert.equal(run(3, 4, "xx").level, 2);
    assert.equal(run(3, 4, "xoxo").level, 3);
  });

  it("không vượt cấp cao nhất và không xuống dưới cấp 1", () => {
    assert.equal(run(4, 4, "ooo").level, 4);
    assert.equal(run(1, 4, "xxxx").level, 1);
  });

  it("đủ 12 câu thì xong; ghi lại cấp của từng câu", () => {
    const s = run(3, 4, "oooxxxooxxoo");
    assert.equal(s.answers.length, 12);
    assert.ok(isPlacementDone(s));
    assert.deepEqual(
      s.answers.slice(0, 4).map((a) => a.level),
      [3, 3, 3, 4],
    );
  });
});

describe("suggestLevel", () => {
  it("đúng hết thì cấp cao nhất đã tới", () => {
    assert.equal(suggestLevel(run(3, 4, "oooooooooooo").answers, 4, 3), 4);
  });

  it("cấp cao nhất có ≥ 2 câu và đúng ≥ 70%", () => {
    // Cấp 3: đúng 3 → lên cấp 4: sai 2 → xuống cấp 3: đúng thêm.
    const answers = run(3, 4, "oooxxoooo").answers;
    assert.equal(suggestLevel(answers, 4, 3), 3);
  });

  it("không cấp nào đạt thì cấp thấp nhất đã gặp", () => {
    assert.equal(suggestLevel(run(3, 4, "xxxxxxxxxxxx").answers, 4, 3), 1);
  });

  it("cấp chỉ có 1 câu không được xét; không có câu nào thì dùng cấp mặc định", () => {
    assert.equal(suggestLevel([{ level: 4, correct: true }, ...run(2, 4, "oo").answers], 4, 2), 2);
    assert.equal(suggestLevel([], 4, 7), 4);
  });
});

describe("placementComment", () => {
  it("nêu chủ đề vững và chủ đề sẽ học, không nói điểm", () => {
    const text = placementComment("Minh", ["Con vật", "Màu sắc"], ["Trái cây"], "Cấp 2 · Mầm non");
    assert.match(text, /Minh nhận ra Con vật và Màu sắc rất nhanh/);
    assert.match(text, /Trái cây còn hơi mới/);
    assert.doesNotMatch(text, /điểm|\d+ câu/);
    assert.match(placementComment("Minh", [], [], "Cấp 1 · Hạt giống"), /còn khá mới với Minh/);
  });
});

describe("pickQuestion", () => {
  const pools = { 1: [{ id: "a" }, { id: "b" }], 2: [{ id: "c" }], 4: [{ id: "d" }] };
  it("lấy câu chưa hỏi ở đúng cấp; hết thì lấy cấp gần nhất", () => {
    assert.equal(pickQuestion(pools, 1, new Set())?.id, "a");
    assert.equal(pickQuestion(pools, 1, new Set(["a"]))?.id, "b");
    assert.equal(pickQuestion(pools, 1, new Set(["a", "b"]))?.id, "c");
    assert.equal(pickQuestion(pools, 3, new Set())?.id, "c");
    assert.equal(pickQuestion(pools, 2, new Set(["c", "a", "b"]))?.id, "d");
  });
  it("kho hết thì null", () => {
    assert.equal(pickQuestion(pools, 2, new Set(["a", "b", "c", "d"])), null);
  });
});
