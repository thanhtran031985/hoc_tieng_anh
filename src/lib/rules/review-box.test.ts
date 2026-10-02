import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { intervalDays, intervalLabel, isMastered, MASTERY_NAMES, masteryOf, nextReview } from "./review-box.ts";

const day = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

describe("nextReview", () => {
  it("từ mới học vào hộp 1, đến hạn ngày mai, dù lần đầu đúng hay sai", () => {
    const right = nextReview(null, true, day("2026-10-05"));
    assert.deepEqual(right, { box: 1, correctCount: 1, wrongCount: 0, dueOn: day("2026-10-06") });
    const wrong = nextReview(null, false, day("2026-10-05"));
    assert.deepEqual(wrong, { box: 1, correctCount: 0, wrongCount: 1, dueOn: day("2026-10-06") });
  });

  it("đúng thì lên một hộp, hẹn theo mốc 1/3/7/14/30 ngày", () => {
    let card = nextReview(null, true, day("2026-10-01"));
    const expected = [
      [2, "2026-10-04"],
      [3, "2026-10-08"],
      [4, "2026-10-15"],
      [5, "2026-10-31"],
    ] as const;
    for (const [box, due] of expected) {
      card = nextReview(card, true, day("2026-10-01"));
      assert.equal(card.box, box);
      assert.deepEqual(card.dueOn, day(due));
    }
  });

  it("hộp 5 đúng nữa vẫn ở hộp 5; sai thì về hộp 1", () => {
    const top = { box: 5, correctCount: 4, wrongCount: 0 };
    assert.equal(nextReview(top, true, day("2026-10-01")).box, 5);
    const back = nextReview(top, false, day("2026-10-01"));
    assert.deepEqual(back, { box: 1, correctCount: 4, wrongCount: 1, dueOn: day("2026-10-02") });
  });

  it("chuỗi đúng/sai nhiều lần: sai ở hộp 4 về hộp 1, rồi đi lại từ đầu", () => {
    let card = nextReview(null, true, day("2026-10-01"));
    for (let i = 0; i < 3; i++) card = nextReview(card, true, day("2026-10-01"));
    assert.equal(card.box, 4);
    card = nextReview(card, false, day("2026-10-20"));
    assert.deepEqual(card, { box: 1, correctCount: 4, wrongCount: 1, dueOn: day("2026-10-21") });
    card = nextReview(card, true, day("2026-10-21"));
    assert.deepEqual(card, { box: 2, correctCount: 5, wrongCount: 1, dueOn: day("2026-10-24") });
  });

  it("nhãn lịch ôn và mức thuộc sinh từ số hộp", () => {
    assert.deepEqual([1, 2, 3, 4, 5].map(intervalLabel), ["Ôn sau 1 ngày", "Ôn sau 3 ngày", "Ôn sau 1 tuần", "Ôn sau 2 tuần", "Ôn sau 1 tháng"]);
    assert.equal(MASTERY_NAMES.length, 5);
    assert.equal(masteryOf({ box: 0 }), 1);
    assert.equal(masteryOf({ box: 7 }), 5);
    assert.equal(masteryOf({ box: 3 }), 3);
  });

  it("intervalDays kẹp hộp ngoài khoảng 1–5, isMastered chỉ khi hộp 5 và đã đúng", () => {
    assert.equal(intervalDays(0), 1);
    assert.equal(intervalDays(9), 30);
    assert.ok(isMastered({ box: 5, correctCount: 1, wrongCount: 0 }));
    assert.ok(!isMastered({ box: 5, correctCount: 0, wrongCount: 2 }));
    assert.ok(!isMastered({ box: 4, correctCount: 9, wrongCount: 0 }));
  });
});
