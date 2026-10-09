import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { BankWord } from "./admin-questions.ts";
import { buildExtraData, buildExtraPreviewStep, emptyExtraForm, extraQuestionSummary, mergeTiles, readExtraForm, splitIntoTiles, validateExtraBuilt, type ExtraContext, type ExtraForm } from "./admin-question-types.ts";

const bank = new Map<string, BankWord>([
  ["cat", { id: 1, word: "cat", image: "/media/pictures/cat.svg" }],
  ["kiwi", { id: 2, word: "kiwi", image: null }],
]);
const sounds = new Map([
  ["c", { ipa: "/k/", audio: null }],
  ["a", { ipa: "/æ/", audio: null }],
  ["t", { ipa: "/t/", audio: null }],
  ["sh", { ipa: "/ʃ/", audio: null }],
  ["i", { ipa: "/ɪ/", audio: null }],
  ["p", { ipa: "/p/", audio: null }],
]);
const ctx: ExtraContext = { bank, sounds };
const form = (patch: Partial<ExtraForm>): ExtraForm => ({ ...emptyExtraForm(), ...patch });

describe("splitIntoTiles / mergeTiles", () => {
  it("chữ ghép chung một ô, chữ lẻ mỗi chữ một ô, tự chọn âm cùng tên", () => {
    assert.deepEqual(splitIntoTiles("ship", sounds), [{ t: "sh", sound: "sh" }, { t: "i", sound: "i" }, { t: "p", sound: "p" }]);
    assert.deepEqual(splitIntoTiles("Cat", sounds).map((t) => t.t), ["c", "a", "t"]);
    assert.deepEqual(splitIntoTiles("tree", new Map()).map((t) => t.t), ["t", "r", "ee"]);
  });

  it("ô không có trong bộ âm thì chưa chọn âm thanh", () => {
    assert.equal(splitIntoTiles("zoo", sounds)[0].sound, "");
  });

  it("gộp ô với ô kế tiếp", () => {
    const tiles = splitIntoTiles("cat", sounds);
    assert.deepEqual(mergeTiles(tiles, 0, sounds).map((t) => t.t), ["ca", "t"]);
    assert.deepEqual(mergeTiles(tiles, 2, sounds).map((t) => t.t), ["c", "a", "t"]);
  });
});

describe("buildExtraData — ghép âm", () => {
  it("dựng đúng khi các ô ghép lại thành từ và mọi ô có âm thanh", () => {
    const r = buildExtraData("phonics", form({ text: "cat", tiles: splitIntoTiles("cat", sounds), picture: "cat" }), ctx);
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.deepEqual(r.data, {
      prompt: { text: "cat", wordId: 1 },
      options: { tiles: [{ t: "c", sound: "c" }, { t: "a", sound: "a" }, { t: "t", sound: "t" }] },
      answer: { order: ["c", "a", "t"] },
    });
    assert.equal(validateExtraBuilt("phonics", r.data), null);
  });

  it("báo lỗi dưới nhóm ô: thiếu từ, chưa tách, ô ghép sai, thiếu âm, hình chưa có", () => {
    const f = (patch: Partial<ExtraForm>) => buildExtraData("phonics", form(patch), ctx);
    assert.deepEqual(f({}), { ok: false, field: "text", message: "Nhập từ cần ghép." });
    assert.equal(f({ text: "cat" }).ok, false);
    assert.match((f({ text: "cat", tiles: [{ t: "c", sound: "c" }, { t: "u", sound: "a" }, { t: "t", sound: "t" }] }) as { message: string }).message, /thành “cat” \(đang là “cut”\)/);
    assert.match((f({ text: "zoo", tiles: [{ t: "z", sound: "" }, { t: "oo", sound: "oo" }] }) as { message: string }).message, /Ô “z” chưa chọn âm thanh/);
    assert.match((f({ text: "cat", tiles: splitIntoTiles("cat", sounds), picture: "kiwi" }) as { message: string }).message, /chưa có hình/);
    assert.match((f({ text: "cat", tiles: splitIntoTiles("cat", sounds), picture: "ghost" }) as { message: string }).message, /chưa có trong ngân hàng/);
  });
});

