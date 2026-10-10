import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { familyDecoysSchema, familyIpaSchema, familyPatternSchema, onsetSchema, parseFamilyDecoys, wordLabEntryInputSchema } from "../schemas/word-family.ts";
import {
  BUILD_TILES_MAX,
  buildDone,
  buildInfo,
  buildRimeOf,
  buildTiles,
  canBuild,
  canPublishFamily,
  canPushLink,
  canSaveFamily,
  cardNav,
  checkOnset,
  crumbLabel,
  cutTo,
  familyIssues,
  hintOnset,
  popLink,
  pushLink,
  sameEntry,
  soundMatches,
  splitOnset,
  splitRime,
  unheardLearned,
  type FamilyDraft,
  type FamilyMemberRef,
  type LabEntry,
} from "./word-family.ts";
import { FAMILY_SEED } from "./word-family-data.ts";

const m = (word: string, sameSound = true, wordId = word.length * 100 + word.charCodeAt(0)): FamilyMemberRef => ({ wordId, word, sameSound });
const atMembers = ["bat", "cat", "hat", "fat", "mat", "flat", "chat", "that"].map((w) => m(w));
const irMembers = ["bird", "girl", "shirt", "skirt"].map((w) => m(w));

const goodDraft = (over: Partial<FamilyDraft> = {}): FamilyDraft => ({
  pattern: "at",
  soundIpa: "/æt/",
  buildRime: null,
  decoys: ["z"],
  trapNote: "Nghe kỹ nhé!",
  members: [...atMembers, m("eat", false), m("what", false)],
  reading: { sentences: [{ en: "The fat cat sat on a mat.", vi: "Con mèo béo ngồi trên tấm thảm." }], audio: "/audio/family-1-abc.mp3" },
  ...over,
});

describe("chữ đầu và vần", () => {
  it("tách chữ đầu khi từ kết thúc bằng vần", () => {
    assert.equal(splitOnset("cat", "at"), "c");
    assert.equal(splitOnset("shirt", "irt"), "sh");
    assert.equal(splitOnset("flat", "at"), "fl");
    assert.equal(splitOnset("Chat", "AT"), "ch");
  });
  it("không tách được thì null", () => {
    assert.equal(splitOnset("eat", "at"), "e", "eat có chữ đầu e");
    assert.equal(splitOnset("at", "at"), null, "không có chữ đầu");
    assert.equal(splitOnset("bird", "at"), null);
    assert.equal(splitOnset("strait", "ait"), "str");
    assert.equal(splitOnset("street", "eet"), "str");
    assert.equal(splitOnset("school", "ool"), "sch");
    assert.equal(splitOnset("thrill", "ill"), "thr");
    assert.equal(splitOnset("straight", "ight"), null, "chữ đầu 4 chữ cái không hợp lệ");
  });
  it("tô màu vần ở lần xuất hiện cuối", () => {
    assert.deepEqual(splitRime("cat", "at"), { before: "c", rime: "at", after: "" });
    assert.deepEqual(splitRime("first", "ir"), { before: "f", rime: "ir", after: "st" });
    assert.deepEqual(splitRime("what", "at"), { before: "wh", rime: "at", after: "" });
    assert.deepEqual(splitRime("fire", "at"), { before: "fire", rime: "", after: "" });
  });
  it("phiên âm cùng âm hay khác âm", () => {
    assert.equal(soundMatches("/kæt/", "/æt/"), true);
    assert.equal(soundMatches("/bɜːd/", "/ɜː/"), true);
    assert.equal(soundMatches("/ˈfaɪə/", "/ɜː/"), false);
    assert.equal(soundMatches("/iːt/", "/æt/"), false);
    assert.equal(soundMatches(null, "/æt/"), false);
  });
  it("vần để ghép lấy build_rime, không có thì lấy vần", () => {
    assert.equal(buildRimeOf("ir", "irt"), "irt");
    assert.equal(buildRimeOf("at", null), "at");
    assert.equal(buildRimeOf("AT", "  "), "at");
  });
});

