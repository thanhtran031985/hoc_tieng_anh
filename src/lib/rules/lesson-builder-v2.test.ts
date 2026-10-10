import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EXTRA_KINDS, NEW_ACTIVITY_TYPES, buildLessons, distribute, extraAllowed, planAppend, planGame, storyKey, type BuilderWord, type UnitExtras } from "./lesson-builder.ts";

const NAMES = ["cat", "dog", "pig", "hen", "cow", "duck", "fish", "bird", "frog", "goat", "lamb", "bear", "lion", "fox", "mouse", "horse", "sheep", "zebra"];
const words = (n: number, picture = true): BuilderWord[] => NAMES.slice(0, n).map((word) => ({ word, hasPicture: picture }));
const keys = (type: string, n: number) => Array.from({ length: n }, (_, i) => `${type}:q${i}`);
const extras: UnitExtras = { phonics: keys("phonics", 4), sentence_order: keys("sentence_order", 4), fill_blank: keys("fill_blank", 4), dictation: keys("dictation", 4), speaking: keys("speaking", 4), short_reading: keys("short_reading", 2) };
const types = (steps: { activityType: string }[]) => steps.map((s) => s.activityType);
const regular = (lessons: ReturnType<typeof buildLessons>) => lessons.filter((l) => l.kind === "lesson");

describe("lesson-builder bản 2", () => {
  it("không truyền cấp thì giữ nguyên bản 1 (nhập Excel không đổi)", () => {
    const v1 = buildLessons(words(12), { unitTitle: "Animals" });
    const withExtras = buildLessons(words(12), { unitTitle: "Animals", extras });
    assert.deepEqual(types(v1.flatMap((l) => l.steps)), types(withExtras.flatMap((l) => l.steps)));
    assert.ok(v1.flatMap((l) => l.steps).every((s) => !NEW_ACTIVITY_TYPES.includes(s.activityType)));
  });

  it("cấp 1: không có nghe-gõ, không có đọc hiểu, không có mưa từ vựng; có ghép âm, đập chuột / bong bóng", () => {
    const lessons = regular(buildLessons(words(16), { levelNumber: 1, extras }));
    const all = lessons.flatMap((l) => types(l.steps));
    assert.ok(!all.includes("dictation"), "cấp 1 không nghe-gõ");
    assert.ok(!all.includes("short_reading"), "cấp 1 không đọc hiểu");
    assert.ok(!all.includes("word_rain"), "mưa từ vựng từ cấp 3");
    assert.ok(all.includes("phonics") && all.includes("sentence_order") && all.includes("speaking"));
    assert.ok(all.includes("word_bubbles") || all.includes("whack_letters"));
  });

  it("cấp 2: nghe-gõ có (từ), chưa có đọc hiểu; cấp 3: đọc hiểu và mưa từ vựng; cấp 4: không ghép âm", () => {
    const l2 = regular(buildLessons(words(16), { levelNumber: 2, extras })).flatMap((l) => types(l.steps));
    assert.ok(l2.includes("dictation") && !l2.includes("short_reading") && !l2.includes("word_rain"));
    const l3 = regular(buildLessons(words(18), { levelNumber: 3, extras })).flatMap((l) => types(l.steps));
    assert.ok(l3.includes("short_reading") && l3.includes("phonics"));
    const lessons4 = regular(buildLessons(words(18), { levelNumber: 4, extras })).flatMap((l) => types(l.steps));
    assert.ok(!lessons4.includes("phonics"), "ghép âm chỉ cấp 1–3");
    assert.ok(lessons4.includes("word_rain") || regular(buildLessons(words(18), { levelNumber: 3, extras })).flatMap((l) => types(l.steps)).includes("word_rain"));
  });

  it("mỗi bài thường có ít nhất một trò chơi hoặc dạng bài mới; trận trùm không đổi", () => {
    for (const level of [1, 2, 3, 4]) {
      const lessons = buildLessons(words(18), { levelNumber: level, extras, unitTitle: "T" });
      for (const lesson of regular(lessons)) assert.ok(lesson.steps.some((s) => NEW_ACTIVITY_TYPES.includes(s.activityType)), `cấp ${level} ${lesson.title}`);
      const boss = lessons.at(-1)!;
      assert.equal(boss.kind, "unit_test");
      assert.deepEqual(types(boss.steps), types(buildLessons(words(18), { unitTitle: "T" }).at(-1)!.steps));
    }
  });

  it("không có câu hỏi nào thì vẫn có trò chơi cuối bài (chủ đề chưa soạn nội dung)", () => {
    const lessons = regular(buildLessons(words(10), { levelNumber: 2 }));
    for (const lesson of lessons) assert.ok(NEW_ACTIVITY_TYPES.includes(lesson.steps.at(-1)!.activityType));
  });

  it("mỗi câu hỏi dùng đúng một lần trong cả chủ đề", () => {
    const lessons = regular(buildLessons(words(24), { levelNumber: 3, extras }));
    const used = lessons.flatMap((l) => l.steps.flatMap((s) => (s.questionKey ? [s.questionKey] : [])));
    const expected = EXTRA_KINDS.flatMap((k) => (extraAllowed(k, 3) ? (extras[k] ?? []) : []));
    assert.deepEqual([...used].sort(), [...expected].sort());
  });

  it("trò chơi và dạng mới đứng sau 5 dạng GĐ1, trò chơi đứng cuối bài", () => {
    for (const lesson of regular(buildLessons(words(16), { levelNumber: 3, extras }))) {
      const t = types(lesson.steps);
      const firstNew = t.findIndex((x) => NEW_ACTIVITY_TYPES.includes(x));
      assert.ok(t.slice(0, firstNew).every((x) => !NEW_ACTIVITY_TYPES.includes(x)));
      assert.ok(["word_rain", "word_bubbles", "whack_letters", "race"].includes(t.at(-1)!), "trò chơi ở cuối bài");
      assert.ok(t.lastIndexOf("choose_word_for_picture") < firstNew, "dạng GĐ1 đứng trước");
    }
  });

  it("cùng đầu vào cho cùng kết quả", () => {
    assert.deepEqual(buildLessons(words(16), { levelNumber: 3, extras }), buildLessons(words(16), { levelNumber: 3, extras }));
  });
});

