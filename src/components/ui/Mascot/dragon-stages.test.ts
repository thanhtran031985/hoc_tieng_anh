import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DRAGON_SEGMENTS, type Expr } from "./dragon-parts.ts";
import { dragonMarkup, STAGES } from "./dragon-stages.ts";

const EXPRS = Object.keys(DRAGON_SEGMENTS) as Expr[];
const original = (e: Expr) => {
  const p = DRAGON_SEGMENTS[e];
  return p.tail + p.tailWing + p.wings + p.body + p.head + p.acc.join("");
};

describe("dragonMarkup (rồng Bông lớn lên)", () => {
  it("dáng 3 và không truyền dáng đều là hình gốc, ở cả 8 biểu cảm", () => {
    for (const e of EXPRS) {
      assert.equal(dragonMarkup(e), original(e), e);
      assert.equal(dragonMarkup(e, 3), original(e), e);
    }
  });

  it("5 dáng khác nhau, dáng khác 3 được bọc nhóm dg-stage--N", () => {
    for (const e of EXPRS) {
      assert.equal(new Set(STAGES.map((s) => dragonMarkup(e, s))).size, 5, e);
      for (const s of [1, 2, 4, 5] as const) assert.match(dragonMarkup(e, s), new RegExp(`class="dg-stage dg-stage--${s}"`));
    }
  });

  it("dáng 1 trong vỏ trứng và chưa có cánh; dáng 2 có mầm lá; dáng 4–5 có khăn", () => {
    const m = (s: 1 | 2 | 4 | 5) => dragonMarkup("chao", s);
    assert.match(m(1), /--dragon-egg\)/);
    assert.doesNotMatch(m(1), /dg-wings/);
    assert.match(m(2), /--dragon-leaf\)/);
    assert.match(m(4), /--dragon-scarf-4\)/);
    assert.match(m(5), /--dragon-scarf-5\)/);
    assert.match(dragonMarkup("chao", 2), /dg-wings/);
  });

  it("biểu cảm xaydung: búa vẽ theo thân, chỉ xuất hiện một lần", () => {
    const hammer = DRAGON_SEGMENTS.xaydung.acc[DRAGON_SEGMENTS.xaydung.hammerAt];
    assert.ok(hammer);
    for (const s of STAGES) assert.equal(dragonMarkup("xaydung", s).split(hammer).length - 1, 1, `dáng ${s}`);
  });
});
