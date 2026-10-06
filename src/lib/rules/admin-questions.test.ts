import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPreviewStep, buildQuestionData, explanationRequired, questionSummary, readQuestionForm, validateBuilt, type BankWord, type QuestionForm } from "./admin-questions.ts";

const words: BankWord[] = [
  { id: 1, word: "apple", image: "/media/pictures/apple.svg" },
  { id: 2, word: "pear", image: "/media/pictures/pear.svg" },
  { id: 3, word: "orange", image: "/media/pictures/orange.svg" },
  { id: 4, word: "banana", image: "/media/pictures/banana.svg" },
  { id: 5, word: "congestion", image: null },
];
const bank = new Map(words.map((w) => [w.word, w]));
const form = (over: Partial<QuestionForm>): QuestionForm => ({ choices: ["", "", "", ""], correct: null, pairs: ["", "", "", ""], ...over });

describe("buildQuestionData — nghe và chọn hình (8.2)", () => {
  it("dựng prompt, options, answer hợp lệ theo Zod", () => {
    const result = buildQuestionData("listen_choose_picture", form({ choices: ["apple", "pear", "orange", ""], correct: 0 }), bank);
    assert.ok(result.ok);
    assert.equal(validateBuilt("listen_choose_picture", result.data), null);
    assert.deepEqual(result.data.answer, { correct: ["a"] });
    assert.deepEqual(result.data.prompt, { text: "apple", wordId: 1 });
  });
  it("báo lỗi: thiếu lựa chọn, từ lạ, trùng, thiếu đáp án đúng, thiếu hình", () => {
    const f = (c: string[], correct: number | null) => buildQuestionData("listen_choose_picture", form({ choices: c, correct }), bank);
    assert.match(f(["apple", "", "", ""], 0).ok === false ? (f(["apple", "", "", ""], 0) as { message: string }).message : "", /ít nhất 2/);
    assert.match((f(["apple", "kiwi", "", ""], 0) as { message: string }).message, /“kiwi” chưa có/);
    assert.match((f(["apple", "Apple", "", ""], 0) as { message: string }).message, /trùng/);
    assert.match((f(["apple", "pear", "", ""], null) as { message: string }).message, /đáp án đúng/);
    assert.match((f(["apple", "congestion", "", ""], 0) as { message: string }).message, /“congestion” chưa có hình/);
  });
});

describe("buildQuestionData — chọn từ đúng cho hình (8.4)", () => {
  it("lấy hình của đáp án đúng làm đề, lựa chọn là chữ", () => {
    const result = buildQuestionData("choose_word_for_picture", form({ choices: ["apple", "pear", "congestion", ""], correct: 1 }), bank);
    assert.ok(result.ok);
    assert.equal(validateBuilt("choose_word_for_picture", result.data), null);
    assert.deepEqual(result.data.prompt, { image: "/media/pictures/pear.svg", wordId: 2 });
  });
  it("đáp án đúng phải có hình", () => {
    const result = buildQuestionData("choose_word_for_picture", form({ choices: ["apple", "congestion", "", ""], correct: 1 }), bank);
    assert.equal(result.ok, false);
  });
});

describe("buildQuestionData — nối từ với hình (8.3)", () => {
  it("3–6 cặp từ khác nhau có hình", () => {
    const result = buildQuestionData("match_pairs", form({ pairs: ["apple", "pear", "orange", "banana"] }), bank);
    assert.ok(result.ok);
    assert.equal(validateBuilt("match_pairs", result.data), null);
    assert.equal(buildQuestionData("match_pairs", form({ pairs: ["apple", "pear", "", ""] }), bank).ok, false);
    assert.equal(buildQuestionData("match_pairs", form({ pairs: ["apple", "pear", "apple", ""] }), bank).ok, false);
    assert.equal(buildQuestionData("match_pairs", form({ pairs: ["apple", "pear", "congestion", ""] }), bank).ok, false);
  });
});

describe("đọc lại và tóm tắt", () => {
  it("readQuestionForm đảo ngược buildQuestionData", () => {
    const input = form({ choices: ["apple", "pear", "orange", ""], correct: 1 });
    const built = buildQuestionData("listen_choose_picture", input, bank);
    assert.ok(built.ok);
    const back = readQuestionForm("listen_choose_picture", built.data.options, built.data.answer);
    assert.deepEqual(back.choices, input.choices);
    assert.equal(back.correct, 1);
    assert.equal(questionSummary("listen_choose_picture", built.data.options, built.data.answer), "Nghe và chọn hình: pear");

    const match = buildQuestionData("match_pairs", form({ pairs: ["apple", "pear", "orange", "banana"] }), bank);
    assert.ok(match.ok);
    assert.deepEqual(readQuestionForm("match_pairs", match.data.options, match.data.answer).pairs, ["apple", "pear", "orange", "banana"]);
    assert.equal(questionSummary("match_pairs", match.data.options, match.data.answer), "Nối từ với hình: apple · pear · orange · banana");
  });
  it("dữ liệu lạ thì trả biểu mẫu trống, không ném lỗi", () => {
    assert.deepEqual(readQuestionForm("listen_choose_picture", null, null).correct, null);
    assert.equal(readQuestionForm("match_pairs", "x", 3).pairs.length, 4);
  });
});

describe("buildPreviewStep và giải thích bắt buộc", () => {
  it("dựng bước cho trình học của bé", () => {
    const step = buildPreviewStep("listen_choose_picture", form({ choices: ["apple", "pear", "", ""], correct: 1 }), bank);
    assert.ok(step && step.kind === "listen_choose_picture");
    assert.equal(step.target.word, "pear");
    assert.equal(step.options.length, 2);
    assert.equal(buildPreviewStep("match_pairs", form({ pairs: ["apple", "pear", "orange", ""] }), bank)?.kind, "match_pairs");
    assert.equal(buildPreviewStep("listen_choose_picture", form({}), bank), null);
  });
  it("giải thích bắt buộc từ cấp 6", () => {
    assert.equal(explanationRequired(5), false);
    assert.equal(explanationRequired(6), true);
  });
});