describe("truyện tranh trong bài", () => {
  it("truyện vào bài thường cuối cùng, trước trò chơi; nhiều truyện thì lùi dần từ cuối", () => {
    const lessons = regular(buildLessons(words(16), { levelNumber: 3, stories: ["a", "b"] }));
    const withStory = lessons.map((l) => l.steps.filter((s) => s.activityType === "story").map((s) => s.questionKey));
    assert.deepEqual(withStory, lessons.map((_, i) => (i === lessons.length - 1 ? [storyKey("a")] : i === lessons.length - 2 ? [storyKey("b")] : [])));
    const last = lessons.at(-1)!.steps;
    assert.equal(last.at(-1)!.activityType === "story", false, "trò chơi đứng sau truyện");
    assert.ok(last.findIndex((s) => s.activityType === "story") < last.length - 1);
  });
  it("bài đã học cũng được thêm bước truyện (chỉ một lần)", () => {
    const built = regular(buildLessons(words(8), { levelNumber: 3, stories: ["a"] }))[0].steps;
    const first = planAppend([], built);
    assert.ok(first.some((s) => s.activityType === "story"));
    assert.deepEqual(planAppend(first.map((s) => ({ activityType: s.activityType, questionKey: s.questionKey })), built), []);
  });
  it("không truyền truyện thì không có bước truyện", () => {
    assert.ok(regular(buildLessons(words(16), { levelNumber: 3 })).every((l) => l.steps.every((s) => s.activityType !== "story")));
  });
});

describe("distribute / planGame / extraAllowed", () => {
  it("chia vòng, mỗi mục một bài", () => {
    assert.deepEqual([0, 1, 2].map((i) => distribute([1, 2, 3, 4, 5], 3, i)), [[1, 4], [2, 5], [3]]);
    assert.deepEqual(distribute([1, 2], 0, 0), []);
  });
  it("trò chơi xoay vòng, mưa từ vựng chỉ cấp 3–5, thiếu từ có hình thì nhường trò khác", () => {
    const w = words(12);
    assert.deepEqual([0, 1, 2, 3].map((i) => planGame(1, i, w)), ["word_bubbles", "whack_letters", "race", "word_bubbles"]);
    assert.deepEqual([0, 1, 2, 3].map((i) => planGame(3, i, w)), ["word_rain", "word_bubbles", "whack_letters", "race"]);
    assert.equal(planGame(2, 0, words(4)), "whack_letters", "4 từ có hình: không đủ 5 bóng");
    assert.equal(planGame(2, 0, words(3)), null);
    assert.equal(planGame(6, 0, words(12)), "word_bubbles", "ngoài cấp 3–5 không có mưa từ vựng");
  });
  it("luật cấp của từng dạng", () => {
    assert.deepEqual(EXTRA_KINDS.map((k) => [1, 2, 3, 4].filter((l) => extraAllowed(k, l)).join("")), ["123", "1234", "1234", "234", "1234", "34"]);
  });
});

describe("planAppend (bài đã có tiến độ học)", () => {
  const built = regular(buildLessons(words(8), { levelNumber: 3, extras }))[0].steps;
  const old = buildLessons(words(8))[0].steps.map((s) => ({ activityType: s.activityType, questionKey: null }));

  it("chỉ thêm bước dạng mới / trò chơi, không đụng bước cũ", () => {
    const add = planAppend(old, built);
    assert.ok(add.length > 0);
    assert.ok(add.every((s) => NEW_ACTIVITY_TYPES.includes(s.activityType)));
  });
  it("chạy lại không thêm lần nữa", () => {
    const first = planAppend(old, built);
    const again = planAppend([...old, ...first.map((s) => ({ activityType: s.activityType, questionKey: s.questionKey }))], built);
    assert.deepEqual(again, []);
  });
  it("bước cũ có sẵn trong bài thì không thêm lại", () => {
    const have = built.filter((s) => NEW_ACTIVITY_TYPES.includes(s.activityType)).map((s) => ({ activityType: s.activityType, questionKey: s.questionKey }));
    assert.deepEqual(planAppend([...old, ...have], built), []);
  });
});
