import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildStep, flushPending, initialBuild, onsetOfWord, typeOnset, type BuildContext, type BuildState } from "./build-flow.ts";
import { buildDone, buildInfo, buildTiles } from "./word-family.ts";

const m = (word: string, sameSound = true, wordId = word.length * 100 + word.charCodeAt(0)) => ({ wordId, word, sameSound });
const info = buildInfo(["bat", "cat", "hat", "fat", "mat", "flat"].map((w) => m(w)), "at", null, ["z", "v"]);
const ctx: BuildContext = { info, tiles: ["b", "c", "h", "f", "m", "fl", "z", "v"] };
const run = (s: BuildState, ...a: Parameters<typeof buildStep>[1][]) => a.reduce((cur, act) => buildStep(cur, act, ctx), s);

describe("luồng Ghép chữ đầu", () => {
  it("đặt chữ rồi kiểm: từ thật vào Đã tìm được, ô vẫn hiện chữ cho tới khi trả về", () => {
    const s = run(initialBuild(), { type: "place", onset: "c" }, { type: "check" });
    assert.equal(s.phase, "ok");
    assert.deepEqual(s.found, ["c"]);
    assert.equal(s.slot, "c");
    const after = run(s, { type: "settle" });
    assert.equal(after.slot, "");
    assert.equal(after.phase, "idle");
    assert.deepEqual(after.found, ["c"]);
  });
  it("từ không có thật: nhắc nhẹ, không thêm vào Đã tìm được", () => {
    const s = run(initialBuild(), { type: "place", onset: "z" }, { type: "check" });
    assert.equal(s.phase, "fake");
    assert.deepEqual(s.found, []);
  });
  it("từ đã tìm rồi: báo lại, không đếm hai lần", () => {
    const s = run(initialBuild(), { type: "place", onset: "c" }, { type: "check" }, { type: "settle" }, { type: "place", onset: "c" }, { type: "check" });
    assert.equal(s.phase, "again");
    assert.deepEqual(s.found, ["c"]);
  });
  it("kiểm khi ô trống thì không làm gì", () => {
    const s = initialBuild();
    assert.equal(buildStep(s, { type: "check" }, ctx), s);
  });
  it("chữ đầu viết hoa được chuẩn hóa", () => {
    assert.equal(run(initialBuild(), { type: "place", onset: " FL " }).slot, "fl");
  });
  it("xóa ô và đặt chữ khác thay chữ cũ", () => {
    const s = run(initialBuild(), { type: "place", onset: "b" }, { type: "place", onset: "h" });
    assert.equal(s.slot, "h");
    assert.equal(run(s, { type: "clear" }).slot, "");
  });
  it("từ cần ghép đầu tiên: hết là khi tìm được", () => {
    const target = onsetOfWord(info, "hat");
    assert.equal(target, "h");
    const s = run(initialBuild(target), { type: "place", onset: "b" }, { type: "check" });
    assert.equal(s.target, "h", "ghép từ khác thì từ cần ghép vẫn còn");
    assert.equal(run(s, { type: "place", onset: "h" }, { type: "check" }).target, null);
  });
  it("từ cần ghép đầu tiên không ghép được thì không có mục tiêu", () => {
    assert.equal(onsetOfWord(info, "eat"), null);
    assert.equal(onsetOfWord(info, null), null);
  });
  it("gợi ý chọn một chữ của từ thật chưa tìm, bỏ chữ nhiễu", () => {
    const s = run(initialBuild(), { type: "hint" });
    assert.ok(s.hint && info.words.some((w) => w.onset === s.hint));
    const all = ["b", "c", "h", "f", "m", "fl"].reduce<BuildState>((cur, o) => run(cur, { type: "place", onset: o }, { type: "check" }), initialBuild());
    assert.equal(run(all, { type: "hint" }).hint, null, "hết từ thì không gợi ý");
  });
  it("đặt chữ mới xóa gợi ý", () => {
    const s = run(initialBuild(), { type: "hint" }, { type: "place", onset: "b" });
    assert.equal(s.hint, null);
  });
  it("tìm đủ mục tiêu thì xong, tìm thêm vẫn được", () => {
    const s = ["b", "c", "h", "f", "m"].reduce<BuildState>((cur, o) => run(cur, { type: "place", onset: o }, { type: "check" }), initialBuild());
    assert.equal(info.goal, 5);
    assert.equal(buildDone(s.found, info.goal), true);
    assert.equal(run(s, { type: "place", onset: "fl" }, { type: "check" }).found.length, 6);
  });
  it("làm lại về trạng thái đầu, giữ từ cần ghép", () => {
    const s = run(initialBuild("h"), { type: "place", onset: "b" }, { type: "check" }, { type: "reset" });
    assert.deepEqual(s, initialBuild(null));
  });
  it("gõ chữ không có trong hàng chữ thì nhắc nhẹ", () => {
    assert.match(run(initialBuild(), { type: "nope", letter: "q" }).message, /q không có trong hàng chữ/);
  });
});

describe("gõ chữ đầu trên bàn phím", () => {
  const onsets = ["s", "sh", "d", "f", "m", "z"];
  it("s rồi h → sh", () => {
    const first = typeOnset("", "s", onsets);
    assert.deepEqual(first, { kind: "wait", pending: "s" });
    assert.deepEqual(typeOnset("s", "h", onsets), { kind: "place", onset: "sh", pending: "" });
  });
  it("s rồi chữ khác → s, rồi chữ kia được tính riêng", () => {
    assert.deepEqual(typeOnset("s", "d", onsets), { kind: "place", onset: "d", pending: "" });
  });
  it("hết giờ chờ thì đặt chữ đã gõ", () => {
    assert.equal(flushPending("s", onsets), "s");
    assert.equal(flushPending("x", onsets), null);
  });
  it("chữ đơn không là phần đầu của chữ dài hơn thì đặt ngay", () => {
    assert.deepEqual(typeOnset("", "f", onsets), { kind: "place", onset: "f", pending: "" });
  });
  it("chữ không có trong hàng chữ", () => {
    assert.deepEqual(typeOnset("", "q", onsets), { kind: "nope", pending: "" });
  });
  it("viết hoa cũng được", () => {
    assert.deepEqual(typeOnset("", "M", onsets), { kind: "place", onset: "m", pending: "" });
  });
});

describe("hàng chữ có từ cần ghép đầu tiên", () => {
  it("luôn có ô cho từ cần ghép", () => {
    for (const seed of ["a", "b", "c", "d", "e"]) assert.ok(buildTiles(info, seed, "mat").includes("m"), seed);
  });
});
