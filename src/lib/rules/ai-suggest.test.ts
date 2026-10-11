import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { allowedTokensFor } from "./vocab-check.ts";
import { cleanExplorer, cleanFamily, explorerPrompt, familyPrompt, libraryPictureKeys, pictureKeyOf, pictureUrlOf, type ExplorerFilterContext, type FamilyCandidate } from "./ai-suggest.ts";

const KEYS = new Set(["volcano", "fire", "smoke", "rock", "water", "snow", "castle", "factory", "island", "mountain", "hot"]);
const ctx = (extra: Partial<ExplorerFilterContext> = {}): ExplorerFilterContext => ({
  word: "volcano",
  meaningVi: "núi lửa",
  wordImage: "/media/pictures/volcano.svg",
  pictureKeys: KEYS,
  allowed: allowedTokensFor(["fire", "smoke", "rock", "hot", "island", "mountain", "volcano", "water", "snow"]),
  ...extra,
});

const branch = (over: Record<string, unknown> = {}) => ({
  kind: "other",
  questionEn: "What comes out of a volcano?",
  questionVi: "Núi lửa phun ra gì?",
  answers: [
    { text: "fire", textVi: "lửa", image: "fire", guess: true },
    { text: "smoke", textVi: "khói", image: "smoke" },
  ],
  distractors: [{ text: "water", image: "water" }],
  sentenceEn: "You can see fire and smoke.",
  sentenceVi: "Cậu thấy lửa và khói.",
  ...over,
});
const identify = { kind: "identify", questionEn: "What's this?", questionVi: "", answers: [{ text: "volcano", textVi: "", image: "castle" }], distractors: [{ text: "a castle", image: "castle" }, { text: "a factory", image: "factory" }], sentenceEn: "This is a volcano.", sentenceVi: "Đây là núi lửa." };

describe("pictureKeyOf / libraryPictureKeys", () => {
  it("lấy khóa hình từ đường dẫn hoặc tên tệp", () => {
    assert.equal(pictureKeyOf("/media/pictures/fire.svg"), "fire");
    assert.equal(pictureKeyOf(" fire.svg "), "fire");
    assert.equal(pictureKeyOf("fire"), "fire");
    assert.equal(pictureUrlOf("fire"), "/media/pictures/fire.svg");
    assert.deepEqual(libraryPictureKeys(["/media/pictures/a.svg", "/uploads/x.png", "/media/pictures/b-c.svg"]), ["a", "b-c"]);
  });
});

describe("lời nhắc", () => {
  it("Khám phá từ có từ, cấp, danh sách hình, nhóm gợi ý và chữ cần tránh", () => {
    const text = explorerPrompt({ word: "apple", ipa: "/ˈæpl/", meaningVi: "quả táo", level: 2, pictureKeys: ["apple", "pear"], set: "food", avoid: ["erupts"] });
    for (const part of ['"apple"', "level 2", "apple, pear", '"food"', "erupts", "an apple"]) assert.ok(text.includes(part), part);
  });

  it("Họ vần liệt kê từ ứng viên có IPA", () => {
    const text = familyPrompt({ pattern: "ous", candidates: [{ word: "famous", ipa: "/ˈfeɪməs/", level: 4 }, { word: "mouse", ipa: null, level: 2 }] });
    assert.ok(text.includes("-ous") && text.includes("famous /ˈfeɪməs/ L4") && text.includes("mouse (no IPA) L2"));
  });
});

