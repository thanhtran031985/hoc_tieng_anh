import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addDays, dateOnly, diffDays, weekStart } from "./dates.ts";
import { freezesAvailable, recordStudyDay, streakForDisplay, type StreakState } from "./streak.ts";

// Tháng 10/2026: 28/9 là thứ Hai, 2/10 là thứ Sáu, 4/10 là Chủ nhật, 5/10 là thứ Hai.
const d = (iso: string) => new Date(`${iso}T00:00:00Z`);
const state = (streakDays: number, streakFreezes: number, last: string | null): StreakState => ({ streakDays, streakFreezes, lastStudyDate: last ? d(last) : null });
const iso = (date: Date | null) => date?.toISOString().slice(0, 10);

describe("dates", () => {
  it("dateOnly lấy ngày lịch ở múi giờ Việt Nam", () => {
    assert.equal(iso(dateOnly(new Date("2026-10-01T18:30:00Z"))), "2026-10-02");
    assert.equal(iso(dateOnly(new Date("2026-10-01T16:59:00Z"))), "2026-10-01");
  });

  it("weekStart là thứ Hai; diffDays và addDays khớp nhau", () => {
    assert.equal(iso(weekStart(d("2026-10-02"))), "2026-09-28");
    assert.equal(iso(weekStart(d("2026-10-04"))), "2026-09-28");
    assert.equal(iso(weekStart(d("2026-10-05"))), "2026-10-05");
    assert.equal(diffDays(d("2026-10-05"), d("2026-10-02")), 3);
    assert.equal(iso(addDays(d("2026-10-31"), 1)), "2026-11-01");
  });
});

describe("recordStudyDay", () => {
  it("ngày học đầu tiên: chuỗi 1 và có 1 thẻ nghỉ phép", () => {
    const next = recordStudyDay(state(0, 1, null), d("2026-10-02"));
    assert.deepEqual([next.streakDays, next.streakFreezes, iso(next.lastStudyDate)], [1, 1, "2026-10-02"]);
  });

  it("học liên tiếp thì chuỗi tăng 1", () => {
    const next = recordStudyDay(state(4, 1, "2026-10-01"), d("2026-10-02"));
    assert.deepEqual([next.streakDays, next.streakFreezes], [5, 1]);
  });

  it("học thêm trong cùng ngày không tăng chuỗi", () => {
    const before = state(4, 1, "2026-10-02");
    assert.deepEqual(recordStudyDay(before, d("2026-10-02")), before);
  });

  it("bỏ 1 ngày: dùng thẻ nghỉ phép, giữ chuỗi, thẻ về 0", () => {
    const next = recordStudyDay(state(4, 1, "2026-09-30"), d("2026-10-02"));
    assert.deepEqual([next.streakDays, next.streakFreezes, iso(next.lastStudyDate)], [5, 0, "2026-10-02"]);
  });

  it("bỏ 1 ngày nhưng đã hết thẻ trong tuần: chuỗi về 1", () => {
    const next = recordStudyDay(state(4, 0, "2026-09-30"), d("2026-10-02"));
    assert.equal(next.streakDays, 1);
  });

  it("bỏ 2 ngày: chuỗi về 1 dù còn thẻ", () => {
    const next = recordStudyDay(state(9, 1, "2026-09-29"), d("2026-10-02"));
    assert.deepEqual([next.streakDays, next.streakFreezes], [1, 1]);
  });

  it("sang tuần mới thì thẻ được nạp lại: hết thẻ tuần trước, thứ Ba tuần sau bỏ thứ Hai vẫn được dùng thẻ", () => {
    const next = recordStudyDay(state(6, 0, "2026-10-04"), d("2026-10-06"));
    assert.deepEqual([next.streakDays, next.streakFreezes], [7, 0]);
  });

  it("sang tuần mới và học liên tiếp: thẻ được nạp về 1", () => {
    const next = recordStudyDay(state(6, 0, "2026-10-04"), d("2026-10-05"));
    assert.deepEqual([next.streakDays, next.streakFreezes], [7, 1]);
  });
});

describe("streakForDisplay", () => {
  it("chưa học bao giờ thì 0", () => {
    assert.equal(streakForDisplay(state(0, 1, null), d("2026-10-02")), 0);
  });

  it("hôm nay hoặc hôm qua có học thì còn nguyên chuỗi", () => {
    assert.equal(streakForDisplay(state(5, 1, "2026-10-02"), d("2026-10-02")), 5);
    assert.equal(streakForDisplay(state(5, 1, "2026-10-01"), d("2026-10-02")), 5);
  });

  it("bỏ 1 ngày: còn thẻ thì chuỗi vẫn giữ, hết thẻ thì về 0", () => {
    assert.equal(streakForDisplay(state(5, 1, "2026-09-30"), d("2026-10-02")), 5);
    assert.equal(streakForDisplay(state(5, 0, "2026-09-30"), d("2026-10-02")), 0);
  });

  it("bỏ từ 2 ngày thì về 0", () => {
    assert.equal(streakForDisplay(state(5, 1, "2026-09-29"), d("2026-10-02")), 0);
  });
});

describe("freezesAvailable", () => {
  it("cùng tuần dùng số thẻ đang có, sang tuần mới được nạp lại", () => {
    assert.equal(freezesAvailable(state(3, 0, "2026-10-02"), d("2026-10-03")), 0);
    assert.equal(freezesAvailable(state(3, 0, "2026-10-04"), d("2026-10-05")), 1);
    assert.equal(freezesAvailable(state(0, 0, null), d("2026-10-05")), 1);
  });
});