describe("buildExtraData — sắp xếp câu", () => {
  it("tự tách thẻ theo từ, dấu câu dính từ cuối; từ nhiễu cách nhau bằng dấu phẩy", () => {
    const r = buildExtraData("sentence_order", form({ text: "She is  reading a book.", distractors: "eat, red" }), ctx);
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.deepEqual(r.data, { prompt: { text: "She is reading a book." }, options: { distractors: ["eat", "red"] }, answer: { words: ["She", "is", "reading", "a", "book."] } });
    assert.equal(validateExtraBuilt("sentence_order", r.data), null);
  });

  it("cách sắp xếp khác: phải dùng đúng các từ của câu; lưu vào answer.alternatives", () => {
    const ok = buildExtraData("sentence_order", form({ text: "Every day I walk.", alternatives: "I walk every day." }), ctx);
    assert.equal(ok.ok, true);
    if (ok.ok) {
      assert.deepEqual((ok.data.answer as { alternatives: string[][] }).alternatives, [["I", "walk", "every", "day."]]);
      assert.equal(validateExtraBuilt("sentence_order", ok.data), null);
    }
    const bad = buildExtraData("sentence_order", form({ text: "Every day I walk.", alternatives: "I run every day." }), ctx);
    assert.equal(bad.ok, false);
    if (!bad.ok) assert.equal(bad.field, "alternatives");
  });

  it("báo lỗi: thiếu câu, ít hơn 3 từ, quá 3 từ nhiễu, từ nhiễu trùng từ trong câu", () => {
    const f = (patch: Partial<ExtraForm>) => (buildExtraData("sentence_order", form(patch), ctx) as { message: string }).message;
    assert.equal(f({}), "Nhập câu gốc.");
    assert.equal(f({ text: "Hello there" }), "Câu cần ít nhất 3 từ để sắp xếp.");
    assert.equal(f({ text: "I like cats", distractors: "a, b, c, d" }), "Tối đa 3 từ nhiễu.");
    assert.equal(f({ text: "I like cats", distractors: "Like" }), "Từ nhiễu “Like” trùng với từ trong câu.");
  });
});

describe("buildExtraData — nghe và gõ", () => {
  it("dựng khi có đáp án trùng nội dung được đọc (không phân biệt hoa/thường, dấu cuối)", () => {
    const r = buildExtraData("dictation", form({ text: "I'm fine.", accepted: "I'm fine\nI am fine" }), ctx);
    assert.equal(r.ok, true);
    if (r.ok) assert.deepEqual(r.data, { prompt: { text: "I'm fine." }, options: { ignoreCase: true, ignoreEndPunct: true }, answer: { accepted: ["I'm fine", "I am fine"] } });
  });

  it("báo lỗi: thiếu nội dung, thiếu đáp án, không đáp án nào trùng", () => {
    const f = (patch: Partial<ExtraForm>) => (buildExtraData("dictation", form(patch), ctx) as { message: string }).message;
    assert.equal(f({}), "Nhập nội dung được đọc.");
    assert.equal(f({ text: "fish" }), "Cần ít nhất một đáp án chấp nhận.");
    assert.equal(f({ text: "fish", accepted: "dish" }), "Chưa có đáp án nào trùng với nội dung được đọc.");
  });

  it("tắt ‘không phân biệt hoa/thường’ thì hoa/thường phải khớp", () => {
    const r = buildExtraData("dictation", form({ text: "Fish", accepted: "fish", ignoreCase: false }), ctx);
    assert.equal(r.ok, false);
  });
});

