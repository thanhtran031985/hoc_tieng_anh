import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COINS } from "./constants.ts";
import { ACHIEVEMENTS, STICKERS, stickerCode } from "./reward-catalog.ts";
import { badgeProgress, bossReward, dropsSticker, earnedBadges, isNewReward, pickSticker, preferredAlbum, type BadgeStats } from "./rewards.ts";

const catalog = STICKERS.map((s) => ({ code: stickerCode(s.key), album: s.album }));
const none: BadgeStats = { streakDays: 0, wordsMastered: 0, levelsPassed: 0, bossWins: 0, stars3Lessons: 0, speakingLines: 0 };
const defs = ACHIEVEMENTS.map((a) => ({ code: a.code, condition: { kind: a.kind, goal: a.goal } }));

describe("dropsSticker", () => {
  it("lần đầu hoàn thành bài thường hoặc trận trùm thì rơi; học lại hay bài ôn tập thì không", () => {
    assert.equal(dropsSticker("lesson", true), true);
    assert.equal(dropsSticker("unit_test", true), true);
    assert.equal(dropsSticker("lesson", false), false);
    assert.equal(dropsSticker("unit_test", false), false);
    assert.equal(dropsSticker("review", true), false);
  });
});

describe("preferredAlbum", () => {
  it("chủ đề có album riêng thì ưu tiên album đó, trận trùm ưu tiên khủng long", () => {
    assert.equal(preferredAlbum("animals", false), "animals");
    assert.equal(preferredAlbum("fruit", false), "fruits");
    assert.equal(preferredAlbum("holidays-transport", false), "vehicles");
    assert.equal(preferredAlbum("animals", true), "dino");
    assert.equal(preferredAlbum("hello-me", false), null);
    assert.equal(preferredAlbum(null, false), null);
  });
});

describe("pickSticker", () => {
  it("ưu tiên album hợp chủ đề", () => {
    for (let i = 0; i < 20; i++) assert.equal(pickSticker({ catalog, owned: new Set(), unitSlug: "fruit", isBoss: false, seed: `s${i}` })?.album, "fruits");
    for (let i = 0; i < 20; i++) assert.equal(pickSticker({ catalog, owned: new Set(), unitSlug: "hello-me", isBoss: true, seed: `b${i}` })?.album, "dino");
  });

  it("không bao giờ rơi trùng sticker đã có: nhặt hết 24 sticker rồi không còn rơi", () => {
    const owned = new Set<string>();
    for (let i = 0; i < 24; i++) {
      const s = pickSticker({ catalog, owned, unitSlug: "animals", isBoss: i % 5 === 0, seed: `x${i}` });
      assert.ok(s, `lần ${i + 1} phải còn sticker`);
      assert.ok(!owned.has(s.code), "trùng sticker đã có");
      owned.add(s.code);
    }
    assert.equal(owned.size, 24);
    assert.equal(pickSticker({ catalog, owned, unitSlug: "animals", isBoss: false, seed: "end" }), null);
  });

  it("album hợp chủ đề đã đủ thì lấy album khác", () => {
    const owned = new Set(catalog.filter((s) => s.album === "fruits").map((s) => s.code));
    const s = pickSticker({ catalog, owned, unitSlug: "fruit", isBoss: false, seed: "k" });
    assert.ok(s && s.album !== "fruits");
  });

  it("cùng hạt giống cho cùng sticker; khác hạt giống có thể khác", () => {
    const a = pickSticker({ catalog, owned: new Set(), unitSlug: "animals", isBoss: false, seed: "same" });
    assert.deepEqual(pickSticker({ catalog, owned: new Set(), unitSlug: "animals", isBoss: false, seed: "same" }), a);
    const set = new Set(Array.from({ length: 30 }, (_, i) => pickSticker({ catalog, owned: new Set(), unitSlug: "animals", isBoss: false, seed: `v${i}` })?.code));
    assert.ok(set.size > 1);
  });
});

