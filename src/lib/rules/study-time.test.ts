import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bonusFor, grantBonus, studyAllowance } from "./study-time.ts";

const TODAY = "2026-10-03";

describe("studyAllowance", () => {
  it("không đặt giới hạn thì không bao giờ hết giờ", () => {
    assert.deepEqual(studyAllowance(null, null, TODAY, 500), { total: null, used: 500, remaining: null, exhausted: false });
  });

  it("còn bao nhiêu phút; chạm giới hạn thì hết giờ", () => {
    assert.deepEqual(studyAllowance(20, null, TODAY, 5), { total: 20, used: 5, remaining: 15, exhausted: false });
    assert.equal(studyAllowance(20, null, TODAY, 20).exhausted, true);
    assert.equal(studyAllowance(20, null, TODAY, 27).remaining, 0);
  });

  it("phút thêm chỉ tính đúng ngày hôm nay", () => {
    assert.equal(studyAllowance(20, { date: TODAY, minutes: 10 }, TODAY, 25).remaining, 5);
    assert.equal(studyAllowance(20, { date: "2026-10-02", minutes: 10 }, TODAY, 25).exhausted, true);
    assert.equal(bonusFor({ date: "2026-10-02", minutes: 10 }, TODAY), 0);
  });
});

describe("grantBonus", () => {
  it("cộng 10 phút mỗi lần, cộng dồn trong ngày", () => {
    const first = grantBonus(20, null, TODAY, 20);
    assert.deepEqual(first, { date: TODAY, minutes: 10 });
    assert.deepEqual(grantBonus(20, first, TODAY, 30), { date: TODAY, minutes: 20 });
  });

  it("luôn còn ít nhất 10 phút kể cả khi bé đã học quá giới hạn", () => {
    const granted = grantBonus(20, null, TODAY, 26);
    assert.equal(granted.minutes, 16);
    assert.equal(studyAllowance(20, granted, TODAY, 26).remaining, 10);
  });

  it("phút thêm của ngày khác bị thay bằng của hôm nay", () => {
    assert.deepEqual(grantBonus(20, { date: "2026-10-01", minutes: 30 }, TODAY, 20), { date: TODAY, minutes: 10 });
  });
});
