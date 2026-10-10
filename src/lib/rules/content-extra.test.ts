import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contentExtraSchema } from "../schemas/content-extra.ts";
import { buildExtraItems, extraKey, extraKeyOf, extrasOf, parseFillEntry, stableIndex } from "./content-extra.ts";
import type { ExtraContext } from "./admin-question-types.ts";
import { PHONICS_SEED } from "./phonics-data.ts";

const sounds = new Map(PHONICS_SEED.map(([g, ipa]) => [g, { ipa, audio: null }]));
const bank = new Map([["cat", { id: 1, word: "cat", image: "/media/pictures/cat.svg" }]]);
const ctx = { bank, sounds } as unknown as ExtraContext;

const content = contentExtraSchema.parse({
  phonics: ["cat", "ship"],
  sentence_order: ["I like my cat.", { text: "The dog is big.", distractors: ["small"] }],
  fill_blank: ["I have a ___. | cat | dog | pig"],
  dictation: ["cat"],
  speaking: ["I like cats."],
  short_reading: [
    {
      title: "My cat",
      text: "I have a cat. Her name is Mimi. She is white. She likes fish.",
      questions: [
        { q: "What is the cat’s name?", a: ["Mimi", "Lan", "Tom"], evidence: 1 },
        { q: "What colour is Mimi?", a: ["white", "black", "red"], evidence: 2 },
      ],
    },
  ],
});

describe("buildExtraItems", () => {
  const { items, errors } = buildExtraItems(content, 3, ctx);
  it("dựng đủ 8 câu và không lỗi", () => {
    assert.deepEqual(errors, []);
    assert.deepEqual(items.map((i) => i.type), ["phonics", "phonics", "sentence_order", "sentence_order", "fill_blank", "dictation", "speaking", "short_reading"]);
  });
  it("ghép âm tách ô đúng (ship = sh + i + p), gắn hình nếu từ có hình", () => {
    const [cat, ship] = items.filter((i) => i.type === "phonics");
    assert.deepEqual((ship.options as { tiles: { t: string }[] }).tiles.map((t) => t.t), ["sh", "i", "p"]);
    assert.deepEqual((cat.prompt as { wordId?: number }).wordId, 1);
    assert.equal((ship.prompt as { wordId?: number }).wordId, undefined);
  });
  it("điền từ: đáp án đúng ở vị trí ổn định, thẻ trộn", () => {
    const fb = items.find((i) => i.type === "fill_blank")!;
    const cards = (fb.options as { cards: string[] }).cards;
    assert.equal(cards[(fb.answer as { correct: number }).correct], "cat");
    assert.equal(new Set(cards).size, 3);
    assert.deepEqual(buildExtraItems(content, 3, ctx).items.find((i) => i.type === "fill_blank")!.options, fb.options);
  });
  it("luyện nói: mức chấm dễ tính cấp 1–2, vừa cấp 3–4", () => {
    const level = (n: number) => (buildExtraItems(content, n, ctx).items.find((i) => i.type === "speaking")!.options as { leniency: string }).leniency;
    assert.deepEqual([level(1), level(2), level(3), level(4)], ["easy", "easy", "normal", "normal"]);
  });
  it("đọc hiểu: đáp án đúng trộn theo từng câu, 2 câu hỏi", () => {
    const rd = items.find((i) => i.type === "short_reading")!;
    const qs = (rd.options as { questions: { choices: string[] }[] }).questions;
    const correct = (rd.answer as { correct: number[] }).correct;
    assert.equal(qs[0].choices[correct[0]], "Mimi");
    assert.equal(qs[1].choices[correct[1]], "white");
  });
  it("khóa câu hỏi khớp giữa tệp và dữ liệu đã lưu", () => {
    for (const item of items) assert.equal(extraKeyOf(item.type, item.prompt), item.key);
    assert.equal(extraKey("sentence_order", "  The Dog   is big. "), "sentence_order:the dog is big.");
  });
  it("extrasOf gom khóa theo dạng đúng thứ tự", () => {
    const e = extrasOf(items);
    assert.equal(e.phonics?.length, 2);
    assert.deepEqual(e.sentence_order, ["sentence_order:i like my cat.", "sentence_order:the dog is big."]);
  });
  it("câu lỗi được báo kèm khóa, các câu khác vẫn dựng", () => {
    const bad = contentExtraSchema.parse({ sentence_order: ["Hi you."], dictation: ["ok then"], fill_blank: ["I have a ___. | cat | cat | pig"] });
    const r = buildExtraItems(bad, 2, ctx);
    assert.equal(r.items.length, 1, "chỉ nghe-gõ hợp lệ");
    assert.ok(r.errors.some((e) => e.startsWith("sentence_order:hi you.:")));
    assert.ok(r.errors.some((e) => e.startsWith("fill_blank:i have a ___.:")), "thẻ trùng nhau bị báo");
  });
});

describe("tệp nội dung", () => {
  it("điền từ cần câu có ___ và 2–3 thẻ nhiễu", () => {
    assert.equal(contentExtraSchema.safeParse({ fill_blank: ["I have a cat. | cat | dog | pig"] }).success, false);
    assert.equal(contentExtraSchema.safeParse({ fill_blank: ["I have a ___. | cat | dog"] }).success, false);
    assert.equal(contentExtraSchema.safeParse({ fill_blank: ["I have a ___. | cat | dog | pig | hen"] }).success, true);
    assert.deepEqual(parseFillEntry("I have a ___. | cat | dog | pig"), { text: "I have a ___.", correct: "cat", distractors: ["dog", "pig"] });
  });
  it("từ lạ trong tệp bị từ chối; ghép âm cần chữ thường", () => {
    assert.equal(contentExtraSchema.safeParse({ unknown: [] }).success, false);
    assert.equal(contentExtraSchema.safeParse({ phonics: ["Cat"] }).success, false);
  });
  it("stableIndex ổn định và trong khoảng", () => {
    assert.equal(stableIndex("abc", 3), stableIndex("abc", 3));
    for (const k of ["a", "bb", "ccc", "dddd"]) assert.ok(stableIndex(k, 3) >= 0 && stableIndex(k, 3) < 3);
    assert.equal(stableIndex("x", 0), 0);
  });
});
