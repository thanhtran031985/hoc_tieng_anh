import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EXAM_QUESTION_COUNT, gradeExam, isExamStepKind, passScore, retakeState, selectExamItems, weakTopics, type ExamCandidate } from "./level-test.ts";

const KINDS = ["listen_choose_picture", "choose_word_for_picture", "fill_blank", "sentence_order", "phonics", "dictation"];

/** 8 chủ đề, mỗi chủ đề `perUnit` câu xoay vòng các dạng bài, mỗi câu một khóa riêng. */
function pool(units = 8, perUnit = 12): ExamCandidate[] {
  const out: ExamCandidate[] = [];
  let id = 1;
  for (let u = 1; u <= units; u++) for (let i = 0; i < perUnit; i++) out.push({ stepId: id, unitId: u, kind: KINDS[i % KINDS.length], key: `w${id++}` });
  return out;
}

const countBy = <T>(list: T[], f: (x: T) => number | string) => list.reduce<Record<string, number>>((m, x) => ({ ...m, [f(x)]: (m[f(x)] ?? 0) + 1 }), {});

describe("passScore", () => {
  it("80% của 20 câu là 16; làm tròn lên", () => {
    assert.equal(passScore(20), 16);
    assert.equal(passScore(10), 8);
    assert.equal(passScore(7), 6);
  });
});

describe("selectExamItems", () => {
  it("đủ 20 câu, không trùng bước, đúng bộ khi cùng hạt giống và khác khi đổi hạt giống", () => {
    const a = selectExamItems(pool(), "seed-1");
    assert.equal(a.length, EXAM_QUESTION_COUNT);
    assert.equal(new Set(a.map((i) => i.stepId)).size, EXAM_QUESTION_COUNT);
    assert.deepEqual(selectExamItems(pool(), "seed-1"), a);
    assert.notDeepEqual(selectExamItems(pool(), "seed-2"), a);
  });

  it("cân bằng chủ đề: 8 chủ đề thì mỗi chủ đề 2 hoặc 3 câu", () => {
    const sizes = Object.values(countBy(selectExamItems(pool(8), "x"), (i) => i.unitId));
    assert.equal(sizes.length, 8);
    for (const n of sizes) assert.ok(n === 2 || n === 3, `chủ đề có ${n} câu`);
  });

  it("4 chủ đề thì mỗi chủ đề đúng 5 câu", () => {
    const sizes = Object.values(countBy(selectExamItems(pool(4), "x"), (i) => i.unitId));
    assert.deepEqual(sizes, [5, 5, 5, 5]);
  });

  it("chủ đề ít câu nhường chỗ cho chủ đề khác, vẫn đủ 20 câu", () => {
    const candidates = [...pool(3, 12), ...pool(1, 1).map((c) => ({ ...c, stepId: 9001, unitId: 99, key: "w9001" }))];
    const items = selectExamItems(candidates, "x");
    assert.equal(items.length, 20);
    assert.equal(items.filter((i) => i.unitId === 99).length, 1);
  });

  it("không có hai câu cùng từ hoặc cùng câu hỏi", () => {
    const candidates = pool().map((c, i) => ({ ...c, key: `w${i % 30}` }));
    const items = selectExamItems(candidates, "x");
    const keys = items.map((i) => candidates.find((c) => c.stepId === i.stepId)!.key);
    assert.equal(new Set(keys).size, keys.length);
  });

  it("trộn dạng bài, bỏ dạng không dùng làm câu thi (nói, đọc hiểu, trò chơi, thẻ từ)", () => {
    const candidates = [...pool(), { stepId: 5000, unitId: 1, kind: "speaking", key: "q5000" }, { stepId: 5001, unitId: 1, kind: "word_card", key: "w5001" }, { stepId: 5002, unitId: 1, kind: "race", key: "w5002" }, { stepId: 5003, unitId: 1, kind: "short_reading", key: "q5003" }];
    const items = selectExamItems(candidates, "x");
    assert.ok(!items.some((i) => i.stepId >= 5000));
    const kinds = Object.keys(countBy(items, (i) => candidates.find((c) => c.stepId === i.stepId)!.kind));
    assert.ok(kinds.length >= 4, `chỉ ${kinds.length} dạng bài`);
  });

  it("cả cấp không đủ câu thì trả ít hơn 20, không lặp", () => {
    const items = selectExamItems(pool(2, 3), "x");
    assert.equal(items.length, 6);
  });

  it("isExamStepKind", () => {
    assert.equal(isExamStepKind("fill_blank"), true);
    assert.equal(isExamStepKind("speaking"), false);
    assert.equal(isExamStepKind("memory_game"), false);
  });
});

