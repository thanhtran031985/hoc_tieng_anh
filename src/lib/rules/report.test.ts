import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { activityWhen, cefrForLevel, compareWeeks, dayLabel, formatDelta, lastDays, minutesPerDay, percentDone } from "./report.ts";

const day = (iso: string) => new Date(`${iso}T00:00:00.000Z`);
// Buổi học lúc 12:00 trưa giờ Việt Nam (05:00 UTC) của ngày `iso`.
const at = (iso: string, minutes: number) => ({ startedAt: new Date(`${iso}T05:00:00.000Z`), minutes });

describe("lastDays và minutesPerDay", () => {
  it("n ngày liên tiếp kết thúc hôm nay, cũ nhất trước", () => {
    assert.deepEqual(lastDays(day("2026-10-03"), 3), [day("2026-10-01"), day("2026-10-02"), day("2026-10-03")]);
  });

  it("cộng phút theo ngày, ngày không học là 0, buổi ngoài khoảng bị bỏ", () => {
    const days = lastDays(day("2026-10-03"), 3);
    assert.deepEqual(minutesPerDay([at("2026-10-01", 10), at("2026-10-01", 5), at("2026-10-03", 20), at("2026-09-01", 99)], days), [15, 0, 20]);
  });

  it("buổi học sau 17:00 UTC tính sang ngày hôm sau theo giờ Việt Nam", () => {
    const late = { startedAt: new Date("2026-10-02T18:30:00.000Z"), minutes: 7 };
    assert.deepEqual(minutesPerDay([late], lastDays(day("2026-10-03"), 2)), [0, 7]);
  });
});

describe("compareWeeks", () => {
  // 2026-10-03 là thứ Bảy: tuần này từ T2 28/9, tuần trước từ T2 21/9.
  it("so cùng khoảng thứ Hai đến cùng thứ của tuần trước", () => {
    const sessions = [at("2026-09-28", 30), at("2026-10-02", 20), at("2026-09-21", 20), at("2026-09-25", 20), at("2026-09-27", 100)];
    const result = compareWeeks(sessions, day("2026-10-03"));
    assert.equal(result.thisWeek, 50);
    assert.equal(result.lastWeek, 40);
    assert.equal(result.deltaPercent, 25);
  });

  it("tuần trước chưa học thì không có phần trăm", () => {
    assert.equal(compareWeeks([at("2026-10-01", 15)], day("2026-10-03")).deltaPercent, null);
  });

  it("formatDelta dùng dấu trừ rõ ràng", () => {
    assert.deepEqual([formatDelta(12), formatDelta(-8), formatDelta(0), formatDelta(null)], ["+12%", "−8%", "0%", ""]);
  });
});

describe("cefrForLevel, percentDone, nhãn ngày", () => {
  it("CEFR theo cấp (kẹp 1–10)", () => {
    assert.equal(cefrForLevel(1).band, 0);
    assert.equal(cefrForLevel(6).label, "A2");
    assert.equal(cefrForLevel(10).band, 2);
    assert.equal(cefrForLevel(99).label, "B1");
  });

  it("phần trăm hoàn thành", () => {
    assert.equal(percentDone(7, 21), 33);
    assert.equal(percentDone(0, 0), 0);
    assert.equal(percentDone(30, 20), 100);
  });

  it("nhãn ngày và mốc hoạt động", () => {
    assert.equal(dayLabel(day("2026-10-02")), "T6 2/10");
    const now = new Date("2026-10-03T14:00:00.000Z");
    assert.equal(activityWhen(new Date("2026-10-03T13:15:00.000Z"), now, "20:15"), "20:15");
    assert.equal(activityWhen(new Date("2026-10-02T13:15:00.000Z"), now, "20:15"), "Hôm qua");
    assert.equal(activityWhen(new Date("2026-09-30T13:15:00.000Z"), now, "20:15"), "T4 30/9");
  });
});
