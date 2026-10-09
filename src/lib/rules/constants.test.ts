import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";
import { COINS, WORDLAB } from "./constants.ts";

type Token = { name: string; value: string };
const tokens = JSON.parse(fs.readFileSync(new URL("../../../designs/tokens.json", import.meta.url), "utf8")) as {
  coins: { tokens: Token[] };
  wordlab: { tokens: Token[] };
};

// "coin-sticker-lesson" → "stickerLesson", "price-furniture-s" → "priceFurnitureS", "links-max-depth" → "linksMaxDepth".
const camel = (name: string) => name.replace(/^coin-/, "").replace(/-(\w)/g, (_, c: string) => c.toUpperCase());

describe("hằng số GĐ2 khớp designs/tokens.json", () => {
  it("COINS: đủ và đúng từng giá trị", () => {
    assert.equal(Object.keys(COINS).length, tokens.coins.tokens.length);
    for (const t of tokens.coins.tokens) assert.equal(COINS[camel(t.name) as keyof typeof COINS], Number(t.value), t.name);
  });

  it("WORDLAB: đủ và đúng từng giá trị", () => {
    assert.equal(Object.keys(WORDLAB).length, tokens.wordlab.tokens.length);
    for (const t of tokens.wordlab.tokens) assert.equal(WORDLAB[camel(t.name) as keyof typeof WORDLAB], Number(t.value), t.name);
  });

  it("khoảng nhánh Khám phá từ hợp lệ", () => {
    assert.ok(WORDLAB.branchMin <= WORDLAB.branchMax);
  });
});
