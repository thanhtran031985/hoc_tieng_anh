import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { describe, it } from "node:test";
import { COINS } from "./constants.ts";
import { OUTFIT_HATS, OUTFIT_TOPS } from "../../components/ui/Mascot/outfits.ts";
import { MOVE_STEP, MOVE_STEP_LARGE, POSITION_LIMITS, ROOM_ITEMS, SUGGESTED_PRICES, canAfford, clampPosition, defaultPosition, flipped, isWearable, itemScale, moveBy, parsePosition, roomCode, roomImage, roomKeyOf, shortBy, zIndexFor } from "./room.ts";

const publicFile = (path: string) => new URL(`../../../public${path}`, import.meta.url);
const count = (group: string) => ROOM_ITEMS.filter((i) => i.group === group).length;

describe("danh mục 19 món", () => {
  it("13 nội thất, 3 áo, 3 mũ; khóa khác nhau", () => {
    assert.equal(ROOM_ITEMS.length, 19);
    assert.deepEqual([count("furniture"), count("clothes"), count("hats")], [13, 3, 3]);
    assert.equal(new Set(ROOM_ITEMS.map((i) => i.key)).size, 19);
    assert.equal(new Set(ROOM_ITEMS.map((i) => roomCode(i.key))).size, 19);
  });

  it("giá theo token coins: nội thất 40/80/150, bể cá 400, áo 60, mũ 50", () => {
    const price = (key: string) => ROOM_ITEMS.find((i) => i.key === key)!.price;
    for (const key of ["plant", "clock", "picture"]) assert.equal(price(key), COINS.priceFurnitureS);
    for (const key of ["lamp", "chair", "rug", "globe", "guitar"]) assert.equal(price(key), COINS.priceFurnitureM);
    for (const key of ["bookshelf", "bed", "desk", "sofa"]) assert.equal(price(key), COINS.priceFurnitureL);
    assert.equal(price("fishtank"), COINS.priceSpecial);
    for (const key of ["tee", "stripe", "raincoat"]) assert.equal(price(key), COINS.priceClothes);
    for (const key of ["cap", "beanie", "sunhat"]) assert.equal(price(key), COINS.priceHat);
    assert.deepEqual([COINS.priceFurnitureS, COINS.priceFurnitureM, COINS.priceFurnitureL, COINS.priceSpecial, COINS.priceClothes, COINS.priceHat], [40, 80, 150, 400, 60, 50]);
  });

  it("nội thất có tệp hình; áo và mũ khớp kiểu vẽ trên Bông", () => {
    for (const i of ROOM_ITEMS.filter((x) => x.group === "furniture")) assert.ok(existsSync(publicFile(roomImage(i.key))), `thiếu hình ${i.key}`);
    assert.deepEqual(ROOM_ITEMS.filter((x) => x.group === "clothes").map((x) => x.key), [...OUTFIT_TOPS]);
    assert.deepEqual(ROOM_ITEMS.filter((x) => x.group === "hats").map((x) => x.key), [...OUTFIT_HATS]);
    for (const i of ROOM_ITEMS) assert.ok(i.en.length > 0 && i.vi.length > 0 && i.price > 0, i.key);
  });

  it("giá của mỗi món nằm trong giá gợi ý của nhóm; mã và khóa chuyển qua lại", () => {
    for (const i of ROOM_ITEMS) assert.ok(SUGGESTED_PRICES[i.group].includes(i.price), i.key);
    assert.equal(roomKeyOf(roomCode("lamp")), "lamp");
    assert.equal(isWearable("hats") && isWearable("clothes") && !isWearable("furniture"), true);
  });
});

describe("giá và đủ xu", () => {
  it("còn thiếu bao nhiêu xu, đủ khi bằng hoặc hơn", () => {
    assert.equal(shortBy(280, 340), 60);
    assert.equal(shortBy(340, 340), 0);
    assert.equal(shortBy(500, 340), 0);
    assert.equal(canAfford(340, 340), true);
    assert.equal(canAfford(339, 340), false);
  });
});

describe("vị trí đồ trong phòng", () => {
  const base = { x: 50, y: 30, flip: 1 as const };

  it("kẹp vào phòng: ngang 5–95, cao 0–72, thảm sát sàn 0–12", () => {
    assert.deepEqual(clampPosition("lamp", { x: -10, y: 500, flip: 1 }), { x: POSITION_LIMITS.xMin, y: POSITION_LIMITS.yMax, flip: 1 });
    assert.deepEqual(clampPosition("lamp", { x: 200, y: -5, flip: -1 }), { x: POSITION_LIMITS.xMax, y: 0, flip: -1 });
    assert.equal(clampPosition("rug", { x: 50, y: 40, flip: 1 }).y, POSITION_LIMITS.rugYMax);
  });

  it("mũi tên: bước nhỏ 2, giữ Shift bước lớn 6; không ra khỏi phòng", () => {
    assert.deepEqual(moveBy("lamp", base, MOVE_STEP, 0), { x: 52, y: 30, flip: 1 });
    assert.deepEqual(moveBy("lamp", base, 0, -MOVE_STEP_LARGE), { x: 50, y: 24, flip: 1 });
    assert.equal(moveBy("lamp", { x: 94, y: 30, flip: 1 }, MOVE_STEP_LARGE, 0).x, POSITION_LIMITS.xMax);
    assert.equal(moveBy("lamp", { x: 50, y: 1, flip: 1 }, 0, -MOVE_STEP_LARGE).y, 0);
  });

  it("xoay lật ngang qua lại, giữ nguyên chỗ", () => {
    assert.deepEqual(flipped(base), { x: 50, y: 30, flip: -1 });
    assert.deepEqual(flipped(flipped(base)), base);
  });

  it("thảm xếp dưới cùng, đồ thấp hơn nằm trên đồ cao hơn", () => {
    assert.equal(zIndexFor("rug", 3), 1);
    assert.ok(zIndexFor("lamp", 10) > zIndexFor("lamp", 60));
    assert.ok(zIndexFor("bed", 20) > zIndexFor("rug", 3));
  });

  it("đọc cột position: hợp lệ thì kẹp lại, hỏng hoặc null thì ở kho", () => {
    assert.deepEqual(parsePosition("lamp", { x: 30, y: 20, flip: -1 }), { x: 30, y: 20, flip: -1 });
    assert.deepEqual(parsePosition("lamp", { x: 300, y: 20 }), { x: 95, y: 20, flip: 1 });
    for (const bad of [null, undefined, "x", 5, {}, { x: "a", y: 1 }, { x: NaN, y: 1 }]) assert.equal(parsePosition("lamp", bad), null);
  });

  it("chỗ đặt ban đầu hợp lệ cho mọi món; bề rộng có hệ số", () => {
    for (const i of ROOM_ITEMS.filter((x) => x.group === "furniture")) {
      const p = defaultPosition(i.key);
      assert.deepEqual(p, clampPosition(i.key, p));
      assert.ok(itemScale(i.key) > 0);
    }
    assert.equal(itemScale("không-có"), 1);
  });
});
