import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync } from "node:fs";
import { explorerAnswersSchema, explorerDistractorsSchema, explorerSentencesSchema } from "../schemas/word-explorer.ts";
import {
  allBranchesOpen,
  buildChoices,
  canPublish,
  composeSentence,
  joinList,
  dimWrongChoice,
  explorerIssues,
  fillQuestionSet,
  guessAnswer,
  isPlayable,
  viewBranches,
  nextClosedBranch,
  printSides,
  withArticle,
  type ExplorerBranch,
  type ExplorerContent,
} from "./word-explorer.ts";
import { buildPlaySteps, type PlayWord } from "./lesson-play.ts";
import { buildReviewSteps, type DueWord } from "./review-play.ts";
import { EXPLORER_SEED } from "./word-explorer-data.ts";

const bird = EXPLORER_SEED.find((w) => w.word === "bird")!;
const cat = EXPLORER_SEED.find((w) => w.word === "cat")!;
const asBranches = (w: typeof bird): ExplorerBranch[] => w.branches.map((b) => ({ kind: b.kind, questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers, distractors: b.distractors }));
const withMedia = (branches: ExplorerBranch[]): ExplorerBranch[] => branches.map((b) => ({ ...b, answers: b.answers.map((a) => ({ ...a, audio: "/audio/x.mp3" })) }));

describe("Khám phá từ mẫu", () => {
  it("bird có 6 nhánh, cat có 5 nhánh, mỗi nhánh một câu trong đoạn văn", () => {
    assert.equal(bird.branches.length, 6);
    assert.equal(cat.branches.length, 5);
    for (const w of [bird, cat]) assert.ok(explorerSentencesSchema.safeParse(w.branches.map((b) => b.sentence)).success);
  });

  it("đáp án và hình nhiễu đều qua Zod, mỗi nhánh 1–2 hình nhiễu", () => {
    for (const b of [...bird.branches, ...cat.branches]) {
      assert.ok(explorerAnswersSchema.safeParse(b.answers).success, b.questionEn);
      assert.ok(explorerDistractorsSchema.safeParse(b.distractors).success, b.questionEn);
      assert.ok(b.distractors.length >= 1 && b.distractors.length <= 2, b.questionEn);
    }
  });

  it("mọi hình dùng trong mẫu có tệp trong public/media/pictures", () => {
    const used = [...bird.branches, ...cat.branches].flatMap((b) => [...b.answers.map((a) => a.image), ...b.distractors.map((d) => d.image)]);
    for (const path of used) assert.ok(path && existsSync(`public${path}`), String(path));
  });

  it("mẫu ở dạng Nháp: còn thiếu âm thanh đáp án và đoạn văn", () => {
    const codes = new Set(explorerIssues(asBranches(bird), { sentences: bird.branches.map((b) => b.sentence), audio: null }).map((i) => i.code));
    assert.deepEqual([...codes].sort(), ["answer_audio", "reading_audio"]);
  });
});

describe("buildChoices", () => {
  it("2–3 hình: đáp án đoán cộng 1–2 hình nhiễu, đúng một hình đúng", () => {
    for (const b of [...bird.branches, ...cat.branches]) {
      const choices = buildChoices(b, "k1-b");
      assert.ok(choices.length >= 2 && choices.length <= 3);
      assert.equal(choices.filter((c) => c.correct).length, 1);
      assert.deepEqual(choices.map((c) => c.id), choices.map((_, i) => i));
    }
  });

  it("cùng hạt giống thì cùng thứ tự", () => {
    const b = bird.branches[2];
    assert.deepEqual(buildChoices(b, "seed"), buildChoices(b, "seed"));
  });

  it("đáp án đánh dấu guess là hình đúng; không đánh dấu thì lấy đáp án đầu", () => {
    assert.equal(guessAnswer(cat.branches[3])?.text, "paws");
    assert.equal(guessAnswer(bird.branches[0])?.text, "a bird");
    const right = buildChoices(cat.branches[4], "x").find((c) => c.correct);
    assert.equal(right?.text, "jump");
  });

  it("hình nhiễu trùng nhãn với đáp án bị bỏ", () => {
    const choices = buildChoices({ answers: [{ text: "Fish", textVi: "", image: "/a.svg" }], distractors: [{ text: "fish", image: "/b.svg" }, { text: "cat", image: "/c.svg" }] }, "s");
    assert.equal(choices.length, 2);
  });

  it("không có đáp án thì không có hình", () => {
    assert.deepEqual(buildChoices({ answers: [], distractors: [] }, "s"), []);
  });
});

