import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { splitSentence } from "./sentence-words.ts";

describe("splitSentence", () => {
  it("tách chữ, chữ thường và dấu câu cuối", () => {
    assert.deepEqual(splitSentence("This is a bird."), [
      { core: "This", word: "this", punct: "" },
      { core: "is", word: "is", punct: "" },
      { core: "a", word: "a", punct: "" },
      { core: "bird", word: "bird", punct: "." },
    ]);
  });

  it("giữ nhiều dấu câu và dấu nháy trong chữ", () => {
    const [a, b] = splitSentence("Don't stop!?");
    assert.deepEqual(a, { core: "Don't", word: "don't", punct: "" });
    assert.deepEqual(b, { core: "stop", word: "stop", punct: "!?" });
  });

  it("chữ không có chữ cái có word rỗng; nhiều khoảng trắng và câu rỗng", () => {
    assert.equal(splitSentence("I have 3  eyes")[2].word, "");
    assert.deepEqual(splitSentence("   "), []);
  });
});
