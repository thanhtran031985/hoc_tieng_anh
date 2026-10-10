import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { allowedTokensFor, isAllowedToken, stems, tokenize, unknownTokens } from "./vocab-check.ts";

describe("vocab-check", () => {
  const allowed = allowedTokensFor(["cat", "dog", "ice cream", "run"]);
  it("tách chữ, bỏ dấu câu, giữ dạng rút gọn", () => {
    assert.deepEqual(tokenize("The cat's big, isn't it?"), ["the", "cat's", "big", "isn't", "it"]);
  });
  it("từ chức năng và từ đã dạy được phép, kể cả dạng biến đổi", () => {
    assert.deepEqual(unknownTokens("I like cats and dogs.", allowed), []);
    assert.deepEqual(unknownTokens("The dog is running to the ice cream.", allowed), []);
    assert.deepEqual(unknownTokens("Mum made a big cake.", allowed), ["cake"]);
  });
  it("từ ngoài cấp được báo một lần, giữ thứ tự", () => {
    assert.deepEqual(unknownTokens("The zebra and the zebra see a giraffe.", allowed), ["zebra", "giraffe"]);
  });
  it("chính từ đang dạy được phép qua tham số own", () => {
    assert.deepEqual(unknownTokens("I see a zebra.", allowed, new Set(["zebra"])), []);
    assert.equal(isAllowedToken("ran", allowed), true);
  });
  it("tên riêng được phép", () => {
    assert.deepEqual(unknownTokens("Tom and Anna like Ben.", allowed), []);
  });
  it("stems gồm dạng gốc", () => {
    assert.ok(stems("stories").has("story"));
    assert.ok(stems("running").has("run"));
    assert.ok(stems("bigger").has("big"));
  });
});