describe("dimWrongChoice", () => {
  const three = buildChoices(bird.branches[2], "s");
  const two = buildChoices(bird.branches[1], "s");
  it("sai 2 lần thì mờ một hình sai, không bao giờ mờ hình đúng", () => {
    assert.equal(dimWrongChoice(three, 1, null), null);
    const id = dimWrongChoice(three, 2, null);
    assert.notEqual(id, null);
    assert.equal(three.find((c) => c.id === id)?.correct, false);
  });
  it("gợi ý (H) mờ ngay; hình đã mờ được giữ nguyên", () => {
    const id = dimWrongChoice(three, 0, null, true);
    assert.notEqual(id, null);
    assert.equal(dimWrongChoice(three, 5, id, false), id);
  });
  it("chỉ có 2 hình thì mờ hình sai, còn lại hình đúng", () => {
    const id = dimWrongChoice(two, 3, null, true);
    assert.equal(two.find((c) => c.id === id)?.correct, false);
  });
});

describe("mở nhánh", () => {
  it("nextClosedBranch đi vòng tới nhánh còn đóng", () => {
    assert.equal(nextClosedBranch([0, 1], 1, 4), 2);
    assert.equal(nextClosedBranch([0, 2, 3], 3, 4), 1);
    assert.equal(nextClosedBranch([0, 1, 2, 3], 0, 4), null);
  });
  it("allBranchesOpen cần mở đủ và có ít nhất một nhánh", () => {
    assert.equal(allBranchesOpen([0, 1, 2, 3], 4), true);
    assert.equal(allBranchesOpen([0, 1, 3], 4), false);
    assert.equal(allBranchesOpen([], 0), false);
  });
});

describe("explorerIssues", () => {
  const full = withMedia(asBranches(bird));
  const reading = { sentences: bird.branches.map((b) => b.sentence), audio: "/audio/word-1.mp3" };

  it("đủ hình, âm thanh, dịch và 4–6 nhánh thì xuất bản được", () => {
    assert.deepEqual(explorerIssues(full, reading), []);
    assert.equal(canPublish(explorerIssues(full, reading)), true);
  });

  it("số nhánh ngoài 4–6 bị chặn", () => {
    assert.equal(explorerIssues(full.slice(0, 3), { ...reading, sentences: reading.sentences.slice(0, 3) })[0].code, "branch_count");
    assert.equal(explorerIssues([...full, full[0]], reading).some((i) => i.code === "branch_count"), true);
  });

  it("đáp án thiếu hình hoặc âm thanh, kèm vị trí để nhảy tới", () => {
    const broken = full.map((b, i) => (i === 1 ? { ...b, answers: b.answers.map((a, j) => (j === 2 ? { ...a, image: null, audio: null } : a)) } : b));
    const issues = explorerIssues(broken, reading);
    assert.deepEqual(issues.map((i) => [i.code, i.field]), [["answer_image", "branch-1-answer-2-image"], ["answer_audio", "branch-1-answer-2-audio"]]);
    assert.match(issues[0].message, /Nhánh 2.*“blue”.*chưa có hình/);
  });

  it("nhánh thiếu hình nhiễu và hình nhiễu thiếu hình", () => {
    const none = full.map((b, i) => (i === 0 ? { ...b, distractors: [] } : b));
    assert.equal(explorerIssues(none, reading)[0].code, "distractor_count");
    const noPic = full.map((b, i) => (i === 3 ? { ...b, distractors: [{ text: "wheels", image: null }] } : b));
    assert.equal(explorerIssues(noPic, reading)[0].code, "distractor_image");
  });

  it("câu hỏi và câu của đoạn văn thiếu dịch", () => {
    const noVi = full.map((b, i) => (i === 2 ? { ...b, questionVi: " " } : b));
    assert.equal(explorerIssues(noVi, reading)[0].code, "question_vi");
    const sentences = reading.sentences.map((s, i) => (i === 4 ? { ...s, vi: "" } : s));
    const issues = explorerIssues(full, { ...reading, sentences });
    assert.deepEqual(issues.map((i) => i.code), ["sentence_vi"]);
    assert.equal(issues[0].field, "reading-sentence-4");
  });

  it("đoạn văn thiếu, thiếu câu hoặc thiếu âm thanh", () => {
    assert.equal(explorerIssues(full, null)[0].code, "reading_missing");
    assert.equal(explorerIssues(full, { ...reading, sentences: reading.sentences.slice(0, 5) })[0].code, "reading_count");
    assert.equal(explorerIssues(full, { ...reading, audio: null })[0].code, "reading_audio");
  });
});

