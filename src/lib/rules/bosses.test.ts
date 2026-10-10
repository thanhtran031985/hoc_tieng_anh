import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { BOSSES, BOSS_LINES, BOSS_QUESTIONS, bossBadgeCode, bossBadgeName, bossEnergy, bossFor, pickLine } from "./bosses.ts";

const curriculum = (n: number): { slug: string }[] => JSON.parse(readFileSync(new URL(`../../../prisma/seed/curriculum/level-0${n}.json`, import.meta.url), "utf8"));

describe("trùm cuối vùng", () => {
  it("mỗi chủ đề cấp 1–5 có đúng một trùm (40 trùm)", () => {
    assert.equal(BOSSES.length, 40);
    for (const level of [1, 2, 3, 4, 5]) {
      const units = curriculum(level).map((u) => u.slug).sort();
      assert.deepEqual(BOSSES.filter((x) => x.levelNumber === level).map((x) => x.slug).sort(), units, `cấp ${level}`);
    }
  });
  it("tên và dáng (màu lông + phụ kiện) không trùng nhau", () => {
    assert.equal(new Set(BOSSES.map((x) => x.name)).size, BOSSES.length);
    assert.equal(new Set(BOSSES.map((x) => `${x.fur}/${x.accessory}`)).size, BOSSES.length);
  });
  it("vùng Con vật là Vua Khỉ Lém đội vương miện; trùm cấp khác dùng bảng màu 1–6", () => {
    const king = bossFor(1, "animals");
    assert.equal(king.name, "Vua Khỉ Lém");
    assert.equal(king.accessory, "crown");
    for (const x of BOSSES) assert.ok(x.fur >= 1 && x.fur <= 6);
  });
  it("chủ đề lạ dùng Vua Khỉ Lém", () => {
    assert.equal(bossFor(7, "anything").slug, "animals");
  });
  it("huy hiệu: tên và mã ổn định", () => {
    const boss = bossFor(2, "food-drink");
    assert.equal(bossBadgeName(boss), "Bạn của Khỉ Đầu Bếp");
    assert.equal(bossBadgeCode(boss), "boss:2:food-drink");
  });
  it("năng lượng giảm một nấc mỗi câu đúng và không bao giờ âm", () => {
    assert.deepEqual([0, 1, 5, 6, 7].map((n) => bossEnergy(n)), [6, 5, 1, 0, 0]);
    assert.equal(BOSS_QUESTIONS, 6);
  });
  it("lời trùm xoay vòng, không có lời chê", () => {
    assert.equal(pickLine(BOSS_LINES.tease, 3), BOSS_LINES.tease[0]);
    for (const line of [...BOSS_LINES.tease, ...BOSS_LINES.hit]) assert.ok(!/ngu|dở|tệ|thua|trượt/i.test(line));
    assert.match(BOSS_LINES.intro("Vua Khỉ Lém", "Con vật"), /Vua Khỉ Lém/);
  });
});
