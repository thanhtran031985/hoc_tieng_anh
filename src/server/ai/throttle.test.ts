import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createThrottle } from "./throttle.ts";

describe("giới hạn lượt gọi AI", () => {
  it("cho đủ số lượt rồi chặn, báo số giây phải chờ", () => {
    const t = createThrottle(3, 60_000);
    assert.deepEqual(t.take("a", 0), { ok: true });
    assert.deepEqual(t.take("a", 1_000), { ok: true });
    assert.deepEqual(t.take("a", 2_000), { ok: true });
    assert.deepEqual(t.take("a", 10_000), { ok: false, retryAfterSeconds: 50 });
  });

  it("hết cửa sổ thì cho lại; mỗi quản trị viên đếm riêng", () => {
    const t = createThrottle(1, 60_000);
    assert.equal(t.take("a", 0).ok, true);
    assert.equal(t.take("b", 0).ok, true);
    assert.equal(t.take("a", 59_999).ok, false);
    assert.equal(t.take("a", 60_000).ok, true);
  });

  it("lượt bị chặn không kéo dài thời gian chờ", () => {
    const t = createThrottle(1, 60_000);
    t.take("a", 0);
    t.take("a", 30_000);
    assert.deepEqual(t.take("a", 59_000), { ok: false, retryAfterSeconds: 1 });
    assert.equal(t.take("a", 60_000).ok, true);
  });
});
