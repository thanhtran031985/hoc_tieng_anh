import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emptyExtraForm, buildExtraData, extraQuestionSummary, readExtraForm, validateExtraBuilt, type ExtraContext, type ExtraForm } from "../admin-question-types.ts";
import { buildPlaySteps } from "../lesson-play.ts";
import { parseExtraQuestion } from "../../schemas/question-extra.ts";
import { dimTarget, isCorrect, neighbourQuestion, nextUndone, splitPassage } from "./reading.ts";

const PASSAGE = "My name is Lan. I have a cat. Her name is Mimi. Mimi is white and small. She likes fish. She sleeps on my bed.";
const data = {
  prompt: { title: "My Cat Mimi", text: PASSAGE },
  options: {
    questions: [
      { text: "What is the cat’s name?", choices: ["Mimi", "Lan", "Tom"], evidence: 2 },
      { text: "What colour is Mimi?", choices: ["black", "white", "yellow"], evidence: 3 },
    ],
  },
  answer: { correct: [0, 1] },
};

describe("splitPassage", () => {
  it("tách đoạn thành câu theo . ! ?", () => {
    assert.equal(splitPassage(PASSAGE).length, 6);
    assert.deepEqual(splitPassage("Hello!  How are you? Fine."), ["Hello!", "How are you?", "Fine."]);
    assert.deepEqual(splitPassage("   "), []);
  });
});

describe("hàm hỗ trợ chấm đọc hiểu", () => {
  it("đúng khi chọn đúng chỉ số", () => {
    assert.equal(isCorrect(1, 1), true);
    assert.equal(isCorrect(0, 1), false);
    assert.equal(isCorrect(null, 0), false);
  });

  it("làm mờ lần lượt đáp án sai, bỏ qua đáp án đúng và đáp án đang chọn", () => {
    assert.equal(dimTarget(3, 0, [], null), 1);
    assert.equal(dimTarget(3, 0, [1], null), 2);
    assert.equal(dimTarget(3, 0, [1], 2), null);
    assert.equal(dimTarget(3, 1, [], 0), 2);
  });

  it("đổi câu hỏi bằng ↑ ↓ và tìm câu chưa trả lời", () => {
    assert.equal(neighbourQuestion([false, false, false], 0, -1), 0);
    assert.equal(neighbourQuestion([false, false, false], 0, 1), 1);
    assert.equal(neighbourQuestion([false, false, false], 2, 1), 2);
    assert.equal(nextUndone([true, false, true], 0), 1);
    assert.equal(nextUndone([false, true, true], 0), 0);
    assert.equal(nextUndone([true, true, true], 0), -1);
  });
});

describe("schema short_reading", () => {
  it("nhận đoạn 6 câu, 2 câu hỏi", () => {
    assert.ok(parseExtraQuestion("short_reading", data));
  });

  it("từ chối đoạn dưới 3 hoặc trên 6 câu, thiếu đáp án đúng, câu chứa đáp án ngoài đoạn, đáp án trùng", () => {
    assert.equal(parseExtraQuestion("short_reading", { ...data, prompt: { ...data.prompt, text: "One. Two." } }), null);
    assert.equal(parseExtraQuestion("short_reading", { ...data, prompt: { ...data.prompt, text: `${PASSAGE} Seven.` } }), null);
    assert.equal(parseExtraQuestion("short_reading", { ...data, answer: { correct: [0] } }), null);
    assert.equal(parseExtraQuestion("short_reading", { ...data, options: { questions: [{ ...data.options.questions[0], evidence: 5 }, data.options.questions[1]] }, prompt: { ...data.prompt, text: "A b. C d. E f." } }), null);
    assert.equal(parseExtraQuestion("short_reading", { ...data, options: { questions: [{ ...data.options.questions[0], choices: ["Mimi", "mimi", "Tom"] }, data.options.questions[1]] } }), null);
  });
});

