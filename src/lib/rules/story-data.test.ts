import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STORY_PAGE_MAX_WORDS, parseStoryQuestion, storySentencesSchema } from "../schemas/story.ts";
import { STORY_SEED, storyQuestionFields } from "./story-data.ts";

describe("truyện mẫu Tom’s Red Kite", () => {
  const story = STORY_SEED[0];

  it("có 6 trang truyện và 1 trang câu hỏi sau trang 3", () => {
    assert.equal(story.pages.filter((p) => p.kind === "page").length, 6);
    assert.equal(story.pages[3].kind, "question");
  });

  it("mỗi trang truyện có 1–2 câu và không quá 16 từ", () => {
    for (const page of story.pages) {
      if (page.kind !== "page") continue;
      assert.ok(storySentencesSchema.safeParse(page.sentences.map((en) => ({ en }))).success);
      const words = page.sentences.join(" ").split(/\s+/).length;
      assert.ok(words <= STORY_PAGE_MAX_WORDS, page.sentences.join(" "));
    }
  });

  it("câu hỏi giữa truyện hợp lệ: 3 lựa chọn, đáp án là “red”", () => {
    const page = story.pages[3];
    assert.equal(page.kind, "question");
    if (page.kind !== "question") return;
    const data = parseStoryQuestion(storyQuestionFields(page));
    assert.ok(data);
    assert.deepEqual(data?.answer.correct, ["b"]);
    assert.equal(data?.options.find((o) => o.id === "b")?.text, "red");
  });

  it("câu hỏi chỉ có 2 lựa chọn bị từ chối", () => {
    assert.equal(parseStoryQuestion({ prompt: { text: "x?" }, options: [{ id: "a", text: "a" }, { id: "b", text: "b" }], answer: { correct: ["a"] } }), null);
  });

  it("từ mới không trùng nhau và tranh của các trang khác nhau", () => {
    assert.equal(new Set(story.newWords).size, story.newWords.length);
    const images = story.pages.flatMap((p) => (p.kind === "page" ? [p.image] : []));
    assert.equal(new Set(images).size, images.length);
  });
});
