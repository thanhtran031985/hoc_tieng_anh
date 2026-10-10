import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPlaySteps, type PlayWord, type StoredStep } from "./lesson-play.ts";
import { rewardFor, gameCoins } from "./lesson-score.ts";
import { ACTIVITY_INFO, insertIndex } from "./admin-builder.ts";
import { parseLessonStepConfig } from "../schemas/lesson-step-config.ts";

const NAMES = ["cat", "dog", "fish", "bird", "duck", "apple", "ball", "kite", "bear", "sun"];
const word = (id: number, name: string, image = true): PlayWord => ({ id, word: name, ipa: null, meaningVi: name, exampleEn: name === "cat" ? "I have a cat." : null, exampleVi: null, image: image ? `/p/${name}.svg` : null });
const ALL = NAMES.map((n, i) => word(i + 1, n));
const step = (id: number, activityType: string): StoredStep => ({ id, activityType, word: null, config: {} });
const cards = ALL.slice(0, 6).map((w, i): StoredStep => ({ id: 100 + i, activityType: "word_card", word: w, config: {} }));

describe("buildPlaySteps — mini game", () => {
  it("dựng cả 4 trò từ từ của bài và chủ đề", () => {
    const play = buildPlaySteps([...cards, step(1, "word_rain"), step(2, "word_bubbles"), step(3, "whack_letters"), step(4, "race")], ALL, "seed", { levelNumber: 3 });
    assert.deepEqual(play.slice(6).map((p) => p.kind), ["word_rain", "word_bubbles", "whack_letters", "race"]);
    const race = play[9];
    assert.equal(race.kind === "race" && race.ghost, null);
  });
  it("Mưa từ vựng bị bỏ ngoài cấp 3–5, các trò khác vẫn có", () => {
    const steps = [...cards, step(1, "word_rain"), step(2, "word_bubbles")];
    assert.deepEqual(buildPlaySteps(steps, ALL, "s", { levelNumber: 2 }).slice(6).map((p) => p.kind), ["word_bubbles"]);
    assert.deepEqual(buildPlaySteps(steps, ALL, "s", { levelNumber: 6 }).slice(6).map((p) => p.kind), ["word_bubbles"]);
    assert.deepEqual(buildPlaySteps(steps, ALL, "s", { levelNumber: 4 }).slice(6).map((p) => p.kind), ["word_rain", "word_bubbles"]);
  });
  it("thiếu từ thì bỏ bước, không lỗi", () => {
    const few = ALL.slice(0, 2);
    const play = buildPlaySteps([step(1, "word_rain"), step(2, "word_bubbles"), step(3, "whack_letters"), step(4, "race")], few, "s", { levelNumber: 3 });
    assert.deepEqual(play, []);
  });
  it("xe ma: lần trước được chuyển vào bước đua xe", () => {
    const play = buildPlaySteps([...cards, step(4, "race")], ALL, "s", { raceGhost: [1, 0, 1, 1] });
    const race = play.find((p) => p.kind === "race");
    assert.deepEqual(race?.kind === "race" ? race.ghost : "x", [1, 0, 1, 1]);
  });
  it("cùng hạt giống ra cùng lượt chơi", () => {
    const a = buildPlaySteps([...cards, step(2, "word_bubbles")], ALL, "same");
    const b = buildPlaySteps([...cards, step(2, "word_bubbles")], ALL, "same");
    assert.deepEqual(a, b);
  });
});

describe("cấu hình, soạn bài và thưởng", () => {
  it("4 dạng được nhận, cấu hình rỗng hợp lệ", () => {
    for (const t of ["word_rain", "word_bubbles", "whack_letters", "race"]) {
      assert.deepEqual(parseLessonStepConfig(t, null), {});
      assert.ok(ACTIVITY_INFO[t as keyof typeof ACTIVITY_INFO].seconds > 0);
    }
  });
  it("chèn bước mới trước trò chơi cuối bài", () => {
    assert.equal(insertIndex([{ activityType: "word_card" }, { activityType: "race" }]), 1);
    assert.equal(insertIndex([{ activityType: "word_card" }, { activityType: "memory_game" }]), 1);
    assert.equal(insertIndex([{ activityType: "word_card" }, { activityType: "dictation" }]), 2);
  });
  it("xu ở bảng kết thúc = phần “mỗi sao” của thưởng bài (5 xu/sao)", () => {
    assert.deepEqual([1, 2, 3].map(gameCoins), [5, 10, 15]);
    assert.equal(rewardFor(3, 2).coins - 10, gameCoins(3));
    assert.equal(gameCoins(0), 0);
    assert.equal(gameCoins(9), 15);
  });
});