describe("buildPlaySteps — đọc hiểu ngắn", () => {
  it("dựng bước với câu tách sẵn, câu hỏi và nghĩa ngắn của các chữ có trong ngân hàng", () => {
    const [step] = buildPlaySteps([{ id: 1, activityType: "short_reading", config: {}, word: null, question: { id: 9, type: "short_reading", ...data } }], [], "seed", { glossary: new Map([["cat", "con mèo"]]) });
    assert.equal(step.kind, "short_reading");
    if (step.kind !== "short_reading") return;
    assert.equal(step.questionId, 9);
    assert.equal(step.sentences.length, 6);
    assert.deepEqual(step.questions.map((q) => [q.correct, q.evidence]), [[0, 2], [1, 3]]);
    assert.equal(step.glossary.cat, "con mèo");
    assert.equal(step.glossary.fish, undefined);
  });
});

describe("luật soạn đọc hiểu ngắn (Adult18)", () => {
  const ctx: ExtraContext = { bank: new Map(), sounds: new Map() };
  const form = (patch: Partial<ExtraForm>): ExtraForm => ({ ...emptyExtraForm(), ...patch });
  const good = form({
    title: "My Cat Mimi",
    text: PASSAGE,
    questions: [
      { text: "What is the cat’s name?", choices: ["Mimi", "Lan", "Tom"], correct: 0, evidence: 2 },
      { text: "What colour is Mimi?", choices: ["black", "white", "yellow"], correct: 1, evidence: 3 },
      { text: "", choices: ["", "", ""], correct: null, evidence: 0 },
    ],
  });
  const message = (patch: Partial<ExtraForm>) => {
    const r = buildExtraData("short_reading", { ...good, ...patch }, ctx);
    return r.ok ? "" : r.message;
  };

  it("dựng đúng và bỏ chỗ câu hỏi trống", () => {
    const r = buildExtraData("short_reading", good, ctx);
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(validateExtraBuilt("short_reading", r.data), null);
    assert.deepEqual((r.data.answer as { correct: number[] }).correct, [0, 1]);
  });

  it("báo lỗi: thiếu tiêu đề, đoạn ngoài 3–6 câu, ít hơn 2 câu hỏi, thiếu đáp án, trùng đáp án, chưa chọn đáp án đúng", () => {
    assert.equal(message({ title: "" }), "Nhập tiêu đề bài đọc.");
    assert.equal(message({ text: "" }), "Nhập đoạn văn.");
    assert.match(message({ text: "One. Two." }), /Đoạn văn cần 3–6 câu \(đang có 2\)/);
    assert.match(message({ text: `${PASSAGE} Seven.` }), /đang có 7/);
    assert.match(message({ questions: [good.questions[0], good.questions[2], good.questions[2]] }), /ít nhất 2 câu hỏi/);
    assert.match(message({ questions: [good.questions[0], { ...good.questions[1], choices: ["black", "white", ""] }, good.questions[2]] }), /Câu hỏi 2 cần đủ 3 đáp án/);
    assert.match(message({ questions: [good.questions[0], { ...good.questions[1], choices: ["black", "Black", "yellow"] }, good.questions[2]] }), /Câu hỏi 2 có hai đáp án trùng nhau/);
    assert.match(message({ questions: [good.questions[0], { ...good.questions[1], correct: null }, good.questions[2]] }), /Câu hỏi 2 chưa chọn đáp án đúng/);
  });

  it("đảo ngược buildExtraData và tóm tắt theo tiêu đề", () => {
    const built = buildExtraData("short_reading", good, ctx);
    assert.equal(built.ok, true);
    if (!built.ok) return;
    const back = readExtraForm("short_reading", built.data.prompt, built.data.options, built.data.answer);
    assert.equal(back.title, "My Cat Mimi");
    assert.deepEqual(back.questions.map((q) => q.correct), [0, 1, null]);
    assert.equal(extraQuestionSummary("short_reading", built.data.prompt), "Đọc hiểu: My Cat Mimi");
  });
});
