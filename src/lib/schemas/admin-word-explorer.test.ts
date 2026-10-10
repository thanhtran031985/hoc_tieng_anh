import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EXPLORER_SEED } from "../rules/word-explorer-data.ts";
import { saveExplorerSchema } from "./admin-word-explorer.ts";

const bird = EXPLORER_SEED.find((w) => w.word === "bird")!;
const branches = () => bird.branches.map((b) => ({ kind: b.kind, questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers.map((a) => ({ ...a })), distractors: b.distractors.map((d) => ({ ...d })), sentence: { ...b.sentence } }));
const input = (patch: Record<string, unknown> = {}) => ({ wordId: 1, status: "draft", branches: branches(), ...patch });

describe("saveExplorerSchema (Soạn Khám phá từ)", () => {
  it("nhận dữ liệu mẫu của bird", () => {
    assert.ok(saveExplorerSchema.safeParse(input()).success);
  });

  it("0 nhánh là gỡ Khám phá, hơn 6 nhánh bị từ chối", () => {
    assert.ok(saveExplorerSchema.safeParse(input({ branches: [] })).success);
    assert.equal(saveExplorerSchema.safeParse(input({ branches: [...branches(), ...branches()] })).success, false);
  });

  it("mỗi nhánh cần câu hỏi và ít nhất một đáp án có chữ", () => {
    const noQuestion = branches();
    noQuestion[0].questionEn = " ";
    assert.equal(saveExplorerSchema.safeParse(input({ branches: noQuestion })).success, false);
    const noAnswer = branches();
    noAnswer[1].answers = [];
    assert.equal(saveExplorerSchema.safeParse(input({ branches: noAnswer })).success, false);
    const blankAnswer = branches();
    blankAnswer[1].answers[0].text = "";
    assert.equal(saveExplorerSchema.safeParse(input({ branches: blankAnswer })).success, false);
  });

  it("tối đa 2 hình nhiễu và 5 đáp án", () => {
    const many = branches();
    many[0].distractors = [{ text: "a", image: null }, { text: "b", image: null }, { text: "c", image: null }];
    assert.equal(saveExplorerSchema.safeParse(input({ branches: many })).success, false);
    const lots = branches();
    lots[0].answers = Array.from({ length: 6 }, (_, i) => ({ text: `w${i}`, textVi: "", image: null, audio: null }));
    assert.equal(saveExplorerSchema.safeParse(input({ branches: lots })).success, false);
  });

  it("hình chỉ nhận đường dẫn trong thư viện, không nhận địa chỉ ngoài hay đường dẫn đi ra ngoài", () => {
    for (const image of ["https://evil.example/x.svg", "//evil/x.svg", "/media/pictures/../../.env", "/etc/passwd", "javascript:alert(1)"]) {
      const list = branches();
      list[0].answers[0].image = image;
      assert.equal(saveExplorerSchema.safeParse(input({ branches: list })).success, false, image);
    }
    const good = branches();
    good[0].answers[0].image = "/uploads/anh-1.png";
    assert.ok(saveExplorerSchema.safeParse(input({ branches: good })).success);
  });

  it("âm thanh chỉ nhận tên tệp mp3 hợp lệ của máy chủ", () => {
    const good = branches();
    good[0].answers[0].audio = "/audio/explorer-12-ab12cd34.mp3";
    assert.ok(saveExplorerSchema.safeParse(input({ branches: good })).success);
    for (const audio of ["/audio/../secret.mp3", "https://x.example/a.mp3", "/audio/explorer-1-zz.mp3", "/media/a.mp3"]) {
      const bad = branches();
      bad[0].answers[0].audio = audio;
      assert.equal(saveExplorerSchema.safeParse(input({ branches: bad })).success, false, audio);
    }
  });

  it("trạng thái chỉ là draft hoặc published", () => {
    assert.equal(saveExplorerSchema.safeParse(input({ status: "planned" })).success, false);
  });
});
