import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { wordQuestionDataSchema } from "../schemas/word-explorer.ts";
import { familyWordsFileSchema } from "../schemas/wordlab-words.ts";
import { WORDLAB } from "./constants.ts";
import { EXPLORER_SEED } from "./word-explorer-data.ts";
import { explorerIssues } from "./word-explorer.ts";
import { FAMILY_SEED } from "./word-family-data.ts";

// Nội dung Khám phá từ và Họ vần (task 25–27): luật chặt hơn nằm ở scripts/check-wordlab.mjs (cần đọc kho từ và hình trên đĩa).

describe("Khám phá từ: dữ liệu seed", () => {
  it("mỗi từ viết một lần, 4–6 nhánh, mỗi nhánh qua Zod", () => {
    const seen = new Set<string>();
    for (const entry of EXPLORER_SEED) {
      assert.equal(seen.has(entry.word), false, `${entry.word} bị viết hai lần`);
      seen.add(entry.word);
      assert.ok(entry.branches.length >= WORDLAB.branchMin && entry.branches.length <= WORDLAB.branchMax, `${entry.word}: ${entry.branches.length} nhánh`);
      for (const b of entry.branches) {
        const parsed = wordQuestionDataSchema.safeParse({ kind: b.kind, questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers, distractors: b.distractors });
        assert.equal(parsed.success, true, `${entry.word}: ${b.questionEn}`);
      }
    }
  });

  it("đủ điều kiện xuất bản, trừ âm thanh (do audio:generate tạo)", () => {
    for (const entry of EXPLORER_SEED) {
      const issues = explorerIssues(
        entry.branches.map((b) => ({ kind: b.kind, questionEn: b.questionEn, questionVi: b.questionVi, answers: b.answers, distractors: b.distractors })),
        { sentences: entry.branches.map((b) => b.sentence), audio: "x.mp3" },
      ).filter((i) => i.code !== "answer_audio");
      assert.deepEqual(issues, [], entry.word);
    }
  });

  it("hình nhiễu không trùng đáp án đoán", () => {
    for (const entry of EXPLORER_SEED) {
      for (const b of entry.branches) {
        const guess = b.answers.find((a) => a.guess) ?? b.answers[0];
        for (const d of b.distractors) {
          assert.notEqual(d.image, guess.image, `${entry.word}: ${d.text}`);
          assert.notEqual(d.text.toLowerCase(), guess.text.toLowerCase(), `${entry.word}: ${d.text}`);
        }
      }
    }
  });
});

describe("Họ vần: dữ liệu seed", () => {
  it("mỗi họ viết một lần (vần + âm), không từ nào hai lần", () => {
    const keys = new Set<string>();
    for (const f of FAMILY_SEED) {
      const key = `${f.pattern}${f.soundIpa}`;
      assert.equal(keys.has(key), false, key);
      keys.add(key);
      const words = [...f.members, ...f.traps];
      assert.equal(new Set(words).size, words.length, f.pattern);
    }
  });

  it("từ thêm vào kho đúng dạng, không trùng nhau", () => {
    const parsed = familyWordsFileSchema.parse(JSON.parse(readFileSync(new URL("../../../prisma/seed/wordlab/family-words.json", import.meta.url), "utf8")));
    const names = parsed.words.map((w) => w.word);
    assert.equal(new Set(names).size, names.length);
  });
});