describe("isNewReward", () => {
  it("nhận trong 3 ngày gần nhất là mới", () => {
    const now = new Date("2026-10-10T00:00:00Z");
    assert.equal(isNewReward(new Date("2026-10-08T00:00:01Z"), now), true);
    assert.equal(isNewReward(new Date("2026-10-07T00:00:00Z"), now), false);
  });
});

describe("badgeProgress", () => {
  it("mỗi loại điều kiện đúng mốc thì xong, thiếu 1 thì chưa, tiến độ không vượt mức", () => {
    const cases: [string, keyof BadgeStats, number][] = [
      ["streak", "streakDays", 7],
      ["words_mastered", "wordsMastered", 100],
      ["boss_wins", "bossWins", 5],
      ["stars3_lessons", "stars3Lessons", 10],
      ["speaking", "speakingLines", 20],
    ];
    for (const [kind, stat, goal] of cases) {
      const cond = { kind, goal } as Parameters<typeof badgeProgress>[0];
      assert.deepEqual(badgeProgress(cond, { ...none, [stat]: goal - 1 }), { have: goal - 1, goal, done: false }, `${kind} thiếu 1`);
      assert.deepEqual(badgeProgress(cond, { ...none, [stat]: goal }), { have: goal, goal, done: true }, `${kind} đủ`);
      assert.equal(badgeProgress(cond, { ...none, [stat]: goal + 50 }).have, goal, `${kind} không vượt mức`);
    }
  });

  it("qua đảo: có hai trạng thái theo số cấp đã qua", () => {
    assert.deepEqual(badgeProgress({ kind: "level_test", goal: 2 }, { ...none, levelsPassed: 1 }), { have: 0, goal: 1, done: false });
    assert.deepEqual(badgeProgress({ kind: "level_test", goal: 2 }, { ...none, levelsPassed: 2 }), { have: 1, goal: 1, done: true });
  });
});

describe("earnedBadges", () => {
  it("chỉ trả huy hiệu mới đủ điều kiện và bé chưa có, theo thứ tự danh mục", () => {
    const stats = { ...none, streakDays: 30, wordsMastered: 100, speakingLines: 3 };
    assert.deepEqual(earnedBadges(defs, new Set(), stats), ["ach:streak7", "ach:streak30", "ach:words100"]);
    assert.deepEqual(earnedBadges(defs, new Set(["ach:streak7"]), stats), ["ach:streak30", "ach:words100"]);
  });

  it("chưa đủ mốc nào thì không có; không cấp lại cái đã có", () => {
    assert.deepEqual(earnedBadges(defs, new Set(), none), []);
    assert.deepEqual(earnedBadges(defs, new Set(defs.map((d) => d.code)), { ...none, streakDays: 999, wordsMastered: 999, bossWins: 99, stars3Lessons: 999, speakingLines: 999 }), []);
  });

  it("bỏ qua huy hiệu qua đảo, huy hiệu trùm và điều kiện hỏng", () => {
    const extra = [
      { code: "level:1", condition: { kind: "level_test", goal: 1 } },
      { code: "boss:1:animals", condition: { kind: "boss", level: 1, unit: "animals" } },
      { code: "ach:bad", condition: { kind: "streak", goal: -3 } },
      { code: "ach:null", condition: null },
    ];
    assert.deepEqual(earnedBadges(extra, new Set(), { ...none, levelsPassed: 4, streakDays: 99 }), []);
  });

  it("một huy hiệu do quản trị thêm (mức khác) vẫn được tính", () => {
    assert.deepEqual(earnedBadges([{ code: "ach:streak14", condition: { kind: "streak", goal: 14 } }], new Set(), { ...none, streakDays: 14 }), ["ach:streak14"]);
  });
});

describe("xu thưởng", () => {
  it("sticker +10, huy hiệu +50, trận trùm +30 (Tiểu học)", () => {
    assert.equal(COINS.stickerLesson, 10);
    assert.equal(COINS.badge, 50);
    assert.equal(bossReward(true).coins, 30);
  });
});