describe("buildExtraData — điền từ", () => {
  it("bỏ thẻ trống và đổi chỉ số thẻ đúng theo danh sách đã gọn", () => {
    const r = buildExtraData("fill_blank", form({ text: "The cat is ___ the box.", cards: ["on", "", "in", "at"], correct: 2 }), ctx);
    assert.equal(r.ok, true);
    if (r.ok) assert.deepEqual(r.data, { prompt: { text: "The cat is ___ the box." }, options: { cards: ["on", "in", "at"] }, answer: { correct: 1 } });
  });

  it("báo lỗi: thiếu câu, không có hoặc nhiều ô trống, ít thẻ, thẻ trùng, chưa chọn thẻ đúng", () => {
    const f = (patch: Partial<ExtraForm>) => (buildExtraData("fill_blank", form(patch), ctx) as { message: string }).message;
    const cards = ["on", "in", "at", ""];
    assert.equal(f({}), "Nhập câu.");
    assert.equal(f({ text: "The cat is in.", cards }), "Câu chưa có ô trống ___.");
    assert.equal(f({ text: "A ___ and ___", cards }), "Câu chỉ được có một ô trống ___.");
    assert.equal(f({ text: "A ___ b", cards: ["on", "in", "", ""], correct: 0 }), "Cần ít nhất 3 thẻ từ (đang có 2).");
    assert.equal(f({ text: "A ___ b", cards: ["on", "On", "at", ""], correct: 0 }), "Có hai thẻ trùng nhau.");
    assert.equal(f({ text: "A ___ b", cards, correct: null }), "Chọn một thẻ đúng.");
    assert.equal(f({ text: "A ___ b", cards, correct: 3 }), "Chọn một thẻ đúng.");
  });
});

describe("readExtraForm / extraQuestionSummary", () => {
  it("đảo ngược buildExtraData cho cả 4 dạng", () => {
    const cases: [Parameters<typeof buildExtraData>[0], ExtraForm][] = [
      ["phonics", form({ text: "cat", tiles: splitIntoTiles("cat", sounds), picture: "cat" })],
      ["sentence_order", form({ text: "She is reading a book.", distractors: "eat", alternatives: "A book she is reading." })],
      ["dictation", form({ text: "fish", accepted: "fish", ignoreEndPunct: false })],
      ["fill_blank", form({ text: "A ___ b", cards: ["on", "in", "at", ""], correct: 1 })],
    ];
    for (const [type, input] of cases) {
      const built = buildExtraData(type, input, ctx);
      assert.equal(built.ok, true, type);
      if (!built.ok) continue;
      const back = readExtraForm(type, built.data.prompt, built.data.options, built.data.answer, input.picture);
      assert.deepEqual(back, input, type);
    }
  });

  it("dòng tóm tắt cho bảng", () => {
    assert.equal(extraQuestionSummary("phonics", { text: "cat" }), "Ghép âm: cat");
    assert.equal(extraQuestionSummary("sentence_order", { text: "She is reading a book." }), "Xếp câu: She is reading a book.");
    assert.equal(extraQuestionSummary("dictation", { text: "fish" }), "Nghe và gõ: fish");
    assert.equal(extraQuestionSummary("fill_blank", { text: "The cat is ___ the box." }), "Điền: The cat is ___ the box.");
  });
});

describe("buildExtraPreviewStep", () => {
  it("dựng đúng kiểu bước của trình học, không gắn mã câu hỏi", () => {
    const step = buildExtraPreviewStep("fill_blank", form({ text: "The cat is ___ the box.", cards: ["in", "on", "at", ""], correct: 0, picture: "cat" }), ctx);
    assert.equal(step?.kind, "fill_blank");
    if (step?.kind === "fill_blank") {
      assert.equal(step.questionId, null);
      assert.equal(step.correct, "in");
      assert.equal(step.picture?.word, "cat");
    }
    assert.equal(buildExtraPreviewStep("fill_blank", form({ text: "No blank" }), ctx), null);
  });
});
