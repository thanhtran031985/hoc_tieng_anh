import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { exampleContainsWord, familyFilterState, familyRefLabel, groupFamiliesByWord, isIpaShape, isWordShape, sortFamilyRefs, splitFamilyChips, wordKey, type FamilyMemberRow, type WordFamilyRef } from "./admin-vocab.ts";

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

const member = (wordId: number, id: number, pattern: string, sameSound: boolean, status = "published"): FamilyMemberRow => ({ wordId, sameSound, family: { id, pattern, soundIpa: `/${pattern}/`, status } });

describe("groupFamiliesByWord", () => {
  it("từ không thuộc họ nào không có mục; từ thuộc một họ có một mục", () => {
    const map = groupFamiliesByWord([member(1, 10, "at", true)]);
    assert.equal(map.has(2), false);
    assert.deepEqual(map.get(1), [{ familyId: 10, pattern: "at", soundIpa: "/at/", sameSound: true, status: "published" }]);
  });

  it("gộp nhiều họ của cùng một từ: Cùng âm trước Bẫy, rồi vần a–z", () => {
    const map = groupFamiliesByWord([member(1, 30, "ous", false), member(1, 20, "ouse", true), member(1, 10, "ack", true), member(2, 10, "ack", true)]);
    assert.deepEqual(map.get(1)?.map((r) => `${r.pattern}:${r.sameSound}`), ["ack:true", "ouse:true", "ous:false"]);
    assert.equal(map.get(2)?.length, 1);
  });

  it("từ vừa Cùng âm ở họ này vừa Bẫy ở họ khác giữ đúng từng trạng thái", () => {
    const refs = groupFamiliesByWord([member(5, 1, "ear", true), member(5, 2, "eer", false)]).get(5)!;
    assert.deepEqual(refs.map((r) => [r.pattern, r.sameSound]), [["ear", true], ["eer", false]]);
  });

  it("trạng thái lạ coi là Nháp", () => {
    assert.equal(groupFamiliesByWord([member(1, 1, "at", true, "archived")]).get(1)?.[0].status, "draft");
  });
});

describe("sortFamilyRefs", () => {
  it("không đổi mảng gốc và ổn định theo mã họ khi cùng vần", () => {
    const a: WordFamilyRef = { familyId: 2, pattern: "at", soundIpa: "/æt/", sameSound: true, status: "draft" };
    const b: WordFamilyRef = { ...a, familyId: 1, soundIpa: "/ɑːt/" };
    const input = [a, b];
    assert.deepEqual(sortFamilyRefs(input).map((r) => r.familyId), [1, 2]);
    assert.deepEqual(input.map((r) => r.familyId), [2, 1]);
  });
});

describe("splitFamilyChips / familyFilterState / familyRefLabel", () => {
  it("hiện tối đa 2 chip, còn lại là +n", () => {
    assert.deepEqual(splitFamilyChips([1, 2, 3, 4]), { shown: [1, 2], more: 2 });
    assert.deepEqual(splitFamilyChips([1, 2]), { shown: [1, 2], more: 0 });
    assert.deepEqual(splitFamilyChips([]), { shown: [], more: 0 });
  });

  it("bộ lọc: có hoặc chưa có họ", () => {
    assert.equal(familyFilterState([]), "none");
    assert.equal(familyFilterState([1]), "has");
  });

  it("nhãn đọc cho chip", () => {
    assert.equal(familyRefLabel({ familyId: 1, pattern: "ous", soundIpa: "/əs/", sameSound: false, status: "draft" }), "-ous, bẫy chính tả, nháp");
    assert.equal(familyRefLabel({ familyId: 1, pattern: "at", soundIpa: "/æt/", sameSound: true, status: "published" }), "-at, cùng âm, đã xuất bản");
  });
});
