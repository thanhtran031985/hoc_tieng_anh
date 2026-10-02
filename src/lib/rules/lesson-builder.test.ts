import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildLessons, splitLessonSizes, MAX_BOSS_STEPS, type BuilderWord } from "./lesson-builder.ts";

const makeWords = (count: number, hasPicture: (index: number) => boolean = () => true): BuilderWord[] =>
  Array.from({ length: count }, (_, i) => ({ word: `word${i + 1}`, hasPicture: hasPicture(i) }));

const types = (steps: { activityType: string }[]) => steps.map((s) => s.activityType);

describe("splitLessonSizes", () => {
  it("chia đều, mỗi bài tối đa 8 từ", () => {
    assert.deepEqual(splitLessonSizes(13), [7, 6]);
    assert.deepEqual(splitLessonSizes(16), [8, 8]);
    assert.deepEqual(splitLessonSizes(17), [6, 6, 5]);
    assert.deepEqual(splitLessonSizes(8), [8]);
    assert.deepEqual(splitLessonSizes(9), [5, 4]);
    assert.deepEqual(splitLessonSizes(3), [3]);
    assert.deepEqual(splitLessonSizes(0), []);
  });

  it("tổng số từ luôn đúng và không bài nào quá 8 từ", () => {
    for (let n = 1; n <= 60; n++) {
      const sizes = splitLessonSizes(n);
      assert.equal(sizes.reduce((a, b) => a + b, 0), n);
      assert.ok(sizes.every((s) => s <= 8), `n=${n}`);
    }
  });
});

describe("buildLessons", () => {
  it("13 từ có đủ hình ra 2 bài (7 + 6 từ) và 1 trận trùm", () => {
    const lessons = buildLessons(makeWords(13), { unitTitle: "Fruit" });
    assert.equal(lessons.length, 3);
    assert.deepEqual(lessons.map((l) => l.kind), ["lesson", "lesson", "unit_test"]);
    assert.deepEqual(lessons.map((l) => l.steps.filter((s) => s.activityType === "word_card").length).slice(0, 2), [7, 6]);
    assert.equal(lessons[2].title, "Trận trùm: Fruit");
  });

  it("thứ tự bước trong bài: thẻ từ → nghe chọn hình → nối cặp → chọn từ cho hình", () => {
    const [lesson] = buildLessons(makeWords(5));
    assert.deepEqual(types(lesson.steps), [
      ...Array(5).fill("word_card"),
      ...Array(5).fill("listen_choose_picture"),
      "match_pairs",
      ...Array(5).fill("choose_word_for_picture"),
    ]);
    // Mỗi từ có thẻ từ, và mỗi bước chọn gắn với đúng từ của bài.
    const cardWords = lesson.steps.filter((s) => s.activityType === "word_card").map((s) => s.word);
    assert.deepEqual(cardWords, ["word1", "word2", "word3", "word4", "word5"]);
    assert.equal(lesson.steps.find((s) => s.activityType === "match_pairs")?.word, null);
  });

  it("từ thiếu hình không có câu nghe chọn hình, nối cặp hay chọn từ cho hình, nhưng vẫn có thẻ từ", () => {
    const words = makeWords(6, (i) => i !== 2); // word3 không có hình
    const [lesson] = buildLessons(words);
    const stepsOf = (word: string) => lesson.steps.filter((s) => s.word === word).map((s) => s.activityType);
    assert.deepEqual(stepsOf("word3"), ["word_card"]);
    assert.deepEqual(stepsOf("word1"), ["word_card", "listen_choose_picture", "choose_word_for_picture"]);
  });

  it("cả chủ đề không có hình thì chỉ có thẻ từ, không có trận trùm", () => {
    const lessons = buildLessons(makeWords(6, () => false));
    assert.equal(lessons.length, 1);
    assert.deepEqual(types(lessons[0].steps), Array(6).fill("word_card"));
  });

  it("ít hơn 3 từ có hình trong bài thì bỏ nối cặp", () => {
    const [lesson] = buildLessons(makeWords(6, (i) => i < 2));
    assert.ok(!types(lesson.steps).includes("match_pairs"));
  });

  it("số cặp nối không vượt quá 6 và số lựa chọn không vượt quá số từ của chủ đề", () => {
    const [lesson] = buildLessons(makeWords(8));
    assert.equal(lesson.steps.find((s) => s.activityType === "match_pairs")?.config.pairCount, 6);
    const [tiny] = buildLessons(makeWords(3));
    assert.equal(tiny.steps.find((s) => s.activityType === "listen_choose_picture")?.config.optionCount, 3);
    const two = buildLessons(makeWords(2));
    assert.equal(two[0].steps.find((s) => s.activityType === "choose_word_for_picture")?.config.optionCount, 2);
  });

  it("chỉ một từ có hình thì không thể tạo câu nghe chọn hình (cần ít nhất 2 hình)", () => {
    const lessons = buildLessons(makeWords(5, (i) => i === 0));
    assert.ok(!lessons.some((l) => types(l.steps).includes("listen_choose_picture")));
  });

  it("trận trùm trộn từ cả chủ đề, tối đa 12 bước, xen hai dạng và chạy lại cho cùng kết quả", () => {
    const words = makeWords(40);
    const boss = buildLessons(words).at(-1)!;
    assert.equal(boss.kind, "unit_test");
    assert.equal(boss.steps.length, MAX_BOSS_STEPS);
    assert.deepEqual(types(boss.steps).slice(0, 4), ["listen_choose_picture", "choose_word_for_picture", "listen_choose_picture", "choose_word_for_picture"]);
    const bossWords = boss.steps.map((s) => s.word);
    assert.equal(new Set(bossWords).size, bossWords.length);
    // Từ ở nhiều bài khác nhau đều có thể vào trận trùm (không chỉ bài đầu).
    assert.ok(bossWords.some((w) => Number(w!.slice(4)) > 8));
    assert.deepEqual(buildLessons(words).at(-1), boss);
    assert.notDeepEqual(buildLessons(words, { seed: "khac" }).at(-1)!.steps.map((s) => s.word), bossWords);
  });

  it("danh sách rỗng không có bài", () => {
    assert.deepEqual(buildLessons([]), []);
  });

  it("cấu hình bước hợp lệ theo schema của dạng bài", () => {
    for (const lesson of buildLessons(makeWords(10))) {
      for (const step of lesson.steps) {
        if (step.activityType === "word_card") assert.equal(step.config.showExample, true);
        if (step.activityType === "match_pairs") assert.equal(step.config.mode, "click");
        if (step.activityType === "listen_choose_picture") assert.equal(step.config.autoPlay, true);
      }
    }
  });
});
