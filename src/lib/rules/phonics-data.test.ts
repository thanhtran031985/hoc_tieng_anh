import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PHONICS_SEED, phonicsSeedFields } from "./phonics-data.ts";
import { phonicsPhonemes } from "./phonics.ts";

describe("PHONICS_SEED", () => {
  it("có đúng 36 âm: 26 chữ đơn, 5 âm ghép phụ âm, 5 âm ghép nguyên âm", () => {
    assert.equal(PHONICS_SEED.length, 36);
    assert.equal(PHONICS_SEED.filter((r) => r[2] === "single").length, 26);
    assert.equal(PHONICS_SEED.filter((r) => r[2] === "consonant_digraph").length, 5);
    assert.equal(PHONICS_SEED.filter((r) => r[2] === "vowel_digraph").length, 5);
  });

  it("chữ đơn là a–z đủ cả, không âm nào trùng", () => {
    const singles = PHONICS_SEED.filter((r) => r[2] === "single").map((r) => r[0]);
    assert.deepEqual(singles, "abcdefghijklmnopqrstuvwxyz".split(""));
    assert.equal(new Set(PHONICS_SEED.map((r) => r[0])).size, 36);
  });

  it("mỗi âm có phiên âm dạng /…/ và đúng 2 từ ví dụ có chứa phần chữ tạo ra âm", () => {
    for (const [grapheme, ipa, , examples] of PHONICS_SEED) {
      assert.match(ipa, /^\/.+\/$/, grapheme);
      assert.equal(examples.length, 2, grapheme);
      for (const [word, part] of examples) assert.ok(word.includes(part) && part.includes(grapheme.slice(0, 1)), `${grapheme}: ${word}/${part}`);
    }
  });

  it("thứ tự bắt đầu từ 1 và mọi phiên âm đổi được sang ký hiệu của giọng đọc", () => {
    assert.equal(phonicsSeedFields(PHONICS_SEED[0], 0).sortOrder, 1);
    assert.equal(phonicsSeedFields(PHONICS_SEED[35], 35).sortOrder, 36);
    for (const row of PHONICS_SEED) assert.ok(phonicsPhonemes(row[1]).length > 0, row[0]);
  });
});
