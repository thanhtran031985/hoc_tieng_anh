import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { closestAnswer, diffChars, firstLetterHint, gradeDictation, isShortWord } from "./dictation.ts";
import { fillSentence, matchCard, nextToDim, splitBlank } from "./fill-blank.ts";
import { gradePhonics, tileForKey, tileForSlot } from "./phonics.ts";
import { gradeOrder, nextCorrectCard, sameWords, wordKey } from "./sentence-order.ts";
import { matchesAny, normalizeAnswer } from "./text.ts";

describe("normalizeAnswer / matchesAny", () => {
  it("bỏ khoảng trắng thừa, dấu câu cuối, không phân biệt hoa/thường", () => {
    assert.equal(normalizeAnswer("  The   Cat. "), "the cat");
    assert.equal(normalizeAnswer("Hello!!", { ignoreCase: false, ignoreEndPunct: true }), "Hello");
    assert.equal(normalizeAnswer("Hello!", { ignoreCase: true, ignoreEndPunct: false }), "hello!");
  });

  it("dấu nháy cong coi như nháy thẳng", () => {
    assert.equal(normalizeAnswer("It’s"), "it's");
  });

  it("khớp một trong các đáp án chấp nhận; ô rỗng không khớp", () => {
    assert.equal(matchesAny("i am fine", ["I am fine.", "I'm fine."]), true);
    assert.equal(matchesAny("I'm fine", ["I am fine.", "I'm fine."]), true);
    assert.equal(matchesAny("", ["a"]), false);
    assert.equal(matchesAny("I am fin", ["I am fine."]), false);
  });
});

describe("gradeDictation", () => {
  const opts = { ignoreCase: true, ignoreEndPunct: true };

  it("đúng thì mọi ký tự ok", () => {
    const g = gradeDictation("Cat", ["cat"], opts);
    assert.equal(g.correct, true);
    assert.ok(g.marks.every((m) => m.state === "ok"));
  });

  it("sai thì chỉ ra ký tự lệch và phần còn thiếu", () => {
    const g = gradeDictation("cot", ["cat"], opts);
    assert.equal(g.correct, false);
    assert.deepEqual(g.marks.map((m) => m.state), ["ok", "bad", "ok"]);
    assert.deepEqual(diffChars("ca", "cat", opts).map((m) => m.char + m.state), ["cok", "aok", "_missing"]);
  });

  it("chọn đáp án gần nhất để tô chữ sai", () => {
    assert.equal(closestAnswer("im fine", ["I am fine", "I'm fine"], opts), "I'm fine");
  });

  it("từ ngắn gõ từng ô, câu gõ một dòng; gợi ý chữ đầu", () => {
    assert.equal(isShortWord("fish"), true);
    assert.equal(isShortWord("elephants"), false);
    assert.equal(isShortWord("I am"), false);
    assert.equal(firstLetterHint(["Fish"]), "F");
  });
});

