import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ALL_DAYS, describeWindow, isStudyAllowed, nextOpening, tempOpenActive, tempOpenDeadline, validateStudyDays, vnClock, windowReason, type StudyWindow } from "./study-window.ts";

// 5/10/2026 là thứ Hai. Khung 17:00–20:30 vào T2–T6.
const weekdays: StudyWindow = { from: "17:00", to: "20:30", days: [1, 2, 3, 4, 5] };
const at = (day: number, hhmm: string) => ({ day, minutes: Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3)) });

describe("vnClock", () => {
  it("lấy thứ và giờ theo múi giờ Việt Nam (UTC+7)", () => {
    assert.deepEqual(vnClock(new Date("2026-10-05T10:00:00Z")), { day: 1, minutes: 17 * 60 });
    assert.deepEqual(vnClock(new Date("2026-10-04T17:30:00Z")), { day: 1, minutes: 30 });
    assert.deepEqual(vnClock(new Date("2026-10-10T16:59:00Z")), { day: 6, minutes: 23 * 60 + 59 });
    assert.equal(vnClock(new Date("2026-10-11T03:00:00Z")).day, 7);
  });
});

describe("windowReason", () => {
  it("không có khung thì luôn mở", () => {
    assert.equal(windowReason(null, at(7, "03:00")), "open");
  });
  it("trong khung là mở; trước giờ bắt đầu và từ giờ kết thúc trở đi thì khóa", () => {
    assert.equal(windowReason(weekdays, at(2, "17:00")), "open");
    assert.equal(windowReason(weekdays, at(2, "20:29")), "open");
    assert.equal(windowReason(weekdays, at(2, "16:59")), "before");
    assert.equal(windowReason(weekdays, at(2, "20:30")), "after");
  });
  it("ngày không được học là ngày nghỉ dù đang trong giờ", () => {
    assert.equal(windowReason(weekdays, at(6, "18:00")), "rest_day");
    assert.equal(windowReason(weekdays, at(7, "18:00")), "rest_day");
  });
  it("khung cả ngày 00:00–23:59 mở đến hết ngày", () => {
    const full: StudyWindow = { from: "00:00", to: "23:59", days: ALL_DAYS };
    assert.equal(windowReason(full, at(3, "00:00")), "open");
    assert.equal(windowReason(full, at(3, "23:59")), "open");
  });
});

describe("nextOpening", () => {
  it("chưa tới giờ hôm nay thì mở hôm nay", () => {
    assert.deepEqual(nextOpening(weekdays, at(2, "15:00")), { dayOffset: 0, day: 2, from: "17:00" });
  });
  it("quá giờ hôm nay thì sang ngày được học kế tiếp; thứ Sáu quá giờ thì thứ Hai", () => {
    assert.deepEqual(nextOpening(weekdays, at(2, "21:00")), { dayOffset: 1, day: 3, from: "17:00" });
    assert.deepEqual(nextOpening(weekdays, at(5, "21:00")), { dayOffset: 3, day: 1, from: "17:00" });
    assert.deepEqual(nextOpening(weekdays, at(7, "09:00")), { dayOffset: 1, day: 1, from: "17:00" });
  });
  it("không có khung thì null", () => {
    assert.equal(nextOpening(null, at(1, "10:00")), null);
  });
});

describe("mở tạm bằng PIN", () => {
  it("còn hạn thì cho học dù ngoài khung giờ, hết hạn thì khóa lại", () => {
    const now = Date.parse("2026-10-05T03:00:00Z"); // thứ Hai 10:00, ngoài khung
    const clock = at(1, "10:00");
    assert.equal(isStudyAllowed(weekdays, clock, null, now), false);
    assert.equal(isStudyAllowed(weekdays, clock, tempOpenDeadline(now), now), true);
    assert.equal(isStudyAllowed(weekdays, clock, tempOpenDeadline(now), now + 30 * 60 * 1000 - 1), true);
    assert.equal(isStudyAllowed(weekdays, clock, tempOpenDeadline(now), now + 30 * 60 * 1000), false);
    assert.equal(tempOpenActive(undefined, now), false);
    assert.equal(tempOpenActive(now - 1, now), false);
  });
});

describe("mô tả và kiểm tra ngày", () => {
  it("describeWindow", () => {
    assert.equal(describeWindow(null), "mọi ngày, mọi giờ");
    assert.equal(describeWindow(weekdays), "17:00–20:30, T2, T3, T4, T5, T6");
    assert.equal(describeWindow({ from: "00:00", to: "23:59", days: [6, 7] }), "mọi giờ, T7, CN");
    assert.equal(describeWindow({ from: "17:00", to: "20:00", days: ALL_DAYS }), "17:00–20:00, cả tuần");
  });
  it("validateStudyDays", () => {
    assert.equal(validateStudyDays([1, 3]), "");
    assert.match(validateStudyDays([]), /ít nhất một ngày/);
    assert.match(validateStudyDays([0, 2]), /chưa hợp lệ/);
    assert.match(validateStudyDays([8]), /chưa hợp lệ/);
    assert.match(validateStudyDays([2, 2]), /chưa hợp lệ/);
  });
});
