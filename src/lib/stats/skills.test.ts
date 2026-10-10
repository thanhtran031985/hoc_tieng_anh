import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { accuracyBySkill, mistakeNote, skillComparison, skillOf, splitPeriods, topMistakes, type AnswerLogLike } from "./skills.ts";

// Hôm nay 10/10/2026 (giờ Việt Nam). Kỳ 7 ngày: 4/10–10/10; kỳ trước: 27/9–3/10.
const today = new Date("2026-10-10T00:00:00Z");
const at = (iso: string) => new Date(`${iso}T05:00:00Z`);
const log = (skill: string | null, isCorrect: boolean, day: string, wordId: number | null = null): AnswerLogLike => ({ skill, isCorrect, createdAt: at(day), wordId });

describe("kỹ năng của một dòng nhật ký", () => {
  it("không có câu hỏi hoặc kỹ năng lạ thì là từ vựng", () => {
    assert.equal(skillOf(null), "vocabulary");
    assert.equal(skillOf("math"), "vocabulary");
    assert.equal(skillOf("listening"), "listening");
  });
});

describe("accuracyBySkill", () => {
  it("đủ 7 kỹ năng theo thứ tự, chưa có câu nào thì percent null", () => {
    const rows = accuracyBySkill([log("listening", true, "2026-10-09"), log("listening", false, "2026-10-09"), log("listening", true, "2026-10-09"), log(null, true, "2026-10-09")]);
    assert.deepEqual(
      rows.map((r) => r.skill),
      ["listening", "speaking", "reading", "writing", "vocabulary", "grammar", "pronunciation"],
    );
    assert.deepEqual([rows[0].total, rows[0].correct, rows[0].percent], [3, 2, 67]);
    assert.equal(rows[1].percent, null);
    assert.deepEqual([rows[4].total, rows[4].percent], [1, 100]);
  });
});

describe("splitPeriods", () => {
  it("kỳ hiện tại gồm đúng 7 ngày kết thúc hôm nay, kỳ trước là 7 ngày liền trước", () => {
    const logs = ["2026-10-10", "2026-10-04", "2026-10-03", "2026-09-27", "2026-09-26", "2026-10-11"].map((d) => log("reading", true, d));
    const { current, previous } = splitPeriods(logs, today, 7);
    assert.deepEqual(
      current.map((l) => l.createdAt.toISOString().slice(0, 10)),
      ["2026-10-10", "2026-10-04"],
    );
    assert.deepEqual(
      previous.map((l) => l.createdAt.toISOString().slice(0, 10)),
      ["2026-10-03", "2026-09-27"],
    );
  });

  it("ngày theo giờ Việt Nam: 17:30 UTC ngày 9 đã là ngày 10", () => {
    assert.equal(splitPeriods([{ createdAt: new Date("2026-10-09T17:30:00Z") }], today, 7).current.length, 1);
    assert.equal(splitPeriods([{ createdAt: new Date("2026-10-03T16:59:00Z") }], today, 7).previous.length, 1);
  });
});

describe("skillComparison", () => {
  it("so với kỳ trước bằng điểm phần trăm, kỳ trước trống thì không có chênh lệch", () => {
    const logs = [
      log("speaking", true, "2026-10-09"),
      log("speaking", true, "2026-10-08"),
      log("speaking", false, "2026-10-07"),
      log("speaking", true, "2026-10-06"),
      log("speaking", true, "2026-10-01"),
      log("speaking", false, "2026-10-01"),
      log("grammar", false, "2026-10-09"),
    ];
    const rows = skillComparison(logs, today, 7);
    const speaking = rows.find((r) => r.skill === "speaking")!;
    assert.deepEqual([speaking.percent, speaking.prevPercent, speaking.delta], [75, 50, 25]);
    const grammar = rows.find((r) => r.skill === "grammar")!;
    assert.deepEqual([grammar.percent, grammar.prevPercent, grammar.delta], [0, null, null]);
    assert.equal(rows.find((r) => r.skill === "reading")!.percent, null);
  });
});

describe("topMistakes", () => {
  const logs = [
    log("listening", false, "2026-10-09", 1),
    log("listening", false, "2026-10-09", 1),
    log("speaking", false, "2026-10-09", 1),
    log("listening", true, "2026-10-09", 1),
    log("writing", false, "2026-10-09", 2),
    log("writing", true, "2026-10-09", 2),
    log("reading", true, "2026-10-09", 3),
    log("reading", false, "2026-10-09", null),
    log("writing", false, "2026-10-09", 4),
    log("writing", false, "2026-10-09", 4),
  ];
  it("từ sai nhiều lên trước; từ chỉ đúng hoặc không có từ bị bỏ", () => {
    const top = topMistakes(logs);
    assert.deepEqual(
      top.map((m) => m.wordId),
      [1, 4, 2],
    );
    assert.deepEqual([top[0].wrong, top[0].total, top[0].worstSkill], [3, 4, "listening"]);
  });
  it("giới hạn số từ và có lời mô tả", () => {
    assert.equal(topMistakes(logs, 2).length, 2);
    assert.equal(mistakeNote(topMistakes(logs)[0]), "Hay sai ở phần nghe · sai 3/4 lần");
  });
});
