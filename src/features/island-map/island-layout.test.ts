import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MAP_HEIGHT, MAP_WIDTH, ZONE_SLOTS, zoneNodePositions } from "./island-layout.ts";

describe("zoneNodePositions", () => {
  it("5 chặng thì đúng 5 điểm của thiết kế", () => {
    for (const slot of ZONE_SLOTS) assert.deepEqual(zoneNodePositions(slot, 5), slot.points.map((p) => [...p]));
  });

  it("3–6 chặng: đủ số điểm, đầu và cuối trùng đầu và cuối đường, nằm trong khung", () => {
    for (const slot of ZONE_SLOTS) {
      for (const n of [2, 3, 4, 6, 7]) {
        const pos = zoneNodePositions(slot, n);
        assert.equal(pos.length, n);
        assert.deepEqual(pos[0], [...slot.points[0]]);
        const last = slot.points[slot.points.length - 1];
        assert.ok(Math.abs(pos[n - 1][0] - last[0]) < 1e-9 && Math.abs(pos[n - 1][1] - last[1]) < 1e-9);
        for (const [x, y] of pos) assert.ok(x >= 0 && x <= MAP_WIDTH && y >= 0 && y <= MAP_HEIGHT);
      }
    }
  });

  it("các chặng cách nhau đủ xa để không đè lên nhau (6 chặng)", () => {
    for (const slot of ZONE_SLOTS) {
      const pos = zoneNodePositions(slot, 6);
      for (let i = 1; i < pos.length; i++) assert.ok(Math.hypot(pos[i][0] - pos[i - 1][0], pos[i][1] - pos[i - 1][1]) > 60);
    }
  });

  it("không có chặng thì trả về rỗng; một chặng đặt ở điểm đầu", () => {
    assert.deepEqual(zoneNodePositions(ZONE_SLOTS[0], 0), []);
    assert.deepEqual(zoneNodePositions(ZONE_SLOTS[0], 1), [[...ZONE_SLOTS[0].points[0]]]);
  });
});
