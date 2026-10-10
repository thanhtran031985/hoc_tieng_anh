import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { saveRoomItemSchema } from "./admin-rewards.ts";

const base = { en: "table", vi: "cái bàn", group: "furniture", price: 80, image: "/media/room/lamp.svg", status: "draft" } as const;
const messageOf = (input: unknown, field: string) => {
  const parsed = saveRoomItemSchema.safeParse(input);
  return parsed.success ? null : (parsed.error.issues.find((i) => i.path[0] === field)?.message ?? null);
};

describe("saveRoomItemSchema (Adult21 · Đồ trong phòng)", () => {
  it("món nội thất đủ thông tin hợp lệ", () => {
    assert.equal(saveRoomItemSchema.safeParse(base).success, true);
  });

  it("giá âm, bằng 0, không nguyên hoặc quá lớn bị từ chối", () => {
    assert.match(messageOf({ ...base, price: -5 }, "price") ?? "", /lớn hơn 0/);
    assert.match(messageOf({ ...base, price: 0 }, "price") ?? "", /lớn hơn 0/);
    assert.match(messageOf({ ...base, price: 2.5 }, "price") ?? "", /số nguyên/);
    assert.match(messageOf({ ...base, price: 5000 }, "price") ?? "", /tối đa 2000/);
    assert.match(messageOf({ ...base, price: undefined }, "price") ?? "", /Nhập giá/);
  });

  it("nội thất thiếu hình hoặc hình ngoài thư mục hình bị từ chối", () => {
    assert.match(messageOf({ ...base, image: null }, "image") ?? "", /Chọn hình/);
    assert.match(messageOf({ ...base, image: "" }, "image") ?? "", /Chọn hình/);
    assert.match(messageOf({ ...base, image: "/etc/passwd.svg" }, "image") ?? "", /Chọn hình/);
    assert.match(messageOf({ ...base, image: "/media/room/../../x.svg" }, "image") ?? "", /Chọn hình/);
  });

  it("áo và mũ không cần hình rời", () => {
    assert.equal(saveRoomItemSchema.safeParse({ ...base, group: "clothes", image: null, price: 60 }).success, true);
    assert.equal(saveRoomItemSchema.safeParse({ ...base, group: "hats", image: undefined, price: 50 }).success, true);
  });

  it("tên tiếng Anh sai dạng và trạng thái lạ bị từ chối", () => {
    assert.ok(messageOf({ ...base, en: "bàn" }, "en"));
    assert.ok(messageOf({ ...base, en: "" }, "en"));
    assert.ok(messageOf({ ...base, status: "deleted" }, "status"));
    assert.ok(messageOf({ ...base, group: "toys" }, "group"));
  });
});