describe("gradeExam", () => {
  const items = Array.from({ length: 20 }, (_, i) => ({ stepId: i + 1, unitId: (i % 4) + 1 }));
  const correct = (n: number) => new Set(items.slice(0, n).map((i) => i.stepId));

  it("16/20 đạt", () => {
    const g = gradeExam(items, correct(16));
    assert.equal(g.score, 16);
    assert.equal(g.passScore, 16);
    assert.equal(g.percent, 80);
    assert.equal(g.passed, true);
  });

  it("15/20 chưa đạt", () => {
    const g = gradeExam(items, correct(15));
    assert.equal(g.passed, false);
    assert.equal(g.percent, 75);
  });

  it("20/20 và 0/20", () => {
    assert.equal(gradeExam(items, correct(20)).passed, true);
    assert.equal(gradeExam(items, correct(0)).score, 0);
  });

  it("câu không có kết quả nộp lên coi là chưa đúng; bộ rỗng không đạt", () => {
    assert.equal(gradeExam(items, new Set()).score, 0);
    assert.equal(gradeExam([], new Set()).passed, false);
  });

  it("mã bước lạ trong kết quả nộp không được tính", () => {
    assert.equal(gradeExam(items, new Set([999, 1000])).score, 0);
  });
});

describe("weakTopics", () => {
  const items = [
    { stepId: 1, unitId: 1 }, { stepId: 2, unitId: 1 }, { stepId: 3, unitId: 1 },
    { stepId: 4, unitId: 2 }, { stepId: 5, unitId: 2 },
    { stepId: 6, unitId: 3 }, { stepId: 7, unitId: 3 },
    { stepId: 8, unitId: 4 }, { stepId: 9, unitId: 4 },
    { stepId: 10, unitId: 5 },
  ];
  const words = new Map<number, number | null>(items.map((i) => [i.stepId, i.stepId * 10]));

  it("tối đa 3 chủ đề, sai nhiều nhất trước, rồi tỷ lệ sai cao hơn", () => {
    const wrongSteps = new Set([1, 2, 4, 5, 6, 8]);
    const answers = items.map((i) => ({ stepId: i.stepId, correct: !wrongSteps.has(i.stepId) }));
    const weak = weakTopics(items, answers, words);
    assert.deepEqual(weak.map((w) => [w.unitId, w.wrong, w.total]), [[2, 2, 2], [1, 2, 3], [3, 1, 2]]);
  });

  it("không có câu sai thì không có chủ đề nào; chủ đề đúng hết không bị gợi ý", () => {
    assert.deepEqual(weakTopics(items, items.map((i) => ({ stepId: i.stepId, correct: true })), words), []);
  });

  it("từ hay sai: lấy từ của các câu sai, không trùng, tối đa 3", () => {
    const many = Array.from({ length: 5 }, (_, i) => ({ stepId: 100 + i, unitId: 7 }));
    const w = new Map<number, number | null>([[100, 1], [101, 1], [102, 2], [103, null], [104, 4]]);
    const weak = weakTopics(many, many.map((i) => ({ stepId: i.stepId, correct: false })), w);
    assert.deepEqual(weak[0].wordIds, [1, 2, 4]);
  });
});

describe("retakeState", () => {
  it("chưa thi hay lần trước đạt thì thi được ngay", () => {
    assert.equal(retakeState(null, []), "free");
    assert.equal(retakeState([], [3]), "free");
  });

  it("chưa đạt: phải ôn xong một bài của chủ đề gợi ý mới thi lại được", () => {
    assert.equal(retakeState([1, 2, 3], []), "needs_review");
    assert.equal(retakeState([1, 2, 3], [9]), "needs_review");
    assert.equal(retakeState([1, 2, 3], [9, 2]), "free");
  });
});
