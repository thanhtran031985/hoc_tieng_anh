import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { litIndexAt, litInSentence, pageText, pageWordCount, storyPublishBlock, wordWeights } from "./lesson-story.ts";

describe("đoạn đọc và đếm từ", () => {
  it("ghép các câu thành một đoạn và đếm từ có chữ cái", () => {
    assert.equal(pageText(["This is Tom.", " He has a red kite. "]), "This is Tom. He has a red kite.");
    assert.equal(pageWordCount(["This is Tom.", "He has a red kite."]), 8);
    assert.equal(pageWordCount(["Count 1, 2, 3!"]), 1);
  });
});

describe("chữ sáng theo giọng đọc", () => {
  it("chia theo tỉ lệ độ dài chữ; chưa bắt đầu hoặc xong thì không chữ nào sáng", () => {
    const weights = wordWeights("a big elephant");
    assert.deepEqual(weights, [2, 4, 9]);
    assert.equal(litIndexAt(0, weights), null);
    assert.equal(litIndexAt(1, weights), null);
    assert.equal(litIndexAt(0.05, weights), 0);
    assert.equal(litIndexAt(0.3, weights), 1);
    assert.equal(litIndexAt(0.9, weights), 2);
  });

  it("không có chữ nào thì không sáng", () => {
    assert.equal(litIndexAt(0.5, []), null);
  });

  it("chữ sáng của cả trang chuyển về đúng câu", () => {
    const sentences = ["This is Tom.", "He has a red kite."];
    assert.equal(litInSentence(1, sentences, 0), 1);
    assert.equal(litInSentence(1, sentences, 1), null);
    assert.equal(litInSentence(3, sentences, 1), 0);
    assert.equal(litInSentence(7, sentences, 1), 4);
    assert.equal(litInSentence(null, sentences, 0), null);
  });
});

describe("storyPublishBlock", () => {
  const page = (sentences: string[], audio: string | null = "/audio/story-1-aaaaaaaa.mp3") => ({ kind: "page" as const, sentences, audio });

  it("đủ trang, có âm thanh, câu hỏi hợp lệ thì xuất bản được", () => {
    assert.equal(storyPublishBlock([page(["This is Tom."]), { kind: "question", valid: true }, page(["Tom is happy."])]), null);
  });

  it("chặn: không có trang truyện nào", () => {
    assert.match(storyPublishBlock([]) ?? "", /ít nhất một trang/);
    assert.match(storyPublishBlock([{ kind: "question", valid: true }]) ?? "", /ít nhất một trang/);
  });

  it("chặn và nêu số trang thiếu âm thanh (trang câu hỏi không có số)", () => {
    const block = storyPublishBlock([page(["One."]), { kind: "question", valid: true }, page(["Two."], null), page(["Three."], null)]);
    assert.match(block ?? "", /trang 2, 3 chưa có âm thanh/);
  });

  it("chặn trang quá 16 từ hoặc quá 2 câu, trang rỗng, câu hỏi hỏng", () => {
    const long = Array.from({ length: 17 }, (_, i) => `w${i}x`).join(" ");
    assert.match(storyPublishBlock([page([long])]) ?? "", /Trang 1 quá dài/);
    assert.match(storyPublishBlock([page(["A b.", "C d.", "E f."])]) ?? "", /quá dài/);
    assert.match(storyPublishBlock([page([""])]) ?? "", /Trang 1 chưa có câu nào/);
    assert.match(storyPublishBlock([page(["Ok."]), { kind: "question", valid: false }]) ?? "", /trang câu hỏi/);
  });
});
