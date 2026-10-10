import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addDays, dateOnly, dayStartInstant, diffDays, weekStart } from "./dates.ts";
import { freezeDayOfWeek, freezesAvailable, recordStudyDay, streakForDisplay, weekCells, type StreakState } from "./streak.ts";

// Tháng 10/2026: 28/9 là thứ Hai, 2/10 là thứ Sáu, 4/10 là Chủ nhật, 5/10 là thứ Hai.
const d = (iso: string) => new Date(`${iso}T00:00:00Z`);
const state = (streakDays: number, streakFreezes: number, last: string | null): StreakState => ({ streakDays, streakFreezes, lastStudyDate: last ? d(last) : null });
const iso = (date: Date | null) => date?.toISOString().slice(0, 10);

describe("dates", () => {
  it("dateOnly lấy ngày lịch ở múi giờ Việt Nam", () => {
    assert.equal(iso(dateOnly(new Date("2026-10-01T18:30:00Z"))), "2026-10-02");
    assert.equal(iso(dateOnly(new Date("2026-10-01T16:59:00Z"))), "2026-10-01");
  });

  it("dayStartInstant là 00:00 giờ Việt Nam của ngày đó (17:00 UTC hôm trước)", () => {
    assert.equal(dayStartInstant(d("2026-10-02")).toISOString(), "2026-10-01T17:00:00.000Z");
    assert.equal(dayStartInstant(d("2026-10-02"), "UTC").toISOString(), "2026-10-02T00:00:00.000Z");
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

// Tuần 28/9–4/10/2026: T2 28/9, T3 29/9, T4 30/9, T5 1/10, T6 2/10, T7 3/10, CN 4/10.
const days = (...list: string[]) => list.map(d);
const statuses = (cells: ReturnType<typeof weekCells>) => cells.map((c) => c.status).join(",");

describe("weekCells: thẻ chuỗi ngày 7 ngày", () => {
  it("học liên tiếp đến hôm nay: ô đã học, hôm nay đã học, các ô sau là chưa tới", () => {
    const studied = days("2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01");
    const cells = weekCells(state(4, 1, "2026-10-01"), studied, d("2026-10-01"));
    assert.equal(statuses(cells), "done,done,done,done,future,future,future");
    assert.equal(cells[3].isToday, true);
    assert.deepEqual(cells.map((c) => c.label), ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]);
  });

  it("hôm nay chưa học thì ô hôm nay là ‘today’", () => {
    const studied = days("2026-09-28", "2026-09-29");
    assert.equal(statuses(weekCells(state(2, 1, "2026-09-29"), studied, d("2026-09-30"))), "done,done,today,future,future,future,future");
  });

  it("bỏ 1 ngày có thẻ nghỉ: chuỗi giữ và ô thứ Tư là bông tuyết", () => {
    // T2, T3 học; T4 nghỉ (dùng thẻ); T5 học → chuỗi 3, thẻ về 0.
    let s = state(0, 1, null);
    for (const day of ["2026-09-28", "2026-09-29", "2026-10-01"]) s = recordStudyDay(s, d(day));
    assert.equal(s.streakDays, 3);
    assert.equal(s.streakFreezes, 0);
    const cells = weekCells(s, days("2026-09-28", "2026-09-29", "2026-10-01"), d("2026-10-01"));
    assert.equal(statuses(cells), "done,done,freeze,done,future,future,future");
    assert.equal(iso(freezeDayOfWeek(s, days("2026-09-28", "2026-09-29", "2026-10-01"), d("2026-10-01"))), "2026-09-30");
  });

  it("bỏ 2 ngày trong tuần: chuỗi về 0 khi xem, không có ô bông tuyết", () => {
    // T2 học (chuỗi 1), T3 T4 bỏ, hôm nay T5.
    const s = state(1, 1, "2026-09-28");
    assert.equal(streakForDisplay(s, d("2026-10-01")), 0);
    assert.equal(statuses(weekCells(s, days("2026-09-28"), d("2026-10-01"))), "done,missed,missed,today,future,future,future");
  });

  it("bỏ 2 ngày liên tiếp rồi học lại: chuỗi về 1, không dùng thẻ nên không có bông tuyết", () => {
    const studied = days("2026-09-28", "2026-10-01");
    let s = recordStudyDay(state(0, 1, null), d("2026-09-28"));
    s = recordStudyDay(s, d("2026-10-01"));
    assert.equal(s.streakDays, 1);
    assert.equal(freezeDayOfWeek(s, studied, d("2026-10-01")), null);
    assert.equal(statuses(weekCells(s, studied, d("2026-10-01"))), "done,missed,missed,done,future,future,future");
  });

  it("đã hết thẻ, bỏ 1 ngày rồi học lại: chuỗi về 1 và ô bỏ lỡ không phải bông tuyết", () => {
    // T2 T3 học (thẻ 1), T4 nghỉ T5 học → dùng thẻ (chuỗi 3, thẻ 0); T6 nghỉ, T7 học → hết thẻ, chuỗi về 1.
    let s = state(0, 1, null);
    const studied = days("2026-09-28", "2026-09-29", "2026-10-01", "2026-10-03");
    for (const day of studied) s = recordStudyDay(s, day);
    assert.equal(s.streakDays, 1);
    assert.equal(freezeDayOfWeek(s, studied, d("2026-10-03")), null);
  });

  it("sang tuần mới có lại thẻ: không còn ô bông tuyết, ô cũ không hiện", () => {
    const s = state(5, 0, "2026-10-04");
    assert.equal(freezesAvailable(s, d("2026-10-05")), 1);
    assert.equal(freezeDayOfWeek(s, days("2026-10-02", "2026-10-03", "2026-10-04"), d("2026-10-05")), null);
    assert.equal(statuses(weekCells(s, [], d("2026-10-05"))), "today,future,future,future,future,future,future");
  });

  it("thứ Hai dùng thẻ khi Chủ nhật tuần trước có học (ngày trước thuộc tuần cũ)", () => {
    // CN 27/9 học, T2 28/9 nghỉ (dùng thẻ), T3 29/9 học.
    let s = recordStudyDay(state(0, 1, null), d("2026-09-27"));
    s = recordStudyDay(s, d("2026-09-29"));
    assert.equal(s.streakFreezes, 0);
    const studied = days("2026-09-27", "2026-09-29");
    assert.equal(iso(freezeDayOfWeek(s, studied, d("2026-09-29"))), "2026-09-28");
    assert.equal(statuses(weekCells(s, studied, d("2026-09-29"))), "freeze,done,future,future,future,future,future");
  });
});
