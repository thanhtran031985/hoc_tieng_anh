import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPlaySteps, type PlayWord, type StoredStep } from "./lesson-play.ts";

const word = (id: number, name: string, image = true): PlayWord => ({
  id,
  word: name,
  ipa: null,
  meaningVi: name,
  exampleEn: null,
  exampleVi: null,
  image: image ? `/media/pictures/${name}.svg` : null,
});

const unit = [word(1, "cat"), word(2, "dog"), word(3, "fish"), word(4, "bird"), word(5, "ball", false)];

const step = (id: number, activityType: string, w: PlayWord | null, config: StoredStep["config"] = {}): StoredStep => ({ id, activityType, word: w, config });

describe("buildPlaySteps", () => {
  it("giữ thứ tự bước và đánh số thẻ từ", () => {
    const steps = [step(1, "word_card", unit[0]), step(2, "word_card", unit[1]), step(3, "listen_choose_picture", unit[0], { optionCount: 3 })];
    const play = buildPlaySteps(steps, unit, "seed");
    assert.deepEqual(
      play.map((p) => p.kind),
      ["word_card", "word_card", "listen_choose_picture"],
    );
    const cards = play.filter((p) => p.kind === "word_card");
    assert.deepEqual(
      cards.map((c) => [c.ordinal, c.total]),
      [
        [1, 2],
        [2, 2],
      ],
    );
  });

  it("nghe và chọn hình: đủ số lựa chọn, có đáp án đúng, chỉ lấy từ có hình, không trùng", () => {
    const [play] = buildPlaySteps([step(1, "listen_choose_picture", unit[0], { optionCount: 3 })], unit, "seed");
    assert.equal(play.kind, "listen_choose_picture");
    if (play.kind !== "listen_choose_picture") return;
    assert.equal(play.options.length, 3);
    assert.ok(play.options.some((o) => o.id === play.target.id));
    assert.ok(play.options.every((o) => o.image !== null));
    assert.equal(new Set(play.options.map((o) => o.id)).size, 3);
  });

  it("chọn từ cho hình: lựa chọn lấy từ cả chủ đề, kể cả từ chưa có hình", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const [play] = buildPlaySteps([step(1, "choose_word_for_picture", unit[0], { optionCount: 4 })], unit, `seed${i}`);
      if (play.kind !== "choose_word_for_picture") throw new Error("sai dạng");
      assert.equal(play.options.length, 4);
      play.options.forEach((o) => seen.add(o.word));
    }
    assert.ok(seen.has("ball"));
  });

  it("cùng hạt giống ra cùng bộ câu hỏi, khác hạt giống thì có thể khác", () => {
    const steps = [step(1, "listen_choose_picture", unit[0], { optionCount: 3 })];
    const a = buildPlaySteps(steps, unit, "x");
    const b = buildPlaySteps(steps, unit, "x");
    assert.deepEqual(a, b);
    const orders = new Set(Array.from({ length: 30 }, (_, i) => JSON.stringify(buildPlaySteps(steps, unit, `k${i}`))));
    assert.ok(orders.size > 1);
  });

  it("bỏ bước không dựng được: từ thiếu hình, không đủ từ nhiễu, dạng bài lạ", () => {
    const noPicture = word(9, "water", false);
    const play = buildPlaySteps(
      [step(1, "listen_choose_picture", noPicture), step(2, "listen_choose_picture", unit[0]), step(3, "unknown_type", unit[0])],
      [unit[0]],
      "seed",
    );
    assert.deepEqual(play, []);
  });

  it("nối từ: lấy các từ có hình của chính bài, tối đa pairCount, cần ít nhất 2 cặp", () => {
    const steps = [step(1, "word_card", unit[0]), step(2, "word_card", unit[1]), step(3, "word_card", unit[2]), step(4, "word_card", unit[4]), step(5, "match_pairs", null, { pairCount: 2 })];
    const play = buildPlaySteps(steps, unit, "seed");
    const match = play.find((p) => p.kind === "match_pairs");
    assert.ok(match && match.kind === "match_pairs");
    assert.deepEqual(
      match.pairs.map((p) => p.word),
      ["cat", "dog"],
    );
    const lonely = buildPlaySteps([step(1, "word_card", unit[0]), step(2, "match_pairs", null, { pairCount: 4 })], unit, "seed");
    assert.ok(!lonely.some((p) => p.kind === "match_pairs"));
  });
});
