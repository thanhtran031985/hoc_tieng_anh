import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPlaySteps, type PlayWord, type StoredStep } from "./lesson-play.ts";
import { parseExtraQuestion } from "../schemas/question-extra.ts";

const cat: PlayWord = { id: 1, word: "cat", ipa: null, meaningVi: "con mèo", exampleEn: null, exampleVi: null, image: "/media/pictures/cat.svg" };

const stepOf = (id: number, activityType: string, q: { type?: string; prompt: unknown; options: unknown; answer: unknown } | null): StoredStep => ({
  id,
  activityType,
  config: {},
  word: null,
  question: q ? { id: id * 10, type: q.type ?? activityType, prompt: q.prompt, options: q.options, answer: q.answer } : null,
});

const phonics = { prompt: { text: "cat", wordId: 1 }, options: { tiles: [{ t: "c", sound: "c" }, { t: "a", sound: "a" }, { t: "t", sound: "t" }] }, answer: { order: ["c", "a", "t"] } };
const order = { prompt: { text: "She is reading a book." }, options: { distractors: ["eat"] }, answer: { words: ["She", "is", "reading", "a", "book."] } };
const dictation = { prompt: { text: "fish" }, options: { ignoreCase: true, ignoreEndPunct: true }, answer: { accepted: ["fish"] } };
const fill = { prompt: { text: "The cat is ___ the box." }, options: { cards: ["in", "on", "at"] }, answer: { correct: 0 } };

describe("buildPlaySteps — 4 dạng bài lấy nội dung từ câu hỏi", () => {
  const extras = { words: new Map([[1, cat]]), meanings: new Map([["on", "trên"]]), sounds: new Map([["c", { ipa: "/k/", audio: "/audio/phonics-1-aaaaaaaa.mp3" }]]) };

  it("dựng đủ 4 dạng theo thứ tự và giữ mã câu hỏi", () => {
    const play = buildPlaySteps([stepOf(1, "phonics", phonics), stepOf(2, "sentence_order", order), stepOf(3, "dictation", dictation), stepOf(4, "fill_blank", fill)], [], "seed", extras);
    assert.deepEqual(play.map((p) => p.kind), ["phonics", "sentence_order", "dictation", "fill_blank"]);
    assert.deepEqual(play.map((p) => (p as { questionId: number }).questionId), [10, 20, 30, 40]);
  });

  it("ghép âm: ô chữ được xáo nhưng đủ, kèm hình từ tham chiếu và âm", () => {
    const [p] = buildPlaySteps([stepOf(1, "phonics", phonics)], [], "seed", extras);
    assert.equal(p.kind, "phonics");
    if (p.kind !== "phonics") return;
    assert.deepEqual(p.tiles.map((t) => t.text).sort(), ["a", "c", "t"]);
    assert.deepEqual(p.order, ["c", "a", "t"]);
    assert.equal(p.picture?.id, 1);
    assert.equal(p.sounds.c.audio, "/audio/phonics-1-aaaaaaaa.mp3");
    assert.equal(p.sounds.a.audio, null);
  });

  it("sắp xếp câu: thẻ gồm cả từ nhiễu, đánh số 1.. theo thứ tự xáo", () => {
    const [p] = buildPlaySteps([stepOf(1, "sentence_order", order)], [], "seed", extras);
    assert.equal(p.kind, "sentence_order");
    if (p.kind !== "sentence_order") return;
    assert.equal(p.cards.length, 6);
    assert.deepEqual(p.cards.map((c) => c.n), [1, 2, 3, 4, 5, 6]);
    assert.ok(p.cards.some((c) => c.word === "eat"));
  });

  it("nghe và gõ: từ ngắn gõ từng ô, câu dài gõ một dòng", () => {
    const [short] = buildPlaySteps([stepOf(1, "dictation", dictation)], [], "seed");
    const [long] = buildPlaySteps([stepOf(1, "dictation", { ...dictation, prompt: { text: "I like my cat" }, answer: { accepted: ["I like my cat"] } })], [], "seed");
    assert.equal(short.kind === "dictation" && short.short, true);
    assert.equal(long.kind === "dictation" && long.short, false);
  });

  it("điền từ: tách quanh ô trống, thẻ đúng là chữ, có nghĩa của thẻ có trong ngân hàng", () => {
    const [p] = buildPlaySteps([stepOf(1, "fill_blank", fill)], [], "seed", extras);
    assert.equal(p.kind, "fill_blank");
    if (p.kind !== "fill_blank") return;
    assert.equal(p.before, "The cat is ");
    assert.equal(p.after, " the box.");
    assert.equal(p.correct, "in");
    assert.deepEqual(p.meanings, { on: "trên" });
  });

  it("bỏ qua bước khi thiếu câu hỏi, câu hỏi sai dạng hoặc dữ liệu hỏng", () => {
    const steps = [stepOf(1, "phonics", null), stepOf(2, "dictation", { type: "phonics", ...phonics }), stepOf(3, "fill_blank", { ...fill, prompt: { text: "No blank" } })];
    assert.deepEqual(buildPlaySteps(steps, [], "seed"), []);
  });

  it("cùng hạt giống thì cùng thứ tự xáo", () => {
    const a = buildPlaySteps([stepOf(1, "sentence_order", order)], [], "seed-1");
    const b = buildPlaySteps([stepOf(1, "sentence_order", order)], [], "seed-1");
    assert.deepEqual(a, b);
  });
});

describe("parseExtraQuestion", () => {
  it("nhận dữ liệu đúng của cả 4 dạng", () => {
    for (const [type, data] of [["phonics", phonics], ["sentence_order", order], ["dictation", dictation], ["fill_blank", fill]] as const) {
      assert.ok(parseExtraQuestion(type, data), type);
    }
  });

  it("từ chối khi ô âm ghép không ra từ, câu có hai ô trống, thiếu đáp án trùng, thẻ trùng", () => {
    assert.equal(parseExtraQuestion("phonics", { ...phonics, prompt: { text: "dog" } }), null);
    assert.equal(parseExtraQuestion("fill_blank", { ...fill, prompt: { text: "A ___ and ___" } }), null);
    assert.equal(parseExtraQuestion("fill_blank", { ...fill, options: { cards: ["in", "In", "at"] } }), null);
    assert.equal(parseExtraQuestion("dictation", { ...dictation, answer: { accepted: ["dish"] } }), null);
    assert.equal(parseExtraQuestion("sentence_order", { ...order, answer: { words: ["is", "She", "reading", "a", "book."] } }), null);
    assert.equal(parseExtraQuestion("unknown", order), null);
  });

  it("câu hỏi dạng nghe và gõ nhận cả đáp án khác hoa/thường, dấu cuối câu", () => {
    assert.ok(parseExtraQuestion("dictation", { prompt: { text: "I am fine." }, options: { ignoreCase: true, ignoreEndPunct: true }, answer: { accepted: ["i am fine"] } }));
  });
});