describe("Ghép chữ đầu", () => {
  it("từ thật của -at: mọi từ cùng âm viết đúng chữ đầu + vần, mục tiêu 5", () => {
    const info = buildInfo(atMembers, "at", null, ["z", "v"]);
    assert.deepEqual(info.words.map((w) => w.onset), ["b", "c", "h", "f", "m", "fl", "ch", "th"]);
    assert.equal(info.goal, 5);
    assert.equal(canBuild(info), true);
  });
  it("-ir ghép bằng irt: shirt, skirt; mục tiêu = số từ thật khi ít hơn 5", () => {
    const info = buildInfo(irMembers, "ir", "irt", ["f", "m", "z"]);
    assert.equal(info.rime, "irt");
    assert.deepEqual(info.words.map((w) => w.word), ["shirt", "skirt"]);
    assert.equal(info.goal, 2);
    assert.equal(canBuild(info), true);
  });
  it("chỉ một từ thật thì chưa có Ghép", () => {
    const info = buildInfo([m("shirt"), m("bird")], "ir", "irt", []);
    assert.equal(canBuild(info), false);
  });
  it("từ Bẫy không là từ thật", () => {
    const info = buildInfo([...atMembers, m("eat", false)], "at", null, []);
    assert.equal(info.words.some((w) => w.word === "eat"), false);
  });
  it("chữ đầu nhiễu trùng chữ đầu của từ thật bị loại, không trùng nhau", () => {
    const info = buildInfo(atMembers, "at", null, ["z", "b", "Z", "v"]);
    assert.deepEqual(info.decoys, ["z", "v"]);
  });
  it("kiểm chữ đầu: thật, trùng, không có thật, trống", () => {
    const info = buildInfo(atMembers, "at", null, []);
    assert.equal(checkOnset(info, [], "c"), "real");
    assert.equal(checkOnset(info, ["c"], "c"), "dup");
    assert.equal(checkOnset(info, [], "z"), "fake");
    assert.equal(checkOnset(info, [], "  "), "empty");
    assert.equal(checkOnset(info, [], "SH"), "fake");
    assert.equal(checkOnset(info, [], "FL"), "real");
  });
  it("hàng chữ có đủ từ thật để đạt mục tiêu, thêm tối đa 3 chữ nhiễu, ổn định theo hạt giống", () => {
    const info = buildInfo(atMembers, "at", null, ["z", "v", "j", "q"]);
    const tiles = buildTiles(info, "7:build:1");
    assert.deepEqual(tiles, buildTiles(info, "7:build:1"));
    assert.ok(tiles.length <= BUILD_TILES_MAX);
    assert.equal(tiles.filter((t) => info.decoys.includes(t)).length, 3);
    assert.ok(tiles.filter((t) => info.words.some((w) => w.onset === t)).length >= info.goal);
  });
  it("từ cần ghép đầu tiên luôn có ô chữ", () => {
    const info = buildInfo(atMembers, "at", null, ["z", "v", "j"]);
    for (const seed of ["a", "b", "c", "d", "e", "f"]) assert.ok(buildTiles(info, seed, "that").includes("th"), seed);
  });
  it("gợi ý chọn từ thật chưa tìm, ưu tiên chữ có ô", () => {
    const info = buildInfo(atMembers, "at", null, []);
    assert.equal(hintOnset(info, ["b", "c"], ["b", "c", "h"]), "h");
    assert.equal(hintOnset(info, ["b", "c"], ["b", "c"]), "h", "không ô nào còn lại thì lấy từ thật đầu tiên chưa tìm");
    assert.equal(hintOnset(info, info.words.map((w) => w.onset), []), null);
  });
  it("tìm đủ mục tiêu là xong", () => {
    assert.equal(buildDone(["b", "c", "h", "f"], 5), false);
    assert.equal(buildDone(["b", "c", "h", "f", "m"], 5), true);
    assert.equal(buildDone([], 0), false);
  });
});

describe("Họ vần", () => {
  it("← → đi giữa thẻ, không vòng quanh", () => {
    assert.equal(cardNav(0, "ArrowRight", 8), 1);
    assert.equal(cardNav(0, "ArrowLeft", 8), 0);
    assert.equal(cardNav(7, "ArrowRight", 8), 7);
    assert.equal(cardNav(3, "ArrowLeft", 8), 2);
    assert.equal(cardNav(0, "ArrowRight", 0), 0);
  });
  it("từ đã học mà chưa nghe", () => {
    const members = [
      { wordId: 1, learned: true },
      { wordId: 2, learned: false },
      { wordId: 3, learned: true },
    ];
    assert.deepEqual(unheardLearned(members, [1]), [3]);
    assert.deepEqual(unheardLearned(members, [1, 3]), []);
  });
});