describe("printSides", () => {
  it("chia nhánh thành hai cột quanh thẻ từ, cột trái nhận nhánh dư", () => {
    assert.deepEqual(printSides(6), { left: [0, 1, 2], right: [3, 4, 5] });
    assert.deepEqual(printSides(5), { left: [0, 1, 2], right: [3, 4] });
    assert.deepEqual(printSides(4), { left: [0, 1], right: [2, 3] });
  });
});

describe("bộ câu hỏi mẫu", () => {
  it("withArticle chọn a/an", () => {
    assert.equal(withArticle("bird"), "a bird");
    assert.equal(withArticle("apple"), "an apple");
  });
  it("Con vật điền sẵn 6 câu theo từ", () => {
    const set = fillQuestionSet("animals", "bird", "con chim");
    assert.equal(set.length, 6);
    assert.equal(set[1].questionEn, "What color is a bird?");
    assert.equal(set[1].questionVi, "Con chim có màu gì?");
    assert.equal(set[0].questionEn, "What’s this?");
    assert.equal(set[3].kind, "parts");
  });
  it("Nghề nghiệp, Nơi chốn, Đồ ăn, Đồ vật đều có 4–6 câu và câu đầu là nhận diện", () => {
    for (const key of ["food", "things", "jobs", "places"] as const) {
      const set = fillQuestionSet(key, "apple", "quả táo");
      assert.ok(set.length >= 4 && set.length <= 6, key);
      assert.equal(set[0].kind, "identify");
      assert.ok(set.every((q) => !q.questionEn.includes("{") && !q.questionVi.includes("{")), key);
    }
  });
});

const content = (w: typeof bird, drop = 0): ExplorerContent => ({
  branches: w.branches.slice(0, w.branches.length - drop).map((b, i) => ({ id: i + 1, kind: b.kind, questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers, distractors: b.distractors, sentence: b.sentence })),
  reading: { sentences: w.branches.slice(0, w.branches.length - drop).map((b) => b.sentence), audio: null },
  glossary: {},
});
const birdWord: PlayWord = { id: 7, word: "bird", ipa: "/bɜːd/", meaningVi: "con chim", exampleEn: "I see a bird.", exampleVi: null, image: "/media/pictures/bird.svg" };

describe("Khám phá từ trong bài học", () => {
  it("isPlayable: 4–6 nhánh và đoạn văn đủ câu", () => {
    assert.equal(isPlayable(content(bird)), true);
    assert.equal(isPlayable(content(cat)), true);
    assert.equal(isPlayable(content(bird, 3)), false);
    assert.equal(isPlayable({ ...content(bird), reading: { sentences: [], audio: null } }), false);
  });

  it("viewBranches: mỗi nhánh 2–3 hình, cùng hạt giống thì cùng thứ tự, khác hạt thì độc lập", () => {
    const a = viewBranches(content(bird), "seed");
    assert.equal(a.length, 6);
    assert.deepEqual(a, viewBranches(content(bird), "seed"));
    assert.ok(a.every((b) => b.choices.length >= 2 && b.choices.length <= 3 && b.choices.filter((c) => c.correct).length === 1));
  });

  it("buildPlaySteps: bước word_explorer dựng đủ nhánh, đoạn văn và nghĩa", () => {
    const steps = buildPlaySteps([{ id: 5, activityType: "word_explorer", config: {}, word: birdWord }], [birdWord], "s", { explorers: new Map([[7, content(bird)]]) });
    assert.equal(steps.length, 1);
    const step = steps[0];
    assert.equal(step.kind, "word_explorer");
    if (step.kind !== "word_explorer") return;
    assert.equal(step.word.id, 7);
    assert.equal(step.branches.length, 6);
    assert.equal(step.reading.sentences.length, 6);
  });

  it("buildPlaySteps: từ chưa có Khám phá đã xuất bản, hoặc chưa đủ nhánh, thì bỏ qua bước", () => {
    const none = buildPlaySteps([{ id: 5, activityType: "word_explorer", config: {}, word: birdWord }], [birdWord], "s", { explorers: new Map() });
    assert.equal(none.length, 0);
    const few = buildPlaySteps([{ id: 5, activityType: "word_explorer", config: {}, word: birdWord }], [birdWord], "s", { explorers: new Map([[7, content(bird, 3)]]) });
    assert.equal(few.length, 0);
    const noWord = buildPlaySteps([{ id: 5, activityType: "word_explorer", config: {}, word: null }], [], "s", { explorers: new Map([[7, content(bird)]]) });
    assert.equal(noWord.length, 0);
  });
});

