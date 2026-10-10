import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extraQuestionTexts } from "./play-texts.ts";

describe("extraQuestionTexts", () => {
  it("sắp xếp câu, nghe-gõ, luyện nói, ghép âm: chính chữ của câu", () => {
    assert.deepEqual(extraQuestionTexts("sentence_order", { text: "I like my cat." }, { distractors: [] }, { words: ["I", "like", "my", "cat."] }), ["I like my cat."]);
    assert.deepEqual(extraQuestionTexts("dictation", { text: "cat" }, { ignoreCase: true, ignoreEndPunct: true }, { accepted: ["cat"] }), ["cat"]);
    assert.deepEqual(extraQuestionTexts("speaking", { text: "I like cats." }, { leniency: "easy" }, { expected: "I like cats." }), ["I like cats."]);
    assert.deepEqual(extraQuestionTexts("phonics", { text: "cat" }, { tiles: [{ t: "c", sound: "c" }, { t: "a", sound: "a" }, { t: "t", sound: "t" }] }, { order: ["c", "a", "t"] }), ["cat"]);
  });
  it("điền từ: câu đủ từ và câu còn thiếu từ (đúng chữ mà bước điền từ đọc)", () => {
    const texts = extraQuestionTexts("fill_blank", { text: "I have a ___." }, { cards: ["cat", "dog", "pig"] }, { correct: 1 });
    assert.deepEqual(texts, ["I have a dog.", "I have a ."]);
  });
  it("đọc hiểu: từng câu của đoạn, câu hỏi và đáp án, không trùng", () => {
    const texts = extraQuestionTexts(
      "short_reading",
      { title: "My cat", text: "I have a cat. Her name is Mimi. She is white." },
      { questions: [{ text: "What is her name?", choices: ["Mimi", "Lan", "Tom"], evidence: 1 }, { text: "What colour is she?", choices: ["white", "black", "Mimi"], evidence: 2 }] },
      { correct: [0, 0] },
    );
    assert.deepEqual(texts, ["I have a cat.", "Her name is Mimi.", "She is white.", "What is her name?", "Mimi", "Lan", "Tom", "What colour is she?", "white", "black"]);
  });
  it("dạng lạ hoặc dữ liệu hỏng thì rỗng", () => {
    assert.deepEqual(extraQuestionTexts("listen_choose_picture", {}, {}, {}), []);
    assert.deepEqual(extraQuestionTexts("dictation", { text: 5 }, {}, {}), []);
  });
});
