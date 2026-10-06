import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeLessonStates, findNextLesson, levelStatus, summarizeUnits, type MapLesson } from "./unlock.ts";

// Hai chủ đề: chủ đề 1 có bài 1, 2, 3 và trùm 4; chủ đề 2 có bài 5, 6 và trùm 7.
const lessons: MapLesson[] = [
  { id: 1, unitId: 10, kind: "lesson" },
  { id: 2, unitId: 10, kind: "lesson" },
  { id: 3, unitId: 10, kind: "lesson" },
  { id: 4, unitId: 10, kind: "unit_test" },
  { id: 5, unitId: 20, kind: "lesson" },
  { id: 6, unitId: 20, kind: "lesson" },
  { id: 7, unitId: 20, kind: "unit_test" },
];

const stars = (entries: Record<number, number>) => new Map(Object.entries(entries).map(([id, s]) => [Number(id), s]));
const states = (entries: Record<number, number>) => computeLessonStates(lessons, stars(entries)).map((n) => `${n.id}:${n.state}`);

describe("computeLessonStates", () => {
  it("chưa học gì: bài đầu là chặng đang học, mọi bài sau và trùm đều khóa", () => {
    assert.deepEqual(states({}), ["1:current", "2:locked", "3:locked", "4:locked", "5:locked", "6:locked", "7:locked"]);
  });

  it("xong bài thì mở bài sau", () => {
    assert.deepEqual(states({ 1: 2 }), ["1:done", "2:current", "3:locked", "4:locked", "5:locked", "6:locked", "7:locked"]);
  });

  it("đạt 1 sao là đủ để mở bài sau; 0 sao thì chưa", () => {
    assert.equal(states({ 1: 1 })[1], "2:current");
    assert.equal(states({ 1: 0 })[1], "2:locked");
  });

  it("trùm chỉ mở khi xong mọi bài thường của chủ đề", () => {
    assert.equal(states({ 1: 3, 2: 3 })[3], "4:locked");
    assert.equal(states({ 1: 3, 2: 3, 3: 1 })[3], "4:open");
  });

  it("trùm không chặn chủ đề kế: xong 3 bài thì bài đầu của chủ đề 2 đã mở dù chưa đấu trùm", () => {
    const result = states({ 1: 3, 2: 3, 3: 3 });
    assert.equal(result[3], "4:open");
    assert.equal(result[4], "5:current");
  });

  it("thắng trùm thì trùm là beaten, giữ số sao", () => {
    const nodes = computeLessonStates(lessons, stars({ 1: 3, 2: 3, 3: 3, 4: 2 }));
    const boss = nodes.find((n) => n.id === 4)!;
    assert.equal(boss.state, "beaten");
    assert.equal(boss.stars, 2);
  });

  it("số sao được giới hạn trong 0–3", () => {
    const nodes = computeLessonStates(lessons, stars({ 1: 9, 2: -4 }));
    assert.equal(nodes[0].stars, 3);
    assert.equal(nodes[1].stars, 0);
  });

  it("bỏ qua bài không thuộc bản đồ (bài thi lên cấp, bài ôn)", () => {
    const extra: MapLesson[] = [...lessons, { id: 8, unitId: 20, kind: "level_test" }, { id: 9, unitId: 20, kind: "review" }];
    assert.equal(computeLessonStates(extra, stars({})).length, lessons.length);
  });

  it("chủ đề chỉ có trùm (không có bài thường) thì trùm khóa", () => {
    const [boss] = computeLessonStates([{ id: 1, unitId: 1, kind: "unit_test" }], stars({}));
    assert.equal(boss.state, "locked");
  });
});

describe("summarizeUnits", () => {
  it("đếm bài xong, sao và trạng thái từng chủ đề", () => {
    const nodes = computeLessonStates(lessons, stars({ 1: 3, 2: 2, 3: 3, 5: 1 }));
    const [first, second] = summarizeUnits(nodes);
    assert.deepEqual(
      { id: first.unitId, done: first.doneCount, of: first.lessonCount, stars: first.stars, max: first.maxStars, state: first.state, boss: first.boss?.state },
      { id: 10, done: 3, of: 3, stars: 8, max: 9, state: "done", boss: "open" },
    );
    assert.deepEqual(
      { id: second.unitId, done: second.doneCount, of: second.lessonCount, stars: second.stars, state: second.state, boss: second.boss?.state },
      { id: 20, done: 1, of: 2, stars: 1, state: "current", boss: "locked" },
    );
  });

  it("chủ đề chưa tới lượt là khóa", () => {
    const [, second] = summarizeUnits(computeLessonStates(lessons, stars({ 1: 3 })));
    assert.equal(second.state, "locked");
  });
});

describe("findNextLesson", () => {
  it("bài đầu của cấp mới", () => {
    assert.equal(findNextLesson(computeLessonStates(lessons, stars({})))?.id, 1);
  });

  it("chặng đang học được ưu tiên hơn trùm đang mở", () => {
    assert.equal(findNextLesson(computeLessonStates(lessons, stars({ 1: 1, 2: 1, 3: 1 }))) ?.id, 5);
  });

  it("hết chặng thường thì trùm đang mở chưa thắng", () => {
    assert.equal(findNextLesson(computeLessonStates(lessons, stars({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 })))?.id, 7);
  });

  it("xong hết cấp thì không còn bài tiếp theo", () => {
    assert.equal(findNextLesson(computeLessonStates(lessons, stars({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 }))), null);
  });

  it("cấp không có bài thì null", () => {
    assert.equal(findNextLesson([]), null);
  });
});

describe("levelStatus", () => {
  it("nhỏ hơn cấp hiện tại là đã qua, bằng là đang học, lớn hơn là khóa", () => {
    assert.deepEqual([1, 2, 3, 4, 10].map((n) => levelStatus(n, 3)), ["past", "past", "current", "locked", "locked"]);
  });

  it("chưa có cấp hiện tại thì bắt đầu ở cấp 1", () => {
    assert.deepEqual([1, 2].map((n) => levelStatus(n, null)), ["current", "locked"]);
  });
});