describe("sentence-order", () => {
  const answer = ["She", "is", "reading", "a", "book."];

  it("so theo chữ, bỏ dấu câu cuối và hoa/thường", () => {
    assert.equal(wordKey("Book."), "book");
    assert.equal(gradeOrder(["she", "is", "reading", "a", "book"], answer).correct, true);
  });

  it("chỉ ra từng vị trí và phần đầu đã đúng", () => {
    const g = gradeOrder(["She", "reading", "is", "a", "book."], answer);
    assert.equal(g.correct, false);
    assert.deepEqual(g.marks, ["ok", "bad", "bad", "ok", "ok"]);
    assert.equal(g.prefix, 1);
  });

  it("từ lặp: so theo chữ nên không nhầm thẻ", () => {
    const dup = ["I", "like", "my", "cat", "and", "my", "dog"];
    assert.equal(gradeOrder(["I", "like", "my", "cat", "and", "my", "dog"], dup).correct, true);
    assert.equal(gradeOrder(["I", "like", "my", "dog", "and", "my", "cat"], dup).correct, false);
  });

  it("cách sắp xếp khác cũng đúng thì vẫn tính đúng; sai thì lấy cách khớp nhiều nhất để gợi ý", () => {
    const main = ["Every", "day", "I", "walk."];
    const alt = ["I", "walk", "every", "day."];
    assert.equal(gradeOrder(["I", "walk", "every", "day"], main, [alt]).correct, true);
    assert.equal(gradeOrder(["I", "walk", "day", "every"], main, [alt]).correct, false);
    const wrong = gradeOrder(["I", "walk", "day", "every"], main, [alt]);
    assert.deepEqual(wrong.answer, alt);
    assert.equal(wrong.prefix, 2);
    assert.equal(sameWords(alt, main), true);
    assert.equal(sameWords(["a", "b", "c"], ["a", "b", "d"]), false);
  });

  it("thiếu thẻ thì chưa đúng", () => {
    assert.equal(gradeOrder(["She", "is"], answer).correct, false);
  });

  it("tìm thẻ đúng kế tiếp trong khay", () => {
    const bank = [{ word: "book." }, { word: "a" }];
    assert.equal(nextCorrectCard(bank, answer, 3), 1);
    assert.equal(nextCorrectCard(bank, answer, 4), 0);
    assert.equal(nextCorrectCard(bank, answer, 5), -1);
  });
});

describe("phonics", () => {
  const order = ["sh", "i", "p"];

  it("đúng khi mọi ô đúng chữ; ô trống tính là empty", () => {
    assert.equal(gradePhonics(["sh", "i", "p"], order).correct, true);
    const g = gradePhonics(["sh", "p", null], order);
    assert.deepEqual(g.marks, ["ok", "bad", "empty"]);
    assert.equal(g.prefix, 1);
    assert.equal(g.correct, false);
  });

  it("từ lặp chữ: so theo chữ", () => {
    assert.equal(gradePhonics(["b", "a", "b", "y"], ["b", "a", "b", "y"]).correct, true);
  });

  it("phím chữ chọn ô chưa dùng đầu tiên bắt đầu bằng chữ đó", () => {
    const tiles = [
      { text: "sh", used: false },
      { text: "s", used: true },
      { text: "i", used: false },
    ];
    assert.equal(tileForKey(tiles, "s"), 0);
    assert.equal(tileForKey(tiles, "i"), 2);
    assert.equal(tileForKey(tiles, "z"), -1);
    assert.equal(tileForSlot(tiles, "i"), 2);
    assert.equal(tileForSlot(tiles, "s"), -1);
  });
});

describe("fill-blank", () => {
  it("tách câu quanh ô trống; câu không đúng một ô thì null", () => {
    assert.deepEqual(splitBlank("The cat is ___ the box."), { before: "The cat is ", after: " the box." });
    assert.equal(splitBlank("No blank here."), null);
    assert.equal(splitBlank("___ and ___"), null);
  });

  it("ghép câu hoàn chỉnh", () => {
    assert.equal(fillSentence("The cat is ___ the box.", "in"), "The cat is in the box.");
  });

  it("gõ thẳng vào ô khớp thẻ (không phân biệt hoa/thường)", () => {
    assert.equal(matchCard("In", ["on", "in", "at"]), 1);
    assert.equal(matchCard("under", ["on", "in", "at"]), -1);
    assert.equal(matchCard("", ["on"]), -1);
  });

  it("gợi ý làm mờ lần lượt các thẻ sai, bỏ qua thẻ đúng và thẻ đang chọn", () => {
    const cards = ["on", "in", "at", "by"];
    assert.equal(nextToDim(cards, 1, [], null), 0);
    assert.equal(nextToDim(cards, 1, [0], null), 2);
    assert.equal(nextToDim(cards, 1, [0], 2), 3);
    assert.equal(nextToDim(cards, 1, [0, 2, 3], null), null);
  });
});
