import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COMPLETION_STARS, completionScore, praiseFor, scoreSpeech, spokenWords, wordsMatch } from "./speaking.ts";

describe("spokenWords", () => {
  it("chữ thường, bỏ dấu câu, giữ dấu nháy trong từ", () => {
    assert.deepEqual(spokenWords("I like apples."), ["i", "like", "apples"]);
    assert.deepEqual(spokenWords("Don’t run, Tom!"), ["don't", "run", "tom"]);
    assert.deepEqual(spokenWords("  "), []);
  });
});

describe("wordsMatch", () => {
  it("giống hệt hoặc lệch 1 ký tự với từ từ 4 chữ cái", () => {
    assert.equal(wordsMatch("cat", "cat"), true);
    assert.equal(wordsMatch("apple", "apples"), true);
    assert.equal(wordsMatch("banana", "bananas"), true);
    assert.equal(wordsMatch("cat", "bat"), false);
    assert.equal(wordsMatch("like", "likes"), true);
    assert.equal(wordsMatch("like", "love"), false);
  });
});

describe("scoreSpeech", () => {
  const sentence = "I like apples.";

  it("khớp hết thì 3 sao, mọi từ nói tốt", () => {
    const s = scoreSpeech(sentence, "i like apples");
    assert.equal(s.stars, 3);
    assert.deepEqual(s.marks, ["ok", "ok", "ok"]);
    assert.deepEqual(s.weak, []);
  });

  it("lệch nhẹ (apple thay apples) vẫn 3 sao", () => {
    assert.equal(scoreSpeech(sentence, "I like apple").stars, 3);
  });

  it("mức dễ tính vừa: thiếu 1/3 từ → 2 sao và nêu từ nên nói lại", () => {
    const s = scoreSpeech(sentence, "I like");
    assert.equal(s.stars, 2);
    assert.deepEqual(s.weak, ["apples"]);
    assert.deepEqual(s.marks, ["ok", "ok", "soso"]);
  });

  it("chỉ khớp 1/3 từ thì 1 sao; không nghe được gì cũng 1 sao (bé đã nói)", () => {
    assert.equal(scoreSpeech(sentence, "like").stars, 1);
    const none = scoreSpeech(sentence, "");
    assert.equal(none.stars, 1);
    assert.equal(none.ratio, 0);
  });

  it("từ nghe được chỉ dùng một lần cho một từ mẫu", () => {
    assert.equal(scoreSpeech("go go go", "go", "normal").stars, 1);
    assert.equal(scoreSpeech("go go go", "go go go", "normal").stars, 3);
  });

  it("mức dễ tính đổi ngưỡng: 4 trên 6 từ", () => {
    const text = "The cat is on the mat";
    const heard = "the cat is on";
    assert.equal(scoreSpeech(text, heard, "easy").stars, 3);
    assert.equal(scoreSpeech(text, heard, "normal").stars, 2);
    assert.equal(scoreSpeech(text, "the cat", "strict").stars, 1);
    assert.equal(scoreSpeech(text, heard, "strict").stars, 1);
  });
});

describe("không chấm và lời khen", () => {
  it("không chấm thì hoàn thành với 2 sao", () => {
    const s = completionScore("I like apples.");
    assert.equal(s.stars, COMPLETION_STARS);
    assert.deepEqual(s.marks, ["ok", "ok", "ok"]);
  });

  it("lời khen theo sao, 2 sao nhắc từ cần nói chậm hơn, không bao giờ chê", () => {
    assert.match(praiseFor(3), /Tuyệt vời/);
    assert.match(praiseFor(2, "apples"), /“apples” chậm hơn/);
    assert.match(praiseFor(2), /Giỏi quá/);
    assert.match(praiseFor(1), /Bông nghe được rồi/);
  });
});