describe("Khám phá từ trong ôn tập", () => {
  const due: DueWord[] = [{ ...birdWord, box: 2 }];
  const pool: PlayWord[] = [1, 2, 3].map((i) => ({ ...birdWord, id: 100 + i, word: `w${i}` }));

  it("không có Khám phá thì phiên ôn giữ nguyên như trước", () => {
    for (const seed of ["a", "b", "c"]) {
      const without = buildReviewSteps(due, pool, seed, 15);
      const withEmpty = buildReviewSteps(due, pool, seed, 15, new Map());
      assert.deepEqual(withEmpty, without);
      assert.ok(without.every((st) => String(st.kind) !== "explorer_branch"));
    }
  });

  it("từ có Khám phá: một phần lượt ôn là câu hỏi nhánh của chính từ đó, có 2–3 hình và đúng một hình đúng", () => {
    const explorers = new Map([[7, content(bird)]]);
    const kinds = Array.from({ length: 24 }, (_, i) => buildReviewSteps(due, pool, `seed-${i}`, 15, explorers)[0]);
    const branches = kinds.filter((st) => st.kind === "explorer_branch");
    assert.ok(branches.length > 0 && branches.length < kinds.length, "có cả hai kiểu câu");
    for (const st of branches) {
      assert.equal(st.kind, "explorer_branch");
      if (st.kind !== "explorer_branch") continue;
      assert.equal(st.word.id, 7);
      assert.ok(st.branch.choices.length >= 2 && st.branch.choices.length <= 3);
      assert.equal(st.branch.choices.filter((c) => c.correct).length, 1);
    }
  });

  it("Khám phá chưa đủ nhánh thì không thay câu ôn", () => {
    const explorers = new Map([[7, content(bird, 3)]]);
    for (let i = 0; i < 12; i++) assert.notEqual(buildReviewSteps(due, pool, `s${i}`, 15, explorers)[0].kind, "explorer_branch");
  });
});

describe("ghép đoạn văn từ đáp án", () => {
  const a = (...texts: string[]) => texts.map((text) => ({ text }));
  it("joinList nối theo kiểu tiếng Anh", () => {
    assert.equal(joinList([]), "");
    assert.equal(joinList(["seeds"]), "seeds");
    assert.equal(joinList(["seeds", "insects"]), "seeds and insects");
    assert.equal(joinList(["brown", "yellow", "blue"], "or"), "brown, yellow or blue");
  });
  it("composeSentence theo loại câu hỏi của bird và cat", () => {
    assert.equal(composeSentence("identify", "bird", a("a bird")), "This is a bird.");
    assert.equal(composeSentence("color", "bird", a("brown", "yellow", "blue")), "It is brown, yellow or blue.");
    assert.equal(composeSentence("food", "bird", a("seeds", "insects", "berries")), "It likes to eat seeds, insects and berries.");
    assert.equal(composeSentence("parts", "bird", a("wings", "feathers", "a beak", "claws")), "It has wings, feathers, a beak and claws.");
    assert.equal(composeSentence("action", "cat", a("run", "jump", "climb")), "It can run, jump and climb.");
    assert.equal(composeSentence("place", "bird", a("in the nest", "on the tree")), "It lives in the nest and on the tree.");
  });
  it("không có đáp án thì không có câu", () => {
    assert.equal(composeSentence("color", "bird", []), "");
    assert.equal(composeSentence("color", "bird", a(" ")), "");
  });
});
