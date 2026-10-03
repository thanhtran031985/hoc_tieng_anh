import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { BankWord } from "./admin-questions.ts";
import { cellText, firstRowByWord, normalizeHeader, parseDifficulty, parseLevel, parsePos, parseQuestionType, parseStatus, questionFormOf, validateQuestionRow, validateVocabRow, type QuestionImportRow, type VocabImportRow } from "./admin-excel.ts";

describe("đọc ô và tiêu đề", () => {
  it("cellText xử lý chuỗi, số, ngày, công thức, rich text, liên kết", () => {
    assert.equal(cellText("  apple "), "apple");
    assert.equal(cellText(8), "8");
    assert.equal(cellText(null), "");
    assert.equal(cellText(new Date("2026-10-03T00:00:00Z")), "2026-10-03");
    assert.equal(cellText({ richText: [{ text: "ap" }, { text: "ple" }] }), "apple");
    assert.equal(cellText({ formula: "A1", result: 5 }), "5");
    assert.equal(cellText({ text: "link", hyperlink: "http://x" }), "link");
  });
  it("normalizeHeader", () => {
    assert.equal(normalizeHeader(" Meaning VI "), "meaning_vi");
    assert.equal(normalizeHeader("example-en"), "example_en");
  });
});

describe("parse", () => {
  it("loại từ, cấp, dạng câu hỏi, độ khó, trạng thái", () => {
    assert.equal(parsePos("Noun"), "noun");
    assert.equal(parsePos("danh từ"), "noun");
    assert.equal(parsePos("xyz"), null);
    assert.equal(parseLevel("8"), 8);
    assert.equal(parseLevel("8.0"), 8);
    for (const bad of ["0", "11", "abc", "", "1.5"]) assert.equal(parseLevel(bad), null, bad);
    assert.equal(parseQuestionType("8.2"), "listen_choose_picture");
    assert.equal(parseQuestionType("MATCH_PAIRS"), "match_pairs");
    assert.equal(parseQuestionType("abcd"), null);
    assert.equal(parseDifficulty(""), 1);
    assert.equal(parseDifficulty("3"), 3);
    assert.equal(parseDifficulty("6"), null);
    assert.equal(parseStatus(""), "draft");
    assert.equal(parseStatus("Published"), "published");
    assert.equal(parseStatus("live"), null);
  });
});

const ctx = { bank: new Map([["leisure", "Cấp 8 · Leisure time"]]), topicsByLevel: { 8: ["Ethnic groups", "Travel"], 1: [] } };
const row = (over: Partial<VocabImportRow> = {}): VocabImportRow => ({ n: 2, word: "ethnic", ipa: "/ˈeθ.nɪk/", pos: "adjective", meaning: "dân tộc", exampleEn: "There are 54 ethnic groups.", exampleVi: "", level: "8", topic: "Ethnic groups", ...over });

describe("validateVocabRow", () => {
  it("dòng hợp lệ không có lỗi", () => {
    assert.deepEqual(validateVocabRow(row(), ctx, firstRowByWord([row()])), {});
  });
  it("báo từng lỗi theo ô", () => {
    const check = (over: Partial<VocabImportRow>) => validateVocabRow(row(over), ctx, firstRowByWord([row(over)]));
    assert.match(check({ word: "" }).word, /Thiếu từ/);
    assert.match(check({ word: "Leisure", exampleEn: "I love leisure." }).word, /đã có trong ngân hàng \(Cấp 8/);
    assert.match(check({ ipa: "" }).ipa, /Thiếu/);
    assert.match(check({ ipa: "eθnɪk" }).ipa, /\/…\//);
    assert.match(check({ pos: "xyz" }).pos, /Loại từ/);
    assert.match(check({ meaning: " " }).meaning, /Thiếu nghĩa/);
    assert.match(check({ exampleEn: "Nothing." }).exampleEn, /chưa chứa từ/);
    assert.match(check({ level: "11" }).level, /1 đến 10/);
    assert.match(check({ topic: "Unknown" }).topic, /không có ở cấp 8/);
  });
  it("báo trùng trong tệp ở các dòng sau", () => {
    const rows = [row({ n: 2 }), row({ n: 3 })];
    const first = firstRowByWord(rows);
    assert.deepEqual(validateVocabRow(rows[0], ctx, first), {});
    assert.match(validateVocabRow(rows[1], ctx, first).word, /Trùng với dòng 2/);
  });
  it("chủ đề để trống thì hợp lệ", () => {
    assert.deepEqual(validateVocabRow(row({ topic: "" }), ctx, firstRowByWord([row()])), {});
  });
});

const bank = new Map<string, BankWord>([
  ["apple", { id: 1, word: "apple", image: "/media/pictures/apple.svg" }],
  ["pear", { id: 2, word: "pear", image: "/media/pictures/pear.svg" }],
  ["orange", { id: 3, word: "orange", image: "/media/pictures/orange.svg" }],
  ["banana", { id: 4, word: "banana", image: "/media/pictures/banana.svg" }],
]);
const qrow = (over: Partial<QuestionImportRow> = {}): QuestionImportRow => ({ n: 2, type: "listen_choose_picture", options: ["apple", "pear", "orange", "", "", ""], answer: "apple", level: "1", skill: "listening", difficulty: "1", explanation: "", status: "draft", ...over });

describe("validateQuestionRow", () => {
  it("dòng hợp lệ ở cả ba dạng", () => {
    assert.deepEqual(validateQuestionRow(qrow(), { bank }), {});
    assert.deepEqual(validateQuestionRow(qrow({ type: "8.4" }), { bank }), {});
    assert.deepEqual(validateQuestionRow(qrow({ type: "match_pairs", options: ["apple", "pear", "orange", "banana", "", ""], answer: "" }), { bank }), {});
  });
  it("báo lỗi theo ô", () => {
    const check = (over: Partial<QuestionImportRow>) => validateQuestionRow(qrow(over), { bank });
    assert.ok(check({ type: "abcd" }).type);
    assert.match(check({ answer: "" }).answer, /Thiếu từ đúng/);
    assert.match(check({ answer: "kiwi" }).answer, /một trong các từ lựa chọn/);
    assert.match(check({ options: ["apple", "kiwi", "", "", "", ""] }).options, /“kiwi” chưa có/);
    assert.ok(check({ level: "0" }).level);
    assert.ok(check({ skill: "dancing" }).skill);
    assert.ok(check({ difficulty: "9" }).difficulty);
    assert.ok(check({ status: "live" }).status);
    assert.match(check({ level: "8" }).explanation, /cần có giải thích/);
    assert.deepEqual(check({ level: "8", explanation: "Vì sao." }), {});
  });
  it("questionFormOf tìm vị trí đáp án đúng", () => {
    assert.equal(questionFormOf("listen_choose_picture", qrow({ answer: "Pear" })).correct, 1);
    assert.deepEqual(questionFormOf("match_pairs", qrow({ type: "match_pairs", options: ["a", "", "b", "", "", ""] })).pairs, ["a", "b"]);
  });
});
