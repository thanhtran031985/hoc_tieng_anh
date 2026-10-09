import { splitSentence } from "@/lib/rules/sentence-words";
import type { StoryPlay, StoryPlayPage } from "@/lib/rules/lesson-play";
import { parseStoryQuestion, storyNewWordsSchema, storySentencesSchema } from "@/lib/schemas/story";
import { db } from "./db";

// Nạp truyện tranh để chơi (bước `story`, task 16): trang truyện, trang câu hỏi, từ mới và nghĩa ngắn của từng chữ.
// Hàm này không kiểm quyền: chỗ gọi (`getLessonPlay` đã qua `requireLearner`, bản xem thử ở quản trị đã qua `requireAdmin`) chịu trách nhiệm.

/** Nạp các truyện theo mã. `publishedOnly`: bé chỉ thấy truyện đã xuất bản; quản trị xem thử cả truyện Nháp. */
export async function getStoriesPlay(storyIds: readonly number[], publishedOnly = true): Promise<Map<number, StoryPlay>> {
  const result = new Map<number, StoryPlay>();
  if (storyIds.length === 0) return result;
  const stories = await db.story.findMany({
    where: { id: { in: [...new Set(storyIds)] }, ...(publishedOnly ? { status: "published" as const } : {}) },
    select: {
      id: true,
      title: true,
      titleVi: true,
      newWords: true,
      level: { select: { number: true } },
      pages: { orderBy: { sortOrder: "asc" }, select: { id: true, kind: true, image: true, sentences: true, audio: true, question: { select: { id: true, prompt: true, options: true, answer: true } } } },
    },
  });

  // Nghĩa ngắn của mọi chữ trong các truyện (một lượt tra chung).
  const tokens = new Set<string>();
  for (const story of stories) {
    for (const w of storyNewWordsSchema.safeParse(story.newWords).data ?? []) tokens.add(w.toLowerCase());
    for (const page of story.pages) {
      for (const s of storySentencesSchema.safeParse(page.sentences).data ?? []) for (const t of splitSentence(s.en)) if (t.word) tokens.add(t.word);
    }
  }
  const rows = tokens.size ? await db.word.findMany({ where: { word: { in: [...tokens] } }, select: { word: true, meaningVi: true }, orderBy: { id: "asc" } }) : [];
  const meaning = new Map<string, string>();
  for (const r of rows) if (!meaning.has(r.word.toLowerCase())) meaning.set(r.word.toLowerCase(), r.meaningVi);

  for (const story of stories) {
    const pages: StoryPlayPage[] = [];
    for (const page of story.pages) {
      if (page.kind === "question") {
        const q = page.question ? parseStoryQuestion({ prompt: page.question.prompt, options: page.question.options, answer: page.question.answer }) : null;
        if (!page.question || !q) continue;
        pages.push({ kind: "question", id: page.id, questionId: page.question.id, text: q.prompt.text ?? "", choices: q.options.map((o) => ({ id: o.id, text: o.text ?? "" })), correct: q.answer.correct[0] });
      } else {
        const sentences = (storySentencesSchema.safeParse(page.sentences).data ?? []).map((s) => s.en);
        if (sentences.length === 0) continue;
        pages.push({ kind: "page", id: page.id, image: page.image, sentences, audio: page.audio });
      }
    }
    const newWords = (storyNewWordsSchema.safeParse(story.newWords).data ?? []).map((word) => ({ word, meaningVi: meaning.get(word.toLowerCase()) ?? null }));
    result.set(story.id, {
      storyId: story.id,
      title: story.title,
      titleVi: story.titleVi,
      levelNumber: story.level.number,
      pages,
      newWords,
      glossary: Object.fromEntries([...tokens].flatMap((w) => (meaning.has(w) ? [[w, meaning.get(w)!]] : []))),
    });
  }
  return result;
}