describe("lỗi khi soạn họ vần", () => {
  it("họ đủ điều kiện thì xuất bản được", () => {
    const issues = familyIssues(goodDraft());
    assert.deepEqual(issues, []);
    assert.equal(canPublishFamily(issues), true);
  });
  it("vần có ký tự lạ", () => {
    const issues = familyIssues(goodDraft({ pattern: "a-t" }));
    assert.ok(issues.some((i) => i.code === "pattern" && i.scope === "save"));
    assert.equal(canSaveFamily(issues), false);
    assert.ok(familyIssues(goodDraft({ pattern: "Ất" })).some((i) => i.code === "pattern"));
    assert.ok(familyIssues(goodDraft({ pattern: "abcdefg" })).some((i) => i.code === "pattern"));
  });
  it("IPA thiếu dấu gạch chéo", () => {
    for (const bad of ["æt", "/æt", "æt/", "//", ""]) {
      assert.ok(familyIssues(goodDraft({ soundIpa: bad })).some((i) => i.code === "ipa" && i.scope === "save"), bad);
    }
  });
  it("ít hơn 3 từ cùng âm chặn xuất bản nhưng vẫn lưu Nháp được", () => {
    const issues = familyIssues(goodDraft({ members: [m("cat"), m("hat"), m("eat", false)] }));
    assert.ok(issues.some((i) => i.code === "members_count" && i.scope === "publish"));
    assert.equal(canSaveFamily(issues), true);
    assert.equal(canPublishFamily(issues), false);
  });
  it("chữ đầu nhiễu trùng từ thật bị chặn cả khi lưu", () => {
    const issues = familyIssues(goodDraft({ decoys: ["z", "c"] }));
    const issue = issues.find((i) => i.code === "decoy_real");
    assert.ok(issue);
    assert.equal(issue.scope, "save");
    assert.match(issue.message, /“c”/);
  });
  it("chữ đầu nhiễu sai dạng hoặc thêm hai lần", () => {
    assert.ok(familyIssues(goodDraft({ decoys: ["zzzz"] })).some((i) => i.code === "decoy_format"));
    assert.ok(familyIssues(goodDraft({ decoys: ["1"] })).some((i) => i.code === "decoy_format"));
    assert.ok(familyIssues(goodDraft({ decoys: ["z", "z"] })).some((i) => i.code === "decoy_format"));
  });
  it("từ không chứa vần", () => {
    const issues = familyIssues(goodDraft({ members: [...atMembers, m("dog")] }));
    assert.ok(issues.some((i) => i.code === "member_pattern" && /dog/.test(i.message)));
  });
  it("có Bẫy mà thiếu lời giải thích", () => {
    assert.ok(familyIssues(goodDraft({ trapNote: " " })).some((i) => i.code === "trap_note"));
    assert.deepEqual(familyIssues(goodDraft({ trapNote: "", members: atMembers })), []);
  });
  it("đoạn văn thiếu, thiếu dịch, thiếu âm thanh", () => {
    assert.ok(familyIssues(goodDraft({ reading: null })).some((i) => i.code === "reading_missing"));
    assert.ok(familyIssues(goodDraft({ reading: { sentences: [], audio: null } })).some((i) => i.code === "reading_missing"));
    assert.ok(familyIssues(goodDraft({ reading: { sentences: [{ en: "A cat.", vi: " " }], audio: "/audio/x.mp3" } })).some((i) => i.code === "sentence_vi" && i.field === "reading-sentence-0"));
    assert.ok(familyIssues(goodDraft({ reading: { sentences: [{ en: "A cat.", vi: "Con mèo." }], audio: null } })).some((i) => i.code === "reading_audio"));
  });
});

