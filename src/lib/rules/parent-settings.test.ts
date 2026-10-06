import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clockMinutes, isEasyPin, normalizeClock, validateName, validateNewPassword, validateNewPin, validateStudyWindow } from "./parent-settings.ts";

describe("khung giờ học", () => {
  it("đọc giờ:phút, chuẩn hóa 7:05 thành 07:05", () => {
    assert.equal(clockMinutes("17:05"), 1025);
    assert.equal(clockMinutes("7:05"), 425);
    assert.equal(clockMinutes("24:00"), null);
    assert.equal(normalizeClock("7:05"), "07:05");
  });

  it("để trống cả hai là mọi giờ; đúng khung thì không lỗi", () => {
    assert.deepEqual(validateStudyWindow("", ""), {});
    assert.deepEqual(validateStudyWindow("17:00", "20:30"), {});
  });

  it("giờ kết thúc phải sau giờ bắt đầu và khung ≥ 30 phút", () => {
    assert.equal(validateStudyWindow("20:30", "17:00").to, "Giờ kết thúc phải sau giờ bắt đầu.");
    assert.equal(validateStudyWindow("17:00", "17:00").to, "Giờ kết thúc phải sau giờ bắt đầu.");
    assert.match(validateStudyWindow("17:00", "17:20").to ?? "", /ít nhất 30 phút/);
    assert.match(validateStudyWindow("abc", "20:00").from ?? "", /giờ:phút/);
    assert.match(validateStudyWindow("17:00", "").to ?? "", /giờ:phút/);
  });
});

describe("tên, mật khẩu, PIN", () => {
  it("tên con", () => {
    assert.equal(validateName("Khánh Linh"), "");
    assert.equal(validateName("  "), "Nhập tên cho con.");
    assert.match(validateName("a".repeat(21)), /tối đa 20/);
    assert.match(validateName("Minh2"), /chữ cái/);
  });

  it("mật khẩu mới ≥ 8 ký tự có cả chữ và số", () => {
    assert.equal(validateNewPassword("matkhau123"), "");
    assert.match(validateNewPassword("ngan1"), /ít nhất 8/);
    assert.match(validateNewPassword("chiconchu"), /cả chữ và số/);
    assert.match(validateNewPassword("12345678"), /cả chữ và số/);
  });

  it("PIN dễ đoán: lặp số hoặc số liền nhau", () => {
    for (const easy of ["1111", "0000", "1234", "4321", "123456", "6543"]) assert.ok(isEasyPin(easy), easy);
    for (const ok of ["2580", "1357", "1212", "9081"]) assert.ok(!isEasyPin(ok), ok);
    assert.match(validateNewPin("1234"), /dễ đoán/);
    assert.match(validateNewPin("12"), /4–6 chữ số/);
    assert.equal(validateNewPin("2580"), "");
  });
});
