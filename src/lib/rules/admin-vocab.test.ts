import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { exampleContainsWord, isIpaShape, isWordShape, wordKey } from "./admin-vocab.ts";

describe("isWordShape", () => {
  it("nhận từ, cụm từ, từ có gạch nối hoặc dấu nháy", () => {
    for (const w of ["apple", "check in", "T-shirt", "o'clock", "Mr."]) assert.equal(isWordShape(w), true, w);
  });
  it("từ chối chuỗi rỗng, bắt đầu bằng số hoặc có ký tự lạ", () => {
    for (const w of ["", " ", "1st", "café!", "ăn"]) assert.equal(isWordShape(w), false, w);
  });
});

describe("isIpaShape", () => {
  it("phải nằm trong hai dấu gạch chéo và có nội dung", () => {
    assert.equal(isIpaShape("/ˈæp.əl/"), true);
    assert.equal(isIpaShape(" /ˌweɪk ˈʌp/ "), true);
    assert.equal(isIpaShape("ˈæpəl"), false);
    assert.equal(isIpaShape("//"), false);
    assert.equal(isIpaShape("/abc"), false);
  });
});

describe("wordKey", () => {
  it("so sánh trùng không phân biệt hoa thường và khoảng trắng", () => {
    assert.equal(wordKey("  Wake   UP "), "wake up");
  });
});

describe("exampleContainsWord", () => {
  it("khớp đúng chữ và các dạng chia", () => {
    assert.equal(exampleContainsWord("apple", "I like an apple."), true);
    assert.equal(exampleContainsWord("get up", "Mum gets up early."), true);
    assert.equal(exampleContainsWord("play", "He is playing football."), true);
    assert.equal(exampleContainsWord("wake up", "I wake up at six o'clock."), true);
  });
  it("báo khi câu không chứa từ", () => {
    assert.equal(exampleContainsWord("apple", "I like bananas."), false);
    assert.equal(exampleContainsWord("get up", "Mum is early."), false);
  });
  it("chữ ngắn phải khớp nguyên chữ, không khớp tiền tố", () => {
    assert.equal(exampleContainsWord("up", "He is upset."), false);
    assert.equal(exampleContainsWord("up", "Stand up!"), true);
  });
  it("thiếu từ hoặc thiếu câu thì chưa kiểm được", () => {
    assert.equal(exampleContainsWord("", "Hello"), true);
    assert.equal(exampleContainsWord("apple", ""), true);
  });
});

describe("exampleContainsWord với động từ bất quy tắc", () => {
  it("nhận dạng quá khứ và phân từ", () => {
    assert.equal(exampleContainsWord("teach", "My mum taught me to cook."), true);
    assert.equal(exampleContainsWord("buy", "I bought a book yesterday."), true);
    assert.equal(exampleContainsWord("go", "She went home."), true);
    assert.equal(exampleContainsWord("go", "She stayed home."), false);
  });
});
