import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseExtraQuestion } from "../schemas/question-extra.ts";
import { buildExtraData, buildExtraPreviewStep, emptyExtraForm, extraQuestionSummary, readExtraForm, validateExtraBuilt, type ExtraContext, type ExtraForm } from "./admin-question-types.ts";
import type { BankWord } from "./admin-questions.ts";
import { buildPlaySteps, type PlayWord } from "./lesson-play.ts";

const apple: BankWord = { id: 1, word: "apple", image: "/media/pictures/apple.svg" };
const ctx: ExtraContext = { bank: new Map([["apple", apple]]), sounds: new Map() };
const form = (patch: Partial<ExtraForm>): ExtraForm => ({ ...emptyExtraForm(), ...patch });
const data = { prompt: { text: "I like apples.", audio: "/audio/question-5-aaaaaaaa.mp3" }, options: { leniency: "easy" }, answer: { expected: "I like apples." } };

describe("schema speaking", () => {
  it("nhận câu mẫu ≤ 12 từ, từ chối câu dài hoặc mức lạ hoặc đáp án lệch câu mẫu", () => {
    assert.ok(parseExtraQuestion("speaking", data));
    assert.equal(parseExtraQuestion("speaking", { ...data, prompt: { text: "a b c d e f g h i j k l m", audio: undefined }, answer: { expected: "a b c d e f g h i j k l m" } }), null);
    assert.equal(parseExtraQuestion("speaking", { ...data, options: { leniency: "hard" } }), null);
    assert.equal(parseExtraQuestion("speaking", { ...data, answer: { expected: "I like pears." } }), null);
  });
});

describe("luật soạn luyện nói (Adult18)", () => {
  const message = (patch: Partial<ExtraForm>) => {
    const r = buildExtraData("speaking", form(patch), ctx);
    return r.ok ? "" : r.message;
  };

  it("dựng đúng, giữ mức dễ tính và âm thanh mẫu; hình tùy chọn", () => {
    const r = buildExtraData("speaking", form({ text: "  I like apples. ", leniency: "easy", audio: "/audio/question-5-aaaaaaaa.mp3", picture: "apple" }), ctx);
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.deepEqual(r.data, { prompt: { text: "I like apples.", audio: "/audio/question-5-aaaaaaaa.mp3", wordId: 1 }, options: { leniency: "easy" }, answer: { expected: "I like apples." } });
    assert.equal(validateExtraBuilt("speaking", r.data), null);
  });

  it("báo lỗi: thiếu câu, quá 12 từ, hình không có trong ngân hàng", () => {
    assert.equal(message({}), "Nhập câu mẫu.");
    assert.match(message({ text: "one two three four five six seven eight nine ten eleven twelve thirteen" }), /tối đa 12 từ \(đang có 13\)/);
    assert.match(message({ text: "Hello", picture: "ghost" }), /chưa có trong ngân hàng/);
  });

  it("đảo ngược buildExtraData và tóm tắt “Nói: …”", () => {
    const built = buildExtraData("speaking", form({ text: "banana", leniency: "strict", audio: "/audio/question-5-aaaaaaaa.mp3" }), ctx);
    assert.equal(built.ok, true);
    if (!built.ok) return;
    const back = readExtraForm("speaking", built.data.prompt, built.data.options, built.data.answer);
    assert.equal(back.leniency, "strict");
    assert.equal(back.audio, "/audio/question-5-aaaaaaaa.mp3");
    assert.equal(extraQuestionSummary("speaking", built.data.prompt), "Nói: banana");
  });

  it("xem như học sinh dựng bước nói có chấm bật sẵn", () => {
    const step = buildExtraPreviewStep("speaking", form({ text: "I like apples.", picture: "apple" }), ctx);
    assert.equal(step?.kind, "speak");
    if (step?.kind === "speak") {
      assert.equal(step.scoring, true);
      assert.equal(step.leniency, "normal");
      assert.equal(step.audio, null);
    }
  });
});

describe("buildPlaySteps — luyện nói", () => {
  const word = (id: number, name: string): PlayWord => ({ id, word: name, ipa: null, meaningVi: name, exampleEn: null, exampleVi: null, image: `/media/pictures/${name}.svg` });
  const pool = [word(1, "apple"), word(2, "banana"), word(3, "grapes"), word(4, "pear")];
  const stored = (picture: PlayWord | null) => [{ id: 1, activityType: "speaking", config: {}, word: picture, question: { id: 9, type: "speaking", ...data } }];

  it("có hình thì kèm bài nghe và chọn hình dự phòng cho máy không có micro", () => {
    const [step] = buildPlaySteps(stored(pool[0]), pool, "seed", { words: new Map([[1, pool[0]]]), speechScoring: false });
    assert.equal(step.kind, "speak");
    if (step.kind !== "speak") return;
    assert.equal(step.scoring, false);
    assert.equal(step.audio, "/audio/question-5-aaaaaaaa.mp3");
    assert.equal(step.fallback?.target.id, 1);
    assert.equal(step.fallback?.options.length, 3);
    assert.ok(step.fallback?.options.some((o) => o.id === 1));
  });

  it("không có hình thì không có bài dự phòng; chấm mặc định bật", () => {
    const [step] = buildPlaySteps(stored(null), pool, "seed");
    assert.equal(step.kind === "speak" && step.fallback, null);
    assert.equal(step.kind === "speak" && step.scoring, true);
  });
});