describe("liên kết qua lại tối đa 4 bậc", () => {
  const bird: LabEntry = { v: "wx", wordId: 1, label: "bird" };
  const famIr: LabEntry = { v: "fam", familyId: 2, label: "họ -ir" };
  const build: LabEntry = { v: "build", familyId: 2, first: 3, label: "Ghép chữ" };
  const shirt: LabEntry = { v: "wx", wordId: 3, label: "shirt" };
  const cat: LabEntry = { v: "wx", wordId: 9, label: "cat" };

  it("đi đúng lượt bird → họ -ir → Ghép chữ → shirt", () => {
    let stack: LabEntry[] = [bird];
    for (const next of [famIr, build, shirt]) {
      const pushed = pushLink(stack, next);
      assert.ok(pushed, next.label);
      stack = pushed;
    }
    assert.deepEqual(stack.map(crumbLabel), ["bird", "họ -ir", "Ghép chữ", "shirt"]);
    assert.equal(canPushLink(stack), false);
  });
  it("bậc thứ 5 không mở", () => {
    assert.equal(pushLink([bird, famIr, build, shirt], cat), null);
  });
  it("đi lại màn đã có thì quay về đúng bậc đó, kể cả khi đã đủ 4 bậc", () => {
    assert.deepEqual(pushLink([bird, famIr, build, shirt], bird), [bird]);
    assert.deepEqual(pushLink([bird, famIr, build], { ...build, first: 5 }), [bird, famIr, build]);
  });
  it("Quay lại về bậc trước, bậc đầu thì giữ nguyên", () => {
    assert.deepEqual(popLink([bird, famIr, build]), [bird, famIr]);
    assert.deepEqual(popLink([bird]), [bird]);
  });
  it("bấm một chỗ trên đường dẫn thì cắt về đó", () => {
    assert.deepEqual(cutTo([bird, famIr, build, shirt], 1), [bird, famIr]);
    assert.deepEqual(cutTo([bird, famIr], 5), [bird, famIr]);
  });
  it("hai bậc cùng màn", () => {
    assert.equal(sameEntry(bird, { ...bird, label: "khác" }), true);
    assert.equal(sameEntry(bird, shirt), false);
    assert.equal(sameEntry(famIr, build), false);
  });
});

describe("Zod", () => {
  it("vần", () => {
    assert.equal(familyPatternSchema.safeParse(" AT ").data, "at");
    assert.equal(familyPatternSchema.safeParse("a t").success, false);
    assert.equal(familyPatternSchema.safeParse("").success, false);
  });
  it("IPA phải có /…/", () => {
    assert.equal(familyIpaSchema.safeParse("/æt/").success, true);
    assert.equal(familyIpaSchema.safeParse("æt").success, false);
  });
  it("chữ đầu 1–3 chữ cái", () => {
    assert.equal(onsetSchema.safeParse("SH").data, "sh");
    assert.equal(onsetSchema.safeParse("shsh").success, false);
    assert.equal(onsetSchema.safeParse("1").success, false);
    assert.equal(familyDecoysSchema.safeParse(["z", "v"]).success, true);
    assert.equal(parseFamilyDecoys("z"), null);
    assert.deepEqual(parseFamilyDecoys(["z"]), ["z"]);
  });
  it("mục của khung liên kết", () => {
    assert.equal(wordLabEntryInputSchema.safeParse({ v: "wx", wordId: 3 }).success, true);
    assert.deepEqual(wordLabEntryInputSchema.parse({ v: "build", familyId: 2 }), { v: "build", familyId: 2, first: null });
    assert.equal(wordLabEntryInputSchema.safeParse({ v: "fam", familyId: 0 }).success, false);
    assert.equal(wordLabEntryInputSchema.safeParse({ v: "other" }).success, false);
  });
});

describe("họ vần mẫu", () => {
  it("dữ liệu seed hợp lệ: vần, IPA, chữ đầu nhiễu không trùng từ thật", () => {
    for (const entry of FAMILY_SEED) {
      assert.equal(familyPatternSchema.safeParse(entry.pattern).success, true, entry.pattern);
      assert.equal(familyIpaSchema.safeParse(entry.soundIpa).success, true, entry.pattern);
      const members = [...entry.members.map((w, i) => m(w, true, i + 1)), ...entry.traps.map((w, i) => m(w, false, 100 + i))];
      const issues = familyIssues({ pattern: entry.pattern, soundIpa: entry.soundIpa, buildRime: entry.buildRime, decoys: entry.decoys, trapNote: entry.trapNote, members, reading: { sentences: entry.sentences, audio: "/audio/x.mp3" } });
      assert.deepEqual(issues, [], entry.pattern);
    }
  });
});
