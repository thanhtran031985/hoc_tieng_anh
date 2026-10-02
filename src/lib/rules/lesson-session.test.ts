import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { baseId, completeStep, createSession, currentStepId, isFinished, isRetryId, progressOf, restoreSession, scoredItems, type ItemResult } from "./lesson-session.ts";

const item = (wordId: number, over: Partial<ItemResult> = {}): ItemResult => ({ wordId, firstTryCorrect: true, wrong: 0, revealed: false, picks: [], scored: true, ...over });

describe("lesson-session", () => {
  it("đi lần lượt qua các bước và báo tiến độ", () => {
    let s = createSession(["a", "b"]);
    assert.equal(currentStepId(s), "a");
    assert.deepEqual(progressOf(s), { value: 0, max: 2 });
    s = completeStep(s, { stepId: "a", items: [item(1)] });
    assert.equal(currentStepId(s), "b");
    assert.deepEqual(progressOf(s), { value: 1, max: 2 });
    s = completeStep(s, { stepId: "b", items: [item(2)] });
    assert.ok(isFinished(s));
    assert.equal(currentStepId(s), null);
    assert.deepEqual(progressOf(s), { value: 2, max: 2 });
  });

  it("bỏ qua kết quả của bước không phải bước hiện tại", () => {
    const s = createSession(["a", "b"]);
    assert.equal(completeStep(s, { stepId: "b", items: [item(1)] }), s);
  });

  it("xem đáp án thì thêm bước làm lại ở cuối, tổng tăng thêm 1", () => {
    let s = createSession(["a", "b"]);
    s = completeStep(s, { stepId: "a", items: [item(1, { firstTryCorrect: false, wrong: 3, revealed: true })] });
    assert.deepEqual(s.order, ["a", "b", "a~r"]);
    assert.equal(progressOf(s).max, 3);
    s = completeStep(s, { stepId: "b", items: [item(2)] });
    assert.equal(currentStepId(s), "a~r");
    assert.ok(isRetryId("a~r") && baseId("a~r") === "a");
  });

  it("mục của bước làm lại không tính điểm và không làm lại lần nữa", () => {
    let s = createSession(["a"]);
    s = completeStep(s, { stepId: "a", items: [item(1, { firstTryCorrect: false, wrong: 3, revealed: true })] });
    s = completeStep(s, { stepId: "a~r", items: [item(1, { firstTryCorrect: false, wrong: 3, revealed: true })] });
    assert.ok(isFinished(s));
    assert.deepEqual(s.order, ["a", "a~r"]);
    assert.equal(scoredItems(s).length, 1);
    assert.equal(scoredItems(s)[0].revealed, true);
  });

  it("scoredItems gộp mọi mục tính điểm của các bước", () => {
    let s = createSession(["a", "b", "c"]);
    s = completeStep(s, { stepId: "a", items: [] });
    s = completeStep(s, { stepId: "b", items: [item(1), item(2, { firstTryCorrect: false, wrong: 1 })] });
    s = completeStep(s, { stepId: "c", items: [item(3)] });
    assert.deepEqual(
      scoredItems(s).map((i) => i.wordId),
      [1, 2, 3],
    );
  });

  it("restoreSession khôi phục dữ liệu hợp lệ và từ chối dữ liệu không khớp bài", () => {
    let s = createSession(["a", "b"]);
    s = completeStep(s, { stepId: "a", items: [item(1, { revealed: true })] });
    const saved = JSON.parse(JSON.stringify(s));
    const valid = new Set(["a", "b"]);
    assert.deepEqual(restoreSession(saved, valid), s);
    assert.equal(restoreSession(saved, new Set(["a"])), null);
    assert.equal(restoreSession({ ...saved, position: 9 }, valid), null);
    assert.equal(restoreSession({ ...saved, results: [] }, valid), null);
    assert.equal(restoreSession("x", valid), null);
    assert.equal(restoreSession(null, valid), null);
  });
});