describe("cleanExplorer", () => {
  it("giữ kết quả tốt, nhánh nhận diện có đúng một đáp án a/an + từ và hình của từ", () => {
    const out = cleanExplorer({ suggestedSet: "places", branches: [identify, branch(), branch({ questionEn: "How does a volcano look?", answers: [{ text: "hot", textVi: "nóng", image: "hot" }], sentenceEn: "It is hot." }), branch(), branch()] }, ctx());
    assert.ok(out);
    assert.equal(out.data.suggestedSet, "places");
    const [first, second] = out.data.branches;
    assert.equal(first.kind, "identify");
    assert.deepEqual(first.answers, [{ text: "a volcano", textVi: "núi lửa", image: "/media/pictures/volcano.svg", guess: true }]);
    assert.equal(first.questionVi, "Đây là gì?");
    assert.equal(second.answers[0].image, "/media/pictures/fire.svg");
    assert.equal(second.sentence.vi, "Cậu thấy lửa và khói.");
    assert.deepEqual(out.outOfLevel, []);
    // Chỉ còn việc âm thanh (không tính) nên không có cảnh báo.
    assert.deepEqual(out.data.warnings, []);
  });

  it("khóa hình lạ thành ô trống kèm lời nhắc cần vẽ; hình có hoa/thường khác vẫn nhận", () => {
    const out = cleanExplorer({ branches: [identify, branch({ answers: [{ text: "lava", textVi: "nham thạch", image: "lava", guess: true }, { text: "fire", textVi: "lửa", image: "FIRE.svg" }] }), branch(), branch()] }, ctx());
    assert.ok(out);
    const b = out.data.branches[1];
    assert.equal(b.answers[0].image, null);
    assert.equal(b.answers[1].image, "/media/pictures/fire.svg");
    assert.ok(out.data.warnings.some((w) => w.includes("Cần vẽ thêm hình") && w.includes("lava")));
    assert.ok(out.data.warnings.some((w) => w.includes("“lava”") && w.includes("chưa có hình")));
  });

  it("cắt cho đủ giới hạn: 6 nhánh, 5 đáp án, 2 hình nhiễu, đúng một đáp án để đoán", () => {
    const many = Array.from({ length: 5 }, (_, i) => ({ text: `a${i}`, textVi: "", image: "rock", guess: true }));
    const out = cleanExplorer({ branches: [identify, ...Array.from({ length: 8 }, () => branch({ answers: [...many, { text: "extra", textVi: "", image: "rock" }], distractors: [{ text: "x", image: "snow" }, { text: "y", image: "snow" }, { text: "z", image: "snow" }] }))] }, ctx());
    assert.ok(out);
    assert.equal(out.data.branches.length, 6);
    const b = out.data.branches[1];
    assert.equal(b.answers.length, 5);
    assert.equal(b.distractors.length, 2);
    assert.equal(b.answers.filter((a) => a.guess).length, 1);
    assert.equal(b.answers[0].guess, true);
  });

  it("không có đáp án đánh dấu thì lấy đáp án đầu; bỏ đáp án trùng và nhiễu trùng đáp án", () => {
    const out = cleanExplorer({ branches: [identify, branch({ answers: [{ text: "fire", textVi: "", image: "fire" }, { text: "Fire", textVi: "", image: "fire" }, { text: "rock", textVi: "", image: "rock" }], distractors: [{ text: "ROCK", image: "rock" }, { text: "snow", image: "snow" }] }), branch(), branch()] }, ctx());
    assert.ok(out);
    const b = out.data.branches[1];
    assert.deepEqual(b.answers.map((a) => [a.text, a.guess]), [["fire", true], ["rock", false]]);
    assert.deepEqual(b.distractors, [{ text: "snow", image: "/media/pictures/snow.svg" }]);
  });

  it("báo từ ngoài cấp ở câu hỏi và câu văn, nhưng chữ của đáp án thì được phép", () => {
    const out = cleanExplorer({ branches: [identify, branch({ questionEn: "What happens when a volcano erupts?", answers: [{ text: "an earthquake", textVi: "động đất", image: "rock", guess: true }], sentenceEn: "An earthquake is dangerous." }), branch(), branch()] }, ctx());
    assert.ok(out);
    assert.deepEqual(out.outOfLevel, ["happens", "erupts", "dangerous"]);
    assert.ok(out.data.warnings.some((w) => w.startsWith("Nhánh 2: từ ngoài cấp") && w.includes("erupts")));
    assert.ok(!out.data.warnings.some((w) => w.includes("earthquake")));
  });

  it("không có vốn từ thì bỏ qua kiểm từ ngoài cấp", () => {
    const out = cleanExplorer({ branches: [identify, branch({ questionEn: "What happens when a volcano erupts?" }), branch(), branch()] }, ctx({ allowed: null }));
    assert.ok(out);
    assert.deepEqual(out.outOfLevel, []);
  });

  it("báo thiếu nhánh, thiếu nhiễu, thiếu bản dịch; bù câu văn khi AI quên", () => {
    const out = cleanExplorer({ branches: [identify, branch({ distractors: [], questionVi: "", sentenceEn: "", sentenceVi: "" })] }, ctx());
    assert.ok(out);
    const w = out.data.warnings.join("\n");
    assert.ok(w.includes("Cần 4–6 nhánh (hiện có 2)"));
    assert.ok(w.includes("Nhánh 2: cần 1–2 hình nhiễu"));
    assert.ok(w.includes("Nhánh 2: câu hỏi chưa có bản dịch"));
    assert.ok(out.data.branches[1].sentence.en.length > 0);
    assert.ok(!w.includes("âm thanh"));
  });

  it("nhánh đầu không phải nhận diện thì nhắc; kind lạ thành other", () => {
    const out = cleanExplorer({ branches: [branch({ kind: "weird" }), branch(), branch(), branch()] }, ctx());
    assert.ok(out);
    assert.equal(out.data.branches[0].kind, "other");
    assert.ok(out.data.warnings.some((w) => w.includes("Nhánh 1 nên là")));
  });

  it("hỏng hoặc rỗng thì null", () => {
    assert.equal(cleanExplorer("xin chào", ctx()), null);
    assert.equal(cleanExplorer({ branches: [] }, ctx()), null);
    assert.equal(cleanExplorer({ branches: [{ kind: "other", questionEn: "", answers: [] }] }, ctx()), null);
    assert.equal(cleanExplorer(null, ctx()), null);
  });

  it("trường sai kiểu không làm hỏng cả kết quả", () => {
    const out = cleanExplorer({ suggestedSet: "robots", branches: [{ ...identify, answers: "oops" }, { ...branch(), distractors: 5, sentenceVi: 7 }] }, ctx());
    assert.ok(out);
    assert.equal(out.data.suggestedSet, undefined);
    assert.equal(out.data.branches[0].answers[0].text, "a volcano");
  });
});

