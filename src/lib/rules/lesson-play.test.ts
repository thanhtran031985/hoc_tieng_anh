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

  it("câu chọn có từ nhiễu dự phòng không trùng lựa chọn và đáp án đúng; thiếu từ thì ít hoặc không có", () => {
    const big = ["cat", "dog", "fish", "bird", "cow", "pig", "hen", "duck"].map((n, i) => word(i + 1, n));
    for (const kind of ["listen_choose_picture", "choose_word_for_picture"] as const) {
      const [play] = buildPlaySteps([step(1, kind, big[0], { optionCount: 3 })], big, "s1");
      if (play.kind !== kind) throw new Error("sai dạng");
      assert.equal(play.options.length, 3);
      assert.ok(play.spare && play.spare.length >= 1 && play.spare.length <= 2);
      const used = new Set([...play.options.map((o) => o.id), ...(play.spare ?? []).map((o) => o.id)]);
      assert.equal(used.size, play.options.length + (play.spare ?? []).length, "từ dự phòng trùng lựa chọn");
      assert.ok(!(play.spare ?? []).some((w) => w.id === play.target.id));
    }
    const [tight] = buildPlaySteps([step(1, "listen_choose_picture", unit[0], { optionCount: 3 })], unit.slice(0, 3), "s1");
    if (tight.kind !== "listen_choose_picture") throw new Error("sai dạng");
    assert.deepEqual(tight.spare, []);
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

  it("lật thẻ: ưu tiên từ có hình của bài, thiếu thì lấy thêm từ có hình của chủ đề, cần ít nhất 3 cặp", () => {
    const many = [1, 2, 3, 4, 5, 6, 7].map((i) => word(i, `w${i}`));
    const steps = [step(1, "word_card", many[0]), step(2, "word_card", many[1]), step(3, "word_card", many[2]), step(4, "memory_game", null, { pairCount: 6 })];
    const memory = buildPlaySteps(steps, many, "seed").find((p) => p.kind === "memory_game");
    assert.ok(memory && memory.kind === "memory_game");
    assert.equal(memory.pairs.length, 6);
    assert.deepEqual(
      memory.pairs.slice(0, 3).map((p) => p.word),
      ["w1", "w2", "w3"],
    );
    assert.equal(new Set(memory.pairs.map((p) => p.id)).size, 6);
    const tiny = buildPlaySteps([step(1, "word_card", many[0]), step(2, "memory_game", null, { pairCount: 6 })], many.slice(0, 2), "seed");
    assert.ok(!tiny.some((p) => p.kind === "memory_game"));
  });
});