// ---- Họ vần ----

const cand = (wordId: number, word: string, ipa: string | null): FamilyCandidate => ({ wordId, word, ipa, partOfSpeech: "adjective", meaningVi: word, image: null });
const CANDS = [
  cand(1, "famous", "/ˈfeɪməs/"),
  cand(2, "nervous", "/ˈnɜːvəs/"),
  cand(3, "serious", "/ˈsɪəriəs/"),
  cand(4, "generous", "/ˈdʒenərəs/"),
  cand(5, "house", "/haʊs/"),
  cand(6, "mouse", "/maʊs/"),
  cand(7, "joyous", null),
];
const famCtx = { pattern: "ous", candidates: CANDS };
const good = {
  soundIpa: "/əs/",
  sameSound: ["famous", "nervous", "serious", "generous"],
  traps: ["house", "mouse"],
  trapNoteVi: "house và mouse đọc là /aʊs/ nhé!",
  decoys: ["b", "pl", "z"],
  sentences: [{ en: "The famous mouse is nervous.", vi: "Chú chuột nổi tiếng đang lo." }, { en: "A serious cat.", vi: "Một chú mèo nghiêm túc." }],
};

describe("cleanFamily", () => {
  it("giữ kết quả tốt: từ cùng âm, Bẫy, chữ đầu nhiễu, câu", () => {
    const out = cleanFamily(good, famCtx);
    assert.ok(out);
    assert.equal(out.soundIpa, "/əs/");
    assert.deepEqual(out.members.filter((m) => m.sameSound).map((m) => m.word), ["famous", "nervous", "serious", "generous"]);
    assert.deepEqual(out.members.filter((m) => !m.sameSound).map((m) => m.word), ["house", "mouse"]);
    assert.deepEqual(out.decoys, ["b", "pl", "z"]);
    assert.equal(out.trapNote, "house và mouse đọc là /aʊs/ nhé!");
    assert.equal(out.sentences.length, 2);
    assert.deepEqual(out.warnings, []);
  });

  it("tự tính lại Cùng âm / Bẫy bằng soundMatches, không tin AI", () => {
    const out = cleanFamily({ ...good, sameSound: ["famous", "house", "nervous", "serious"], traps: ["mouse", "generous"] }, famCtx);
    assert.ok(out);
    const same = (w: string) => out.members.find((m) => m.word === w)?.sameSound;
    assert.equal(same("house"), false);
    assert.equal(same("generous"), true);
    assert.ok(out.warnings.some((w) => w.includes("“house”") && w.includes("xếp Bẫy")));
    assert.ok(out.warnings.some((w) => w.includes("“generous”") && w.includes("xếp Cùng âm")));
  });

  it("từ không có trong kho thì bỏ và báo; từ thiếu IPA thành Bẫy", () => {
    const out = cleanFamily({ ...good, sameSound: ["famous", "nervous", "serious", "ravenous", "joyous"], traps: [] }, famCtx);
    assert.ok(out);
    assert.ok(!out.members.some((m) => m.word === "ravenous"));
    assert.equal(out.members.find((m) => m.word === "joyous")?.sameSound, false);
    assert.ok(out.warnings.some((w) => w.includes("ravenous")));
    assert.ok(out.warnings.some((w) => w.includes("Bẫy") && w.includes("joyous")));
  });

  it("bỏ chữ đầu nhiễu tạo từ thật hoặc sai dạng, không trùng nhau", () => {
    // “fam” là chữ đầu của từ thật famous; “joy” + “ous” là joyous có trong kho.
    const out = cleanFamily({ ...good, decoys: ["joy", "fam", "B", "b", "x1", "toolong", "q"] }, famCtx);
    assert.ok(out);
    assert.deepEqual(out.decoys, ["b", "q"]);
    assert.ok(out.warnings.some((w) => w.includes("tạo ra từ thật") && w.includes("joy") && w.includes("fam")));
  });

  it("IPA thiếu gạch chéo thì thêm vào; sai dạng thì bỏ và báo", () => {
    assert.equal(cleanFamily({ ...good, soundIpa: "əs" }, famCtx)?.soundIpa, "/əs/");
    const bad = cleanFamily({ ...good, soundIpa: "//" }, famCtx);
    assert.ok(bad);
    assert.equal(bad.soundIpa, "");
    assert.ok(bad.warnings.some((w) => w.includes("IPA")));
  });

  it("không có Bẫy thì không giữ lời giải thích; có Bẫy mà thiếu lời thì báo", () => {
    assert.equal(cleanFamily({ ...good, traps: [] }, famCtx)?.trapNote, "");
    const out = cleanFamily({ ...good, trapNoteVi: "" }, famCtx);
    assert.ok(out?.warnings.some((w) => w.includes("Bẫy chính tả")));
  });

  it("ít hơn 3 từ cùng âm thì nhắc", () => {
    const out = cleanFamily({ ...good, sameSound: ["famous"], traps: [] }, famCtx);
    assert.ok(out?.warnings.some((w) => w.includes("ít nhất 3 từ cùng âm")));
  });

  it("cắt số từ, chữ đầu nhiễu và câu cho đủ giới hạn", () => {
    const out = cleanFamily({ ...good, decoys: ["b", "c", "d", "f", "g"], sentences: Array.from({ length: 7 }, (_, i) => ({ en: `Sentence ${i}.`, vi: "Câu." })) }, famCtx);
    assert.ok(out);
    assert.equal(out.decoys.length, 3);
    assert.equal(out.sentences.length, 4);
  });

  it("hỏng hoặc rỗng thì null", () => {
    assert.equal(cleanFamily("x", famCtx), null);
    assert.equal(cleanFamily({}, famCtx), null);
    assert.equal(cleanFamily(null, famCtx), null);
  });
});
